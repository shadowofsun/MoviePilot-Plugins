<script setup>
import { ref } from 'vue'
import AppPage from './AppPage.vue'

defineProps({
  api: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['switch', 'close'])

const pageRef = ref(null)

// 主界面点击"设置"按钮，切换到配置界面。
function openConfig() {
  emit('switch')
}
</script>

<template>
  <div class="metadata115sync-page-wrapper">
    <VToolbar density="comfortable" class="sticky-toolbar">
      <div class="text-h6 ms-3">元数据115同步</div>
      <VSpacer />
      <VBtn icon="mdi-cog" variant="text" @click="openConfig" />
      <VBtn icon="mdi-refresh" variant="text" :loading="pageRef?.loading" @click="pageRef?.loadStatus()" />
      <VBtn icon="mdi-close" variant="text" @click="emit('close')" />
    </VToolbar>
    <VDivider />

    <AppPage ref="pageRef" :api="api" plugin-id="Metadata115Sync" hide-title @open-config="openConfig" />
  </div>
</template>

<style scoped>
.sticky-toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgb(var(--v-theme-surface));
}
</style>
