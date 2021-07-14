<header class="bg-blue-900 pt-1 border border-black md:flex-col flex flex-row justify-between" x-data="{mobileMenuOpen : false}">
    <div class="flex text-xs m-1 mb-2">
        <img alt="Manila Observatory Logo" class="h-12 ml-1" src="/resources/static/logo.png" />
        <p class="md:hidden font-bold text-2xl ml-3 my-auto text-gray-200">Manila Observatory</p>
        <div class="hidden md:inline px-2">
            <p class="font-bold">Manila Observatory</p>
            <p>Ateneo de Manila University Campus</p>
            <p>Loyola Heights, Quezon City, Philippines</p>
        </div>
        <div class="hidden md:inline border-l border-black px-2">
            <p>Tel: (632) 8426-5921 / 8426-0837 / 8426-6495</p>
            <p>Fax: (632) 8426-0847 / 8426-6141</p>
            <p>Email: <a href="mailto:manila@observatory.ph" title="Manila Observatory email address" class="text-gray-200">manila@observatory.ph</a></p>
        </div>
    </div>
    <?php include_once(__DIR__.'/../components/nav.php'); ?>
</header>