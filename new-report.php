<!doctype html>
<html lang="en">
<?php include_once('./components/head.php'); ?>

<?php
    include_once('./lib/upload-report.php');
    include_once('./lib/publish-report.php');

    if (!isset($_SESSION['username'])) { //if login in session is not set
        header("Location: /auth/login.php?prev=/new-report.php");
    }
?>

<body class="bg-gray-600 w-full md:w-4/5 mx-auto">
  <?php include_once('./components/header.php'); ?>
  <div class="bg-gray-300 border-l border-r border-b border-black flex py-4 justify-center" x-data="newReport()">
    <div class="flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <?php if (array_key_exists('published', $_GET)) { ?>
      <h4 class="p-4 flex justify-center text-3xl font-medium">Publish success!</h4>
      <p class="p-1 mb-3">Click <a href="/reports.php"
          class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">here</a></p>
      <?php } elseif (array_key_exists('uploaded', $_GET)) { ?>
      <h4 class="p-4 flex justify-center text-3xl font-medium">Upload success!</h4>
      <p class="p-1 mb-3">Preview the document <a href="/reports.php?view=draft" target="_blank"
          class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">here</a></p>
      <form
        action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>"
        method="post" enctype="multipart/form-data">
        <div class="flex items-center justify-between">
          <button type="submit" name="publish"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Publish
          </button>
        </div>
      </form>
      <?php } else { ?>
      <h1 class="p-4 flex justify-center text-3xl font-medium">Report Upload</h1>
      <form
        action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>"
        method="post" enctype="multipart/form-data">
        <div class="mb-4">
          <label for="tccode" class="block text-gray-700 text-sm font-bold mb-2">TC Code</label>
          <input type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="tccode" name="tccode" placeholder="wp<CY><YYYY>" required />
        </div>

        <div class="mb-4">
          <label for="reportnum" class="block text-gray-700 text-sm font-bold mb-2">Report Number</label>
          <input type="number"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="reportnum" name="reportnum" placeholder="1" required />
        </div>

        <div class="mb-4">
          <span>Attachments</span>
          <label
            class="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue-500 appearance-none border rounded-lg shadow tracking-wide uppercase cursor-pointer hover:bg-blue-500 hover:text-white">
            <i class="fas fa-cloud-upload-alt fa-2x"></i>
            <span class="mt-2 text-base truncate"
              x-text="fileName ? fileName.replace(/^.*[\\\/]/, '') : 'Select a file'"></span>
            <input type="file" name="report" class="hidden" x-model="fileName" required />
          </label>
        </div>

        <div class="flex items-center justify-between">
          <button type="submit" name="upload"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Upload
          </button>
        </div>
      </form>
      <?php } ?>
    </div>
</body>

</html>
