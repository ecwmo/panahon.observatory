<template>
  <div class="h-screen -mt-14 flex flex-col justify-center items-center text-center">
    <i class="text-8xl fas fa-triangle-exclamation"></i>
    <span class="text-4xl font-medium">Page not found</span>
    <span class="p-4 text-lg">we are sorry, but the page you requested was not found</span>
    <router-link
      to="/"
      class="bg-skin-button hover:bg-skin-button-accent text-skin-button hover:text-skin-button-accent uppercase px-3 py-2 rounded-lg shadow-lg"
      >Go to Home</router-link
    >
  </div>
</template>
