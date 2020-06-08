<template>
  <div class="relative box-border text-sm">
    <div
      class="flex justify-between items-center transition ease-out duration-200 cursor-pointer rounded border px-2 py-1 space-x-2"
      :class="[
        theme.borderColor,
        { 'border-b-0 rounded-bl-none rounded-br-none': isOn },
      ]"
      @click="isOn = true"
    >
      <span v-if="multiple && value.length > 0" class="block items-center">
        <span
          class="inline-flex items-center m-px p-1 space-x-1 rounded-full border border-opacity-75"
          :class="theme.borderColor"
          v-for="(item, i) in value"
          :key="i"
        >
          <small class="px-1 capitalize">
            {{ getProp(item, serverSide.keyObject[1]) }}
          </small>
        </span>
      </span>
      <span
        v-if="!multiple"
        class="capitalize"
        :class="[!value ? theme.placeholderColor : '']"
      >
        {{ value || placeholder }}
      </span>
      <span
        v-if="multiple && value.length < 1"
        class="capitalize"
        :class="theme.placeholderColor"
      >
        {{ placeholder }}
      </span>
      <span
        v-if="!multiple && value.length > 0"
        class="inline-flex items-center rounded p-1 hover:bg-gray-200"
        @click="$emit('change', '')"
      >
        <svg
          class="w-5 h-5"
          :class="theme.placeholderColor"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </span>
      <span v-else class="inline p-1">
        <svg
          class="w-5 h-5"
          :class="theme.placeholderColor"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </span>
    </div>
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-class="opacity-0 -translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-100 transform"
      leave-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-3"
    >
      <div
        v-show="isOn"
        class="fixed inset-0 lg:absolute lg:inset-x-0 lg:top-auto lg:bottom-auto pt-2 space-y-2 transition ease-out duration-200 bg-white rounded-none lg:rounded-bl lg:rounded-br overflow-hidden border-0 lg:border-l lg:border-b lg:border-r"
        :class="[theme.backgroundColor, theme.borderColor]"
      >
        <div v-if="filter" class="px-2 flex space-x-2">
          <div
            class="flex-1 md:flex items-center border border-opacity-75 rounded overflow-hidden px-2"
            :class="theme.borderColor"
          >
            <input
              ref="vueTailwindSelectInput"
              type="text"
              v-model.trim="query"
              class="w-full bg-transparent p-2 lg:p-1 focus:outline-none"
              placeholder='Search or filter (Press "/" to focus)'
              v-focused
            />
            <span
              v-show="query.length > 0"
              class="rounded-full p-px bg-opacity-25 cursor-pointer"
              :class="theme.selected.crossColor"
              @click="query = ''"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
          </div>
          <div class="lg:hidden inline-flex items-center">
            <span
              class="rounded p-1"
              :class="theme.hoverColor"
              @click="isOn = !isOn"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
          </div>
        </div>
        <div
          ref="infinity"
          class="relative overflow-y-auto scrolling-touch h-full lg:max-h-48"
        >
          <transition-group
            v-if="serverSide && multiple"
            tag="ul"
            enter-active-class="transition ease-out duration-200 transform"
            enter-class="opacity-0 translate-y-1/2"
            enter-to-class="opacity-100 translate-y-full"
            leave-active-class="transition ease-in duration-200 transform"
            leave-class="opacity-100 translate-y-full"
            leave-to-class="opacity-0 translate-y-1/2"
          >
            <li
              v-for="(option, index) in filterData"
              :key="`${index}-group`"
              class="flex justify-between items-center cursor-pointer"
              :class="theme.hoverColor"
            >
              <span
                class="capitalize flex-1 px-2 py-1"
                :data-vue-tailwind-select="
                  getProp(option, serverSide.keyObject[0])
                "
                @click.prevent="onChange(option)"
              >
                {{ getProp(option, serverSide.keyObject[1]) }}
              </span>
              <span
                v-if="
                  value.find(
                    (o) => o.name === getProp(option, serverSide.keyObject[1]),
                  )
                "
                class="inline-flex items-center mx-2 rounded-full bg-opacity-50 p-px"
                :class="theme.selected.crossColor"
                @click="removeSelection(option)"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </li>
          </transition-group>
          <transition-group
            v-else
            tag="ul"
            enter-active-class="transition ease-out duration-200 transform"
            enter-class="opacity-0 translate-y-1/2"
            enter-to-class="opacity-100 translate-y-full"
            leave-active-class="transition ease-in duration-200 transform"
            leave-class="opacity-100 translate-y-full"
            leave-to-class="opacity-0 translate-y-1/2"
          >
            <li
              v-for="(option, index) in filterData"
              :key="`${index}-group`"
              :data-vue-tailwind-select="
                serverSide ? getProp(option, serverSide.keyObject[0]) : option
              "
              @click.prevent="onChange(option)"
              class="flex justify-between items-center space-x-2 px-2 py-1 cursor-pointer"
              :class="theme.hoverColor"
            >
              <span class="capitalize">
                {{
                  serverSide ? getProp(option, serverSide.keyObject[1]) : option
                }}
              </span>
              <span
                v-if="
                  (serverSide
                    ? getProp(option, serverSide.keyObject[1])
                    : option) === value
                "
                class="inline-flex items-center rounded-full bg-opacity-50 p-px"
                :class="theme.selected.checkColor"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </li>
          </transition-group>
          <div
            v-show="loading"
            class="absolute inset-0 bg-opacity-75 flex justify-center items-center"
            :class="theme.backgroundColor"
          >
            <span>Loading...</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'vue-tailwind-options',
  directives: {
    focused: {
      bind: (el) => {
        document.addEventListener(
          'keypress',
          (e) => {
            if (e.keyCode === 47) {
              e.preventDefault()
              el.focus()
            }
          },
          false,
        )
      },
      unbind: () => {
        document.removeEventListener('keypress', () => {}, false)
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
      default: () => [],
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
      default: () => ({
        backgroundColor: 'bg-white',
        borderColor: 'border-gray-400',
        placeholderColor: 'text-gray-600',
        hoverColor: 'hover:bg-gray-200',
        selected: {
          crossColor: 'bg-red-400 text-red-500',
          checkColor: 'bg-teal-400 text-teal-500',
        },
      }),
    },
  },
  data() {
    return {
      isOn: false,
      query: '',
      fieldSetData: [],
      loading: false,
    }
  },
  computed: {
    filterData() {
      const vm = this
      const q = vm.query.toLowerCase()
      if (vm.fieldSetData.length > 0) {
        if (!vm.serverSide) {
          return vm.fieldSetData.filter((option) => {
            return option[vm.serverSide.keyObject[1]].toLowerCase().includes(q)
          })
        } else {
          return vm.fieldSetData
        }
      } else {
        return vm.options.filter((option) => {
          return option.toLowerCase().includes(q)
        })
      }
    },
    multiple() {
      const vm = this
      return Array.isArray(vm.value)
    },
  },
  watch: {
    isOn(prev) {
      const vm = this
      const q = vm.query.toLowerCase()
      if (prev && vm.serverSide) {
        vm.fetchData(q)
      }
    },
    fieldSetData(prev) {
      const vm = this
      if (prev.length > 0) {
        vm.loading = false
      }
    },
    query(prev) {
      const vm = this
      const q = vm.query.toLowerCase()
      if (prev.length > 0 && vm.serverSide) {
        vm.fetchData(q)
      }
    },
  },
  mounted() {
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
    onChange(option) {
      const vm = this
      let selected
      vm.isOn = !vm.isOn
      if (vm.serverSide) {
        if (vm.multiple) {
          if (
            !vm.value.find(
              (o) =>
                vm.getProp(o, vm.serverSide.keyObject[1]) ===
                vm.getProp(option, vm.serverSide.keyObject[1]),
            )
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
    removeSelection(item) {
      const vm = this
      vm.$emit(
        'change',
        vm.value.filter(
          (o) =>
            vm.getProp(o, vm.serverSide.keyObject[1]) !==
            vm.getProp(item, vm.serverSide.keyObject[1]),
        ),
      )
    },
    fetchData(q) {
      const vm = this
      vm.loading = !vm.loading
      const uri = q
        ? `${vm.serverSide.endpoint}?query=${q}`
        : vm.serverSide.endpoint
      axios
        .get(uri)
        .then((response) => {
          vm.loading = !vm.loading
          vm.fieldSetData = vm
            .getProp(response, vm.serverSide.propertyName)
            .map((o) => ({
              [vm.serverSide.keyObject[0]]: vm.getProp(
                o,
                vm.serverSide.keyObject[0],
              ),
              [vm.serverSide.keyObject[1]]: vm.getProp(
                o,
                vm.serverSide.keyObject[1],
              ),
            }))
        })
        .catch((e) => {
          console.warn(`Error ${e}`)
          vm.fieldSetData = []
        })
    },
    getProp(holder, propName) {
      if (!propName || !holder) {
        return holder
      }

      if (propName in holder) {
        return holder[propName]
      }

      const propParts = Array.isArray(propName)
        ? propName
        : (propName + '').split('.')

      let result = holder
      while (propParts.length && result) {
        result = result[propParts.shift()]
      }

      return result
    },
  },
}
</script>
