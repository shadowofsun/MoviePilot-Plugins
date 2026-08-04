<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  initialConfig: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['save', 'switch', 'close'])

const localConfig = ref({
  enabled: false,
  cron: '',
  interval: 0,
  onlyonce: false,
  notify: false,
  upload_delay: 0.5,
  trigger_monitor: false,
  dir_map: [],
})

// 新增一条目录映射。
function addDirMap() {
  localConfig.value.dir_map.push({ local: '', remote: '' })
}

// 删除指定目录映射。
function removeDirMap(index) {
  localConfig.value.dir_map.splice(index, 1)
}

// 保存配置。
function saveConfig() {
  emit('save', {
    enabled: Boolean(localConfig.value.enabled),
    cron: localConfig.value.cron || '',
    interval: Number(localConfig.value.interval) || 0,
    onlyonce: Boolean(localConfig.value.onlyonce),
    notify: Boolean(localConfig.value.notify),
    upload_delay: Number(localConfig.value.upload_delay) || 0,
    dir_map: (localConfig.value.dir_map || []).filter(
      item => item.local && item.remote
    ),
  })
}

onMounted(() => {
  const cfg = props.initialConfig || {}
  localConfig.value = {
    enabled: Boolean(cfg.enabled),
    cron: cfg.cron || '',
    interval: Number(cfg.interval) || 0,
    onlyonce: Boolean(cfg.onlyonce),
    notify: Boolean(cfg.notify),
    upload_delay: Number(cfg.upload_delay) || 0.5,
    dir_map: Array.isArray(cfg.dir_map) ? cfg.dir_map.map(item => ({ ...item })) : [],
  }
})
</script>

<template>
  <div class="metadata115sync-config">
    <VToolbar density="comfortable" color="transparent">
      <VBtn icon="mdi-arrow-left" variant="text" @click="emit('switch')" title="返回主界面" />
      <div class="text-h6 ms-3">元数据115同步配置</div>
      <VSpacer />
      <VBtn icon="mdi-content-save" variant="text" color="primary" @click="saveConfig" />
      <VBtn icon="mdi-close" variant="text" @click="emit('close')" />
    </VToolbar>
    <VDivider />

    <VContainer fluid>
      <VSwitch v-model="localConfig.enabled" label="启用插件" color="primary" />
      <VAlert v-if="localConfig.enabled" type="info" density="compact" class="mb-3">
        插件启用后，会在以下情况自动触发元数据同步：
        <ul class="mt-1 mb-0">
          <li>MoviePilot 文件整理完成时（监听整理完成事件，自动同步新增影视的元数据到115）</li>
          <li>按下方配置的定时任务（cron 或间隔）周期同步</li>
          <li>手动点击「立即同步」按钮或发送 /sync115 命令</li>
        </ul>
      </VAlert>

      <VCard class="mb-4">
        <VCardTitle>定时设置</VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <VTextField
                v-model="localConfig.cron"
                label="Cron 表达式（如 0 6 * * *）"
                placeholder="留空则不使用 cron 定时"
                hint="标准 5 位 cron 表达式"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model.number="localConfig.interval"
                label="间隔（分钟）"
                type="number"
                min="0"
                hint="大于 0 时按间隔定时同步"
              />
            </VCol>
          </VRow>
          <VSwitch v-model="localConfig.onlyonce" label="保存后立即运行一次" color="primary" />
          <VSwitch v-model="localConfig.notify" label="同步完成后发送通知" color="primary" />
          <VTextField
            v-model.number="localConfig.upload_delay"
            label="上传间隔（秒）"
            type="number"
            min="0"
            step="0.1"
            hint="每个文件上传后的等待间隔，避免触发115风控。建议 0.5-2 秒"
          />
        </VCardText>
      </VCard>

      <VCard>
        <VCardTitle class="d-flex align-center">
          目录映射
          <VSpacer />
          <VBtn size="small" color="primary" variant="tonal" prepend-icon="mdi-plus" @click="addDirMap">
            添加
          </VBtn>
        </VCardTitle>
        <VCardText>
          <VAlert type="info" density="compact" class="mb-3">
            本地目录（已刮削的硬链接目录）→ 115网盘目录。同步时会把本地目录中的 nfo/海报/mediainfo.json 等元数据文件上传到115对应目录。
          </VAlert>
          <div v-for="(item, index) in localConfig.dir_map" :key="index" class="mb-3">
            <VCard variant="outlined">
              <VCardText>
                <VRow align="center">
                  <VCol cols="12" md="5">
                    <VTextField
                      v-model="item.local"
                      label="本地目录"
                      placeholder="/media/Moviepilot media/硬链接/动漫/动漫剧集"
                    />
                  </VCol>
                  <VCol cols="12" md="1" class="text-center">
                    <VIcon color="primary">mdi-arrow-right</VIcon>
                  </VCol>
                  <VCol cols="12" md="5">
                    <VTextField
                      v-model="item.remote"
                      label="115目录"
                      placeholder="/自用已刮削影音库/动漫剧集"
                    />
                  </VCol>
                  <VCol cols="12" md="1" class="text-center">
                    <VBtn icon="mdi-delete" variant="text" color="error" @click="removeDirMap(index)" />
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </div>
          <VAlert v-if="!localConfig.dir_map.length" type="info" density="compact">
            尚未配置目录映射，点击"添加"按钮新增。
          </VAlert>
        </VCardText>
      </VCard>
    </VContainer>
  </div>
</template>
