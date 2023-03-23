<template>
  <div class="space-y-2 md:space-y-4">
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
            <td
              v-for="(imgSrc, imgIdx) in validationImgs.data?.[gName.id]"
              :key="`${gIdx}_${imgIdx}`"
              :class="{ 'cursor-pointer': imgSrc }"
              class="w-1/5"
              @click.prevent="handleThumbnailClick(imgIdx, gIdx)"
            >
              <img
                v-show="imgSrc"
                ref="imgEls"
                class="border hover:border-black"
                :src="gIdx <= lazyLoadGroupStartIdx ? imgSrc ?? undefined : undefined"
                :data-url="gIdx > lazyLoadGroupStartIdx ? imgSrc : undefined"
              />
            </td>
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

  const imgEls = ref([])
  const lazyLoadStartIdx = 10
  const lazyLoadGroupStartIdx = 1

  const handleThumbnailClick = (imgIdx: number, grpIdx: number) => {
    setActiveImage(imgIdx, grpIdx)
    imgPopUp.value = true
  }

  watchEffect(() => {
    const validImgs = imgEls.value.filter(({ dataset: { url } }: HTMLImageElement) => url !== undefined)
    if (validImgs.length) {
      setTimeout(() => {
        ;(imgEls.value as HTMLImageElement[])
          .slice(lazyLoadStartIdx)
          .filter(({ dataset: { url } }) => url !== undefined)
          .forEach((img) => {
            const { stop: unobserve } = useIntersectionObserver(img, ([{ isIntersecting }]) => {
              if (isIntersecting && img.dataset.url !== undefined) {
                img.src = img.dataset.url ?? ''
                unobserve()
              }
            })
          })
      }, 2000)
    }
  })
</script>
