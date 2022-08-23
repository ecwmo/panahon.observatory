<?php
session_start();
include_once(__DIR__ . '/../start.php');

define('LDAP_URL', $_ENV['LDAP_URL']);
define('LDAP_USER_ATTR', $_ENV['LDAP_USER_ATTR']);
define('LDAP_DC', $_ENV['LDAP_DC']);

define('RES_REPORTS_DIR', LOCAL_PATH_ROOT . '/resources/reports');
