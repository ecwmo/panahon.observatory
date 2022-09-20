<template>
  <div class="fixed inset-0 bg-skin-body-fill/30" aria-hidden="true" />
  <div class="flex justify-center items-center">
    <div class="max-w-screen-2xl flex flex-col w-full select-none h-screen">
      <NavBar class="z-10" />
      <div class="bg-skin-body-fill text-skin-base flex-1 overflow-y-auto z-0">
        <router-view />
      </div>
      <Footer class="z-10" />
    </div>
  </div>
</template>
