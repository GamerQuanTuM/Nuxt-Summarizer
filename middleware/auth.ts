export default defineNuxtRouteMiddleware((to, from) => {
  const { $userDetails: user } = useNuxtApp();
  if (user.value) {
    navigateTo(to.fullPath);
  } else {
    return navigateTo("/");
  }
});
