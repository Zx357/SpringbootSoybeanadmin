<template>
  <el-image
    :src="`${realSrc}`"
    fit="cover"
    :style="`width:${realWidth};height:${realHeight};`"
    :preview-src-list="realSrcList"
    preview-teleported
  >
    <template #error>
      <div class="image-slot">
        <el-icon><picture-filled /></el-icon>
      </div>
    </template>
  </el-image>
</template>

<script setup>
import { getServiceBaseURL } from '@/utils/service';

defineOptions({ name: 'ImagePreview' });

const isExternal = path => /^(https?:|mailto:|tel:)/.test(path);

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  width: {
    type: [Number, String],
    default: ''
  },
  height: {
    type: [Number, String],
    default: ''
  }
});

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const baseUrl = getServiceBaseURL(import.meta.env, isHttpProxy).baseURL;

const realSrc = computed(() => {
  if (!props.src) {
    return '';
  }
  const realSrc = props.src.split(',')[0];
  if (isExternal(realSrc)) {
    return realSrc;
  }
  return baseUrl + realSrc;
});

const realSrcList = computed(() => {
  if (!props.src) {
    return [];
  }
  const realSrcList = props.src.split(',');
  const srcList = [];
  realSrcList.forEach(item => {
    if (isExternal(item)) {
      return srcList.push(item);
    }
    return srcList.push(baseUrl + item);
  });
  return srcList;
});

const realWidth = computed(() => (typeof props.width == 'string' ? props.width : `${props.width}px`));

const realHeight = computed(() => (typeof props.height == 'string' ? props.height : `${props.height}px`));
</script>

<style lang="scss" scoped>
.el-image {
  border-radius: 5px;
  background-color: #ebeef5;
  box-shadow: 0 0 5px 1px #ccc;
  :deep(.el-image__inner) {
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
    }
  }
  :deep(.image-slot) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #909399;
    font-size: 30px;
  }
}
</style>
