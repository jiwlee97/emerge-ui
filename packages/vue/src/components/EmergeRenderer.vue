<script setup lang="ts">
import type { UIManager } from '@emerge-ui/core';
import { useEmerge } from '../composables/useEmerge';
import { computed } from 'vue';

export interface EmergeRendererProps {
  /**
   * UIManager instance to use
   */
  manager: UIManager;
  /**
   * Teleport target (default: body)
   */
  to?: string | Element;
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

const props = withDefaults(defineProps<EmergeRendererProps>(), {
  to: 'body',
  debug: false,
});

const { instances } = useEmerge(
  props.manager,
  computed(() => ({
    type: props.type,
    minPriority: props.minPriority,
    limit: props.limit,
  }))
);
</script>

<template>
  <Teleport :to="to">
    <component
      v-for="instance in instances"
      :key="instance.id"
      :is="instance.component"
      v-bind="instance.props"
      :data-emerge-id="debug ? instance.id : undefined"
      :data-emerge-type="debug ? instance.type : undefined"
      :data-emerge-priority="debug ? instance.priority : undefined"
      :data-emerge-created-at="debug ? instance.createdAt : undefined"
    />
  </Teleport>
</template>
