<template> <!-- Constructs the buttons and contains their logic -->
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  </head>
    <div class="flex justify-right">
      <NotificationBox :noti-count="notiCount" class="flex" />
    </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { push } from 'notivue/astro'
  import NotificationBox from '@/components/NotificationBox.vue'
  
  const notiCount = ref(0) //prop to pass into NotificationBox for notification count

  function pushStatic() {
    console.log('Pushing static notification')
    push.success({
      title: 'Title',
      message: 'short description, date, link to report',
      duration: Infinity,
      onManualClear(item) {
      notiCount.value -= 1
    }
    })
    notiCount.value += 1  
  }

  const props = defineProps<{
    notifData: {
      title: string
      message: string
      duration: number
    }[]
  }>()

  onMounted(() => { //creates notifications based on passed notifData
    props.notifData.forEach(({ title, message, duration }) => {
      push.success({
        title,
        message,
        duration,
        onManualClear(item) {
          notiCount.value -= 1
        }
      })
      notiCount.value += 1
    })
  })
</script>
