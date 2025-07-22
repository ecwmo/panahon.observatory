<template>
  <header>
    <!-- Constructs navbar found on top of the page -->
    <nav
      v-if="mode === 'alternate'"
      id="navbar1"
      class="flex justify-between items-center bg-white md:new-navbar p-3 md:p-2"
    >
      <!-- left half of the navbar -->
      <div class="hidden md:flex flex-col text-white items-center">
        <h1 class="font-trajan text-xl md:text-3xl tracking-3px">Panahon</h1>
        <div>
          <a
            v-for="tab in pages.filter(({ visible }) => visible ?? true)"
            :key="tab.label"
            :href="tab.to"
            :class="[
              'p-1 md:p-2 text-sm md:text-base font-semibold transition duration-300',
              isActive(tab.to) ? 'text-navbar-Active border-b-2 border-navbar-Active' : 'hover:text-navbar-Active',
            ]"
            @click="open = false"
          >
            {{ tab.label }}
          </a>
          <!-- Constructs each tab in navbar -->
          <a
            v-if="userSession.data"
            href="#"
            class="p-1 md:p-2 text-sm md:text-base font-semibold text-navbar-Gray hover:text-navbar-Blue transition duration-300"
            @click.prevent="handleLogout"
            >Logout</a
          >
        </div>
      </div>
      <div class="relative flex flex-row-reverse justify-between items-center w-full md:w-auto">
        <!-- constructs the right half of the navbar -->
        <div class="flex items-center space-x-2 md:space-x-4">
          <div class="hidden md:flex md:flex-col justify-between items-center">
            <h1 class="font-trajan text-mo-Blue text-sm md:text-xl md:tracking-widest md:font-semibold">
              Manila Observatory
            </h1>
            <h3 class="text-navbar-Subtitle hidden md:flex md:text-xs">
              Committed to a scientific culture for sustainable development
            </h3>
          </div>
          <h1 class="flex md:hidden font-trajan text-mo-Blue">Panahon | MO</h1>
          <img src="/resources/static/img/logo/mo.png" alt="Logo" class="h-8 w-8 md:h-12 md:w-12" />
        </div>
        <div class="flex md:hidden">
          <button
            class="flex items-center px-3 py-2 border rounded hover:text-white hover:border-white hover:bg-black ml-2"
            @click="toggle"
          >
            <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div :class="open ? 'absolute w-full' : 'hidden'" class="md:flex">
          <div
            class="flex flex-col items-center md:flex-row md:justify-end"
            :class="open ? 'absolute left-0 mt-5 w-max bg-white shadow-lg z-50 md:hidden' : ''"
          >
            <!-- handles drop down hamburger logic -->
            <a
              v-for="tab in pages.filter(({ visible }) => visible ?? true)"
              :key="tab.label"
              :href="tab.to"
              :class="[
                {
                  'text-gray-900 border-b-2 border-gray-900 md-hidden': isActive(tab.to),
                },
              ]"
              class="md:hidden p-1 md:p-2 text-sm md:text-base font-semibold text-gray-500 hover:text-blue-500 transition duration-300 active:text-gray-900 active:border-b-2 active:border-gray-900"
              @click="open = false"
            >
              {{ tab.label }}
            </a>
            <a
              v-if="userSession.data"
              href="#"
              class="p-1 md:p-2 text-sm md:text-base font-semibold text-gray-500 hover:text-blue-500 transition duration-300"
              @click.prevent="handleLogout"
              >Logout</a
            >
          </div>
        </div>
      </div>
    </nav>

    <!-- default navbar design -->
    <nav v-else id="navbar2" class="flex flex-col justify-between items-center bg-white shadow-lg">
      <!-- header -->
      <div class="flex justify-between items-center w-full px-2 md:px-6 py-2">
        <h1 class="font-trajan text-mo-Blue flex md:text-4xl md:tracking-wider md:font-semibold">
          Panahon<span class="flex md:hidden">&nbsp;| MO</span>
        </h1>
        <div class="flex justify-between items-center">
          <!-- constructs the right half of the navbar -->
          <div class="flex items-center space-x-2 md:space-x-4">
            <div class="hidden md:flex flex-col justify-between items-center">
              <h1 class="font-trajan text-mo-Blue text-sm md:text-xl md:tracking-widest md:font-semibold">
                Manila Observatory
              </h1>
              <h3 class="text-navbar-Subtitle hidden md:flex md:text-xs">
                Committed to a scientific culture for sustainable development
              </h3>
            </div>
            <img src="/resources/static/img/logo/mo.png" alt="Logo" class="h-8 w-8 md:h-12 md:w-12" />
          </div>
        </div>
      </div>
      <!-- menu -->
      <div class="bg-mo-Blue flex justify-center w-full py-1">
        <div class="flex justify-between items-center w-8/9 md:w-3/4">
          <a
            v-for="tab in pages.filter(({ visible }) => visible ?? true)"
            :key="tab.label"
            :href="tab.to"
            :class="[
              'text-center text-sm md:text-base font-semibold transition duration-300',
              isActive(tab.to)
                ? 'text-navbar-Active border-b-2 border-navbar-Active'
                : 'hover:text-navbar-Active text-white',
            ]"
            @click="open = false"
          >
            {{ tab.label }}
          </a>
          <a
            v-if="userSession"
            href="#"
            class="text-center text-sm md:text-base font-semibold text-white hover:text-navbar-Active transition duration-300"
            @click.prevent="handleLogout"
            >Logout</a
          >
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'
  import { ref } from 'vue'
  import { useSession, signOut } from '@/lib/auth-client'

  import { $activePage, pages } from '@/stores/routes'

  withDefaults(
    defineProps<{
      mode?: string
    }>(),
    { mode: 'default' },
  )

  const userSession = useSession()

  const activeTab = useStore($activePage)

  const open = ref(false)

  const toggle = () => (open.value = !open.value)

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          if (activeTab.value.auth) location.href = location.origin + `/login?ref=${activeTab.value.to}`
        },
      },
    })
  }

  const isActive = (pathName: string) => {
    const activeTabPath = activeTab.value?.to ?? '/'
    return pathName === activeTabPath
  }
</script>

<!-- import custom MO font -->
<style scoped>
  @font-face {
    font-family: Trajan;
    src: url('/resources/static/font/trajan-pro/TrajanPro-Bold.otf');
  }

  .font-trajan {
    font-family: 'Trajan', serif;
  }
</style>
