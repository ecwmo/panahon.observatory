<?php
  require __DIR__ . '/vendor/autoload.php';

  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
  $dotenv->load();

  define('LDAP_URL', 'ldap://10.8.7.10');
  define('LDAP_USER_ATTR', 'uid');
  define('LDAP_DC', 'ou=people,dc=observatory,dc=ph');

  define('LOCAL_PATH_ROOT', __DIR__);

  define('RES_REPORTS_DIR', LOCAL_PATH_ROOT.'/resources/reports');
