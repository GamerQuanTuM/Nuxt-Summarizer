import AuthModal from "~/components/AuthModal.client.vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("AuthModal", AuthModal);

  const showModal = ref<boolean>(false);


  const toggleModal = (): void => {
    showModal.value = !showModal.value;
  };

  return {
    provide: {
      showModal,
      toggleModal,
    },
  };
});

