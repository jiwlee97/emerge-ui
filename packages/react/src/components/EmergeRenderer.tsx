import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { UIManager } from '@emerge-ui/core';
import { useEmerge } from '../hooks/useEmerge';

export interface EmergeRendererProps {
  /**
   * UIManager instance to use
   */
  manager: UIManager;
  /**
   * Portal container (default: document.body)
   */
  container?: Element | DocumentFragment | null;
  /**
   * Filter instances by type (optional)
   * e.g., 'slide', 'modal', etc.
   */
  type?: string;
  /**
   * Filter instances by minimum priority (optional)
   */
  minPriority?: number;
  /**
   * Limit the number of instances to return (optional)
   */
  limit?: number;
  /**
   * Enable debug mode (adds data attributes)
   */
  debug?: boolean;
}

/**
 * Component that renders UI instances using React Portal
 *
 * @example
 *
 * <EmergeRenderer manager={uiManager} />
 *  *
 * @example
 * // With filters
 *
 * <EmergeRenderer
 *   manager={uiManager}
 *   type="modal"
 *   debug={true}
 * />
 *  */
export function EmergeRenderer({
  manager,
  container = typeof document !== 'undefined' ? document.body : null,
  type,
  minPriority,
  limit,
  debug = false,
}: EmergeRendererProps) {
  // Get filtered instances
  const { instances } = useEmerge(
    manager,
    useMemo(
      () => ({
        type,
        minPriority,
        limit,
      }),
      [type, minPriority, limit]
    )
  );

  // Render nothing if no container
  if (!container) {
    return null;
  }

  // Render instances to portal
  return createPortal(
    <>
      {instances.map((instance) => {
        const Component = instance.component;

        // Debug attributes
        const debugProps = debug
          ? {
              'data-emerge-id': instance.id,
              'data-emerge-type': instance.type,
              'data-emerge-priority': instance.priority,
              'data-emerge-created-at': instance.createdAt,
            }
          : {};

        return (
          <Component key={instance.id} {...instance.props} {...debugProps} />
        );
      })}
    </>,
    container
  );
}
