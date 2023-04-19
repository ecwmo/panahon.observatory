<template>
  <div ref="bodyEl" class="h-full overflow-y-scroll">
    <div class="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 h-fit">
      <ReportCard
        v-for="(report, idx) in $reports"
        :key="report.id"
        :data="report"
        :class="[idx === 0 ? 'col-span-2 row-span-2 md:col-span-3 md:row-span-3' : 'col-span-1 row-span-1']"
        class="group relative flex justify-center overflow-hidden rounded-lg"
        @load="handleImgLoad(idx)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'

  import { fetchNewReports, reports } from '@/stores/report'

  const bodyEl = ref()
  const { arrivedState } = useScroll(bodyEl)

  const $reports = useStore(reports)

  const reportCount = computed(() => $reports.value.length)
  const hasScroll = computed(() => bodyEl.value.clientHeight < bodyEl.value.scrollHeight)

  const handleImgLoad = (idx: number) => {
    if (reportCount.value - 1 === idx) {
      if (!hasScroll.value) {
        fetchNewReports()
      }
    }
  }

  watch(arrivedState, ({ bottom }) => {
    if (bottom) {
      fetchNewReports()
    }
  })
</script>
