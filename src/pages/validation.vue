<template>
  <div class="flex flex-col justify-between items-center">
    <ValidationDateSelector v-model="valStore.selectedDate" class="m-2 md:m-6 w-36" />
    <div class="md:m-6">
      <table class="table-auto text-xs md:text-base">
        <thead>
          <tr>
            <th>Lead time (days)</th>
            <th v-for="lt in valStore.leadTimes" :key="`val_${lt.text}`">{{ lt.text }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(gName, gIdx) in valStore.imageGroups" :key="gIdx">
            <th class="[writing-mode:vertical-rl] rotate-180 h-min">{{ gName.text }}</th>
            <td
              v-for="(imgSrc, imgIdx) in valStore.data?.[gName.id]"
              :key="`${gIdx}_${imgIdx}`"
              :class="{ 'cursor-pointer': imgSrc }"
              class="w-1/5"
              @click.prevent="handleThumbnailClick(imgIdx, gIdx)"
            >
              <img v-if="imgSrc" class="border hover:border-black" :src="imgSrc" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ImageModal
    :open="imgPopUp"
    @close="imgPopUp = false"
    @up="valStore.up"
    @right="valStore.next"
    @down="valStore.down"
    @left="valStore.prev"
  >
    <img class="object-contain rounded-2xl drop-shadow-xl" :src="valStore.activeImage" />
  </ImageModal>
</template>

<script setup lang="ts">
  const valStore = useValidationStore()

  const imgPopUp = ref(false)

  const handleThumbnailClick = (imgIdx: number, grpIdx: number) => {
    valStore.setActiveImage(imgIdx, grpIdx)
    imgPopUp.value = true
  }
</script>
