<template> <!-- creates the fake cards that appear when loading the site -->
  <div
    class="relative flex flex-col justify-center cursor-pointer py-1.5 md:py-3 px-1 md:px-2 h-32 w-52 md:w-60 bg-card-defaultBg"
  >
    <div class="flex justify-evenly items-center animate-pulse">
      <div class="h-8 w-8 md:h-10 md:w-10 bg-card-fake rounded"></div>
      <div class="flex flex-col space-y-2">
        <div class="h-3 md:h-4 w-18 bg-card-fake rounded"></div>
        <div class="flex justify-evenly space-x-1">
          <div class="h-3 md:h-4 w-12 bg-card-fake rounded"></div>
          <div class="h-6 md:h-8 w-8 bg-card-fake rounded"></div>
        </div>
        <div class="flex justify-evenly space-x-1">
          <div class="h-2 md:h-3 w-12 bg-card-fake rounded"></div>
          <div class="h-3 md:h-4 w-8 bg-card-fake rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>
