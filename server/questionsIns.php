<?php
    require_once 'connect.php';
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header('Content-Type: text/html; charset=utf-8');

    $query = "INSERT INTO `questions`(`num`, `question`, `season`, `status`)
          VALUES ('".$_POST['num']."',
            '".$_POST['text']."',
            '".$_POST['season']."',
            '1')";

//    echo $query;
    $result =$conn->query($query);
    if (!$result) die ("Сбой доступа к базе данных: ".$conn->error());

    echo "Добавлено !!!";
?>