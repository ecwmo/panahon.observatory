<template>
  <div class="flex flex-col w-full select-none h-screen">
    <NavBar class="z-10" />
    <div class="bg-skin-body-fill text-skin-base flex-1 overflow-y-auto z-0">
      <router-view />
    </div>
    <Footer class="z-10" />
  </div>
</template>
