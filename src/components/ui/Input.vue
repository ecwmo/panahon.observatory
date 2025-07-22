<template>
  <div>
    <label :for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"><slot /></label>
    <input
      :type="type"
      :name="name"
      :id="name"
      v-model="model"
      class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      :placeholder="placeholder"
      :required="required"
    />
  </div>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{ name: string; type?: string; placeholder?: string; required?: boolean }>(), {
    type: 'text',
    placeholder: '',
    required: false,
  })

  const model = defineModel()
</script>
