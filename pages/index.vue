<script setup lang="ts">
const router = useRouter()
const { $toggleModal, $userDetails } = useNuxtApp();

const handleClick = () => {
  if (!$userDetails.value) {
    $toggleModal()
  }
  if ($userDetails.value) {
    // console.log(toRaw($userDetails.value))
    router.push('/dashboard')
  }
}
</script>

<template>
  <div
    class="relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/polygon-bg-element.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-[1] before:transform before:-translate-x-1/2">
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
      <div class="mt-5 max-w-2xl text-center mx-auto">
        <h1 class="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl">AI
          Content<span class="bg-clip-text bg-gradient-to-tl from-red-600 to-violet-600 text-transparent">
            Summarizer</span></h1>
      </div>
      <div class="mt-5 max-w-3xl text-center mx-auto">
        <p class="text-lg text-gray-600">Streamline your workflow with AI-powered document
          summarization, delivering concise summaries in seconds.</p>
      </div>
      <div class="mt-8 gap-3 flex justify-center">
        <button
          class="inline-flex justify-center items-center  gap-x-3 text-center bg-gradient-to-tl from-red-600 to-violet-600 hover:bg-gradient-to-rl hover:from-violet-600 hover:to-red-600 border border-transparent text-white text-sm font-medium rounded-md focus:outline-none py-3 px-4"
          @click="handleClick">Get started
          <IconRightArrow />
        </button>
      </div>
    </div>
  </div>

  <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 items-center gap-2"><a
        class="group flex flex-col justify-center hover:bg-gray-50 rounded-xl p-4 md:p-7" href="#">
        <div class="flex justify-center items-center size-12 bg-primary-pink rounded-xl">
          <IconTemplate />
        </div>
        <div class="mt-5">
          <h3 class="group-hover:text-gray-600 text-lg font-semibold text-gray-800">
            25+ templates</h3>
          <p class="mt-1 text-gray-600 dark:text-neutral-400">Responsive, and mobile-first project on the web</p><span
            class="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 group-hover:underline font-medium">Learn
            more
            <IconCustomise />
          </span>
        </div>
      </a><a class="group flex flex-col justify-center hover:bg-gray-50 rounded-xl p-4 md:p-7 dark:hover:bg-neutral-800"
        href="#">
        <div class="flex justify-center items-center size-12 bg-primary-pink rounded-xl">
          <IconBook />
        </div>
        <div class="mt-5">
          <h3 class="group-hover:text-gray-600 text-lg font-semibold text-gray-800">
            Customizable</h3>
          <p class="mt-1 text-gray-600 dark:text-neutral-400">Components are easily customized and extendable</p><span
            class="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 group-hover:underline font-medium">Learn
            more
            <IconMessage />
          </span>
        </div>
      </a><a class="group flex flex-col justify-center hover:bg-gray-50 rounded-xl p-4 md:p-7" href="#">
        <div class="flex justify-center items-center size-12 bg-primary-pink rounded-xl"><svg
            class="flex-shrink-0 size-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg></div>
        <div class="mt-5">
          <h3 class="group-hover:text-gray-600 text-lg font-semibold text-gray-800">
            Free to Use</h3>
          <p class="mt-1 text-gray-600 dark:text-neutral-400">Every component and plugin is well documented</p><span
            class="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 group-hover:underline font-medium">Learn
            more<svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg></span>
        </div>
      </a><a class="group flex flex-col justify-center hover:bg-gray-50 rounded-xl p-4 md:p-7" href="#">
        <div class="flex justify-center items-center size-12 bg-primary-pink rounded-xl"><svg
            class="flex-shrink-0 size-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
            <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
          </svg></div>
        <div class="mt-5">
          <h3 class="group-hover:text-gray-600 text-lg font-semibold text-gray-800">
            24/7 Support</h3>
          <p class="mt-1 text-gray-600 dark:text-neutral-400">Contact us 24 hours a day, 7 days a week</p><span
            class="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 group-hover:underline font-medium">Learn
            more<svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg></span>
        </div>
      </a>
    </div>
  </div>
  <!-- <AuthModal v-if="$showModal" @close="($toogleModal as unknown)" /> -->
</template>
