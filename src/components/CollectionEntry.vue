<script setup lang="ts">
import type { CollectionInfo, PresentType } from '../data'
import { isFavoritedCollection, removeRecentCollection, toggleFavoriteCollection } from '../store'

const props = defineProps<{
  collection: CollectionInfo
  type?: PresentType
}>()

function onAction() {
  if (props.type === 'recent')
    removeRecentCollection(props.collection.id)
  else
    toggleFavoriteCollection(props.collection.id)
}
</script>

<template>
  <RouterLink
    :key="collection.id"
    p3 relative
    border="~ base"
    class="grid grid-cols-[1fr_90px] gap2 items-center color-base transition-all translate-z-0"
    hover="text-primary !border-primary shadow"
    :to="`/collection/${collection.id}`"
  >
    <div ml2>
      <div class="flex-auto text-lg leading-1em my1">
        {{ collection.name }}
        <span v-if="isFavoritedCollection(collection.id)" m="l--0.5" op80 text-xs inline-block align-top i-carbon-star-filled />
      </div>
      <div flex="~ col auto" opacity-50 text-xs>
        <span>{{ collection.author?.name }}</span>
        <span op50>{{ collection.license?.title }}</span>
        <span m1 />
        <span>{{ collection.total }} icons</span>
      </div>
    </div>
    <Icons
      :icons="collection.sampleIcons"
      :namespace="`${collection.id}:`"
      color-class=""
      size="xl"
      spacing="m-1"
      class="ma justify-center opacity-75 flex-wrap pointer-events-none"
    />
    <button
      class="group"
      absolute top--1px right--1px p2 border="~ transparent" hover="bg-base border-primary"
      :title="type === 'recent' ? 'Remove from recent' : type === 'favorite' || isFavoritedCollection(collection.id) ? 'Remove from favorites' : 'Add to favorites'"
      @click.prevent="onAction"
    >
      <div
        v-if="type === 'recent'"
        i-carbon-delete op0 group-hover="op100"
      />
      <div
        v-else-if="type === 'favorite' || isFavoritedCollection(collection.id)"
        i-carbon-star-filled op0 group-hover="op100"
      />
      <div
        v-else
        i-carbon-star op0 group-hover="op100"
      />
    </button>
  </RouterLink>
</template>
