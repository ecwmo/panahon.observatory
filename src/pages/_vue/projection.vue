<template>
    <html>
    <head>
        <title>Province Selector</title>
    </head>
    <body>
        <h1>Province and Model Dropdown</h1>


        <List provinces={provinces} models={models} />
    </body>
    </html>
</template>

<script setup lang="ts">
  import GraphProjection from '@/components/projection/GraphProjection.vue'
  import ListProvince from '@/components/projection/ListProvince.vue'
  import { getProvincesAndModels } from '../api/provinces';
 </script>

<style scoped>
</style>



