<template>
  <Header />
  <div class="bg-gray-300 border border-t-0 border-black flex flex-col items-center">
    <router-view />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import Header from '@/components/Header.vue'

  export default defineComponent({
    components: {
      Header,
    },
  })
</script>
