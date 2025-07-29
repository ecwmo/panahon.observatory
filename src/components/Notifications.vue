<template>
    <div class="flex relative">
        <!-- button to toggle pop up notification visibility -->
        <div class="relative">
        <div v-if="notiCount != 0 " class="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center">{{ notiCount }}</div>
        <button :class="[
            'rounded p-0 m-0 w-10 h-10',
            notiCount !== 0 ? 'bg-yellow-500' : 'bg-white'
            ]" 
            @click="bellButton"
        ><i class="fa-solid fa-bell"></i>
        </button>
        </div>

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
import { ref, watch, onMounted } from 'vue'

const toggleNotifs = ref(false)
const notiCount = ref(0)
const activeNotiCount = ref(0)
const notifQueue = ref<{ title: string; message: string; duration: number }[]>([])
const activeQueue = ref<{ title: string; message: string; duration: number }[]>([])

onMounted(() => { //ensures notifications are global
  const globalNotifs = Object.values(JSON.parse(localStorage.getItem("notifs")!))
  globalNotifs.forEach((notif: {title: string; message: string; duration: number}) => {
    notifQueue.value.push(notif);
    notiCount.value += 1;
    pushNextNotif();
  })
})


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
  (newData, oldData) => { //tracks new notifications
    const newItems = newData.slice(oldData?.length || 0)

    notifQueue.value.push(...newItems) //queue for all notifications
    notiCount.value += newItems.length;

    activeQueue.value.push(...notifQueue.value); //queue for notifications currently active
    saveNotifs();
    
    for (let i = 0; i < 3; i++) {
      pushNextNotif()
    }
  },
)

watch(notiCount, (newVal) => { //set toggleNotifs to false if no more notifs
  if (newVal === 0) {
    toggleNotifs.value = false
  }
})

function pushNextNotif() { //function for pushing the next notification
  if (activeNotiCount.value >= 3 || notifQueue.value.length === 0) return; //prevent hallucinating notifs

  const { title, message, duration } = notifQueue.value.shift()!;
  if (activeNotiCount.value < 3){
    push.success({
        title,
        message,
        duration,
        onManualClear() {
          activeNotiCount.value -= 1;
          notiCount.value -= 1;
          console.log(title,message,duration)
          const index = activeQueue.value.findIndex( //finds cleared notif from queue and removes it on clear
            (notif) =>
              notif.title === title &&
              notif.message === message &&
              notif.duration === duration
          );
          if (index !== -1) {
            activeQueue.value.splice(index, 1);
          }
          saveNotifs();
          pushNextNotif();
        },
      })
    activeNotiCount.value += 1;
  }
}

function saveNotifs() { //updates localStorage
  localStorage.setItem("notifs", JSON.stringify(activeQueue.value));
}
</script>