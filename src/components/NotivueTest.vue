<template> <!-- Constructs the buttons and contains their logic -->
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  </head>
    <div class="flex justify-right">
      <NotificationBox :notifData="notifData" class="flex" />
    </div>
</template>

<script setup lang="ts">
import { useWebNotification } from '@vueuse/core';
import { ref, onMounted } from 'vue';
import NotificationBox from '@/components/NotificationBox.vue'

const notifData = ref([]);

onMounted(() => {
  const socket = new WebSocket("ws://127.0.0.1:9999/ws/notifications"); //connection to noficiation server

  socket.onmessage = (event) => { //parse through each notification
    const json = JSON.parse(event.data);
    json.forEach(notificationParser);
  };
});

function notificationParser(entry: any) { //renews array for each new entry para pansinin ni watch
  notifData.value = [ ...notifData.value, {title:entry.title,message:entry.short_desc + entry.category + entry.date_issued + entry.report_link,duration:Infinity}];
  
  const { //created desktop notif
    isSupported,
    permissionGranted,
    show,
  } = useWebNotification({
    title: entry.title,
    body: entry.short_desc + entry.category + entry.date_issued + entry.report_link,
  })
  
  if (isSupported.value && permissionGranted.value) //if permission == true, then show desktop notification
  show()

}
</script>
