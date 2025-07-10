<template>
  <header>    
    <!-- Constructs navbar found on top of the page -->
    <nav v-if="mode === 'alternate'" id="navbar1" class="flex justify-between items-center bg-white md:new-navbar"> <!-- left half of the navbar -->
      <div class="hidden md:flex flex-col text-white w-full">
        <h1 class="font-trajan text-lg md:text-2xl tracking-3px" v-if="$activeTab.to != '/'">Panahon | {{$activeTab.to.replace('/',"")}}</h1>
        <h1 class="font-trajan text-lg md:text-2xl tracking-3px" v-else>Panahon | Observatory</h1>
        <div class="">
          <a
            v-for="tab in $tabs.filter(({ visible }) => visible ?? true)"
            :key="tab.label"
            :href="tab.to"
            :class="[
                'p-1 md:p-2 text-sm md:text-base font-semibold transition duration-300', 
                isActive(tab.to)
                ?'text-navbar-Active border-b-2 border-navbar-Active'
                :'hover:text-navbar-Active'
            ]"
            @click="open = false"
          >
            {{ tab.label }}
          </a> <!-- Constructs each tab in navbar -->
          <a
            v-if="user.isLoggedIn"
            href="#"
            class="p-1 md:p-2 text-sm md:text-base font-semibold text-navbar-Gray hover:text-navbar-Blue transition duration-300"
            @click.prevent="handleLogout"
          >Logout</a>
        </div>
      </div>
      <div class="flex flex-row-reverse justify-between items-center w-full"> <!-- constructs the right half of the navbar -->
        <div class="flex items-center">
          <div class="flex flex-col">
            <span class="font-trajan text-mo-Blue text-lg text-sm md:text-2xl md:tracking-5px md:ml-10 mr-2">Manila Observatory</span>
            <h1 class="font-semibold text-xs md:text-base text-navbar-Subtitle shadow md:mr-6 hidden md:flex">Committed to a scientific culture for sustainable development</h1>
          </div>
          <img :src="route('resources/static/img/logo/mo.png')" alt="Logo" class="h-12 w-12 md:h-35 md:w-35 mr-2 mt-1 mb-1 md:m-0" >
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
          > <!-- handles drop down hamburger logic -->
            <a
              v-for="tab in $tabs.filter(({ visible }) => visible ?? true)"
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
              v-if="user.isLoggedIn"
              href="#"
              class="p-1 md:p-2 text-sm md:text-base font-semibold text-gray-500 hover:text-blue-500 transition duration-300"
              @click.prevent="handleLogout"
              >Logout</a
            >
          </div>
        </div>
      </div>
    </nav>

    <!-- Other navbar design -->
    <div v-else-if="mode === 'default'">
      <nav id="navbar2" class="flex justify-between items-center bg-white shadow-lg px-2 md:px-6 py-2"> <!-- left half of the navbar -->
        <div class="flex flex-row-reverse justify-between items-center w-full"> <!-- constructs the right half of the navbar -->
          <div class="flex items-center">
            <div class="flex flex-col">
              <span class="font-trajan text-mo-Blue text-lg text-sm md:text-2xl md:tracking-5px md:ml-10 mr-2">Manila Observatory</span>
              <h1 class="font-semibold text-xs md:text-base text-navbar-Subtitle shadow md:mr-6 hidden md:flex">Committed to a scientific culture for sustainable development</h1>
            </div>
            <img :src="route('resources/static/img/logo/mo.png')" alt="Logo" class="h-12 w-12 md:h-35 md:w-35 mr-2 mt-1 mb-1 md:m-0" >
          </div>
        </div>
      </nav>
      <nav id="navbar2-sub" class="bg-mo-Blue flex">
        <div class="flex justify-center w-full mb-1 mt-1">
          <div class="flex justify-between items-center w-3/4">
            <a
              v-for="tab in $tabs.filter(({ visible }) => visible ?? true)"
              :key="tab.label"
              :href="tab.to"
              :class="[
                  'text-center p-1 md:p-2 text-sm md:text-base font-semibold transition duration-300', 
                  isActive(tab.to)
                  ?'text-navbar-Active border-b-2 border-navbar-Active'
                  :'hover:text-navbar-Active text-white'
              ]"
              @click="open = false"
            >
              {{ tab.label }}
            </a> <!-- Constructs each tab in navbar -->
            <a
              v-if="user.isLoggedIn"
              href="#"
              class="p-1 md:p-2 text-sm md:text-base font-semibold text-white hover:text-navbar-Blue transition duration-300"
              @click.prevent="handleLogout"
            >Logout</a>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'
  import { ref } from 'vue'

  import { $user, logout } from '@/stores/auth'
  import { activePage, pages, route, basePath } from '@/stores/routes'

  const user = useStore($user)
  const $tabs = useStore(pages)
  const $activeTab = useStore(activePage)

  const open = ref(false)

  const toggle = () => (open.value = !open.value)

  const handleLogout = async () => {
    await logout()
    if ($activeTab.value.to === route('report/upload')) location.href = route('login')
  }

  const isActive = (pathName: string) => { //made activeTabPath dynamic
    const activeTabPath = basePath + $activeTab.value.to
    return pathName === activeTabPath //compare relative paths
  }

  const toggleNavbars = () => { //function for toggleNavbars button
    const newNav = document.getElementById("navbar1");
    const oldNav = document.getElementById("navbar2");
    const oldNavSub = document.getElementById("navbar2-sub");

    if (newNav.style.display === "flex") {
      newNav.style.display = "none";
      oldNav.style.display = "flex";
      oldNavSub.style.display = "flex";
    } else {
      newNav.style.display = "flex";
      oldNav.style.display = "none";
      oldNavSub.style.display = "none";
    }
  }

  const { mode = 'default' } = defineProps<{ //takes in mode prop from defaultLayout
    mode?: string
  }>()


</script>

<!-- import custom MO font -->
<style scoped>
  .router-link-active {
    @apply text-gray-900 border-b-2 border-gray-900;
  }

  @font-face { 
    font-family: Trajan;
    src: url("/resources/static/font/trajan-pro/TrajanPro-Bold.otf");
  }

  .font-trajan {
    font-family: 'Trajan',serif;
  }
</style>