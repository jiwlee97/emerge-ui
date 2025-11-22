/**
 * Base interface for UI instances
 * @template Props - Type of props passed to the component
 */
export interface UIInstance<Props = any> {
  /** Unique identifier */
  id: string;
  /** Component */
  component: any;
  /** Props to be passed to the component */
  props: Props;
  /** UI type (slide, modal, drawer, etc.) */
  type: string;
  /** Priority (used for z-index, etc.) */
  priority: number;
  /** Creation timestamp */
  createdAt: number;
}

export type UIType = 'slide' | 'modal' | 'drawer' | 'toast';

/**
 * Component registration configuration
 */
export interface RegisterConfig {
  /** Component name */
  name: string;
  /** Component */
  component: any;
  /** UI type */
  type?: UIType | (string & {});
  /** Singleton mode (only one can be open at a time) */
  singleton?: boolean;
  /** Priority (higher values appear on top) */
  priority?: number;
}

/**
 * Options for opening UI
 */
export interface OpenOptions {
  /** Custom ID */
  id?: string;
  /** Callback when closed */
  onClose?: () => void;
}

/**
 * Handle for controlling opened UI instance
 * @template Props - Type of props passed to the component
 */
export interface UIHandle<Props = any> {
  /** Instance ID */
  id: string;
  /** Close this instance */
  close: () => void;
  /** Update props */
  update: (props: Partial<Props>) => void;
}

/**
 * Methods for registered component
 * @template Props - Type of props passed to the component
 */
export interface RegisteredMethods<Props> {
  /** Open UI */
  open: (props: Props, options?: OpenOptions) => UIHandle<Props>;
  /** Close all instances of this component */
  close: () => void;
  /** Close all UI instances */
  closeAll: () => void;
}

/**
 * Subscription listener type
 */
export type Listener = (instances: UIInstance[]) => void;
