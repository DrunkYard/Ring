<?php
    require_once 'connect.php';
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header('Content-Type: text/html; charset=utf-8');

    $query = "SELECT *
                  FROM authors
                  WHERE status = '1'";

    $result =$conn->query($query);
    if (!$result) die ("Сбой доступа к базе данных: ".$conn->error());

    $rows = $result->num_rows;

    $resp;

    for ($i = 0; $i < $rows; $i++) {
        $result->data_seek($i);
        $row = $result->fetch_array(MYSQLI_NUM);

        if (($_POST["user"] == $row[1]) && (md5($_POST["pass"]) == $row[2])) {
            $resp = [
                "id" => $row[0],
                "name" => $row[1],
                "password" => md5($row[2]),
                "group" => $row[3],
                "status" => $row[4]
            ];

            $str = json_encode($resp);
            break;
        } else {
            $resp = [
                "id" => "",
                "name" => "",
                "password" => "",
                "group" => 0,
                "status" => ""
            ];

            $str = json_encode($resp);
        }
    }

    echo $str;
?>