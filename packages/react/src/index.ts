// Core re-exports
export { UIManager, uiManager } from '@emerge-ui/core';
export type {
  UIInstance,
  UIType,
  RegisterConfig,
  OpenOptions,
  UIHandle,
  RegisteredMethods,
  Listener,
} from '@emerge-ui/core';

// React-specific exports
export {
  useEmerge,
  type UseEmergeOptions,
  type UseEmergeReturn,
} from './hooks/useEmerge';

export {
  EmergeRenderer,
  type EmergeRendererProps,
} from './components/EmergeRenderer';

export {
  EmergeProvider,
  EmergeContext,
  useEmergeContext,
  useOptionalEmergeContext,
  type EmergeProviderProps,
} from './contexts/EmergeContext';
