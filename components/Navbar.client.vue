<template>
  <header
    class="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white border-b border-gray-200 text-sm py-3 sm:py-0 min-h-20">
    <nav class="relative max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8"
      aria-label="Global">
      <div class="flex items-center justify-between">
        <div>
          <img @click="router.push('/')" alt="logo" loading="lazy" width="300" height="300" decoding="async"
            data-nimg="1" style="color:transparent" src="~/assets/logo2.png" class="cursor-pointer" />
        </div>
      </div>
      <div class="hidden overflow-hidden transition-all duration-300 basis-full grow sm:block">
        <div v-if="$userDetails === null" class="flex flex-col sm:flex-row sm:items-center sm:justify-end sm:ps-7">
          <div @click="($toggleModal as unknown)"
            class="flex items-center gap-x-2 font-medium text-gray-500  sm:border-s sm:border-gray-300 py-2 sm:py-0 sm:ms-4 sm:my-6 sm:ps-6 cursor-pointer">
            <IconProfile />
            Get Started
          </div>
        </div>

        <div v-else class="flex flex-col sm:flex-row sm:items-center sm:justify-end sm:ps-7">
          <div @click="handleLogout"
            class="flex items-center gap-x-2 font-medium text-gray-500  sm:border-s sm:border-gray-300 py-2 sm:py-0 sm:ms-4 sm:my-6 sm:ps-6 cursor-pointer">
            <IconProfile />
            {{ $userDetails.name }}
          </div>
        </div>
      </div>
    </nav>
    <!-- <div class="z-50">
      <AuthModal v-if="$showModal" @close="$toggleModal" />
    </div> -->
  </header>
</template>

<script lang="ts" setup>
const { $toggleModal, $userDetails, $clearUserDetails, $toast } = useNuxtApp();

const router = useRouter()

const handleLogout = async () => {
  const { data, status } = await useFetch('/api/logout', {
    method: "GET"
  })

  if (status.value === 'success' && data.value) {
    $clearUserDetails()
    $toast.success("Logout Success")
    router.push("/")
  } else {
    $toast.error("Unexpected response from the server")
  }
}



</script>

<style></style>