# Emerge UI

A powerful, type-safe UI management library for programmatically controlling modals, dialogs, sheets, and other overlay components in React and Vue.

## Features

- Type-Safe: Full TypeScript support with intelligent type inference
- Framework Agnostic Core: Use with React, Vue, or any framework
- Flexible: Works with any UI component library (shadcn/ui, Radix, Element Plus, etc.)
- Simple API: Imperative control over declarative components
- Lightweight: Minimal bundle size with zero dependencies (core)
- Reactive: Subscribe to UI state changes
- Priority Management: Control z-index and rendering order
- Singleton Mode: Ensure only one instance of a component is open

## Installation

### React

```bash
# npm
npm install @emerge-ui/core @emerge-ui/react

# pnpm
pnpm add @emerge-ui/core @emerge-ui/react

# yarn
yarn add @emerge-ui/core @emerge-ui/react
```

### Vue

```bash
# npm
npm install @emerge-ui/core @emerge-ui/vue

# pnpm
pnpm add @emerge-ui/core @emerge-ui/vue

# yarn
yarn add @emerge-ui/core @emerge-ui/vue
```

## Quick Start

### React

```typescript
// emerge.ts - UI 컴포넌트 등록
import { UIManager } from '@emerge-ui/react';
import { MyDialog, type MyDialogProps } from './MyDialog';

export const uiManager = new UIManager();

export const dialog = uiManager.register<MyDialogProps>({
  name: 'Dialog',
  component: MyDialog,
  type: 'dialog',
});

export const { open: openDialog, close: closeDialog } = dialog;
```

```typescript
// App.tsx - 렌더러 및 사용
import { EmergeRenderer } from '@emerge-ui/react';
import { uiManager, openDialog } from './emerge';

function App() {
  const handleClick = () => {
    const handle = openDialog({
      title: 'Confirm Action',
      description: 'Are you sure you want to proceed?',
      onClose: () => {
        handle.close();
      },
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Open Dialog</button>

      {/* UI 인스턴스를 렌더링하는 컨테이너 */}
      <EmergeRenderer manager={uiManager} />
    </div>
  );
}
```

### Vue

```typescript
// emerge.ts - UI 컴포넌트 등록
import { UIManager } from '@emerge-ui/vue';
import MyDialog, { type MyDialogProps } from './MyDialog.vue';
import { markRaw } from 'vue';

export const uiManager = new UIManager();

export const dialog = uiManager.register<MyDialogProps>({
  name: 'Dialog',
  component: markRaw(MyDialog),
  type: 'dialog',
  singleton: true,
});

export const { open: openDialog, close: closeDialog } = dialog;
```

```vue
<!-- App.vue - 렌더러 및 사용 -->
<script setup lang="ts">
import { EmergeRenderer } from '@emerge-ui/vue';
import { uiManager, openDialog } from './emerge';

const handleClick = () => {
  const handle = openDialog({
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed?',
    onClose: () => {
      handle.close();
    },
  });
};
</script>

<template>
  <div>
    <button @click="handleClick">Open Dialog</button>

    <!-- UI 인스턴스를 렌더링하는 컨테이너 -->
    <EmergeRenderer :manager="uiManager" />
  </div>
</template>
```
