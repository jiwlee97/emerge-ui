import { createContext, useContext, type ReactNode } from 'react';
import { UIManager, uiManager } from '@emerge-ui/core';

/**
 * Context for Emerge UI Manager
 */
export const EmergeContext = createContext<UIManager | null>(null);

/**
 * Props for EmergeProvider
 */
export interface EmergeProviderProps {
  /**
   * UIManager instance (optional, uses default if not provided)
   */
  manager?: UIManager;
  /**
   * Children components
   */
  children: ReactNode;
}

/**
 * Provider component for Emerge UI
 *
 * @example
 *
 * // Basic usage with default manager
 * <EmergeProvider>
 *   <App />
 * </EmergeProvider>
 *  *
 * @example
 * // With custom manager
 *
 * const customManager = new UIManager();
 *
 * <EmergeProvider manager={customManager}>
 *   <App />
 * </EmergeProvider>
 *  */
export function EmergeProvider({
  manager = uiManager,
  children,
}: EmergeProviderProps) {
  return (
    <EmergeContext.Provider value={manager}>{children}</EmergeContext.Provider>
  );
}

/**
 * Hook to access the Emerge UI Manager from context
 *
 * @returns UIManager instance
 * @throws Error if used outside of EmergeProvider
 *
 * @example
 *
 * function MyComponent() {
 *   const manager = useEmergeContext();
 *
 *   const handleOpen = () => {
 *     const dialog = manager.register({
 *       name: 'Dialog',
 *       component: MyDialog,
 *     });
 *     dialog.open({ title: 'Hello' });
 *   };
 *
 *   return <button onClick={handleOpen}>Open</button>;
 * }
 *  */
export function useEmergeContext(): UIManager {
  const context = useContext(EmergeContext);

  if (!context) {
    throw new Error(
      'useEmergeContext must be used within an EmergeProvider. ' +
        'Wrap your component tree with <EmergeProvider>.'
    );
  }

  return context;
}

/**
 * Hook to optionally access the Emerge UI Manager from context
 * Returns null if not within a provider (useful for optional features)
 *
 * @returns UIManager instance or null
 *
 * @example
 *
 * function MyComponent() {
 *   const manager = useOptionalEmergeContext();
 *
 *   if (!manager) {
 *     // Fallback behavior
 *     return <div>Emerge UI not available</div>;
 *   }
 *
 *   // Use manager...
 * }
 *  */
export function useOptionalEmergeContext(): UIManager | null {
  return useContext(EmergeContext);
}
