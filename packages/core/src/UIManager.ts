import type {
  UIInstance,
  RegisterConfig,
  Listener,
  RegisteredMethods,
  OpenOptions,
  UIHandle,
} from './types';

export class UIManager {
  private instances = new Map<string, UIInstance>();
  private components = new Map<string, RegisterConfig>();
  private listeners = new Set<Listener>();
  private idCounter = 0;

  /**
   * Register a component
   * @template Props - Type of props passed to the component
   * @param config - Component registration configuration
   * @returns Methods for controlling the registered component
   */
  register<Props = any>(config: RegisterConfig): RegisteredMethods<Props> {
    const { name, component, type, singleton = false, priority = 0 } = config;

    this.components.set(name, {
      name,
      component,
      type,
      singleton,
      priority,
    });

    return {
      open: (props: Props, options?: OpenOptions): UIHandle => {
        return this.open(name, props, options);
      },

      close: () => {
        this.closeByName(name);
      },

      closeAll: () => {
        this.closeAll();
      },
    };
  }

  /**
   * Open a UI instance
   * @template Props - Type of props passed to the component
   * @param name - Component name
   * @param props - Props to pass to the component
   * @param options - Open options
   * @returns Handle for controlling the instance
   */
  private open<Props>(
    name: string,
    props: Props,
    options?: OpenOptions
  ): UIHandle<Props> {
    const config = this.components.get(name);
    if (!config) {
      throw new Error(`Component '${name}' is not registered`);
    }
    // Handle singleton mode
    if (config.singleton) {
      this.closeByName(name);
    }

    // Generate ID
    const id = options?.id || `${name}--${++this.idCounter}`;

    // Create instance
    const instance: UIInstance<Props> = {
      id,
      component: config.component,
      props,
      type: config.type || 'slide',
      priority: config.priority || 0,
      createdAt: Date.now(),
    };

    this.instances.set(id, instance);
    this.notify();

    // Return handle
    return {
      id,
      close: () => {
        try {
          options?.onClose?.();
        } finally {
          this.close(id);
        }
      },
      update: (newProps: Partial<Props>) => {
        this.update(id, newProps);
      },
    };
  }

  /**
   * Close a specific instance
   * @param id - Instance ID to close
   */
  private close(id: string): void {
    if (this.instances.delete(id)) {
      this.notify();
    }
  }

  /**
   * Update instance props
   * @param id - Instance ID to update
   * @param newProps - New props to merge
   */
  private update<Props>(id: string, newProps: Partial<Props>): void {
    const instance = this.instances.get(id) as UIInstance<Props> | undefined;
    if (instance) {
      instance.props = { ...instance.props, ...newProps };
      this.notify();
    }
  }

  /**
   * Close all instances of a specific component
   * @param name - Component name
   */
  private closeByName(name: string): void {
    const config = this.components.get(name);
    if (!config) {
      return;
    }
    const toClose: string[] = [];
    this.instances.forEach((instance, id) => {
      if (instance.component === config.component) {
        toClose.push(id);
      }
    });
    toClose.forEach((id) => this.close(id));
  }

  /**
   * Close all instances of a specific type
   * @param type - UI type to close
   */
  closeByType(type: string): void {
    const toClose: string[] = [];
    this.instances.forEach((instance, id) => {
      if (instance.type === type) {
        toClose.push(id);
      }
    });
    toClose.forEach((id) => this.close(id));
  }

  /**
   * Close all instances
   */
  closeAll(): void {
    this.instances.clear();
    this.notify();
  }

  /**
   * Get all currently open instances
   * @returns Array of instances sorted by priority and creation time
   */
  getInstances(): UIInstance[] {
    return Array.from(this.instances.values()).sort(
      (a, b) => a.priority - b.priority || a.createdAt - b.createdAt
    );
  }

  /**
   * Get instances of a specific type
   * @param type - UI type to filter
   * @returns Array of instances matching the type
   */
  getInstancesByType(type: string): UIInstance[] {
    return this.getInstances().filter((instance) => instance.type === type);
  }

  /**
   * Get a specific instance by ID
   * @param id - Instance ID
   * @returns Instance if found, undefined otherwise
   */
  getInstance(id: string): UIInstance | undefined {
    return this.instances.get(id);
  }

  /**
   * Subscribe to instance changes
   * @param listener - Callback to be called when instances change
   * @returns Unsubscribe function
   */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);

    // Send initial state
    try {
      listener(this.getInstances());
    } catch (error) {
      console.error('[Emerge UI] Initial listener error:', error);
    }

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of changes
   */
  private notify(): void {
    const instances = this.getInstances();
    this.listeners.forEach((listener) => {
      try {
        listener(instances);
      } catch (error) {
        console.error('[Emerge UI] Listener error:', error);
      }
    });
  }

  /**
   * Debug utility: Print current state
   */
  debug(): void {
    console.group('Emerge UI Debug');
    console.log('Registered Components:', Array.from(this.components.keys()));
    console.log('Active Instances:', this.instances.size);
    console.log('Instances:', this.getInstances());
    console.groupEnd();
  }
}
