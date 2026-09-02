<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Icon } from '@iconify/vue';

defineOptions({ name: 'SvgIcon', inheritAttrs: false });

/**
 * Props
 *
 * - Support iconify and local svg icon
 * - If icon and localIcon are passed at the same time, localIcon will be rendered first
 * - iconClass: 兼容若依 <svg-icon icon-class="xxx" /> 用法，按本地图标渲染
 */
interface Props {
  /** Iconify icon name */
  icon?: string;
  /** Local svg icon name */
  localIcon?: string;
  /** 若依风格的本地图标名（icon-class） */
  iconClass?: string;
  /** 若依风格：图标颜色（仅本地图标生效） */
  color?: string;
}

const props = defineProps<Props>();

const attrs = useAttrs();

const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || ''
}));

const finalLocalIcon = computed(() => props.localIcon || props.iconClass);

/** 若依空图标占位符（# 或空串）不渲染图标 */
const isValidLocalIcon = computed(() => {
  const name = finalLocalIcon.value;
  return Boolean(name && name !== '#');
});

const symbolId = computed(() => {
  const { VITE_ICON_LOCAL_PREFIX: prefix } = import.meta.env;

  const defaultLocalIcon = 'no-icon';

  const icon = finalLocalIcon.value || defaultLocalIcon;

  return `#${prefix}-${icon}`;
});

/** If localIcon is passed, render localIcon first */
const renderLocalIcon = computed(() => isValidLocalIcon.value || !props.icon);
const iconStyle = computed(() => (props.color ? { color: props.color, fill: 'currentColor' } : undefined));
</script>

<template>
  <template v-if="renderLocalIcon && isValidLocalIcon">
    <svg aria-hidden="true" width="1em" height="1em" :style="iconStyle" v-bind="bindAttrs">
      <use :xlink:href="symbolId" fill="currentColor" />
    </svg>
  </template>
  <template v-else-if="renderLocalIcon">
    <!-- iconClass 为 # 或空时不渲染图标（与若依原版行为一致） -->
  </template>
  <template v-else>
    <Icon v-if="icon" :icon="icon" v-bind="bindAttrs" />
  </template>
</template>

<style scoped></style>
