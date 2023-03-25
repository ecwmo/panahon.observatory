<template>
  <div ref="bodyEl" class="space-y-2 md:space-y-4">
    <ValidationDateSelector class="w-36 z-30" />
    <div>
      <table class="table-auto text-xs md:text-base">
        <thead>
          <tr>
            <th>Lead time (days)</th>
            <th v-for="lt in leadTimes" :key="`val_${lt.text}`">{{ lt.text }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(gName, gIdx) in imageGroups" :key="gIdx">
            <th class="[writing-mode:vertical-rl] rotate-180 h-min">{{ gName.text }}</th>
            <template v-for="(imgSrc, imgIdx) in validationImgs.data?.[gName.id]" :key="`${gIdx}_${imgIdx}`">
              <component
                :is="gIdx <= lazyLoadGroupStartIdx ? 'td' : Lazy"
                as="td"
                :class="{ 'cursor-pointer': imgSrc }"
                :style="imgElStyle"
                class="w-1/5 border hover:border-black"
                @click.prevent="handleThumbnailClick(imgIdx, gIdx)"
              >
                <img v-if="imgSrc?.length > 0" :src="imgSrc" />
              </component>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ImageModal :open="imgPopUp" @close="imgPopUp = false" @up="up" @right="next" @down="down" @left="prev">
    <img class="object-contain rounded-2xl drop-shadow-xl" :src="activeImg" />
  </ImageModal>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'

  import Lazy from '@/components/Lazy.vue'

  import {
    activeImage,
    down,
    imageGroups,
    leadTimes,
    next,
    prev,
    setActiveImage,
    up,
    validationImages,
  } from '@/stores/validation'

  const validationImgs = useStore(validationImages)
  const activeImg = useStore(activeImage)

  const imgPopUp = ref(false)

  const bodyEl = ref()
  const imgElHeight = ref(0)
  const lazyLoadGroupStartIdx = 1

  const imgElStyle = computed(() => ({ height: `${imgElHeight.value}px` }))

  const handleThumbnailClick = (imgIdx: number, grpIdx: number) => {
    setActiveImage(imgIdx, grpIdx)
    imgPopUp.value = true
  }

  onMounted(() => {
    const { width } = bodyEl.value?.getClientRects()?.[0]
    imgElHeight.value = (width / 9) * (16 / 9)
  })
</script>
