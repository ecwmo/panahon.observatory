<?php
require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$dotenv->required(['LDAP_URL', 'LDAP_USER_ATTR', 'LDAP_DC']);

date_default_timezone_set('Asia/Manila');

define('LOCAL_PATH_ROOT', __DIR__);
