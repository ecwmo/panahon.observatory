<template>
  <div class="h-full space-y-2 md:space-y-4 p-2 md:p-8">
    <TabGroup>
      <TabList class="flex space-x-2 rounded-xl p-1 z-40">
        <Tab v-for="tab in tabs" v-slot="{ selected }" :key="tab" as="template">
          <button
            :class="[
              'rounded-lg p-2.5 text-sm font-medium leading-5 text-blue-700',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
            ]"
          >
            {{ tab }}
          </button>
        </Tab>
      </TabList>
      <TabPanels class="flex h-full w-full">
        <TabPanel class="space-y-2 md:space-y-4">
          <ValidationDateSelector class="w-36 z-30" />
          <div>
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
        </TabPanel>
        <TabPanel class="flex flex-col h-full w-full items-center justify-center space-y-2 md:space-y-4">
          <ValidationDateSelector :range-view="true" class="w-48 z-30" />

          <div class="flex flex-col md:flex-row h-full w-full space-x-2 md:space-x-4">
            <MapBox class="w-full md:w-1/2 h-full z-0" />

            <div class="w-full md:w-1/2 h-full">
              <img class="object-contain rounded-2xl" :src="valStore.activeStnImage" />
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
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

  const tabs = ['Maps', 'Timeseries']

  const handleThumbnailClick = (imgIdx: number, grpIdx: number) => {
    valStore.setActiveImage(imgIdx, grpIdx)
    imgPopUp.value = true
  }
</script>
