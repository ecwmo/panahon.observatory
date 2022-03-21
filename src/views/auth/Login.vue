<template>
  <div class="bg-gray-300 border-l border-r border-b border-black flex py-4 justify-center">
    <div class="flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h3 v-show="isLoggedIn" class="text-xl font-medium">{{ `Hello ${loggedInUser}!!!` }}</h3>
      <h1 v-show="!isLoggedIn" class="p-4 flex justify-center text-3xl font-medium">Login</h1>
      <form v-show="!isLoggedIn" @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="username" class="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <input
            v-model="user.username"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="username"
            id="username"
            placeholder="mobservatory"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            v-model="user.password"
            type="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="password"
            id="password"
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
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { User } from '@/services/auth.service'
  import useAuth from '@/composables/useAuth'

  export default defineComponent({
    setup() {
      const router = useRouter()
      const user = ref(<User>{})

      const { loggedInUser, isLoggedIn, login } = useAuth()

      const handleLogin = async () => {
        const res = await login(user.value)
        if (res.hasOwnProperty('username')) router.go(-1)
      }

      return { user, handleLogin, isLoggedIn, loggedInUser }
    },
  })
</script>
