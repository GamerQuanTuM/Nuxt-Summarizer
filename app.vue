<template>
  <NuxtLayout>
    <NuxtPage />
    <AuthModal v-if="$showModal" @close="($toggleModal as unknown)" />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { $showModal, $toggleModal } = useNuxtApp();

</script>
