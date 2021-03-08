<?php

session_start();

if(isset($_POST['username']) && isset($_POST['password'])) {

    $ldapDomain = "observatory.ph"; // name = domain
    $ldapURL = "ldap://pawikan.observatory.ph";

    $ldap = ldap_connect($ldapURL);
    $username = $_POST['username'];
    $password = $_POST['password'];

    $auth_user="uid=".$username.",ou=people,dc=observatory,dc=ph";


    ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
    ldap_set_option($ldap, LDAP_OPT_REFERRALS, 0);

    $bind = @ldap_bind($ldap, $auth_user, $password);


    if ($bind) {
        // $filter="(uid=$username)";
        // $result = ldap_search($ldap,"ou=people,dc=observatory,dc=ph",$filter);
        // // echo $result;
        // ldap_sort($ldap,$result,"sn");
        // $info = ldap_get_entries($ldap, $result);
        // for ($i=0; $i<$info["count"]; $i++)
        // {
        //     if($info['count'] > 1)
        //         break;
        //     echo "<p>You are accessing <strong> ". $info[$i]["sn"][0] .", " . $info[$i]["givenname"][0] ."</strong><br /> (" . $info[$i]["samaccountname"][0] .")</p>\n";
        //     echo '<pre>';
        //     var_dump($info);
        //     echo '</pre>';
        //     $userDn = $info[$i]["distinguishedname"][0]; 
        // }
        $_SESSION['valid'] = true;
        $_SESSION['timeout'] = time();
        $_SESSION['username'] = $username;
        echo $username;
        @ldap_close($ldap);
    } else {
        $msg = "Invalid email address / password";
        header('HTTP/1.1 500 Internal Server Error');
        header('Content-Type: application/json; charset=UTF-8');
        die(json_encode(array('message' => $msg)));
    }

}

?>