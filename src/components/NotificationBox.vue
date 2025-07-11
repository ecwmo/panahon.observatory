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
        <Notivue :use="false" v-slot="item">
        <div v-if="toggleNotifs" class="bg-white p-4 rounded shadow mt-2 w-[300px] max-h-[400px] overflow-y-auto">
            <p class="font-semibold mb-2">Notification Center</p>

            <div class="flex flex-col gap-2">
            <NotivueSwipe :item="item">
                <Notification :defaults="false" :item="item" class="bg-gray-100 p-3 rounded" />
            </NotivueSwipe>
            </div>
        </div>
        </Notivue>
    </div>
</template>


<script setup lang="ts">
import { Notivue, NotivueSwipe, Notification } from 'notivue/astro'
import { ref, watch } from 'vue'

const toggleNotifs = ref(false)

function bellButton() { //toggle notifications
  toggleNotifs.value = !toggleNotifs.value
  console.log("notiCount: " + notiCount)
}

const { notiCount = 0 } = defineProps<{ //takes in mode prop from defaultLayout
  notiCount?: Number
}>()

watch( //set Notifs to false if 0 
  () => notiCount,
  (newVal) => {
    if (newVal === 0) {
      toggleNotifs.value = false
    }
  }
)
</script>

<!-- <style>
:root { /* from notivue documentation */
  /* Your variables */
  --header-height: 0px;
  --container-padding: 0px;
  --container-width: 1280px;

  /* Set the maximum width of the stream */
  --nv-root-width: var(--container-width);

  /* Add the top padding and place it below the header */
  --nv-root-top: calc(var(--header-height) + var(--container-padding));

  /* Add the same left-right paddings of your app container */
  --nv-root-left: 1300px;
}

/* Rules for mobile devices */
@media (max-width: 768px) {
  :root {
    --header-height: 60px;
    --container-padding: 20px;
  }
}
</style> -->
