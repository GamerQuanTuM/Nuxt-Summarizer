<script lang="ts" setup>


type SummaryData = {
  summary: string;
  message: string;
  fileId: string;
}

type SummaryStatus = "error" | "idle" | "pending" | "success";

const props = defineProps<{
  summary?: Summary | null,
}>();

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'refetch'): void,
}>();

const pdfFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const { $userDetails, $setUserDetails } = useNuxtApp()

const summaryData = ref<SummaryData | null>(null);
const summaryStatus = ref<SummaryStatus>("idle");

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    pdfFile.value = target.files[0];
  }
}

const handleSubmit = async () => {
  if (!pdfFile.value) {
    console.log('No file selected');
    return;
  }

  summaryStatus.value = "pending";

  const formData = new FormData();
  formData.append('pdf', pdfFile.value);

  const { data, error } = await useFetch('/api/summary', {
    method: "POST",
    body: formData
  });

  if (error.value) {
    console.error('Error:', error.value);
    summaryStatus.value = "error";
    return;
  }

  summaryData.value = data.value as SummaryData;

  if (data.value && 'credit' in data.value) {
    const credit = data.value.credit as number;
    if ($userDetails.value) {
      $setUserDetails({ credit });
    }
  }
  summaryStatus.value = "success";
  emit('refetch');
}

const removePdf = () => {
  pdfFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
    summaryData.value = null;
  }
}

const handleClose = () => {
  emit('close');
}
</script>

<template>
  <button @click="handleClose"
    class="w-fit h-fit px-4 py-2 rounded-[10px] bg-primary-pink mb-8 text-white flex items-center gap-3 font-medium"
    v-show="props?.summary">
    <IconLeftArrow class="h-5 w-5 text-white" />
    Go Back
  </button>
  <div class="w-full h-full flex gap-3">
    <section class="w-1/3 rounded-[10px] bg-white border-[1px] space-y-3 px-3 py-5">
      <h1 class="text-2xl text-primary-pink font-medium">{{ props?.summary ? "Summarized PDF" : "Summarize PDF" }}</h1>
      <p class="text-sm text-slate-500 font-normal">AI model to summarize a pdf in any language</p>
      <p class="text-black font-semibold text-sm py-3">{{ props?.summary ? "Your Uploaded PDF" : "Please Upload Your PDF Here"}}</p>
      <div v-if="!props?.summary"
        class="border-[1px] border-dashed h-80 rounded-[10px] flex flex-col items-center justify-center relative overflow-hidden">
        <input type="file" accept=".pdf" class="hidden" @change="handleFileUpload" ref="fileInput" />
        <div v-if="!pdfFile">
          <button @click="fileInput?.click()" class="text-primary-pink z-10">
            Click to Upload
          </button>
        </div>
        <template v-else>
          <IconFile class="h-20 w-20 text-primary-pink" />
          <p class="mt-2 text-sm text-gray-600">{{ pdfFile.name }}</p>
          <button @click="removePdf" class="mt-2 text-xs text-red-500">
            Remove
          </button>
        </template>
      </div>

      <div v-else-if="props?.summary"
        class="border-[1px] border-dashed h-80 rounded-[10px] flex flex-col items-center justify-center relative overflow-hidden">
        <img :src="props?.summary?.previewImageUrl" class="object-cover object-top h-full w-full" />
      </div>
      <div v-show="!props.summary" class="pt-3">
        <button :disabled="summaryStatus === 'pending' || !pdfFile" @click="handleSubmit"
          class="w-full bg-primary-pink text-white font-semibold text-center text-xl h-11 rounded-[10px] disabled:cursor-not-allowed disabled:bg-gray-400">
          {{ summaryStatus === 'pending' ? 'Generating...' : 'Generate Summary' }}
        </button>
      </div>
    </section>
    <section v-if="!props?.summary" class="flex-1 rounded-[10px] bg-white border-[1px] flex flex-col pb-8">
      <div class="h-14 border-b-[1px] px-5 flex items-center">
        <h1 class="text-2xl font-semibold text-black">Results</h1>
      </div>
      <div v-if="summaryStatus === 'pending'" class="flex-1 flex items-center justify-center">
        <div class="loader w-20"></div>
      </div>
      <div v-else-if="summaryStatus === 'error'" class="flex-1 flex items-center justify-center text-primary-red">
        <p>An error occurred while generating the summary. Please try again.</p>
      </div>
      <div v-else-if="summaryData?.summary" v-html="summaryData?.summary"
        class="flex-1 p-5 overflow-y-auto prose max-w-full"></div>
      <div v-else class="flex-1 flex items-center justify-center text-gray-500">
        <p>No summary available. Please upload a PDF and click "Generate Summary".</p>
      </div>
    </section>

    <section v-else-if="props?.summary" class="flex-1 rounded-[10px] bg-white border-[1px] flex flex-col">
      <div class="h-14 border-b-[1px] px-5 flex items-center">
        <h1 class="text-2xl font-semibold text-black">{{ props?.summary?.fileName }}</h1>
      </div>
      <div v-if="props?.summary?.summaryText" v-html="props?.summary?.summaryText"
        class="flex-1 p-5 overflow-y-auto prose max-w-full max-h-[25rem]"></div>
    </section>
  </div>
</template>
