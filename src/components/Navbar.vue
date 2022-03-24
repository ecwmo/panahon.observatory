<template>
  <nav class="flex justify-between md:w-full flex-wrap md:flex-no-wrap">
    <div class="flex justify-end items-center w-full">
      <button
        @click.prevent="mobileMenuOpen = !mobileMenuOpen"
        class="md:hidden my-auto mr-2 w-8 h-8 bg-gray-200 text-gray-600 p-1"
      >
        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>

    <div
      class="absolute right-0 top-16 md:top-0 md:relative border border-b-0 md:border-l-0 md:border-r-0 border-black md:flex flex-col md:flex-row md:w-full justify-between bg-blue-900"
      :class="{ hidden: !mobileMenuOpen }"
    >
      <ul class="md:flex flex-col md:flex-row">
        <router-link
          v-for="p in lPages"
          :key="p.name"
          :to="p.to"
          :class="{ 'text-gray-100 bg-blue-600': activePage === p.name }"
          class="py-1 px-2 border-b md:border-r md:border-b-0 border-black text-gray-300 uppercase hover:text-gray-100 hover:bg-blue-600"
        >
          {{ p.label }}
        </router-link>
      </ul>
      <ul class="md:flex flex-col md:flex-row border-t md:border-t-0 md:border-l-0 border-black">
        <a
          v-show="isLoggedIn"
          @click.prevent="handleLogout"
          href="#"
          class="py-1 px-2 border-b md:border-l md:border-b-0 border-black text-gray-300 uppercase hover:text-gray-100 hover:bg-blue-600"
          >Logout</a
        >
        <router-link
          v-for="p in rPages"
          :key="p.name"
          :to="p.to"
          :class="{ 'text-gray-100 bg-blue-600': activePage === p.name }"
          class="py-1 px-2 border-b md:border-l md:border-b-0 border-black text-gray-300 uppercase hover:text-gray-100 hover:bg-blue-600"
        >
          {{ p.label }}
        </router-link>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import useAuth from '@/composables/useAuth'

  export default defineComponent({
    setup() {
      const route = useRoute()
      const router = useRouter()
      const mobileMenuOpen = ref(false)

      const { isLoggedIn, logout } = useAuth()

      const lPages = [
        {
          name: 'index',
          description: 'Latest Summaries - Weather Conditions and Maps',
          label: 'Quick View',
          to: '/',
        },
        { name: 'models', description: 'Model Results - Forecasts and Maps', label: 'Models', to: '/models' },
        { name: 'climate', description: 'Philippine Climate Information', label: 'Climate', to: '/climate' },
        { name: 'report', description: 'Tropical Cyclone Report', label: 'Reports', to: '/report' },
      ]

      const rPages = [{ name: 'faq', description: 'Frequently Asked Questions', label: 'FAQ', to: '/faq' }]

      const handleLogout = async () => {
        await logout()
        if (route.name === 'NewReport') router.push('/login')
      }

      const activePage = computed(() => {
        const page = route.path.substring(1)
        return page === '' ? 'index' : page
      })

      return { mobileMenuOpen, activePage, lPages, rPages, isLoggedIn, handleLogout }
    },
  })
</script>
