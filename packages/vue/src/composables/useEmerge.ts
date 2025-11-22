import { UIManager, type UIInstance } from '@emerge-ui/core';
import {
  computed,
  onUnmounted,
  shallowRef,
  unref,
  type ComputedRef,
  type MaybeRef,
  type Ref,
} from 'vue';

/**
 * Options for filtering instances
 */
export interface UseEmergeOptions {
  /**
   * Filter by UI type
   */
  type?: string;
  /**
   * Filter by minimum priority
   */
  minPriority?: number;
  /**
   * Maximum number of instances to return
   */
  limit?: number;
}

/**
 * Return type for useEmerge composable
 */
export interface UseEmergeReturn {
  /**
   * Filtered UI instances
   */
  instances: ComputedRef<UIInstance[]>;
  /**
   * All instances (unfiltered)
   */
  allInstances: Ref<UIInstance[]>;
  /**
   * Number of filtered instances
   */
  count: ComputedRef<number>;
  /**
   * Whether there are no filtered instances
   */
  isEmpty: ComputedRef<boolean>;
  /**
   * UIManager instance
   */
  manager: UIManager;
}

/**
 * Composable for managing Emerge UI instances
 *
 * @param manager - UIManager instance
 * @param options - Filter options
 * @returns Reactive UI instances and utilities
 *
 * @example
 * // Get all instances
 * const { instances } = useEmerge(manager);
 *
 * @example
 * // Filter by type
 * const { instances: slides } = useEmerge(manager, { type: 'slide' });
 *
 * @example
 * // Multiple filters
 * const { instances } = useEmerge(manager, {
 *   type: 'modal',
 *   minPriority: 10,
 *   limit: 5
 * });
 */
export function useEmerge(
  manager: UIManager,
  options?: MaybeRef<UseEmergeOptions>
): UseEmergeReturn {
  // Get all instances
  const allInstances = shallowRef<UIInstance[]>(manager.getInstances());

  // Subscribe to changes
  const unsubscribe = manager.subscribe((newInstances) => {
    allInstances.value = newInstances;
  });

  // Cleanup on unmount
  onUnmounted(() => {
    unsubscribe();
  });

  // Apply filters
  const instances = computed(() => {
    let filtered = allInstances.value;

    const { type, minPriority, limit } = unref(options) || {};

    // Filter by type
    if (type) {
      filtered = filtered.filter((instance) => instance.type === type);
    }

    // Filter by minimum priority
    if (minPriority != null) {
      filtered = filtered.filter(
        (instance) => instance.priority >= minPriority
      );
    }

    // Limit results
    if (limit != null) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  });

  return {
    instances,
    allInstances,
    count: computed(() => instances.value.length),
    isEmpty: computed(() => instances.value.length === 0),
    manager,
  };
}
