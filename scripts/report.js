var str1 = document.referrer.split('/');

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function toDef(date) {
    var tmp = date.split(".");
    if (tmp[0] < 10) tmp[0] = "0" + tmp[0];
    if (tmp[1] < 10) tmp[1] = "0" + tmp[1];
    tmp = tmp[2] + "-" + tmp[1] + "-" + tmp[0];
    return tmp;
}

function toPoint(date) {
    var tmp = date.split("-");
    tmp = tmp[2] + "." + tmp[1] + "." + tmp[0];
    return tmp;
}


if (str1[3] == "Ring") {
    $("#header").append(
        '<div class="row">'+
            '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">'+
                '<button type="button" class="btn btn-warning btn-lg"'+
                'onclick="prn(this)">Для печати</button>'+
            '</div>'+
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"></div>'+
            '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">'+
                '<button type="button" class="btn btn-danger btn-lg"'+
                'onclick="exit(this)">Выход</button>'+
            '</div>'+
        '</div>'+
        '<div class="row">'+
            '<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">'+
                '<h3><span class="label label-warning">С</span></h3>'+
                '<input type="date" class="form-control" id="date1"'+
                    'onchange="ref()">'+
            '</div>'+
            '<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">'+
                '<h3><span class="label label-warning">До</span></h3>'+
                '<input type="date" class="form-control" id="date2"'+
                       'onchange="ref()">'+
            '</div>'+
            '<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">'+
                '<h3><span class="label label-warning">Магазин</span></h3>'+
                '<select class="form-control" id="point"'+
                'onchange="sel()"></select>'+
            '</div>'+
            '<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">'+
                '<h3><span class="label label-warning">Дата</span></h3>'+
                '<select class="form-control" id="listdat"></select>'+
            '</div>'+
        '</div>'+
        '<br>'+
        '<div class="row">'+
            '<div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">'+
                '<button type="button" class="btn btn-success btn-lg"'+
                'onclick="report(this)"report">Отчет</button>'+
            '</div>'+
            '<div class="col-md-3 col-lg-3"></div>'+
            '<div class="col-md-3 col-lg-3"></div>'+
        '</div>'+
        '<br>'
        );

    var temp = new Date(toDef(getCookie("Date")));
    temp.setDate(temp.getDate() - 7);
    temp = temp.getDate() + "." +
        (temp.getMonth()+1) + "." +
        temp.getFullYear();

    var dat1 = toDef(temp);
    var dat2 = toDef(getCookie('Date'));

    $('#date1').attr('value', dat1);
    $('#date2').attr('value', dat2);

    $.ajax({
        type: "POST",
        url: "server/answerts.php",
        data: "dat1="+$('#date1').val() +
        "&dat2="+$('#date2').val(),
        success: function(data){
            // console.log(data)

            var str = JSON.parse(data);
            $('#point').empty();
            for (i = 0; i < str.length; i++)
                $('#point').append("<option value='"+str[i].point+"'>"+str[i].name+"</option>");

            $.ajax({
                type: "POST",
                url: "server/pointsDat.php",
                data: "dat1=" + $('#date1').val() +
                "&dat2=" + $('#date2').val() + "&point=" + $('#point').val(),
                success: function (data) {
                    var str = JSON.parse(data);
                    $('#listdat').empty();
                    for (i = 0; i < str.length; i++)
                        $('#listdat').append("<option>" + toPoint(str[i].date) + " " + str[i].time + "</option>");
                }
            });
        }
    });
} else {
    window.location.href = "404.htm";
}

function ref() {
    $.ajax({
        type: "POST",
        url: "server/answerts.php",
        data: "dat1="+$('#date1').val() +
        "&dat2="+$('#date2').val(),
        success: function(data){
            var str = JSON.parse(data);
            $('#point').empty();
            for (i = 0; i < str.length; i++)
                $('#point').append("<option value='"+str[i].point+"'>"+str[i].name+"</option>");

            $.ajax({
                type: "POST",
                url: "server/pointsDat.php",
                data: "dat1=" + $('#date1').val() +
                "&dat2=" + $('#date2').val() + "&point=" + $('#point').val(),
                success: function (data) {
                    var str = JSON.parse(data);
                    $('#listdat').empty();
                    for (i = 0; i < str.length; i++)
                        $('#listdat').append("<option>" + toPoint(str[i].date) + " " + str[i].time + "</option>");
                }
            });
        }
    });
}

function sel() {
    $.ajax({
        type: "POST",
        url: "server/pointsDat.php",
        data: "dat1="+$('#date1').val() +
        "&dat2="+$('#date2').val() + "&point=" + $('#point').val(),
        success: function(data){
            var str = JSON.parse(data);
            $('#listdat').empty();
            for (i = 0; i < str.length; i++)
                $('#listdat').append("<option>"+toPoint(str[i].date) + " " + str[i].time+"</option>");
        }
    });
}

function report() {
    $('#report').remove();
    $('#body').append(
        '<div class="row" id="report"><div class="row"><h3 align="center" id="user">Менеджер</h3>'+
        '</div><br>'+
        '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="grid">'+
        '<table class="table table-bordered table-hover">'+
        '<thead><th></th><th id="tc">Торговый центр</th><th></th>' +
        '</tr><tr class="active"><th>Номер вопроса</th><th>Вопрос</th>'+
        '<th>Баллы</th></tr></thead><tbody id="answ"></tbody></table></div></div>');
    $('#answ').empty();

    var tc = $('#point').val();
    var listdat = $('#listdat').val();
    var datime = listdat.split(" ");
    var date = datime[0].split(".");
    date = date[2]+"-"+date[1]+"-"+date[0];

    $.ajax({
        type: "POST",
        url: "server/report.php",
        data: "date="+ date +
        "&time="+ datime[1] + "&point=" + tc,
        success: function(data){
            var str = JSON.parse(data);
            $('#user').html("Менеджер: " + str[0].author);
            $('#tc').html("ТЦ: " + str[0].point);
            var sum = 0;
            for (i = 0; i < str.length; i++) {
                console.log(str[i].author);
                sum = sum + (str[i].value * 1);
                $('#answ').append(
                    "<tr>" +
                    "<td>" + str[i].quest + "</td>" +
                    "<td>" + str[i].question + "</td>" +
                    "<td>" + str[i].value + "</td>" +
                    "</tr>");
            }
            $('#answ').append("<tr><td></td><td>Итого: </td><td>" + sum + "</td></tr>");
        }
    });
}

function prn() {
    $('#header').remove();
    $('#body').removeAttr('class');
}

function exit() {
    if (getCookie("Group") == 1) {
        window.close();
    } else {
        window.location.href = "index.html";
    }
}