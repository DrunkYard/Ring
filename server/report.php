<?php
    require_once 'connect.php';
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header('Content-Type: text/html; charset=utf-8');

    $query = "SELECT answerts.quest, questions.question, answerts.val,
                      points.name, authors.fullname
                  FROM answerts
                  LEFT OUTER JOIN points on answerts.point = points.code
                  LEFT OUTER JOIN authors on answerts.author = authors.id
                  LEFT OUTER JOIN questions on answerts.quest = questions.num
                  WHERE date = '".$_POST['date']."'
                    and time = '".$_POST['time']."'
                    and point = '".$_POST['point']."'
                  ORDER BY answerts.quest";

    $result =$conn->query($query);
    if (!$result) die ("Сбой доступа к базе данных: ".$conn->error());

    $rows = $result->num_rows;
    $arr;
    for ($i = 0; $i < $rows; $i++) {
        $result->data_seek($i);
        $row = $result->fetch_array(MYSQLI_NUM);

        $arr[$i] = [
            "quest" => $row[0],
            "question" => '"'.$row[1].'"',
            "value" => $row[2],
            "point" => $row[3],
            "author" => $row[4]
        ];

        $str = json_encode($arr);
    }

    echo $str;
?>