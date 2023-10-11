<template>
  <div ref="bodyEl" class="relative h-full overflow-y-scroll">
    <div v-if="user.isLoggedIn" class="absolute bottom-12 md:bottom-14 right-0 w-12 md:w-14 md:m-2">
      <button
        class="fixed z-20 w-10 md:w-12 h-10 md:h-12 bg-blue-600 rounded-full hover:bg-blue-700 active:shadow-2xl mouse shadow-xl transition ease-in duration-200 focus:outline-none"
        @click.prevent="handleFABClick"
      >
        <svg viewBox="0 0 20 20" enable-background="new 0 0 20 20" class="w-6 h-6 inline-block">
          <path
            fill="#FFFFFF"
            d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                      C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                      C15.952,9,16,9.447,16,10z"
          ></path>
        </svg>
      </button>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
      <ReportCard
        v-for="(report, idx) in reports"
        :key="report.id"
        :data="report"
        :class="[
          idx === 0
            ? featuredImgPos === 'landscape'
              ? 'col-span-2 row-span-2 md:col-span-3 md:row-span-3'
              : 'col-span-2 row-span-3'
            : 'col-span-1 row-span-1',
        ]"
        class="group relative flex justify-center overflow-hidden rounded-lg"
        @load="handleImgLoad($event, idx)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'

  import { Report } from '@/schemas/report'

  import { $user } from '@/stores/auth'
  import { apiRoute, route } from '@/stores/routes'

  const bodyEl = ref()
  const { arrivedState } = useScroll(bodyEl)
  const featuredImgPos = ref('landscape')

  const user = useStore($user)

  const reportCount = computed(() => reports.value.length)
  const hasScroll = computed(() => bodyEl.value.clientHeight < bodyEl.value.scrollHeight)

  const cursor = ref(0)
  const fetchReports = async ({ pageParam = 0 }) => {
    const url = `${apiRoute('reports')}?take=5&skip=${pageParam}`
    const { data } = await axios.get(url)
    cursor.value += data.length
    return Report.array().parse(data)
  }

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['reports'],
    queryFn: fetchReports,
    getNextPageParam: () => cursor.value,
  })

  const reports = computed(() => {
    return data.value?.pages.flat(1)
  })

  const handleImgLoad = (ev: Event, idx: number) => {
    if (reportCount.value - 1 === idx) {
      if (!hasScroll.value) {
        fetchNextPage()
      }
    }
    if (idx == 0) {
      const featImg = ev.target as HTMLImageElement
      if (featImg.height > featImg.width) featuredImgPos.value = 'portrait'
    }
  }

  const handleFABClick = () => {
    location.href = `${route('reports/upload')}`
  }

  watch(arrivedState, ({ bottom }) => {
    if (bottom) {
      fetchNextPage()
    }
  })
</script>
