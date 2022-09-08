<template>
  <div class="flex flex-col" :class="[{ 'h-screen': $route.name === 'index' }]">
    <Header></Header>
    <div class="bg-skin-body-fill h-full">
      <router-view />
    </div>
  </div>
</template>
