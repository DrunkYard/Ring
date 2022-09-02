<?php
    require_once 'connect.php';
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header('Content-Type: text/html; charset=utf-8');

    $query = "INSERT INTO `authors`(`fullname`, `passwd`, `idgroup`, `status`)
      VALUES ('".$_POST['name']."',
        '".md5($_POST['pass'])."',
        '".$_POST['groups']."',
        '1')";

    $result =$conn->query($query);
    if (!$result) die ("Сбой доступа к базе данных: ".$conn->error());

    echo "Добавлено !!!";
?>