import { importShared } from './__federation_fn_import-JrT3xvdd.js';

const {createTextVNode:_createTextVNode,resolveComponent:_resolveComponent,withCtx:_withCtx,createVNode:_createVNode,openBlock:_openBlock,createBlock:_createBlock,createCommentVNode:_createCommentVNode,toDisplayString:_toDisplayString,createElementVNode:_createElementVNode,renderList:_renderList,Fragment:_Fragment,createElementBlock:_createElementBlock} = await importShared('vue');


const _hoisted_1 = { class: "metadata115sync-app" };
const _hoisted_2 = { class: "d-flex align-center" };
const _hoisted_3 = { class: "text-caption" };
const _hoisted_4 = { class: "text-body-2" };
const _hoisted_5 = { class: "text-body-2" };

const {computed,onMounted,ref} = await importShared('vue');



const _sfc_main = {
  __name: 'AppPage',
  props: {
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
},
  emits: ['open-config'],
  setup(__props, { emit: __emit }) {

const props = __props;

const emit = __emit;

const loading = ref(false);
const runningAll = ref(false);
const runningIndex = ref(-1);
const checking = ref(false);
const stopping = ref(false);
const error = ref('');
const status = ref({
  enabled: false,
  running: false,
  current_dir: '',
  last_run: '',
  last_result: '',
  sync_log: [],
});
const dirMap = ref([]);
const checkResult = ref(null);

const pluginBase = computed(() => `plugin/${props.pluginId || 'Metadata115Sync'}`);

// 加载同步状态和目录映射。
async function loadStatus() {
  loading.value = true;
  error.value = '';
  try {
    const response = await props.api.get(`${pluginBase.value}/status`);
    const data = response?.data || response || {};
    status.value = {
      enabled: Boolean(data.enabled),
      running: Boolean(data.running),
      current_dir: data.current_dir || '',
      last_run: data.last_run || '',
      last_result: data.last_result || '',
      sync_log: Array.isArray(data.sync_log) ? data.sync_log : [],
    };
    // 加载目录映射配置
    const cfgResp = await props.api.get(`${pluginBase.value}`);
    const cfgData = cfgResp?.data || cfgResp || {};
    const cfg = cfgData.config || cfgData || {};
    dirMap.value = Array.isArray(cfg.dir_map) ? cfg.dir_map : [];
  } catch (err) {
    error.value = err?.message || '加载状态失败';
  } finally {
    loading.value = false;
  }
}

// 手动触发全部目录同步。
async function runSyncAll() {
  runningAll.value = true;
  error.value = '';
  try {
    const response = await props.api.post(`${pluginBase.value}/run`);
    const data = response?.data || response || {};
    if (data.success === false) {
      error.value = data.message || '同步失败';
    } else {
      status.value.running = true;
      status.value.current_dir = '全部目录';
    }
  } catch (err) {
    error.value = err?.message || '同步失败';
  } finally {
    runningAll.value = false;
  }
}

// 手动触发指定目录同步（用 query 参数传 index）。
async function runSyncDir(index) {
  runningIndex.value = index;
  error.value = '';
  try {
    const response = await props.api.post(`${pluginBase.value}/run_dir?index=${index}`);
    const data = response?.data || response || {};
    if (data.success === false) {
      error.value = data.message || '同步失败';
    } else {
      status.value.running = true;
      status.value.current_dir = data.message || '';
    }
  } catch (err) {
    error.value = err?.message || '同步失败';
  } finally {
    runningIndex.value = -1;
  }
}

// 停止同步。
async function stopSync() {
  stopping.value = true;
  error.value = '';
  try {
    const response = await props.api.post(`${pluginBase.value}/stop`);
    const data = response?.data || response || {};
    if (data.success === false) {
      error.value = data.message || '停止失败';
    }
  } catch (err) {
    error.value = err?.message || '停止失败';
  } finally {
    stopping.value = false;
  }
}

// 检测115网盘风控状态。
async function checkRisk() {
  checking.value = true;
  error.value = '';
  checkResult.value = null;
  try {
    const response = await props.api.get(`${pluginBase.value}/check`);
    const data = response?.data || response || {};
    if (data.success === false) {
      error.value = data.message || '检测失败';
    } else {
      checkResult.value = data;
    }
  } catch (err) {
    error.value = err?.message || '检测失败';
  } finally {
    checking.value = false;
  }
}

// 格式化风控冷却剩余时间。
function formatCooldown(seconds) {
  if (!seconds) return '无'
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}小时${m}分${s}秒`
}

onMounted(() => {
  loadStatus();
  // 定时刷新状态（同步进行中时）
  setInterval(() => {
    if (status.value.running) {
      loadStatus();
    }
  }, 3000);
});

return (_ctx, _cache) => {
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VSpacer = _resolveComponent("VSpacer");
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VCardTitle = _resolveComponent("VCardTitle");
  const _component_VCard = _resolveComponent("VCard");
  const _component_VAlert = _resolveComponent("VAlert");
  const _component_VChip = _resolveComponent("VChip");
  const _component_VListItemTitle = _resolveComponent("VListItemTitle");
  const _component_VListItem = _resolveComponent("VListItem");
  const _component_VList = _resolveComponent("VList");
  const _component_VCardText = _resolveComponent("VCardText");
  const _component_VCardActions = _resolveComponent("VCardActions");
  const _component_VDivider = _resolveComponent("VDivider");
  const _component_VCol = _resolveComponent("VCol");
  const _component_VRow = _resolveComponent("VRow");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    (!__props.hideTitle)
      ? (_openBlock(), _createBlock(_component_VCard, {
          key: 0,
          class: "mb-4"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_VCardTitle, { class: "d-flex align-center" }, {
              default: _withCtx(() => [
                _createVNode(_component_VIcon, {
                  class: "me-2",
                  color: "primary"
                }, {
                  default: _withCtx(() => [...(_cache[2] || (_cache[2] = [
                    _createTextVNode("mdi-cloud-upload", -1)
                  ]))]),
                  _: 1
                }),
                _cache[4] || (_cache[4] = _createTextVNode(" 元数据115同步 ", -1)),
                _createVNode(_component_VSpacer),
                _createVNode(_component_VBtn, {
                  size: "small",
                  variant: "tonal",
                  color: "primary",
                  "prepend-icon": "mdi-cog",
                  onClick: _cache[0] || (_cache[0] = $event => (emit('open-config')))
                }, {
                  default: _withCtx(() => [...(_cache[3] || (_cache[3] = [
                    _createTextVNode(" 设置 ", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }))
      : _createCommentVNode("", true),
    (error.value)
      ? (_openBlock(), _createBlock(_component_VAlert, {
          key: 1,
          type: "error",
          class: "mb-4",
          closable: "",
          "onClick:close": _cache[1] || (_cache[1] = $event => (error.value = ''))
        }, {
          default: _withCtx(() => [
            _createTextVNode(_toDisplayString(error.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode("", true),
    _createVNode(_component_VCard, { class: "mb-4" }, {
      default: _withCtx(() => [
        _createVNode(_component_VCardTitle, null, {
          default: _withCtx(() => [...(_cache[5] || (_cache[5] = [
            _createTextVNode("同步状态", -1)
          ]))]),
          _: 1
        }),
        _createVNode(_component_VCardText, null, {
          default: _withCtx(() => [
            _createVNode(_component_VList, null, {
              default: _withCtx(() => [
                _createVNode(_component_VListItem, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_VListItemTitle, null, {
                      default: _withCtx(() => [
                        _cache[7] || (_cache[7] = _createElementVNode("span", { class: "text-body-2" }, "插件状态：", -1)),
                        _createVNode(_component_VChip, {
                          color: status.value.enabled ? 'success' : 'default',
                          size: "small"
                        }, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(status.value.enabled ? '已启用' : '未启用'), 1)
                          ]),
                          _: 1
                        }, 8, ["color"]),
                        (status.value.running)
                          ? (_openBlock(), _createBlock(_component_VChip, {
                              key: 0,
                              color: "primary",
                              size: "small",
                              class: "ms-2"
                            }, {
                              default: _withCtx(() => [...(_cache[6] || (_cache[6] = [
                                _createTextVNode(" 同步中 ", -1)
                              ]))]),
                              _: 1
                            }))
                          : _createCommentVNode("", true)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                (status.value.running)
                  ? (_openBlock(), _createBlock(_component_VListItem, { key: 0 }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VListItemTitle, null, {
                          default: _withCtx(() => [
                            _cache[8] || (_cache[8] = _createElementVNode("span", { class: "text-body-2" }, "当前目录：", -1)),
                            _createElementVNode("span", null, _toDisplayString(status.value.current_dir || '...'), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }))
                  : _createCommentVNode("", true),
                _createVNode(_component_VListItem, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_VListItemTitle, null, {
                      default: _withCtx(() => [
                        _cache[9] || (_cache[9] = _createElementVNode("span", { class: "text-body-2" }, "上次运行：", -1)),
                        _createElementVNode("span", null, _toDisplayString(status.value.last_run || '从未运行'), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                (status.value.last_result)
                  ? (_openBlock(), _createBlock(_component_VListItem, { key: 1 }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VListItemTitle, null, {
                          default: _withCtx(() => [
                            _cache[10] || (_cache[10] = _createElementVNode("span", { class: "text-body-2" }, "上次结果：", -1)),
                            _createElementVNode("span", null, _toDisplayString(status.value.last_result), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }))
                  : _createCommentVNode("", true)
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode(_component_VCardActions, null, {
          default: _withCtx(() => [
            _createVNode(_component_VBtn, {
              color: "primary",
              loading: runningAll.value,
              disabled: !status.value.enabled || status.value.running,
              "prepend-icon": "mdi-play",
              onClick: runSyncAll
            }, {
              default: _withCtx(() => [...(_cache[11] || (_cache[11] = [
                _createTextVNode(" 全部同步 ", -1)
              ]))]),
              _: 1
            }, 8, ["loading", "disabled"]),
            (status.value.running)
              ? (_openBlock(), _createBlock(_component_VBtn, {
                  key: 0,
                  color: "error",
                  loading: stopping.value,
                  "prepend-icon": "mdi-stop",
                  onClick: stopSync
                }, {
                  default: _withCtx(() => [...(_cache[12] || (_cache[12] = [
                    _createTextVNode(" 停止 ", -1)
                  ]))]),
                  _: 1
                }, 8, ["loading"]))
              : _createCommentVNode("", true),
            _createVNode(_component_VBtn, {
              color: "warning",
              variant: "tonal",
              loading: checking.value,
              "prepend-icon": "mdi-shield-alert",
              onClick: checkRisk
            }, {
              default: _withCtx(() => [...(_cache[13] || (_cache[13] = [
                _createTextVNode(" 检测115风控 ", -1)
              ]))]),
              _: 1
            }, 8, ["loading"]),
            _createVNode(_component_VBtn, {
              variant: "text",
              loading: loading.value,
              "prepend-icon": "mdi-refresh",
              onClick: loadStatus
            }, {
              default: _withCtx(() => [...(_cache[14] || (_cache[14] = [
                _createTextVNode(" 刷新 ", -1)
              ]))]),
              _: 1
            }, 8, ["loading"])
          ]),
          _: 1
        }),
        (checkResult.value)
          ? (_openBlock(), _createBlock(_component_VCardText, { key: 0 }, {
              default: _withCtx(() => [
                _createVNode(_component_VDivider, { class: "mb-3" }),
                _createVNode(_component_VAlert, {
                  type: checkResult.value.level === 'success' ? 'success' : 'warning',
                  density: "compact",
                  class: "mb-2"
                }, {
                  default: _withCtx(() => [
                    _createElementVNode("div", _hoisted_2, [
                      _createVNode(_component_VIcon, {
                        class: "me-2",
                        color: checkResult.value.level === 'success' ? 'success' : 'warning'
                      }, {
                        default: _withCtx(() => [
                          _createTextVNode(_toDisplayString(checkResult.value.level === 'success' ? 'mdi-check-circle' : 'mdi-alert'), 1)
                        ]),
                        _: 1
                      }, 8, ["color"]),
                      _createElementVNode("strong", null, "115网盘状态：" + _toDisplayString(checkResult.value.status), 1)
                    ])
                  ]),
                  _: 1
                }, 8, ["type"]),
                _createVNode(_component_VList, { density: "compact" }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VListItem, null, {
                      default: _withCtx(() => [
                        _createVNode(_component_VListItemTitle, null, {
                          default: _withCtx(() => [
                            _cache[15] || (_cache[15] = _createElementVNode("span", { class: "text-body-2" }, "风控冷却：", -1)),
                            _createElementVNode("span", null, _toDisplayString(checkResult.value.in_cooldown ? `冷却中，剩余 ${formatCooldown(checkResult.value.cooldown_remaining)}` : '无'), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VListItem, null, {
                      default: _withCtx(() => [
                        _createVNode(_component_VListItemTitle, null, {
                          default: _withCtx(() => [
                            _cache[16] || (_cache[16] = _createElementVNode("span", { class: "text-body-2" }, "当前速率：", -1)),
                            _createElementVNode("span", null, "QPS " + _toDisplayString(checkResult.value.qps) + " / QPM " + _toDisplayString(checkResult.value.qpm) + " / QPH " + _toDisplayString(checkResult.value.qph), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VListItem, null, {
                      default: _withCtx(() => [
                        _createVNode(_component_VListItemTitle, null, {
                          default: _withCtx(() => [
                            _cache[17] || (_cache[17] = _createElementVNode("span", { class: "text-body-2" }, "API 限流：", -1)),
                            _createElementVNode("span", null, _toDisplayString(checkResult.value.api_qps_limit ?? '未知') + " QPS", 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VListItem, null, {
                      default: _withCtx(() => [
                        _createVNode(_component_VListItemTitle, null, {
                          default: _withCtx(() => [
                            _cache[18] || (_cache[18] = _createElementVNode("span", { class: "text-body-2" }, "检测时间：", -1)),
                            _createElementVNode("span", null, _toDisplayString(checkResult.value.check_time), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }))
          : _createCommentVNode("", true)
      ]),
      _: 1
    }),
    (status.value.sync_log.length)
      ? (_openBlock(), _createBlock(_component_VCard, {
          key: 2,
          class: "mb-4"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_VCardTitle, null, {
              default: _withCtx(() => [...(_cache[19] || (_cache[19] = [
                _createTextVNode("同步记录", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VCardText, null, {
              default: _withCtx(() => [
                _createVNode(_component_VList, {
                  density: "compact",
                  "max-height": "200",
                  class: "overflow-y-auto"
                }, {
                  default: _withCtx(() => [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(status.value.sync_log, (log, idx) => {
                      return (_openBlock(), _createBlock(_component_VListItem, { key: idx }, {
                        default: _withCtx(() => [
                          _createVNode(_component_VListItemTitle, null, {
                            default: _withCtx(() => [
                              _createElementVNode("span", _hoisted_3, _toDisplayString(log), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024))
                    }), 128))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }))
      : _createCommentVNode("", true),
    _createVNode(_component_VCard, null, {
      default: _withCtx(() => [
        _createVNode(_component_VCardTitle, null, {
          default: _withCtx(() => [...(_cache[20] || (_cache[20] = [
            _createTextVNode("目录映射", -1)
          ]))]),
          _: 1
        }),
        _createVNode(_component_VCardText, null, {
          default: _withCtx(() => [
            (!dirMap.value.length)
              ? (_openBlock(), _createBlock(_component_VAlert, {
                  key: 0,
                  type: "info",
                  density: "compact"
                }, {
                  default: _withCtx(() => [...(_cache[21] || (_cache[21] = [
                    _createTextVNode(" 尚未配置目录映射，请在插件配置页添加。 ", -1)
                  ]))]),
                  _: 1
                }))
              : _createCommentVNode("", true),
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(dirMap.value, (item, index) => {
              return (_openBlock(), _createElementBlock("div", {
                key: index,
                class: "mb-3"
              }, [
                _createVNode(_component_VCard, { variant: "outlined" }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCardText, null, {
                      default: _withCtx(() => [
                        _createVNode(_component_VRow, { align: "center" }, {
                          default: _withCtx(() => [
                            _createVNode(_component_VCol, {
                              cols: "12",
                              md: "5"
                            }, {
                              default: _withCtx(() => [
                                _cache[22] || (_cache[22] = _createElementVNode("div", { class: "text-body-2 text-medium-emphasis" }, "本地目录", -1)),
                                _createElementVNode("div", _hoisted_4, _toDisplayString(item.local), 1)
                              ]),
                              _: 2
                            }, 1024),
                            _createVNode(_component_VCol, {
                              cols: "12",
                              md: "1",
                              class: "text-center"
                            }, {
                              default: _withCtx(() => [
                                _createVNode(_component_VIcon, { color: "primary" }, {
                                  default: _withCtx(() => [...(_cache[23] || (_cache[23] = [
                                    _createTextVNode("mdi-arrow-right", -1)
                                  ]))]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            _createVNode(_component_VCol, {
                              cols: "12",
                              md: "5"
                            }, {
                              default: _withCtx(() => [
                                _cache[24] || (_cache[24] = _createElementVNode("div", { class: "text-body-2 text-medium-emphasis" }, "115目录", -1)),
                                _createElementVNode("div", _hoisted_5, _toDisplayString(item.remote), 1)
                              ]),
                              _: 2
                            }, 1024),
                            _createVNode(_component_VCol, {
                              cols: "12",
                              md: "1",
                              class: "text-center"
                            }, {
                              default: _withCtx(() => [
                                _createVNode(_component_VBtn, {
                                  color: "primary",
                                  size: "small",
                                  variant: "tonal",
                                  loading: runningIndex.value === index,
                                  disabled: !status.value.enabled || status.value.running,
                                  "prepend-icon": "mdi-play",
                                  onClick: $event => (runSyncDir(index))
                                }, {
                                  default: _withCtx(() => [...(_cache[25] || (_cache[25] = [
                                    _createTextVNode(" 同步 ", -1)
                                  ]))]),
                                  _: 1
                                }, 8, ["loading", "disabled", "onClick"])
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024)
              ]))
            }), 128))
          ]),
          _: 1
        })
      ]),
      _: 1
    })
  ]))
}
}

};

export { _sfc_main as default };
