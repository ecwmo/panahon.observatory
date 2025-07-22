<template>
  <div class="w-full flex flex-col p-6 space-y-4 md:space-y-6 sm:p-8">
    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Sign Up</h1>
    <form class="space-y-4 md:space-y-6" @submit.prevent="handleSignUp">
      <FormInput name="full-name" placeholder="Enter name here" v-model="userData.fullName" required>Name</FormInput>
      <FormInput type="email" name="email" placeholder="Enter email here" v-model="userData.email" required
        >Email</FormInput
      >
      <FormInput type="password" name="password" placeholder="••••••••" v-model="userData.password" required
        >Password</FormInput
      >
      <FormInput
        type="password"
        name="confirm-password"
        placeholder="••••••••"
        v-model="userData.confirmPassword"
        required
        >Confirm Password</FormInput
      >
      <Button :disabled="!isValid" :is-pending="isPending">Sign Up</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, reactive } from 'vue'
  import { signUp } from '@/lib/auth-client'

  import FormInput from '@/components/ui/Input.vue'
  import Button from '@/components/ui/Button.vue'

  const userData = reactive({ email: '', fullName: '', password: '', confirmPassword: '' })
  const isPending = ref(false)
  const isValid = computed(
    () =>
      !(!userData.email || !userData.fullName || !userData.password) && userData.password === userData.confirmPassword,
  )

  const handleSignUp = async () => {
    await signUp.email({
      email: userData.email,
      password: userData.password,
      name: userData.fullName,
      fetchOptions: {
        onResponse: () => {
          isPending.value = false
        },
        onRequest: () => {
          isPending.value = true
        },
        onError: (ctx) => {
          console.log(ctx.error.message)
        },
      },
    })
  }
</script>
