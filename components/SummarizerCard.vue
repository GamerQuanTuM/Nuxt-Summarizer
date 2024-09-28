<script lang="ts" setup>
import { format } from 'date-fns'

const props = defineProps<{
  summary: Summary
}>()

const showDetails = ref(false)

const emit = defineEmits<{
  (e: 'showDetailsSummary', summary: Summary): void
  (e: 'showDetails', showDetails: boolean): void
}>()

const handleShowDetails = () => {
  showDetails.value = !showDetails.value
  emit('showDetailsSummary', props.summary)
  emit('showDetails', showDetails.value)
}

const fileName = computed(() => {
  if (props.summary.fileName.length > 25) {
    return `${props.summary?.fileName.slice(0, 25)}...`
  } else {
    return props.summary.fileName
  }
})


const formattedDate = format(new Date(props.summary.$createdAt), 'MMM d, yyyy')
</script>

<template>
  <div class="card-container h-fit bg-white rounded-[15px] shadow-lg overflow-hidden">
    <div class="relative h-48">
      <img :src="props.summary.previewImageUrl" :alt="props.summary.fileName"
        class="w-full h-full object-top object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div class="absolute bottom-0 left-0 p-4">
        <span class="text-white text-xs font-medium bg-primary-pink px-2 py-1 rounded-full">
          {{ props.summary.$id }}
        </span>
      </div>
    </div>
    <div class="content-container p-4 flex flex-col">
      <div class="flex-grow mb-2 line-clamp-4">
        <h2 class="text-lg font-bold text-gray-800">{{ fileName }}</h2>
      </div>
      <p class="text-xs text-gray-500 mb-3">{{ formattedDate }}</p>
      <button @click="handleShowDetails"
        class="w-full bg-primary-pink hover:bg-primary-pink/90 text-white text-sm font-medium py-2 px-4 rounded-full flex items-center justify-center">
        View More
        <IconRightArrow class="ml-1 w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  max-width: 400px;
  cursor: pointer;
}

.content-container {
  height: calc(100% - 12rem);
}
</style>