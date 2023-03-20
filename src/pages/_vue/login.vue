<template>
  <div class="flex py-4 justify-center">
    <div class="flex flex-col bg-skin-body-fill-inv text-skin-inverted shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h3 v-if="auth.isLoggedIn" class="text-xl font-medium">{{ `Hello ${auth.username}!!!` }}</h3>
      <div v-else>
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
            <Button type="submit" class="uppercase font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >Login</Button
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'

  import { login, user } from '@/stores/auth'
  import { activePageURL, route } from '@/stores/routes'

  const userForm = ref({ username: '', password: '' })

  const auth = useStore(user)
  const activeURL = useStore(activePageURL)

  const handleLogin = async () => {
    await login(userForm.value)

    if (auth.value.isLoggedIn) location.href = route(activeURL.value.searchParams.get('ref')?.replace(/^\//, ''))
    else userForm.value = { username: '', password: '' }
  }
</script>
