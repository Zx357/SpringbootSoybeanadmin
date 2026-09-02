<template>
  <!-- icon 为 # 或空时不渲染图标（与若依原版行为一致） -->
  <component v-if="elIconComp && isValidIcon" :is="elIconComp" :class="svgClass" />
  <svg v-else-if="isValidIcon" :class="svgClass" aria-hidden="true" width="1em" height="1em">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

interface Props {
  iconClass: string;
  className?: string;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  color: ''
});

/** 若依空图标占位符（# 或空串）不渲染图标 */
const isValidIcon = computed(() => Boolean(props.iconClass && props.iconClass !== '#'));

/** 若图标名为 Element Plus 图标组件名（首字母大写），直接渲染组件 */
const elIconComp = computed<Component | null>(() => {
  if (!props.iconClass) return null;
  const comp = (ElementPlusIconsVue as Record<string, Component>)[props.iconClass];
  if (comp && /^[A-Z]/.test(props.iconClass)) {
    return comp;
  }
  return null;
});

const iconName = computed(() => `#icon-local-${props.iconClass}`);

const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`;
  }
  return 'svg-icon';
});
</script>

<style scoped lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
