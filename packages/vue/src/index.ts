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

// Vue-specific exports
export {
  useEmerge,
  type UseEmergeOptions,
  type UseEmergeReturn,
} from './composables/useEmerge';
export {
  default as EmergeRenderer,
  type EmergeRendererProps,
} from './components/EmergeRenderer.vue';

import { UIManager, uiManager } from '@emerge-ui/core';
import type { App } from 'vue';
import EmergeRenderer from './components/EmergeRenderer.vue';

export interface EmergePluginOptions {
  manager?: UIManager;
}

export const EmergePlugin = {
  install(app: App, options: EmergePluginOptions = {}) {
    const manager = options.manager || uiManager;

    app.provide('emerge', manager);

    app.component('EmergeRenderer', EmergeRenderer);

    app.config.globalProperties.$emerge = manager;
  },
};
