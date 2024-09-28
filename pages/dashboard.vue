<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import type { DefineComponent } from "vue";
import IconHome from "~/components/icon/Home.vue";
import IconBilling from "~/components/icon/Billing.vue";
import IconSetting from "~/components/icon/Setting.vue";
import IconCreate from "~/components/icon/Create.vue";
import ComingSoon from '~/components/ComingSoon.vue';

definePageMeta({
  middleware: "auth"
})

type Active = "home" | "billing" | "setting" | "create";
type NavOption = { name: string; href?: string; icon: DefineComponent<{}, {}, any>; active: Active };

const navOptions: NavOption[] = [
  { name: "Home", href: "/", icon: IconHome, active: "home" },
  { name: "Create", href: "/create", icon: IconCreate, active: "create" },
  { name: "Billing", href: "/billing", icon: IconBilling, active: "billing" },
  { name: "Setting", href: "/setting", icon: IconSetting, active: "setting" },
];

const active = ref<Active>("home");
const sliderValue = ref(10000);
const maxSliderValue = ref(10000);
const maxValue = 10000;
const sliderRef = ref<HTMLInputElement | null>(null);
const isShowDetailsShown = ref<boolean>(false);
const selectedSummary = ref<Summary | null>(null);

const { $userDetails } = useNuxtApp()


const refetchSummary = ref(false);

const updateSliderBackground = () => {
  const percentage = (sliderValue.value / maxValue) * 100;
  if (sliderRef.value) {
    sliderRef.value.style.setProperty('--value', `${percentage}%`);
  }
};

watch(sliderValue, updateSliderBackground);

onMounted(() => {
  updateSliderBackground();
});

onMounted(() => {
  sliderValue.value = $userDetails.value?.credit as number
  maxSliderValue.value = $userDetails.value?.maxCredit as number
})

const handleActive = (activeIcon: Active) => {
  active.value = activeIcon;
};

const handleFetch = async () => {
  const { data, status } = useFetch('/api/summary-by-user-id', {
    method: "GET"
  });
  refetchSummary.value = false;
  return { data, status };
};

onMounted(() => {
  handleFetch();
});

const { data, status } = await handleFetch();

const handleShowDetails = (showDetails: boolean) => {
  isShowDetailsShown.value = showDetails;
  if (!showDetails) {
    selectedSummary.value = null;
  }
};

const handleShowDetailsSummary = (summary: Summary) => {
  selectedSummary.value = summary;
  isShowDetailsShown.value = true;
};

watch(() => refetchSummary.value, (newVal) => {
  if (newVal) {
    handleFetch();
  }
});

watch(() => $userDetails.value?.credit, (newVal) => {
  if (newVal) {
    sliderValue.value = newVal
  }
})
</script>

<template>
  <div class="flex h-full w-full">
    <section class="w-[20%] h-full border-r-[1px] py-4 px-5 relative">
      <div class="flex flex-col gap-3">
        <div class="flex items-center h-12 gap-3 cursor-pointer px-3"
          :class="{ 'bg-primary-pink text-white rounded-[10px]': active === nav.active }" v-for="(nav, i) in navOptions"
          :key="i" @click="handleActive(nav.active)">
          <component :is="nav.icon" class="h-5 w-5" />
          <h1 class="text-xl font-normal">{{ nav.name }}</h1>
        </div>
      </div>

      <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%]">
        <div class="h-32 w-full bg-primary-pink rounded-[10px] flex flex-col p-4 gap-5">
          <h1 class="text-xl font-medium text-white">Credits</h1>
          <div class="flex flex-col gap-2">
            <input ref="sliderRef" type="range" :min="0" :max="maxValue" v-model="sliderValue"
              @input="updateSliderBackground" class="range-slider w-full" />
            <p class="text-sm font-normal text-white">{{ sliderValue }}/{{ maxSliderValue }} credit used</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main section with scrollable content -->
    <section class="flex-1 flex flex-col h-full bg-blue-50 p-5 w-full">
      <div v-if="active === 'home'" class="flex-1 overflow-y-auto h-full w-full">
        <div class="flex items-center justify-center h-full w-full" v-if="status === 'pending'">
          <div class="loader w-28"></div>
        </div>
        <div v-else-if="status === 'success'">
          <div v-if="!isShowDetailsShown" class="grid grid-cols-3 gap-5">
            <div v-for="(item, i) in data.documents" :key="i">
              <SummarizerCard :summary="item" @show-details-summary="handleShowDetailsSummary"
                @show-details="handleShowDetails" />
            </div>
          </div>
          <div v-else>
            <ContentSummarizer :summary="selectedSummary" @close="handleShowDetails(false)" />
          </div>
        </div>
      </div>

      <div v-else-if="active === 'create'" class="w-full h-full">
        <ContentSummarizer @refetch="handleFetch" />
      </div>
      <div class="h-full w-full" v-else-if="active === 'billing'">
        <ComingSoon />
      </div>
      <div class="h-full w-full" v-else-if="active === 'setting'">
        <ComingSoon />
      </div>
      <div class="pb-5"></div>
    </section>
  </div>
</template>
