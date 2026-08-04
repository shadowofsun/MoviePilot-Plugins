<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  api: {
    type: Object,
    default: () => ({}),
  },
  pluginId: {
    type: String,
    default: 'Metadata115Sync',
  },
  hideTitle: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['open-config'])

const loading = ref(false)
const runningAll = ref(false)
const runningIndex = ref(-1)
const checking = ref(false)
const stopping = ref(false)
const error = ref('')
const status = ref({
  enabled: false,
  running: false,
  current_dir: '',
  last_run: '',
  last_result: '',
  sync_log: [],
})
const dirMap = ref([])
const checkResult = ref(null)

const pluginBase = computed(() => `plugin/${props.pluginId || 'Metadata115Sync'}`)

// 加载同步状态和目录映射。
async function loadStatus() {
  loading.value = true
  error.value = ''
  try {
    const response = await props.api.get(`${pluginBase.value}/status`)
    const data = response?.data || response || {}
    status.value = {
      enabled: Boolean(data.enabled),
      running: Boolean(data.running),
      current_dir: data.current_dir || '',
      last_run: data.last_run || '',
      last_result: data.last_result || '',
      sync_log: Array.isArray(data.sync_log) ? data.sync_log : [],
    }
    // 加载目录映射配置
    const cfgResp = await props.api.get(`${pluginBase.value}`)
    const cfgData = cfgResp?.data || cfgResp || {}
    const cfg = cfgData.config || cfgData || {}
    dirMap.value = Array.isArray(cfg.dir_map) ? cfg.dir_map : []
  } catch (err) {
    error.value = err?.message || '加载状态失败'
  } finally {
    loading.value = false
  }
}

// 手动触发全部目录同步。
async function runSyncAll() {
  runningAll.value = true
  error.value = ''
  try {
    const response = await props.api.post(`${pluginBase.value}/run`)
    const data = response?.data || response || {}
    if (data.success === false) {
      error.value = data.message || '同步失败'
    } else {
      status.value.running = true
      status.value.current_dir = '全部目录'
    }
  } catch (err) {
    error.value = err?.message || '同步失败'
  } finally {
    runningAll.value = false
  }
}

// 手动触发指定目录同步（用 query 参数传 index）。
async function runSyncDir(index) {
  runningIndex.value = index
  error.value = ''
  try {
    const response = await props.api.post(`${pluginBase.value}/run_dir?index=${index}`)
    const data = response?.data || response || {}
    if (data.success === false) {
      error.value = data.message || '同步失败'
    } else {
      status.value.running = true
      status.value.current_dir = data.message || ''
    }
  } catch (err) {
    error.value = err?.message || '同步失败'
  } finally {
    runningIndex.value = -1
  }
}

// 停止同步。
async function stopSync() {
  stopping.value = true
  error.value = ''
  try {
    const response = await props.api.post(`${pluginBase.value}/stop`)
    const data = response?.data || response || {}
    if (data.success === false) {
      error.value = data.message || '停止失败'
    }
  } catch (err) {
    error.value = err?.message || '停止失败'
  } finally {
    stopping.value = false
  }
}

// 检测115网盘风控状态。
async function checkRisk() {
  checking.value = true
  error.value = ''
  checkResult.value = null
  try {
    const response = await props.api.get(`${pluginBase.value}/check`)
    const data = response?.data || response || {}
    if (data.success === false) {
      error.value = data.message || '检测失败'
    } else {
      checkResult.value = data
    }
  } catch (err) {
    error.value = err?.message || '检测失败'
  } finally {
    checking.value = false
  }
}

// 格式化风控冷却剩余时间。
function formatCooldown(seconds) {
  if (!seconds) return '无'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h}小时${m}分${s}秒`
}

onMounted(() => {
  loadStatus()
  // 定时刷新状态（同步进行中时）
  setInterval(() => {
    if (status.value.running) {
      loadStatus()
    }
  }, 3000)
})
</script>

<template>
  <div class="metadata115sync-app">
    <VCard v-if="!hideTitle" class="mb-4">
      <VCardTitle class="d-flex align-center">
        <VIcon class="me-2" color="primary">mdi-cloud-upload</VIcon>
        元数据115同步
        <VSpacer />
        <VBtn
          size="small"
          variant="tonal"
          color="primary"
          prepend-icon="mdi-cog"
          @click="emit('open-config')"
        >
          设置
        </VBtn>
      </VCardTitle>
    </VCard>

    <VAlert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">
      {{ error }}
    </VAlert>

    <VCard class="mb-4">
      <VCardTitle>同步状态</VCardTitle>
      <VCardText>
        <VList>
          <VListItem>
            <VListItemTitle>
              <span class="text-body-2">插件状态：</span>
              <VChip :color="status.enabled ? 'success' : 'default'" size="small">
                {{ status.enabled ? '已启用' : '未启用' }}
              </VChip>
              <VChip v-if="status.running" color="primary" size="small" class="ms-2">
                同步中
              </VChip>
            </VListItemTitle>
          </VListItem>
          <VListItem v-if="status.running">
            <VListItemTitle>
              <span class="text-body-2">当前目录：</span>
              <span>{{ status.current_dir || '...' }}</span>
            </VListItemTitle>
          </VListItem>
          <VListItem>
            <VListItemTitle>
              <span class="text-body-2">上次运行：</span>
              <span>{{ status.last_run || '从未运行' }}</span>
            </VListItemTitle>
          </VListItem>
          <VListItem v-if="status.last_result">
            <VListItemTitle>
              <span class="text-body-2">上次结果：</span>
              <span>{{ status.last_result }}</span>
            </VListItemTitle>
          </VListItem>
        </VList>
      </VCardText>
      <VCardActions>
        <VBtn
          color="primary"
          :loading="runningAll"
          :disabled="!status.enabled || status.running"
          prepend-icon="mdi-play"
          @click="runSyncAll"
        >
          全部同步
        </VBtn>
        <VBtn
          v-if="status.running"
          color="error"
          :loading="stopping"
          prepend-icon="mdi-stop"
          @click="stopSync"
        >
          停止
        </VBtn>
        <VBtn
          color="warning"
          variant="tonal"
          :loading="checking"
          prepend-icon="mdi-shield-alert"
          @click="checkRisk"
        >
          检测115风控
        </VBtn>
        <VBtn variant="text" :loading="loading" prepend-icon="mdi-refresh" @click="loadStatus">
          刷新
        </VBtn>
      </VCardActions>

      <VCardText v-if="checkResult">
        <VDivider class="mb-3" />
        <VAlert
          :type="checkResult.level === 'success' ? 'success' : 'warning'"
          density="compact"
          class="mb-2"
        >
          <div class="d-flex align-center">
            <VIcon class="me-2" :color="checkResult.level === 'success' ? 'success' : 'warning'">
              {{ checkResult.level === 'success' ? 'mdi-check-circle' : 'mdi-alert' }}
            </VIcon>
            <strong>115网盘状态：{{ checkResult.status }}</strong>
          </div>
        </VAlert>
        <VList density="compact">
          <VListItem>
            <VListItemTitle>
              <span class="text-body-2">风控冷却：</span>
              <span>{{ checkResult.in_cooldown ? `冷却中，剩余 ${formatCooldown(checkResult.cooldown_remaining)}` : '无' }}</span>
            </VListItemTitle>
          </VListItem>
          <VListItem>
            <VListItemTitle>
              <span class="text-body-2">当前速率：</span>
              <span>QPS {{ checkResult.qps }} / QPM {{ checkResult.qpm }} / QPH {{ checkResult.qph }}</span>
            </VListItemTitle>
          </VListItem>
          <VListItem>
            <VListItemTitle>
              <span class="text-body-2">API 限流：</span>
              <span>{{ checkResult.api_qps_limit ?? '未知' }} QPS</span>
            </VListItemTitle>
          </VListItem>
          <VListItem>
            <VListItemTitle>
              <span class="text-body-2">检测时间：</span>
              <span>{{ checkResult.check_time }}</span>
            </VListItemTitle>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>

    <VCard v-if="status.sync_log.length" class="mb-4">
      <VCardTitle>同步记录</VCardTitle>
      <VCardText>
        <VList density="compact" max-height="200" class="overflow-y-auto">
          <VListItem v-for="(log, idx) in status.sync_log" :key="idx">
            <VListItemTitle>
              <span class="text-caption">{{ log }}</span>
            </VListItemTitle>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>

    <VCard>
      <VCardTitle>目录映射</VCardTitle>
      <VCardText>
        <VAlert v-if="!dirMap.length" type="info" density="compact">
          尚未配置目录映射，请在插件配置页添加。
        </VAlert>
        <div v-for="(item, index) in dirMap" :key="index" class="mb-3">
          <VCard variant="outlined">
            <VCardText>
              <VRow align="center">
                <VCol cols="12" md="5">
                  <div class="text-body-2 text-medium-emphasis">本地目录</div>
                  <div class="text-body-2">{{ item.local }}</div>
                </VCol>
                <VCol cols="12" md="1" class="text-center">
                  <VIcon color="primary">mdi-arrow-right</VIcon>
                </VCol>
                <VCol cols="12" md="5">
                  <div class="text-body-2 text-medium-emphasis">115目录</div>
                  <div class="text-body-2">{{ item.remote }}</div>
                </VCol>
                <VCol cols="12" md="1" class="text-center">
                  <VBtn
                    color="primary"
                    size="small"
                    variant="tonal"
                    :loading="runningIndex === index"
                    :disabled="!status.enabled || status.running"
                    prepend-icon="mdi-play"
                    @click="runSyncDir(index)"
                  >
                    同步
                  </VBtn>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>
