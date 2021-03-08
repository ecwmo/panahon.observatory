<?php

session_start();

unset($_SESSION['valid']);
unset($_SESSION['timeout']);
unset($_SESSION['username']);

echo "Logout success";

?>