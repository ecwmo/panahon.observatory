<template>
  <div class="flex flex-col max-h-screen">
    <Header></Header>
    <router-view> </router-view>
  </div>
</template>

<script setup lang="ts">
  import Header from '@/components/Header.vue'
</script>
