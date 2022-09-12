<template>
  <div class="flex flex-col w-full select-none" :class="[{ 'h-screen': $route.name === 'index' }]">
    <NavBar class="z-10" />
    <div class="bg-skin-body-fill text-skin-base h-full z-0">
      <router-view />
    </div>
  </div>
</template>
