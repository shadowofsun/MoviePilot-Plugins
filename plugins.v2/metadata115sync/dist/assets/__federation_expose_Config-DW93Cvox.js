import { importShared } from './__federation_fn_import-JrT3xvdd.js';

const {resolveComponent:_resolveComponent,createVNode:_createVNode,createElementVNode:_createElementVNode,withCtx:_withCtx,createTextVNode:_createTextVNode,openBlock:_openBlock,createBlock:_createBlock,createCommentVNode:_createCommentVNode,renderList:_renderList,Fragment:_Fragment,createElementBlock:_createElementBlock} = await importShared('vue');


const _hoisted_1 = { class: "metadata115sync-config" };

const {onMounted,ref} = await importShared('vue');



const _sfc_main = {
  __name: 'Config',
  props: {
  initialConfig: {
    type: Object,
    default: () => ({}),
  },
},
  emits: ['save', 'switch', 'close'],
  setup(__props, { emit: __emit }) {

const props = __props;

const emit = __emit;

const localConfig = ref({
  enabled: false,
  cron: '',
  interval: 0,
  onlyonce: false,
  notify: false,
  upload_delay: 0.5,
  trigger_monitor: false,
  batch_size: 50,
  batch_pause: 10,
  risk_action: 'pause',
  risk_pause: 60,
  dir_map: [],
});

// 新增一条目录映射。
function addDirMap() {
  localConfig.value.dir_map.push({ local: '', remote: '' });
}

// 删除指定目录映射。
function removeDirMap(index) {
  localConfig.value.dir_map.splice(index, 1);
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
    trigger_monitor: Boolean(localConfig.value.trigger_monitor),
    batch_size: Number(localConfig.value.batch_size) || 0,
    batch_pause: Number(localConfig.value.batch_pause) || 0,
    risk_action: localConfig.value.risk_action || 'pause',
    risk_pause: Number(localConfig.value.risk_pause) || 0,
    dir_map: (localConfig.value.dir_map || []).filter(
      item => item.local && item.remote
    ),
  });
}

onMounted(() => {
  const cfg = props.initialConfig || {};
  localConfig.value = {
    enabled: Boolean(cfg.enabled),
    cron: cfg.cron || '',
    interval: Number(cfg.interval) || 0,
    onlyonce: Boolean(cfg.onlyonce),
    notify: Boolean(cfg.notify),
    upload_delay: Number(cfg.upload_delay) || 0.5,
    trigger_monitor: Boolean(cfg.trigger_monitor),
    batch_size: Number(cfg.batch_size) || 50,
    batch_pause: Number(cfg.batch_pause) || 10,
    risk_action: cfg.risk_action || 'pause',
    risk_pause: Number(cfg.risk_pause) || 60,
    dir_map: Array.isArray(cfg.dir_map) ? cfg.dir_map.map(item => ({ ...item })) : [],
  };
});

return (_ctx, _cache) => {
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VSpacer = _resolveComponent("VSpacer");
  const _component_VToolbar = _resolveComponent("VToolbar");
  const _component_VDivider = _resolveComponent("VDivider");
  const _component_VSwitch = _resolveComponent("VSwitch");
  const _component_VAlert = _resolveComponent("VAlert");
  const _component_VCardTitle = _resolveComponent("VCardTitle");
  const _component_VTextField = _resolveComponent("VTextField");
  const _component_VCol = _resolveComponent("VCol");
  const _component_VRow = _resolveComponent("VRow");
  const _component_VCardText = _resolveComponent("VCardText");
  const _component_VCard = _resolveComponent("VCard");
  const _component_VSelect = _resolveComponent("VSelect");
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VContainer = _resolveComponent("VContainer");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createVNode(_component_VToolbar, {
      density: "comfortable",
      color: "transparent"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_VBtn, {
          icon: "mdi-arrow-left",
          variant: "text",
          onClick: _cache[0] || (_cache[0] = $event => (emit('switch'))),
          title: "返回主界面"
        }),
        _cache[12] || (_cache[12] = _createElementVNode("div", { class: "text-h6 ms-3" }, "元数据115同步配置", -1)),
        _createVNode(_component_VSpacer),
        _createVNode(_component_VBtn, {
          icon: "mdi-content-save",
          variant: "text",
          color: "primary",
          onClick: saveConfig
        }),
        _createVNode(_component_VBtn, {
          icon: "mdi-close",
          variant: "text",
          onClick: _cache[1] || (_cache[1] = $event => (emit('close')))
        })
      ]),
      _: 1
    }),
    _createVNode(_component_VDivider),
    _createVNode(_component_VContainer, { fluid: "" }, {
      default: _withCtx(() => [
        _createVNode(_component_VSwitch, {
          modelValue: localConfig.value.enabled,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((localConfig.value.enabled) = $event)),
          label: "启用插件",
          color: "primary"
        }, null, 8, ["modelValue"]),
        (localConfig.value.enabled)
          ? (_openBlock(), _createBlock(_component_VAlert, {
              key: 0,
              type: "info",
              density: "compact",
              class: "mb-3"
            }, {
              default: _withCtx(() => [...(_cache[13] || (_cache[13] = [
                _createTextVNode(" 插件启用后，会在以下情况自动触发元数据同步： ", -1),
                _createElementVNode("ul", { class: "mt-1 mb-0" }, [
                  _createElementVNode("li", null, "MoviePilot 文件整理完成时（监听整理完成事件，自动同步新增影视的元数据到115）"),
                  _createElementVNode("li", null, "按下方配置的定时任务（cron 或间隔）周期同步"),
                  _createElementVNode("li", null, "手动点击「立即同步」按钮或发送 /sync115 命令")
                ], -1)
              ]))]),
              _: 1
            }))
          : _createCommentVNode("", true),
        _createVNode(_component_VCard, { class: "mb-4" }, {
          default: _withCtx(() => [
            _createVNode(_component_VCardTitle, null, {
              default: _withCtx(() => [...(_cache[14] || (_cache[14] = [
                _createTextVNode("定时设置", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VCardText, null, {
              default: _withCtx(() => [
                _createVNode(_component_VRow, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCol, {
                      cols: "12",
                      md: "6"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
                          modelValue: localConfig.value.cron,
                          "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((localConfig.value.cron) = $event)),
                          label: "Cron 表达式（如 0 6 * * *）",
                          placeholder: "留空则不使用 cron 定时",
                          hint: "标准 5 位 cron 表达式"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VCol, {
                      cols: "12",
                      md: "6"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
                          modelValue: localConfig.value.interval,
                          "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((localConfig.value.interval) = $event)),
                          modelModifiers: { number: true },
                          label: "间隔（分钟）",
                          type: "number",
                          min: "0",
                          hint: "大于 0 时按间隔定时同步"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode(_component_VSwitch, {
                  modelValue: localConfig.value.onlyonce,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((localConfig.value.onlyonce) = $event)),
                  label: "保存后立即运行一次",
                  color: "primary"
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VSwitch, {
                  modelValue: localConfig.value.notify,
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((localConfig.value.notify) = $event)),
                  label: "同步完成后发送通知",
                  color: "primary"
                }, null, 8, ["modelValue"]),
                _createVNode(_component_VTextField, {
                  modelValue: localConfig.value.upload_delay,
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((localConfig.value.upload_delay) = $event)),
                  modelModifiers: { number: true },
                  label: "上传间隔（秒）",
                  type: "number",
                  min: "0",
                  step: "0.1",
                  hint: "每个文件上传后的等待间隔，避免触发115风控。建议 0.5-2 秒"
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode(_component_VCard, { class: "mb-4" }, {
          default: _withCtx(() => [
            _createVNode(_component_VCardTitle, null, {
              default: _withCtx(() => [...(_cache[15] || (_cache[15] = [
                _createTextVNode("风控保护", -1)
              ]))]),
              _: 1
            }),
            _createVNode(_component_VCardText, null, {
              default: _withCtx(() => [
                _createVNode(_component_VRow, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCol, {
                      cols: "12",
                      md: "6"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
                          modelValue: localConfig.value.batch_size,
                          "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((localConfig.value.batch_size) = $event)),
                          modelModifiers: { number: true },
                          label: "每上传多少个文件后暂停",
                          type: "number",
                          min: "0",
                          hint: "每上传 N 个文件后暂停一次，0 表示不启用"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VCol, {
                      cols: "12",
                      md: "6"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
                          modelValue: localConfig.value.batch_pause,
                          "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((localConfig.value.batch_pause) = $event)),
                          modelModifiers: { number: true },
                          label: "批量暂停时长（秒）",
                          type: "number",
                          min: "0",
                          hint: "达到批量数量后暂停的秒数"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode(_component_VRow, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCol, {
                      cols: "12",
                      md: "6"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VSelect, {
                          modelValue: localConfig.value.risk_action,
                          "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((localConfig.value.risk_action) = $event)),
                          label: "接近风控阈值时",
                          items: [
                  { title: '暂停一段时间', value: 'pause' },
                  { title: '停止同步', value: 'stop' },
                ],
                          hint: "检测到接近115风控阈值时的处理方式"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_VCol, {
                      cols: "12",
                      md: "6"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_VTextField, {
                          modelValue: localConfig.value.risk_pause,
                          "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((localConfig.value.risk_pause) = $event)),
                          modelModifiers: { number: true },
                          label: "风控暂停时长（秒）",
                          type: "number",
                          min: "0",
                          hint: "选择「暂停一段时间」时生效"
                        }, null, 8, ["modelValue"])
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
        }),
        _createVNode(_component_VCard, null, {
          default: _withCtx(() => [
            _createVNode(_component_VCardTitle, { class: "d-flex align-center" }, {
              default: _withCtx(() => [
                _cache[17] || (_cache[17] = _createTextVNode(" 目录映射 ", -1)),
                _createVNode(_component_VSpacer),
                _createVNode(_component_VBtn, {
                  size: "small",
                  color: "primary",
                  variant: "tonal",
                  "prepend-icon": "mdi-plus",
                  onClick: addDirMap
                }, {
                  default: _withCtx(() => [...(_cache[16] || (_cache[16] = [
                    _createTextVNode(" 添加 ", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode(_component_VCardText, null, {
              default: _withCtx(() => [
                _createVNode(_component_VAlert, {
                  type: "info",
                  density: "compact",
                  class: "mb-3"
                }, {
                  default: _withCtx(() => [...(_cache[18] || (_cache[18] = [
                    _createTextVNode(" 本地目录（已刮削的硬链接目录）→ 115网盘目录。同步时会把本地目录中的 nfo/海报/mediainfo.json 等元数据文件上传到115对应目录。 ", -1)
                  ]))]),
                  _: 1
                }),
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(localConfig.value.dir_map, (item, index) => {
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
                                    _createVNode(_component_VTextField, {
                                      modelValue: item.local,
                                      "onUpdate:modelValue": $event => ((item.local) = $event),
                                      label: "本地目录",
                                      placeholder: "/media/Moviepilot media/硬链接/动漫/动漫剧集"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                                      default: _withCtx(() => [...(_cache[19] || (_cache[19] = [
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
                                    _createVNode(_component_VTextField, {
                                      modelValue: item.remote,
                                      "onUpdate:modelValue": $event => ((item.remote) = $event),
                                      label: "115目录",
                                      placeholder: "/自用已刮削影音库/动漫剧集"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                                      icon: "mdi-delete",
                                      variant: "text",
                                      color: "error",
                                      onClick: $event => (removeDirMap(index))
                                    }, null, 8, ["onClick"])
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
                }), 128)),
                (!localConfig.value.dir_map.length)
                  ? (_openBlock(), _createBlock(_component_VAlert, {
                      key: 0,
                      type: "info",
                      density: "compact"
                    }, {
                      default: _withCtx(() => [...(_cache[20] || (_cache[20] = [
                        _createTextVNode(" 尚未配置目录映射，点击\"添加\"按钮新增。 ", -1)
                      ]))]),
                      _: 1
                    }))
                  : _createCommentVNode("", true)
              ]),
              _: 1
            })
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
