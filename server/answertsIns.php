<?php
    require_once 'connect.php';
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header('Content-Type: text/html; charset=utf-8');

    $conn->set_charset('utf8');

    $query = "INSERT INTO answerts(date, time, quest, val, author, point)
                  VALUES ('".$_POST['date']."', '".$_POST['time']."', '".
                            $_POST['num']."', '".$_POST['ans']."', '".$_POST['auth'].
                            "', '".$_POST['point']."')";

//    echo $query;
    $result =$conn->query($query);
    if (!$result) die ("Сбой доступа к базе данных: ".$conn->error());

    echo "success";
?>