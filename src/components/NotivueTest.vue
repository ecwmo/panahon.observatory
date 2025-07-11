<template> <!-- Constructs the buttons and contains their logic -->
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  </head>
    <div class="flex justify-right">
      <NotificationBox :notifData="notifData" class="flex" />
    </div>
</template>

<script setup lang="ts">
  import NotificationBox from '@/components/NotificationBox.vue'
  
  const props = defineProps<{ //passes the data for notifications to the NotificationBox proper
    notifData: {
      title: string
      message: string
      duration: number
    }[]
  }>()

</script>
