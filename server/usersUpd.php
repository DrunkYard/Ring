<?php
require_once 'connect.php';
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/html; charset=utf-8');

$query = "UPDATE `authors` SET 
                `fullname`='".$_POST["name"]."',
                `passwd`='".md5($_POST["pass"])."',
                `idgroup`='".$_POST["groups"]."'
              WHERE id='".$_POST["id"]."'";

$result =$conn->query($query);
if (!$result) die ("Сбой доступа к базе данных: ".$conn->error());

echo "Изменено !!!";
?>