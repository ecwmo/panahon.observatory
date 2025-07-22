<template>
  <div class="w-full flex flex-col p-6 space-y-4 md:space-y-6 sm:p-8">
    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Login</h1>
    <div class="flex flex-col items-center">
      <button
        type="button"
        class="mx-auto md:w-full space-x-2 text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center dark:focus:ring-[#4285F4]/55"
        @click.prevent="handleGoogleLogin"
      >
        <div class="md:w-1/12 i-fa6-brands-google text-lg" />
        <div class="md:w-11/12 text-center">Sign in with Google</div>
      </button>
    </div>
    <div class="inline-flex items-center justify-center w-full">
      <hr class="w-64 h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <span
        class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900"
        >or</span
      >
    </div>
    <form class="space-y-4 md:space-y-6" @submit.prevent="handleLogin">
      <FormInput type="email" name="email" placeholder="Enter email here" v-model="userData.email" required
        >Email</FormInput
      >
      <FormInput type="password" name="password" placeholder="••••••••" v-model="userData.password" required
        >Password</FormInput
      >
      <div class="flex items-center justify-between">
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="remember"
              aria-describedby="remember"
              type="checkbox"
              v-model="userData.remember"
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
          </div>
        </div>
        <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Forgot password?</a>
      </div>
      <Button :disabled="!isValid" :is-pending="isPending">Login</Button>
      <p class="text-sm font-light text-gray-500 dark:text-gray-400">
        Don’t have an account yet?
        <a href="/signup" class="font-medium text-blue-600 hover:underline dark:text-blue-500">Sign up</a>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, reactive } from 'vue'
  import { signIn } from '@/lib/auth-client'

  import FormInput from '@/components/ui/Input.vue'
  import Button from '@/components/ui/Button.vue'

  const userData = reactive({ email: '', password: '', remember: false })
  const isPending = ref(false)
  const isValid = computed(() => !(!userData.email || !userData.password))

  const getPageRef = () => {
    const params = new URLSearchParams(location.search)
    return params.get('ref') ?? '/'
  }

  const handleLogin = async () => {
    await signIn.email({
      email: userData.email,
      password: userData.password,
      callbackURL: getPageRef(),
      rememberMe: userData.remember,
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

  const handleGoogleLogin = async () => {
    await signIn.social({
      provider: 'google',
      callbackURL: getPageRef(),
      fetchOptions: {
        onError: (ctx) => {
          console.log(ctx.error.message)
        },
      },
    })
  }
</script>
