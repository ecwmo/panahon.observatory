<!doctype html>
<html lang="en">
<?php include_once(__DIR__.'/../components/head.php'); ?>

<?php
    $loginError = false;
    if(isset($_POST['login'])) {
        $ldap = ldap_connect(LDAP_URL);
        $username = $_POST['username'];
        $password = $_POST['password'];
    
        $auth_user=LDAP_USER_ATTR."=".$username.",".LDAP_DC;
    
        ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($ldap, LDAP_OPT_REFERRALS, 0);
    
        $bind = @ldap_bind($ldap, $auth_user, $password);   
    
        if ($bind) {
            $_SESSION['valid'] = true;
            $_SESSION['timeout'] = time();
            $_SESSION['username'] = $username;
            @ldap_close($ldap);
        } else {
            $loginError = true;
        }
    }
?>

<body class="bg-gray-600 w-full md:w-4/5 mx-auto">
    <?php include_once(__DIR__.'/../components/header.php'); ?>
    <div class="bg-gray-300 border-l border-r border-b border-black flex py-4 justify-center">
        <div class="flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <?php if ($_SESSION["username"]) { ?>
            <h3 class="text-xl font-medium">Hello <?php echo $_SESSION["username"]; ?>!!!</h3>
            <?php } else { ?>
            <h1 class="p-4 flex justify-center text-3xl font-medium">Login</h1>
            <form action="" method="post">
                <div class="mb-4">
                    <label for="username" class="block text-gray-700 text-sm font-bold mb-2">Username</label>
                    <input 
                        type="text" 
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        name="username" id="username" placeholder="mobservatory" required/>
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input
                        type="password" 
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        name="password" id="password" placeholder="************" required/>
                </div>
                <div class="flex items-center justify-between">
                    <button 
                        type="submit"
                        name="login"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Login
                    </button>
                </div>
            </form>
            <?php } ?>

            <?php if ($loginError) { ?>
            <div class="flex justify-center bg-red-200 my-4 rounded">
                <div class="m-2">
                    <h4 class="text-lg">Login error</h4>
                    <p></p>
                </div>
            </div>
            <?php } ?>
        </div>
    </div>

    <!-- Main Script -->
    <script src="/dist/main.js" type="text/javascript"></script>
</body>

</html>
