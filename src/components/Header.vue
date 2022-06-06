<template>
  <header
    class="bg-blue-900 pt-1 border border-black md:flex-col flex flex-row justify-between shadow-lg text-gray-200"
  >
    <div class="flex text-xs m-1 mb-2">
      <RouterLink to="/" class="flex">
        <img
          alt="Manila Observatory Logo"
          class="w-9 h-9 md:w-12 md:h-12 ml-1"
          src="/resources/static/img/logo/android-chrome-192x192.png"
        />
        <p class="md:hidden font-bold text-2xl ml-3 my-auto">Manila Observatory</p>
      </RouterLink>
      <div class="hidden md:inline px-2">
        <p class="font-bold">Manila Observatory</p>
        <p>Ateneo de Manila University Campus</p>
        <p>Loyola Heights, Quezon City, Philippines</p>
      </div>
      <div class="hidden md:inline border-l border-black px-2">
        <br />
        <p>Tel: (632) 8426-5921</p>
        <p>
          Email:
          <a href="mailto:manila@observatory.ph" title="Manila Observatory email address" class="hover:text-blue-400"
            >manila@observatory.ph</a
          >
        </p>
      </div>
    </div>
    <Navbar />
  </header>
</template>
