<template> <!-- Constructs the buttons and contains their logic -->
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  </head>
    <div class="flex h-20">
      <NotificationBox :noti-count="notiCount" class="flex" />
    </div>
    <div class="flex flex-col">
      <h1 class="font-serif">Testing notivue</h1>
      <button class="rounded bg-white px-4" @click="pushStatic">Push</button>
    </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { push } from 'notivue/astro'
  import NotificationBox from '@/components/NotificationBox.vue'
  import { createNotivue } from 'notivue'
  const notiCount = ref(0) //prop to pass into NotificationBox for notification count

  function pushStatic() {
    console.log('Pushing static notification')
    push.success({
      title: 'Title',
      message: 'short description, date, link to report',
      duration: Infinity,
      onManualClear(item) {
      console.log('Manually cleared!')
      notiCount.value -= 1
    }
    })
    notiCount.value += 1  
  }
</script>
