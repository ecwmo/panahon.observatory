<template>
    <div class="flex relative">
        <!-- Bell button to toggle notifications -->
        <button :class="[
            'rounded p-0 m-0 w-10 h-10',
            notiCount !== 0 ? 'bg-amber' : 'bg-white'
            ]" 
            @click="bellButton"
        ><i class="fa-solid fa-bell"></i>
        </button>

        <!-- renders the notifications themselves -->
        <Notivue v-slot="item">
          <div v-if="toggleNotifs" class="">
            <div class="flex flex-col">
              <NotivueSwipe :item="item">
                  <Notification :item="item" class="bg-gray-100 rounded p-4 w-full break-words max-w-[30vw]" />
              </NotivueSwipe>
            </div>
          </div>
        </Notivue>
    </div>
</template>


<script setup lang="ts">
import { Notivue, NotivueSwipe, Notification, push } from 'notivue/astro'
import { ref, watch } from 'vue'

const toggleNotifs = ref(false)
const notiCount = ref(0)

function bellButton() { //toggle notifications
  toggleNotifs.value = !toggleNotifs.value
}

const props = defineProps<{ //prop containing notifData
  notifData: {
    title: string
    message: string
    duration: number
  }[]
}>()

watch(
  () => props.notifData,
  (newData, oldData) => { //tracks which notifs have been added
    const newItems = newData.slice(oldData?.length || 0)

    newItems.forEach(({ title, message, duration }) => { //adds notifications
      push.success({
        title,
        message,
        duration,
        onManualClear() {
          notiCount.value -= 1
        },
      })
      notiCount.value += 1
    })
  },
)

watch(notiCount, (newVal) => { //set toggleNotifs to false if no more notifs
  if (newVal === 0) {
    toggleNotifs.value = false
  }
})
</script>