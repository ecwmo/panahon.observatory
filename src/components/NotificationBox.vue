<template>
    <div class="flex">
        <!-- Bell button to toggle notifications -->
        <button :class="[
            'rounded p-0 m-0 w-10 h-10',
            notiCount !== 0 ? 'bg-amber' : 'bg-white'
            ]" 
            @click="bellButton"
        ><i class="fa-solid fa-bell"></i>
        </button>

        <!-- Notification box -->
        <div class="bg-white p-4 rounded shadow mt-2 overflow-y-auto overflow-x-auto">
          <p class="font-semibold mb-2">Notification Center</p>
          <div class="flex flex-col gap-2">
            <Notivue :use="false" v-slot="item">
              <NotivueSwipe :item="item">
                  <Notification :defaults="false" :item="item" class="bg-gray-100 p-3 rounded" />
              </NotivueSwipe>
            </Notivue>
          </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { Notivue, NotivueSwipe, Notification, push } from 'notivue/astro'
import { ref, watch, onMounted } from 'vue'

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

onMounted(() => { //creates notifications
  props.notifData.forEach(({ title, message, duration }) => {
    push.success({
      title,
      message,
      duration,
      onManualClear() {
        notiCount.value -= 1
      }
    })
    notiCount.value += 1
  })
})

watch(notiCount, (newVal) => { //set toggleNotifs to false if no more notifs
  if (newVal === 0) {
    toggleNotifs.value = false
  }
})

</script>

<style>
:root { /* from notivue documentation */
  /* Your variables */
  --header-height: 214px;
  --container-padding: 0px;
  --container-width: 1280px;

  /* Set the maximum width of the stream */
  --nv-root-width: var(--container-width);

  /* Add the top padding and place it below the header */
  --nv-root-top: calc(var(--header-height) + var(--container-padding));

  /* Add the same left-right paddings of your app container */
  --nv-root-left: 1100px;
}

/* Rules for mobile devices */
@media (max-width: 768px) {
  :root {
    --header-height: 60px;
    --container-padding: 20px;
  }
}
</style>
