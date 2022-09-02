<?php
    require_once 'connect.php';
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header('Content-Type: text/html; charset=utf-8');

    $query = "SELECT *
			  FROM `authors`
			  LEFT OUTER JOIN `group` on `authors`.idgroup = `group`.id
			  WHERE status = '1'";

//    echo $query;
    $result =$conn->query($query);
    if (!$result) die ("Сбой доступа к базе данных: ".$conn->error());

    $rows = $result->num_rows;

    for ($i = 0; $i < $rows; $i++) {
        $result->data_seek($i);
        $row = $result->fetch_array(MYSQLI_NUM);

        $arr[$i] = [
            "id" => $row[0],
            "name" => $row[1],
            "password" => $row[2],
            "group" => $row[3],
            "status" => $row[4],
            "group_name" => $row[6]
        ];

        $str = json_encode($arr);
    }

    echo $str;
?>