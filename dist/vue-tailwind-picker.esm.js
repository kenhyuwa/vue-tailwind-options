import axios from 'axios'

//
var script = {
  name: 'vue-tailwind-options',
  directives: {
    focused: {
      bind: function (el) {
        document.addEventListener(
          'keypress',
          function (e) {
            if (e.keyCode === 47) {
              e.preventDefault()
              el.focus()
            }
          },
          false,
        )
      },
      unbind: function () {
        document.removeEventListener('keypress', function () {}, false)
      },
    },
  },
  props: {
    placeholder: {
      type: String,
      required: false,
      default: 'please choose',
    },
    value: {
      type: [String, Array],
      required: true,
    },
    options: {
      type: Array,
      required: false,
      default: function () {
        return []
      },
    },
    filter: {
      type: Boolean,
      required: false,
      default: true,
    },
    serverSide: {
      type: Object,
      required: false,
      default: undefined,
    },
    theme: {
      type: Object,
      required: false,
      default: function () {
        return {
          backgroundColor: 'bg-white',
          borderColor: 'border-gray-400',
          placeholderColor: 'text-gray-600',
          hoverColor: 'hover:bg-gray-200',
          selected: {
            crossColor: 'bg-red-400 text-red-500',
            checkColor: 'bg-teal-400 text-teal-500',
          },
        }
      },
    },
  },
  data: function data() {
    return {
      isOn: false,
      query: '',
      fieldSetData: [],
      loading: false,
    }
  },
  computed: {
    filterData: function filterData() {
      var vm = this
      var q = vm.query.toLowerCase()
      if (vm.fieldSetData.length > 0) {
        if (!vm.serverSide) {
          return vm.fieldSetData.filter(function (option) {
            return option[vm.serverSide.keyObject[1]].toLowerCase().includes(q)
          })
        } else {
          return vm.fieldSetData
        }
      } else {
        return vm.options.filter(function (option) {
          return option.toLowerCase().includes(q)
        })
      }
    },
    multiple: function multiple() {
      var vm = this
      return Array.isArray(vm.value)
    },
  },
  watch: {
    isOn: function isOn(prev) {
      var vm = this
      var q = vm.query.toLowerCase()
      if (prev && vm.serverSide) {
        vm.fetchData(q)
      }
    },
    fieldSetData: function fieldSetData(prev) {
      var vm = this
      if (prev.length > 0) {
        vm.loading = false
      }
    },
    query: function query(prev) {
      var vm = this
      var q = vm.query.toLowerCase()
      if (prev.length > 0 && vm.serverSide) {
        vm.fetchData(q)
      }
    },
  },
  mounted: function mounted() {
    // const vm = this
    // const infinity = vm.$refs.infinity
    // infinity.addEventListener('scroll', (e) => {
    //   if (infinity.scrollTop + infinity.clientHeight >= infinity.scrollHeight) {
    //     // vm.page++
    //     // vm.fetchData()
    //   }
    // })
  },
  methods: {
    onChange: function onChange(option) {
      var vm = this
      var selected
      vm.isOn = !vm.isOn
      if (vm.serverSide) {
        if (vm.multiple) {
          if (
            !vm.value.find(function (o) {
              return (
                vm.getProp(o, vm.serverSide.keyObject[1]) ===
                vm.getProp(option, vm.serverSide.keyObject[1])
              )
            })
          ) {
            vm.value.push(option)
            selected = vm.value
          }
          selected = vm.value
        } else {
          selected = vm.getProp(option, vm.serverSide.keyObject[1])
        }
      } else {
        selected = option
      }
      vm.$emit('change', selected)
    },
    removeSelection: function removeSelection(item) {
      var vm = this
      vm.$emit(
        'change',
        vm.value.filter(function (o) {
          return (
            vm.getProp(o, vm.serverSide.keyObject[1]) !==
            vm.getProp(item, vm.serverSide.keyObject[1])
          )
        }),
      )
    },
    fetchData: function fetchData(q) {
      var vm = this
      vm.loading = !vm.loading
      var uri = q
        ? vm.serverSide.endpoint + '?query=' + q
        : vm.serverSide.endpoint
      axios
        .get(uri)
        .then(function (response) {
          vm.loading = !vm.loading
          vm.fieldSetData = vm
            .getProp(response, vm.serverSide.propertyName)
            .map(function (o) {
              var obj

              return (
                (obj = {}),
                (obj[vm.serverSide.keyObject[0]] = vm.getProp(
                  o,
                  vm.serverSide.keyObject[0],
                )),
                (obj[vm.serverSide.keyObject[1]] = vm.getProp(
                  o,
                  vm.serverSide.keyObject[1],
                )),
                obj
              )
            })
        })
        .catch(function (e) {
          console.warn('Error ' + e)
          vm.fieldSetData = []
        })
    },
    getProp: function getProp(holder, propName) {
      if (!propName || !holder) {
        return holder
      }

      if (propName in holder) {
        return holder[propName]
      }

      var propParts = Array.isArray(propName)
        ? propName
        : (propName + '').split('.')

      var result = holder
      while (propParts.length && result) {
        result = result[propParts.shift()]
      }

      return result
    },
  },
}

function normalizeComponent(
  template,
  style,
  script,
  scopeId,
  isFunctionalTemplate,
  moduleIdentifier /* server only */,
  shadowMode,
  createInjector,
  createInjectorSSR,
  createInjectorShadow,
) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector
    createInjector = shadowMode
    shadowMode = false
  }
  // Vue.extend constructor export interop.
  var options = typeof script === 'function' ? script.options : script
  // render functions
  if (template && template.render) {
    options.render = template.render
    options.staticRenderFns = template.staticRenderFns
    options._compiled = true
    // functional template
    if (isFunctionalTemplate) {
      options.functional = true
    }
  }
  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }
  var hook
  if (moduleIdentifier) {
    // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (style) {
        style.call(this, createInjectorSSR(context))
      }
      // register component module identifier for async chunk inference
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (style) {
    hook = shadowMode
      ? function (context) {
          style.call(
            this,
            createInjectorShadow(context, this.$root.$options.shadowRoot),
          )
        }
      : function (context) {
          style.call(this, createInjector(context))
        }
  }
  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook]
    }
  }
  return script
}

/* script */
var __vue_script__ = script

/* template */
var __vue_render__ = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    'div',
    { staticClass: 'relative box-border text-sm' },
    [
      _c(
        'div',
        {
          staticClass:
            'flex justify-between items-center transition ease-out duration-200 cursor-pointer rounded border px-2 py-1 space-x-2',
          class: [
            _vm.theme.borderColor,
            { 'border-b-0 rounded-bl-none rounded-br-none': _vm.isOn },
          ],
          on: {
            click: function ($event) {
              _vm.isOn = true
            },
          },
        },
        [
          _vm.multiple && _vm.value.length > 0
            ? _c(
                'span',
                { staticClass: 'block items-center' },
                _vm._l(_vm.value, function (item, i) {
                  return _c(
                    'span',
                    {
                      key: i,
                      staticClass:
                        'inline-flex items-center m-px p-1 space-x-1 rounded-full border border-opacity-75',
                      class: _vm.theme.borderColor,
                    },
                    [
                      _c('small', { staticClass: 'px-1 capitalize' }, [
                        _vm._v(
                          '\n          ' +
                            _vm._s(
                              _vm.getProp(item, _vm.serverSide.keyObject[1]),
                            ) +
                            '\n        ',
                        ),
                      ]),
                    ],
                  )
                }),
                0,
              )
            : _vm._e(),
          _vm._v(' '),
          !_vm.multiple
            ? _c(
                'span',
                {
                  staticClass: 'capitalize',
                  class: [!_vm.value ? _vm.theme.placeholderColor : ''],
                },
                [
                  _vm._v(
                    '\n      ' +
                      _vm._s(_vm.value || _vm.placeholder) +
                      '\n    ',
                  ),
                ],
              )
            : _vm._e(),
          _vm._v(' '),
          _vm.multiple && _vm.value.length < 1
            ? _c(
                'span',
                {
                  staticClass: 'capitalize',
                  class: _vm.theme.placeholderColor,
                },
                [_vm._v('\n      ' + _vm._s(_vm.placeholder) + '\n    ')],
              )
            : _vm._e(),
          _vm._v(' '),
          !_vm.multiple && _vm.value.length > 0
            ? _c(
                'span',
                {
                  staticClass:
                    'inline-flex items-center rounded p-1 hover:bg-gray-200',
                  on: {
                    click: function ($event) {
                      return _vm.$emit('change', '')
                    },
                  },
                },
                [
                  _c(
                    'svg',
                    {
                      staticClass: 'w-5 h-5',
                      class: _vm.theme.placeholderColor,
                      attrs: { fill: 'currentColor', viewBox: '0 0 20 20' },
                    },
                    [
                      _c('path', {
                        attrs: {
                          'fill-rule': 'evenodd',
                          d:
                            'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z',
                          'clip-rule': 'evenodd',
                        },
                      }),
                    ],
                  ),
                ],
              )
            : _c('span', { staticClass: 'inline p-1' }, [
                _c(
                  'svg',
                  {
                    staticClass: 'w-5 h-5',
                    class: _vm.theme.placeholderColor,
                    attrs: { fill: 'currentColor', viewBox: '0 0 20 20' },
                  },
                  [
                    _c('path', {
                      attrs: {
                        'fill-rule': 'evenodd',
                        d:
                          'M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z',
                        'clip-rule': 'evenodd',
                      },
                    }),
                  ],
                ),
              ]),
        ],
      ),
      _vm._v(' '),
      _c(
        'transition',
        {
          attrs: {
            'enter-active-class': 'transition ease-out duration-200 transform',
            'enter-class': 'opacity-0 -translate-y-3',
            'enter-to-class': 'opacity-100 translate-y-0',
            'leave-active-class': 'transition ease-in duration-100 transform',
            'leave-class': 'opacity-100 translate-y-0',
            'leave-to-class': 'opacity-0 -translate-y-3',
          },
        },
        [
          _c(
            'div',
            {
              directives: [
                {
                  name: 'show',
                  rawName: 'v-show',
                  value: _vm.isOn,
                  expression: 'isOn',
                },
              ],
              staticClass:
                'fixed inset-0 lg:absolute lg:inset-x-0 lg:top-auto lg:bottom-auto pt-2 space-y-2 transition ease-out duration-200 bg-white rounded-none lg:rounded-bl lg:rounded-br overflow-hidden border-0 lg:border-l lg:border-b lg:border-r',
              class: [_vm.theme.backgroundColor, _vm.theme.borderColor],
            },
            [
              _vm.filter
                ? _c('div', { staticClass: 'px-2 flex space-x-2' }, [
                    _c(
                      'div',
                      {
                        staticClass:
                          'flex-1 md:flex items-center border border-opacity-75 rounded overflow-hidden px-2',
                        class: _vm.theme.borderColor,
                      },
                      [
                        _c('input', {
                          directives: [
                            {
                              name: 'model',
                              rawName: 'v-model.trim',
                              value: _vm.query,
                              expression: 'query',
                              modifiers: { trim: true },
                            },
                            { name: 'focused', rawName: 'v-focused' },
                          ],
                          ref: 'vueTailwindSelectInput',
                          staticClass:
                            'w-full bg-transparent p-2 lg:p-1 focus:outline-none',
                          attrs: {
                            type: 'text',
                            placeholder:
                              'Search or filter (Press "/" to focus)',
                          },
                          domProps: { value: _vm.query },
                          on: {
                            input: function ($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.query = $event.target.value.trim()
                            },
                            blur: function ($event) {
                              return _vm.$forceUpdate()
                            },
                          },
                        }),
                        _vm._v(' '),
                        _c(
                          'span',
                          {
                            directives: [
                              {
                                name: 'show',
                                rawName: 'v-show',
                                value: _vm.query.length > 0,
                                expression: 'query.length > 0',
                              },
                            ],
                            staticClass:
                              'rounded-full p-px bg-opacity-25 cursor-pointer',
                            class: _vm.theme.selected.crossColor,
                            on: {
                              click: function ($event) {
                                _vm.query = ''
                              },
                            },
                          },
                          [
                            _c(
                              'svg',
                              {
                                staticClass: 'w-5 h-5',
                                attrs: {
                                  fill: 'currentColor',
                                  viewBox: '0 0 20 20',
                                },
                              },
                              [
                                _c('path', {
                                  attrs: {
                                    'fill-rule': 'evenodd',
                                    d:
                                      'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z',
                                    'clip-rule': 'evenodd',
                                  },
                                }),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                    _vm._v(' '),
                    _c(
                      'div',
                      { staticClass: 'lg:hidden inline-flex items-center' },
                      [
                        _c(
                          'span',
                          {
                            staticClass: 'rounded p-1',
                            class: _vm.theme.hoverColor,
                            on: {
                              click: function ($event) {
                                _vm.isOn = !_vm.isOn
                              },
                            },
                          },
                          [
                            _c(
                              'svg',
                              {
                                staticClass: 'w-6 h-6',
                                attrs: {
                                  fill: 'currentColor',
                                  viewBox: '0 0 20 20',
                                },
                              },
                              [
                                _c('path', {
                                  attrs: {
                                    'fill-rule': 'evenodd',
                                    d:
                                      'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z',
                                    'clip-rule': 'evenodd',
                                  },
                                }),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ])
                : _vm._e(),
              _vm._v(' '),
              _c(
                'div',
                {
                  ref: 'infinity',
                  staticClass:
                    'relative overflow-y-auto scrolling-touch h-full lg:max-h-48',
                },
                [
                  _vm.serverSide && _vm.multiple
                    ? _c(
                        'transition-group',
                        {
                          attrs: {
                            tag: 'ul',
                            'enter-active-class':
                              'transition ease-out duration-200 transform',
                            'enter-class': 'opacity-0 translate-y-1/2',
                            'enter-to-class': 'opacity-100 translate-y-full',
                            'leave-active-class':
                              'transition ease-in duration-200 transform',
                            'leave-class': 'opacity-100 translate-y-full',
                            'leave-to-class': 'opacity-0 translate-y-1/2',
                          },
                        },
                        _vm._l(_vm.filterData, function (option, index) {
                          return _c(
                            'li',
                            {
                              key: index + '-group',
                              staticClass:
                                'flex justify-between items-center cursor-pointer',
                              class: _vm.theme.hoverColor,
                            },
                            [
                              _c(
                                'span',
                                {
                                  staticClass: 'capitalize flex-1 px-2 py-1',
                                  attrs: {
                                    'data-vue-tailwind-select': _vm.getProp(
                                      option,
                                      _vm.serverSide.keyObject[0],
                                    ),
                                  },
                                  on: {
                                    click: function ($event) {
                                      $event.preventDefault()
                                      return _vm.onChange(option)
                                    },
                                  },
                                },
                                [
                                  _vm._v(
                                    '\n              ' +
                                      _vm._s(
                                        _vm.getProp(
                                          option,
                                          _vm.serverSide.keyObject[1],
                                        ),
                                      ) +
                                      '\n            ',
                                  ),
                                ],
                              ),
                              _vm._v(' '),
                              _vm.value.find(function (o) {
                                return (
                                  o.name ===
                                  _vm.getProp(
                                    option,
                                    _vm.serverSide.keyObject[1],
                                  )
                                )
                              })
                                ? _c(
                                    'span',
                                    {
                                      staticClass:
                                        'inline-flex items-center mx-2 rounded-full bg-opacity-50 p-px',
                                      class: _vm.theme.selected.crossColor,
                                      on: {
                                        click: function ($event) {
                                          return _vm.removeSelection(option)
                                        },
                                      },
                                    },
                                    [
                                      _c(
                                        'svg',
                                        {
                                          staticClass: 'w-5 h-5',
                                          attrs: {
                                            fill: 'currentColor',
                                            viewBox: '0 0 20 20',
                                          },
                                        },
                                        [
                                          _c('path', {
                                            attrs: {
                                              'fill-rule': 'evenodd',
                                              d:
                                                'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z',
                                              'clip-rule': 'evenodd',
                                            },
                                          }),
                                        ],
                                      ),
                                    ],
                                  )
                                : _vm._e(),
                            ],
                          )
                        }),
                        0,
                      )
                    : _c(
                        'transition-group',
                        {
                          attrs: {
                            tag: 'ul',
                            'enter-active-class':
                              'transition ease-out duration-200 transform',
                            'enter-class': 'opacity-0 translate-y-1/2',
                            'enter-to-class': 'opacity-100 translate-y-full',
                            'leave-active-class':
                              'transition ease-in duration-200 transform',
                            'leave-class': 'opacity-100 translate-y-full',
                            'leave-to-class': 'opacity-0 translate-y-1/2',
                          },
                        },
                        _vm._l(_vm.filterData, function (option, index) {
                          return _c(
                            'li',
                            {
                              key: index + '-group',
                              staticClass:
                                'flex justify-between items-center space-x-2 px-2 py-1 cursor-pointer',
                              class: _vm.theme.hoverColor,
                              attrs: {
                                'data-vue-tailwind-select': _vm.serverSide
                                  ? _vm.getProp(
                                      option,
                                      _vm.serverSide.keyObject[0],
                                    )
                                  : option,
                              },
                              on: {
                                click: function ($event) {
                                  $event.preventDefault()
                                  return _vm.onChange(option)
                                },
                              },
                            },
                            [
                              _c('span', { staticClass: 'capitalize' }, [
                                _vm._v(
                                  '\n              ' +
                                    _vm._s(
                                      _vm.serverSide
                                        ? _vm.getProp(
                                            option,
                                            _vm.serverSide.keyObject[1],
                                          )
                                        : option,
                                    ) +
                                    '\n            ',
                                ),
                              ]),
                              _vm._v(' '),
                              (_vm.serverSide
                                ? _vm.getProp(
                                    option,
                                    _vm.serverSide.keyObject[1],
                                  )
                                : option) === _vm.value
                                ? _c(
                                    'span',
                                    {
                                      staticClass:
                                        'inline-flex items-center rounded-full bg-opacity-50 p-px',
                                      class: _vm.theme.selected.checkColor,
                                    },
                                    [
                                      _c(
                                        'svg',
                                        {
                                          staticClass: 'w-5 h-5',
                                          attrs: {
                                            fill: 'currentColor',
                                            viewBox: '0 0 20 20',
                                          },
                                        },
                                        [
                                          _c('path', {
                                            attrs: {
                                              'fill-rule': 'evenodd',
                                              d:
                                                'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z',
                                              'clip-rule': 'evenodd',
                                            },
                                          }),
                                        ],
                                      ),
                                    ],
                                  )
                                : _vm._e(),
                            ],
                          )
                        }),
                        0,
                      ),
                  _vm._v(' '),
                  _c(
                    'div',
                    {
                      directives: [
                        {
                          name: 'show',
                          rawName: 'v-show',
                          value: _vm.loading,
                          expression: 'loading',
                        },
                      ],
                      staticClass:
                        'absolute inset-0 bg-opacity-75 flex justify-center items-center',
                      class: _vm.theme.backgroundColor,
                    },
                    [_c('span', [_vm._v('Loading...')])],
                  ),
                ],
                1,
              ),
            ],
          ),
        ],
      ),
    ],
    1,
  )
}
var __vue_staticRenderFns__ = []
__vue_render__._withStripped = true

/* style */
var __vue_inject_styles__ = undefined
/* scoped */
var __vue_scope_id__ = undefined
/* module identifier */
var __vue_module_identifier__ = undefined
/* functional template */
var __vue_is_functional_template__ = false
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = normalizeComponent(
  { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
  __vue_inject_styles__,
  __vue_script__,
  __vue_scope_id__,
  __vue_is_functional_template__,
  __vue_module_identifier__,
  false,
  undefined,
  undefined,
  undefined,
)

// Import vue component

// Declare install function executed by Vue.use()
function install(Vue) {
  if (install.installed) {
    return
  }
  install.installed = true
  Vue.component('VueTailwindOptions', __vue_component__)
}

// Create module definition for Vue.use()
var plugin = {
  install: install,
}

// Auto-install when vue is found (eg. in browser via <script> tag)
var GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}

export default __vue_component__
export { install }
