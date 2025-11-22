export { UIManager } from './UIManager';
export type {
  UIInstance,
  UIType,
  RegisterConfig,
  OpenOptions,
  UIHandle,
  RegisteredMethods,
  Listener,
} from './types';

import { UIManager } from './UIManager';
export const uiManager = new UIManager();
