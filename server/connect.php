<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $hn = 'localhost';
    $db = 'total';
    $un = 'user';
    $pw = 'pass';

    $conn = new mysqli($hn, $un, $pw, $db);

    if($conn->connect_error) die ($conn->connect_error);
    $conn->set_charset('utf8');