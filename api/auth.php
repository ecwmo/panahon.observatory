<?php
include_once(__DIR__.'/../start.php');

header('Content-Type: application/json');

if (isset($_POST['login'])) {
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

        $res = array("message"=>"success", "type"=>"login");
    } else {
        $res = array("message"=>"fail", "type"=>"login");
    }
    echo json_encode($res);
} elseif (isset($_POST['logout'])) {
    unset($_SESSION['valid']);
    unset($_SESSION['timeout']);
    unset($_SESSION['username']);

    $res = array("message"=>"success", "type"=>"logout");
    echo json_encode($res);
} else {
    if (isset($_SESSION['username'])) { //if login in session is not set
        echo json_encode($_SESSION);
    }
}
