<template>
  <div>
    <h1 class="p-4 flex justify-center text-3xl font-medium">Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="username" class="block text-sm font-bold mb-2">Username</label>
        <input
          id="username"
          v-model="userForm.username"
          type="text"
          class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          name="username"
          placeholder="mobservatory"
          required
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-sm font-bold mb-2">Password</label>
        <input
          id="password"
          v-model="userForm.password"
          type="password"
          class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          name="password"
          placeholder="************"
          required
        />
      </div>
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'

  import { $user, login } from '@/stores/auth'
  import { activePageURL, route } from '@/stores/routes'

  const userForm = ref({ username: '', password: '' })

  const user = useStore($user)
  const $activeURL = useStore(activePageURL)

  const handleLogin = async () => {
    await login(userForm.value)

    if (user.value.isLoggedIn) location.href = route($activeURL.value.searchParams.get('ref')?.replace(/^\//, ''))
    else userForm.value = { username: '', password: '' }
  }
</script>
