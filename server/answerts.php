<?php
    require_once 'connect.php';
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header('Content-Type: text/html; charset=utf-8');

    $query = "SELECT *
              FROM answerts
              LEFT OUTER JOIN points on answerts.point = points.code
              WHERE date >= '".$_POST['dat1']."'
                and date <= '".$_POST['dat2']."'
                GROUP BY point";

//    echo $query;
    $result =$conn->query($query);
    if (!$result) die ("Сбой доступа к базе данных: ".$conn->error());

    $rows = $result->num_rows;
    $arr;
    for ($i = 0; $i < $rows; $i++) {
        $result->data_seek($i);
        $row = $result->fetch_array(MYSQLI_NUM);

        $arr[$i] = [
            "id" => $row[0],
            "date" => '"'.$row[1].'"',
            "time" => $row[2],
            "quest" => $row[3],
            "val" => $row[4],
            "author" => $row[5],
            "point" => $row[6],
            "name" => $row[9]
        ];

        $str = json_encode($arr);
    }

    echo $str;
?>