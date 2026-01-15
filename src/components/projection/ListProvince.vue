<template>
  <div>
    <label>
      Province:
      <select v-model="selectedProvince">
        <option v-for="province in props.provinces" :key="province" :value="province">
          {{ province }}
        </option>
      </select>
    </label>

    <label>
      Model:
      <select v-model="selectedModel">
        <option v-for="model in props.models" :key="model" :value="model">
          {{ model }}
        </option>
      </select>
    </label>

    <p>Selected Province: {{ selectedProvince }}</p>
    <p>Selected Model: {{ selectedModel }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";

const props = defineProps<{
  provinces: string[];
  models: string[];
}>();

const selectedProvince = ref(props.provinces[0] || "");
const selectedModel = ref(props.models[0] || "");
</script>
