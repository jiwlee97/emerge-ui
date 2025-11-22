import { UIManager, type UIInstance } from '@emerge-ui/core';
import { useState, useEffect, useMemo } from 'react';

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
 * Return type for useEmerge hook
 */
export interface UseEmergeReturn {
  /**
   * Filtered UI instances
   */
  instances: UIInstance[];
  /**
   * All instances (unfiltered)
   */
  allInstances: UIInstance[];
  /**
   * Number of filtered instances
   */
  count: number;
  /**
   * Whether there are no filtered instances
   */
  isEmpty: boolean;
  /**
   * UIManager instance
   */
  manager: UIManager;
}

/**
 * Hook for managing Emerge UI instances
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
 * const { instances } = useEmerge(manager, { type: 'modal' });
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
  options?: UseEmergeOptions
): UseEmergeReturn {
  // State for all instances
  const [allInstances, setAllInstances] = useState<UIInstance[]>(
    manager.getInstances()
  );

  // Subscribe to manager changes
  useEffect(() => {
    const unsubscribe = manager.subscribe((newInstances) => {
      setAllInstances(newInstances);
    });

    return unsubscribe;
  }, [manager]);

  // Apply filters with useMemo
  const instances = useMemo(() => {
    let filtered = allInstances;

    const { type, minPriority, limit } = options || {};

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
  }, [allInstances, options?.type, options?.minPriority, options?.limit]);

  // Computed values
  const count = instances.length;
  const isEmpty = count === 0;

  return {
    instances,
    allInstances,
    count,
    isEmpty,
    manager,
  };
}
