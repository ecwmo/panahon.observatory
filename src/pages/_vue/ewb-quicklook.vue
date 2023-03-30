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
        <img :src="$ewbImages?.jtwc" class="border border-black shadow-md rounded-2xl" />
      </div>
      <div>
        <img :src="$ewbImages?.pagasa" class="border border-black shadow-md rounded-2xl" />
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
              <Lazy
                v-for="(imgSrc, imgIdx) in d.imgs"
                :key="imgSrc"
                :class="{ 'cursor-pointer': imgSrc }"
                :style="imgElStyle"
                as="td"
                class="w-1/5 border hover:border-black"
                @click="handleThumbnailClick(imgIdx, gIdx, section.name)"
              >
                <img v-if="imgSrc?.length > 0" :src="imgSrc" />
              </Lazy>
              <td v-for="i in section?.fill_end" :key="`filld_${i}`" class="w-1/5"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ImageModal :open="imgPopUp" @close="imgPopUp = false" @up="up" @right="next" @down="down" @left="prev">
    <img class="object-contain rounded-2xl drop-shadow-xl" :src="$activeImage" />
  </ImageModal>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'

  import { activeImage, down, ewbImages, metadata, next, prev, setActiveImage, up } from '@/stores/ewb'

  import { EWBIntImages } from '@/types/ewb'

  const $ewbImages = useStore(ewbImages)
  const $activeImage = useStore(activeImage)

  const bodyEl = ref()
  const tabHeaderEl = ref()
  const sectionEls = ref()
  const imgElHeight = ref(0)

  const { directions: scrollDir, isScrolling } = useScroll(bodyEl)

  const tabs = ['JTWC', 'PAGASA', 'Forecast', 'Forecast (Accumulated)', 'Observed']
  const selectedTab = ref(0)

  const imgPopUp = ref(false)

  const sections = computed(() => [
    {
      name: 'fcst',
      header: metadata.fcst.variants,
      data: metadata.fcst.items.map((d) => ({
        ...d,
        imgs: $ewbImages.value?.fcst[d.id as keyof EWBIntImages['fcst']],
      })),
    },
    {
      name: 'fcstAccum',
      header: metadata.fcstAccum.variants,
      data: metadata.fcstAccum.items.map((d) => ({
        ...d,
        imgs: $ewbImages.value?.fcstAccum[d.id as keyof EWBIntImages['fcstAccum']],
      })),
      fill_end: 2,
    },
    {
      name: 'obs',
      header: metadata.obs.variants,
      data: metadata.obs.items.map((d) => ({ ...d, imgs: $ewbImages.value?.obs[d.id as keyof EWBIntImages['obs']] })),
    },
  ])

  const imgElStyle = computed(() => ({ height: `${imgElHeight.value}px` }))

  const handleThumbnailClick = (imgIdx: number, grpIdx: number, imgType: string) => {
    setActiveImage(imgIdx, grpIdx, imgType)
    imgPopUp.value = true
  }

  const handleTabChange = (idx: number) => {
    const el = sectionEls.value.children[idx]

    bodyEl.value.scrollTo({
      behavior: 'smooth',
      top: el.offsetTop - sectionEls.value.offsetTop,
    })
  }

  watchEffect(() => {
    if (!isScrolling.value && tabHeaderEl.value) {
      tabHeaderEl.value.$el.children?.[selectedTab.value]?.focus()
    }
  })

  onMounted(() => {
    const intObsOpts = {
      root: bodyEl,
      threshold: 0,
      rootMargin: `${tabHeaderEl.value?.$el.offsetHeight * -1}px`,
    }

    const { width } = bodyEl.value?.getClientRects()?.[0]
    imgElHeight.value = (width / 9) * (16 / 9)
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
