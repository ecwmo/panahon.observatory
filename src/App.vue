<template>
  <div class="flex flex-col w-full select-none" :class="[{ 'h-screen': $route.name === 'index' }]">
    <NavBar />
    <div class="bg-skin-body-fill text-skin-base h-full">
      <router-view />
    </div>
  </div>
</template>
