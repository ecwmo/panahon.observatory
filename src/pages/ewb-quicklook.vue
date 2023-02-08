<template>
  <div ref="bodyEl" class="h-full md:p-4 overflow-scroll">
    <TabGroup :selected-index="selectedTab" @change="handleTabChange">
      <TabList
        ref="tabHeaderEl"
        :class="['fixed flex space-x-2 rounded-xl p-1 mx-5 z-40 ', { 'backdrop-blur-sm bg-white/10': selectedTab > 0 }]"
      >
        <Tab v-for="tab in tabs" v-slot="{ selected }" :key="tab" as="template">
          <button
            :class="[
              'rounded-lg p-2.5 text-sm font-medium leading-5',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-white shadow text-blue-700'
                : selectedTab > 0
                ? 'text-blue-400 hover:backdrop-blur-sm hover:bg-white/20 hover:text-blue-700'
                : 'text-blue-200 hover:bg-white/10 hover:text-white',
            ]"
          >
            {{ tab }}
          </button>
        </Tab>
      </TabList>
    </TabGroup>
    <div ref="sectionEls" class="flex flex-col justify-between items-center md:mx-6 md:space-y-6 mt-14">
      <div>
        <img
          class="border border-black shadow-md rounded-2xl"
          :src="ewb.data?.jtwc"
          @load="handleStaticImageLoad"
          @error="handleStaticImageLoad"
        />
      </div>
      <div>
        <img class="border border-black shadow-md rounded-2xl" :src="ewb.data?.pagasa" />
      </div>

      <div v-for="section in sections" :key="section.name">
        <table class="table-auto text-xs md:text-base">
          <thead>
            <tr>
              <th></th>
              <th v-for="h in section.header" :key="`hd_${section.name}_${h.text}`">{{ h.text }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(d, gIdx) in section.data" :key="`bdy_${section.name}_${d.id}`">
              <th class="[writing-mode:vertical-rl] rotate-180 h-min">
                {{ d.text }}
              </th>
              <td
                v-for="(imgSrc, imgIdx) in d.imgs"
                :key="imgSrc"
                class="w-1/5"
                @click="handleThumbnailClick(imgIdx, gIdx, section.name)"
              >
                <img class="border cursor-pointer hover:border-black" :data-url="imgSrc" />
              </td>
              <td v-for="i in section?.fill_end" :key="`filld_${i}`" class="w-1/5"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ImageModal
    :open="imgPopUp"
    @close="imgPopUp = false"
    @up="ewb.up"
    @right="ewb.next"
    @down="ewb.down"
    @left="ewb.prev"
  >
    <img class="object-contain rounded-2xl drop-shadow-xl" :src="ewb.activeImage" />
  </ImageModal>
</template>

<script setup lang="ts">
  import { EWBIntImages } from '@/types/ewb'

  const bodyEl = ref()
  const tabHeaderEl = ref()
  const sectionEls = ref()

  const { directions: scrollDir, isScrolling } = useScroll(bodyEl)

  const tabs = ['JTWC', 'PAGASA', 'Forecast', 'Forecast (Accumulated)', 'Observed']
  const selectedTab = ref(0)

  const imgPopUp = ref(false)

  const ewb = useEWBStore()

  const sections = computed(() => [
    {
      name: 'fcst',
      header: ewb.metadata.fcst.variants,
      data: ewb.metadata.fcst.items.map((d) => ({ ...d, imgs: ewb.data?.fcst[d.id as keyof EWBIntImages['fcst']] })),
    },
    {
      name: 'fcstAccum',
      header: ewb.metadata.fcstAccum.variants,
      data: ewb.metadata.fcstAccum.items.map((d) => ({
        ...d,
        imgs: ewb.data?.fcstAccum[d.id as keyof EWBIntImages['fcstAccum']],
      })),
      fill_end: 2,
    },
    {
      name: 'obs',
      header: ewb.metadata.obs.variants,
      data: ewb.metadata.obs.items.map((d) => ({ ...d, imgs: ewb.data?.obs[d.id as keyof EWBIntImages['obs']] })),
    },
  ])

  const lazySectionEls = computed(() => [...sectionEls.value.children].slice(2))

  const handleThumbnailClick = (imgIdx: number, grpIdx: number, imgType: string) => {
    ewb.setActiveImage(imgIdx, grpIdx, imgType)
    imgPopUp.value = true
  }

  const handleTabChange = (idx: number) => {
    const el = sectionEls.value.children[idx]
    let lazyLoadImgs: Promise<HTMLImageElement>[] = []

    if (idx > 1) {
      lazySectionEls.value.forEach((s) => {
        const imgs: HTMLImageElement[] = [...s.querySelectorAll('img')]
        imgs
          .filter(({ src, dataset: { url } }) => url !== undefined && src.length === 0)
          .forEach((img) => {
            img.dataset.shouldLoad = 'false'
          })
      })

      lazyLoadImgs = ([...el.querySelectorAll('img')] as HTMLImageElement[])
        .filter(({ src, dataset: { url } }) => url !== undefined && src.length === 0)
        .map((img) => {
          return new Promise((resolve) => {
            const f = () => {
              img.dataset.shouldLoad = 'true'
              resolve(img)
            }
            img.onload = f
            img.onerror = f
            img.src = img.dataset.url ?? ''
          })
        })
    }

    Promise.all(lazyLoadImgs).then(() => {
      bodyEl.value.scrollTo({
        behavior: 'smooth',
        top: el.offsetTop - sectionEls.value.offsetTop,
      })
    })
  }

  const handleStaticImageLoad = () => {
    lazySectionEls.value.forEach((s) => {
      const imgs: HTMLImageElement[] = [...s.querySelectorAll('img')].filter(
        ({ dataset: { url } }) => url !== undefined
      )

      if (imgs.length) {
        imgs.forEach((img) => {
          const { stop: unobserve } = useIntersectionObserver(img, ([{ isIntersecting }]) => {
            if (isIntersecting && img.dataset.url !== undefined && img.dataset.shouldLoad !== 'false') {
              img.src = img.dataset.url ?? ''
              unobserve()
            }
          })
        })
      }
    })
  }

  watchEffect(() => {
    if (!isScrolling.value && tabHeaderEl.value) {
      tabHeaderEl.value.$el.children?.[selectedTab.value]?.focus()

      lazySectionEls.value.forEach((s) => {
        const imgs: HTMLImageElement[] = [...s.querySelectorAll('img')]

        imgs
          .filter(({ dataset: { shouldLoad } }) => shouldLoad === 'false')
          .forEach((img) => {
            img.dataset.shouldLoad = 'true'
          })
      })
    }
  })

  onMounted(() => {
    const intObsOpts = {
      root: bodyEl,
      threshold: 0,
      rootMargin: `${tabHeaderEl.value?.$el.offsetHeight * -1}px`,
    }
    ;[...sectionEls.value.children].forEach((s, idx) => {
      useIntersectionObserver(
        s,
        ([{ isIntersecting }]) => {
          const shouldUpdate = (scrollDir.bottom && !isIntersecting) || (scrollDir.top && isIntersecting)

          if (shouldUpdate) {
            selectedTab.value = scrollDir.top ? idx : idx + 1
          }
        },
        intObsOpts
      )
    })
  })
</script>
