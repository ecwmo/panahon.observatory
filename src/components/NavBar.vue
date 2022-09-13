<template>
  <header>
    <!-- Navbar goes here -->
    <nav class="flex flex-wrap justify-between items-center bg-skin-header-fill shadow-lg px-2 md:px-6 py-2">
      <div class="flex items-center flex-no-shrink mr-6">
        <img src="/resources/static/img/logo/mo.png" alt="Logo" class="h-8 w-8 md:h-10 md:w-10 mr-2" />
        <span class="font-semibold text-gray-900 text-lg md:text-2xl">Manila Observatory</span>
      </div>
      <div class="flex md:hidden">
        <button
          class="flex items-center px-3 py-2 border rounded hover:text-white hover:border-white hover:bg-black"
          @click="toggle"
        >
          <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div :class="open ? 'relative w-full' : 'hidden'" class="md:flex">
        <div
          class="flex flex-col flex-grow items-center md:flex-row md:justify-end"
          :class="open ? 'absolute right-0 bg-white shadow-lg' : ''"
        >
          <router-link
            v-for="tab in tabs"
            :key="tab.label"
            :to="tab.to"
            class="p-2 font-semibold text-skin-header-link hover:text-skin-header-link-accent transition duration-300"
            @click="open = false"
            >{{ tab.label }}</router-link
          >
          <a
            v-if="auth.isLoggedIn"
            href="#"
            class="p-2 font-semibold text-skin-header-link hover:text-skin-header-link-accent transition duration-300"
            @click.prevent="handleLogout"
            >Logout</a
          >
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()

  const open = ref(false)

  const tabs = [
    {
      name: 'index',
      description: 'Latest Summaries - Weather Conditions and Maps',
      label: 'Quick View',
      to: '/',
    },
    { name: 'models', description: 'Model Results - Forecasts and Maps', label: 'Models', to: '/models' },
    { name: 'climate', description: 'Philippine Climate Information', label: 'Climate', to: '/climate' },
    { name: 'report', description: 'Tropical Cyclone Report', label: 'Reports', to: '/report' },
    // { name: 'faq', description: 'Frequently Asked Questions', label: 'FAQ', to: '/faq' },
  ]

  const toggle = () => (open.value = !open.value)

  const handleLogout = async () => {
    await auth.logout()
    if (route.name === 'NewReport') router.push('/login')
  }
</script>

<style scoped>
  .router-link-active {
    @apply text-skin-header-link-active border-b-2 border-gray-900;
  }
</style>
