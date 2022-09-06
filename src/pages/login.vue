<template>
  <div class="bg-gray-300 border-l border-r border-b border-black flex py-4 justify-center">
    <div class="flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h3 v-if="auth.isLoggedIn" class="text-xl font-medium">{{ `Hello ${auth.user.username}!!!` }}</h3>
      <div v-else>
        <h1 class="p-4 flex justify-center text-3xl font-medium">Login</h1>
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="username" class="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input
              id="username"
              v-model="userForm.username"
              type="text"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="username"
              placeholder="mobservatory"
              required
            />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              id="password"
              v-model="userForm.password"
              type="password"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="password"
              placeholder="************"
              required
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              type="submit"
              name="login"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const route = useRoute()
  const router = useRouter()
  const userForm = ref({ username: '', password: '' })

  const auth = useAuthStore()

  const handleLogin = async () => {
    await auth.login(userForm.value)
    if (auth.isLoggedIn) route?.query?.redirect ? router.push(route?.query?.redirect as string) : router.go(-1)
    else userForm.value = { username: '', password: '' }
  }
</script>
