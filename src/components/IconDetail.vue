<script setup lang='ts'>
import { getIconSnippet, toComponentName } from '../utils/icons'
import { collections } from '../data'
import { activeMode, copyPreviewColor, getTransformedId, inBag, preferredCase, previewColor, pushRecentIcon, showCaseSelect, showHelp, toggleBag } from '../store'
import { Download } from '../utils/pack'
import { idCases } from '../utils/case'

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  showCollection: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close', 'copy', 'next', 'prev'])

const caseSelector = ref<HTMLDivElement>()
const transformedId = computed(() => getTransformedId(props.icon))
const color = computed(() => copyPreviewColor.value ? previewColor.value : 'currentColor')

onClickOutside(caseSelector, () => {
  showCaseSelect.value = false
})

onKeyStroke('ArrowLeft', (e) => {
  if (!props.icon)
    return
  emit('prev')
  e.preventDefault()
})

onKeyStroke('ArrowRight', (e) => {
  if (!props.icon)
    return
  emit('next')
  e.preventDefault()
})

async function copyText(text?: string) {
  if (text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    }
    catch (err) {
    }
  }
  return false
}

const copy = async (type: string) => {
  pushRecentIcon(props.icon)
  const text = await getIconSnippet(props.icon, type, true, color.value)
  if (!text)
    return

  emit('copy', await copyText(text))
}

const download = async (type: string) => {
  pushRecentIcon(props.icon)
  const text = await getIconSnippet(props.icon, type, false, color.value)
  if (!text)
    return

  const name = `${toComponentName(props.icon)}.${type}`
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })

  Download(blob, name)
}

const toggleSelectingMode = () => {
  switch (activeMode.value) {
    case 'select':
      activeMode.value = 'normal'
      break
    default:
      activeMode.value = 'select'
      emit('close')
      break
  }
}

const collection = computed(() => {
  const id = props.icon.split(':')[0]
  return collections.find(i => i.id === id)
})
</script>

<template>
  <div class="p-2 flex flex-col flex-wrap md:flex-row md:text-left relative">
    <IconButton class="absolute top-0 right-0 p-3 text-2xl flex-none leading-none" icon="carbon:close" @click="$emit('close')" />
    <div :style="{ color: previewColor }">
      <ColorPicker v-model:value="previewColor" class="inline-block">
        <Icon :key="icon" outer-class="p-4 text-8xl" :icon="icon" />
      </ColorPicker>
    </div>
    <div class="px-6 py-2 mb-2 md:px-2 md:py-4">
      <button
        class="text-gray-500 hover:text-primary text-sm dark:text-dark-500 !outline-none"
        @click="showHelp = !showHelp"
      >
        How to use the icon?
      </button>
      <div class="flex text-gray-700 relative font-mono dark:text-dark-900">
        {{ transformedId }}
        <IconButton icon="carbon:copy" class="ml-2" @click="copy('id')" />
        <IconButton icon="carbon:chevron-up" class="ml-2" @click="showCaseSelect = !showCaseSelect" />
        <div class="flex-auto" />
        <div
          v-if="showCaseSelect"
          ref="caseSelector"
          class="absolute left-0 bottom-1.8em text-sm rounded shadow p-2 bg-white dark:bg-dark-100 dark:border dark:border-dark-200"
        >
          <div
            v-for="[k, v] of Object.entries(idCases)"
            :key="k"
            class="flex items-center p-1 cursor-pointer"
            :class="k === preferredCase ? 'text-primary' : ''"
            @click="preferredCase = k as any"
          >
            <Icon
              icon="carbon:checkmark"
              class="text-primary text-lg"
              outer-class="mr-1"
              :class="k === preferredCase ? '' : 'opacity-0'"
            />
            <span class="flex-auto mr-2">{{ v(icon) }}</span>
          </div>
        </div>
      </div>

      <p v-if="showCollection && collection" class="flex mb-1 text-gray-500 text-sm">
        Collection:
        <RouterLink
          class="ml-1 text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
          :to="`/collection/${collection.id}`"
          @click="$emit('close')"
        >
          {{ collection.name }}
        </RouterLink>
      </p>

      <div>
        <button
          class="
            inline-block leading-1em border border-base my-2 mr-2 font-sans pl-2 pr-3 py-1 rounded-full text-sm cursor-pointer
            hover:bg-gray-50 dark:hover:bg-dark-200
          "
          :class="inBag(icon) ? 'text-primary' : 'text-gray-500'"
          @click="toggleBag(icon)"
        >
          <template v-if="inBag(icon)">
            <Icon class="inline-block text-lg align-middle" icon="carbon:shopping-bag" />
            <span class="inline-block align-middle ml1">in bag</span>
          </template>
          <template v-else>
            <Icon class="inline-block text-lg align-middle" icon="carbon:add" />
            <span class="inline-block align-middle ml1">add to bag</span>
          </template>
        </button>

        <button
          v-if="inBag(icon)"
          class="
            inline-block leading-1em border border-base my-2 mr-2 font-sans pl-2 pr-3 py-1 rounded-full text-sm cursor-pointer
            hover:bg-gray-50 dark:hover:bg-dark-200
          "
          :class="activeMode === 'select' ? 'text-primary' : 'text-gray-500'"
          @click="toggleSelectingMode"
        >
          <Icon class="inline-block text-lg align-middle" icon="carbon:list-checked" />
          <span class="inline-block align-middle ml1">multiple select</span>
        </button>

        <button
          class="
            inline-block leading-1em border border-base my-2 mr-2 font-sans pl-2 pr-3 py-1 rounded-full text-sm cursor-pointer
            hover:bg-gray-50 dark:hover:bg-dark-200
          "
          :class="copyPreviewColor ? 'text-primary' : 'text-gray-500'"
          @click="copyPreviewColor = !copyPreviewColor"
        >
          <Icon v-if="!copyPreviewColor" class="inline-block text-lg align-middle" icon="carbon:checkbox" />
          <Icon v-else class="inline-block text-lg align-middle" icon="carbon:checkbox-checked" />
          <span class="inline-block align-middle ml1">copy with color</span>
        </button>
      </div>

      <div class="flex flex-wrap mt-2">
        <div class="mr-4">
          <div class="my-1 text-gray-500 text-sm">
            Snippets
          </div>
          <button class="btn small mr-1 mb-1 opacity-75" @click="copy('svg')">
            SVG
          </button>
          <button class="btn small mr-1 mb-1 opacity-75" @click="copy('svg-symbol')">
            SVG Symbol
          </button>
          <button class="btn small mr-1 mb-1 opacity-75" @click="copy('html')">
            Iconify
          </button>
          <button class="btn small mr-1 mb-1 opacity-75" @click="copy('pure-jsx')">
            JSX
          </button>
        </div>
        <div class="mr-4">
          <div class="my-1 text-gray-500 text-sm">
            Components
          </div>
          <button class="btn small mr-1 mb-1 opacity-75" @click="copy('vue')">
            Vue
          </button>
          <button class="btn small mr-1 mb-1 opacity-75" @click="copy('vue-ts')">
            Vue<sup class="opacity-50 -mr-1">TS</sup>
          </button>
          <button class="btn small mr-1 mb-1 opacity-75" @click="copy('jsx')">
            React
          </button>
          <button class="btn small mr-1 mb-1 opacity-75" @click="copy('tsx')">
            React<sup class="opacity-50 -mr-1">TS</sup>
          </button>
          <button class="btn small mr-1 mb-1 opacity-75" @click="copy('svelte')">
            Svelte
          </button>
          <button class="btn small mr-1 mb-1 opacity-75" @click="copy('unplugin')">
            Unplugin Icons
          </button>
        </div>
        <div class="mr-4">
          <div class="my-1 text-gray-500 text-sm">
            Links
          </div>
          <button class="btn small mr-1 mb-1 opacity-75" @click="copy('url')">
            URL
          </button>
          <button class="btn small mr-1 mb-1 opacity-75" @click="copy('data_url')">
            Data URL
          </button>
        </div>
        <div class="mr-4">
          <div class="my-1 text-gray-500 text-sm">
            Download
          </div>
          <button class="btn small mr-1 mb-1 opacity-75" @click="download('svg')">
            SVG
          </button>
          <button class="btn small mr-1 mb-1 opacity-75" @click="download('vue')">
            Vue
          </button>
          <button class="btn small mr-1 mb-1 opacity-75" @click="download('jsx')">
            React
          </button>
          <button class="btn small mr-1 mb-1 opacity-75" @click="download('tsx')">
            React<sup class="opacity-50 -mr-1">TS</sup>
          </button>
          <button class="btn small mr-1 mb-1 opacity-75" @click="download('svelte')">
            Svelte
          </button>
        </div>
        <div class="mr-4">
          <div class="my-1 text-gray-500 text-sm">
            View on
          </div>
          <a
            v-if="collection"
            class="btn small mr-1 mb-1 opacity-75"
            :href="`https://icon-sets.iconify.design/${collection.id}/?query=${icon.split(':')[1]}`"
            target="_blank"
          >
            Iconify
          </a>
          <a
            v-if="collection"
            class="btn small mr-1 mb-1 opacity-75"
            :href="`https://uno.antfu.me/?s=i-${icon.replace(':', '-')}`"
            target="_blank"
          >
            UnoCSS
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
