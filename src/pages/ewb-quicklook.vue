<template>
  <div class="flex flex-col justify-between items-center">
    <div class="md:m-6">
      <img class="border border-black shadow-md rounded-2xl" :src="ewb.data?.jtwc" />
    </div>
    <div class="md:m-6">
      <img class="border border-black shadow-md rounded-2xl" :src="ewb.data?.pagasa" />
    </div>

    <div class="md:m-6">
      <table class="table-auto text-xs md:text-base">
        <thead>
          <tr>
            <th></th>
            <th v-for="ft in ewb.forecastTimes" :key="`hd_${ft.text}`">{{ ft.text }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fvar, gIdx) in ewb.forecastVariables" :key="fvar.id">
            <th class="[writing-mode:vertical-rl] rotate-180 h-min">
              {{ fvar.text }}
            </th>
            <td
              v-for="(imgSrc, imgIdx) in ewb.data?.fcst?.[fvar.id]"
              :key="imgSrc"
              class="w-1/5"
              @click="handleThumbnailClick(imgIdx, gIdx, 'fcst')"
            >
              <img class="border cursor-pointer hover:border-black" :src="imgSrc" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="md:m-6">
      <table class="table-auto text-xs md:text-base">
        <thead>
          <tr>
            <th></th>
            <th v-for="ot in ewb.observationTimes" :key="`hd_${ot.text}`">
              {{ ot.text }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(obs, gIdx) in ewb.observationTypes" :key="obs.id">
            <th class="[writing-mode:vertical-rl] rotate-180 h-min">{{ obs.text }}</th>
            <td
              v-for="(imgSrc, imgIdx) in ewb.data?.obs?.[obs.id]"
              :key="imgSrc"
              class="w-1/5"
              @click="handleThumbnailClick(imgIdx, gIdx, 'obs')"
            >
              <img class="border cursor-pointer hover:border-black" :src="imgSrc" />
            </td>
          </tr>
        </tbody>
      </table>
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
  const imgPopUp = ref(false)

  const ewb = useEWBStore()

  const handleThumbnailClick = (imgIdx: number, grpIdx: number, imgType: string) => {
    ewb.setActiveImage(imgIdx, grpIdx, imgType)
    imgPopUp.value = true
  }
</script>
