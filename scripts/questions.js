if ((getCookie("Season") >= 4) && (getCookie("Season") <= 10)) {
    $('title').html("Летний опрос");
}

var str1 = document.referrer.split('/');

if (str1[3] == "Ring") {
    $(".container").append(
        '<div class="row">'+
            '<div class="col-md-2 col-lg-2"></div>'+
            '<div class="col-xs-12 col-sm-12 col-md-8 col-lg-8"'+
                'id="question">'+

            '</div>'+
            '<div class="col-md-2 col-lg-2"></div>'+
        '</div>'+
        '<div class="row">'+
            '<div class="col-md-2 col-lg-2"></div>'+
            '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">'+
                '<button type="button" class="btn btn-danger btn-lg"'+
                        'onclick="nextQstNo(this)" id="No">Нет</button>'+
            '</div>'+
            '<div class="col-xs-5 col-sm-5 col-md-4 col-lg-4">'+
                '<button type="button"'+
                        'class="btn btn-info btn-lg"'+
                        'onclick="nextQstSkip(this)" id="Skip">Пропустить</button>'+
            '</div>'+
            '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">'+
                '<button type="button" class="btn btn-success btn-lg"'+
                        'onclick="nextQstYes(this)" id="Yes">Да</button>'+
        '</div>'+
        '<div class="col-md-4 col-lg-4"></div>'+


        '<div class="row">'+
            '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'+
                '<div class="label"><br><br></div>'+
            '</div>'+
        '</div>'+

        '<nav class="navbar navbar-default navbar-fixed-bottom">'+
            '<div class="container">'+
                '<div class="row">'+
                    '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="navigate">'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</nav>'+

        '<div class="row">'+
            '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'+
                '<div class="label"><br><br></div>'+
            '</div>'+
        '</div>'+

        '<div class="row">'+
            '<div class="col-md-2 col-lg-2"></div>'+
            '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"></div>'+
            '<div class="col-xs-5 col-sm-5 col-md-4 col-lg-4">'+
                '<button type="button"'+
                        'class="btn btn-success btn-lg"'+
                        'onclick="result(this)" id="send">Отправить</button>'+
            '</div>'+
        '</div>'
        );

    var count = 0;
    var answ = new Array();

    if (answ.length != getCookie("Count"))
        $('#send').attr('disabled', 'true');

    $.ajax({
        type: "POST",
        url: "server/questions.php",
        success: function(data){
            var qst = JSON.parse(data);
            document.cookie = "Count="+(qst.length + 1);

            $("#question").html("<h2>" + qst[count].num + ". " + qst[count].text + " ?</h2>");

            for (i = 0; i < qst.length; i++) {
                $("#navigate").append('<button type="button" ' +
                    'class="movebtn btn btn-default btn-lg" id="' + qst[i].num +
                    '" onclick="move(this.innerHTML)">' +
                    qst[i].num + '</button>');
            }
        }
    });
} else {
    window.location.href = "404.htm";
}

function EnDis() {
    array = answ.filter(function(el) {
        return el != null;
    })

    if (array.length == (getCookie("Count") - 1)) {
        $('#send').removeAttr('disabled');
    } else {
        $('#send').attr('disabled', 'true');
    }
}

function move(str) {
    for (i = 0; i < $('.movebtn').length + 1; i++) {
        $("#" + i).html(i);
    }

    $.ajax({
        type: "POST",
        url: "server/questions.php",
        success: function (data) {
            var qst = JSON.parse(data);
            for (i = 0; i < qst.length; i++)
                if (qst[i].num == str) {
                    $("#question").html("<h2>" +
                        qst[i].num + ". " +
                        qst[i].text + " ?</h2>");
                    count = i;
                    break;
                }
            EnDis(count);
        }
    });
}

function nextQstYes() {
    if (count <= (getCookie("Count") - 2)) {
        n = $('#question h2').html().split(".")[0];
        $('#' + n).attr('class', 'movebtn btn btn-success btn-lg');

        answ[n] = {
            "date": getCookie("Date"),
            "time": getCookie("Time"),
            "num": $('#question h2').html().split(".")[0],
            "ans": 1,
            "auth": getCookie("User"),
            "point": getCookie("Point")
        }

        count++;

        $.ajax({
            type: "POST",
            url: "server/questions.php",
            success: function (data) {
                var qst = JSON.parse(data);
                $("#question").html("<h2>" + qst[count].num + ". " + qst[count].text + " ?</h2>");
            }
        });
    }

    n = $('#question h2').html().split(".")[0];
    EnDis();
}

function nextQstNo(str) {
    if (count <= (getCookie("Count") - 2)) {
        n = $('#question h2').html().split(".")[0];
        $('#' + n).attr('class', 'movebtn btn btn-danger btn-lg');

        answ[n] = {
            "date": getCookie("Date"),
            "time": getCookie("Time"),
            "num": $('#question h2').html().split(".")[0],
            "ans": 0,
            "auth": getCookie("User"),
            "point": getCookie("Point")
        };

        count++;
            $.ajax({
                type: "POST",
                url: "server/questions.php",
                success: function (data) {
                    var qst = JSON.parse(data);
                    $("#question").html("<h2>" + qst[count].num + ". " + qst[count].text + " ?</h2>");
                }
            });
    }

    n = $('#question h2').html().split(".")[0];
    EnDis();
}

function nextQstSkip() {
    if (count <= (getCookie("Count") - 2)) {
        n = $('#question h2').html().split(".")[0];
        $('#' + n).attr('class', 'movebtn btn btn-info btn-lg');

        answ[n] = null;

        count++;
        $.ajax({
            type: "POST",
            url: "server/questions.php",
            success: function (data) {
                var qst = JSON.parse(data);
                $("#question").html("<h2>" + qst[count].num + ". " + qst[count].text + " ?</h2>");
            }
        });
    }

    EnDis();
}

function result() {
    answ = answ.filter(function(el) {
        return el != null;
    })

    for (i = 0;i < answ.length; i++) {
        var tmp = answ[i].date.split(".");
        if (tmp[0] < 10) tmp[0] = "0" + tmp[0];
        if (tmp[1] < 10) tmp[1] = "0" + tmp[1];
        answ[i].date = tmp[2] + "-" + tmp[1] + "-" + tmp[0];
    }

    for (i = 0;i < answ.length; i++)
    $.ajax({
        type: "POST",
        url: "server/answertsIns.php",
        data: "date="+answ[i].date+"&time="+answ[i].time +
            "&num="+answ[i].num+"&ans="+answ[i].ans+
            "&auth="+answ[i].auth+"&point="+answ[i].point,
        success: function (data) {
            console.log(data);
        },
        complete: function() {
            if (getCookie("Group") == 1) {
                window.close();
            } else {
                window.location.href = "index.html";
            }
        }
    });
}