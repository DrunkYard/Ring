var str1 = document.referrer.split('/');

if (str1[3] == "Ring") {
    $(".header").append('<nav class="navbar navbar-default">'+
            '<div class="container-fluid">'+
                '<div class="navbar-header">'+
                    '<button type="button" class="navbar-toggle collapsed"'+
                            'data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"'+
                            'aria-expanded="false">'+
                        '<span class="sr-only">Toggle navigation</span>'+
                        '<span class="icon-bar"></span>'+
                        '<span class="icon-bar"></span>'+
                        '<span class="icon-bar"></span>'+
                    '</button>'+
                    '<a class="navbar-brand" href="#">'+
                        '<img alt="Brand" src="img/logo.png" id="logo"></a>'+
                '</div>'+
                '<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">'+
                    '<ul class="nav navbar-nav">'+
                        '<li><a href="#" onclick="report()">Отчет</a></li>'+
                        '<li><a href="#" onclick="answerts()">Опрос</a></li>'+
                        '<li class="dropdown">'+
                            '<a href="#" class="dropdown-toggle"'+
                               'data-toggle="dropdown" role="button"'+
                               'aria-haspopup="true" aria-expanded="false">Администрирование'+
                                '<span class="caret"></span></a>'+
                            '<ul class="dropdown-menu">'+
                                '<li><a href="#" onclick="users()">Пользователи</a></li>'+
                                '<li role="separator" class="divider"></li>'+
                                '<li><a href="#" onclick="question()">Вопросы</a></li>'+
                                '<li role="separator" class="divider"></li>'+
                                '<li><a href="#" onclick="shops()">Магазины</a></li>'+
                            '</ul>'+
                        '</li>'+
                    '</ul>'+
                    '<ul class="nav navbar-nav navbar-right">'+
                        '<li><a href="#" onclick="exit()">Выход</a></li>'+
                    '</ul>'+
                '</div>'+
            '</div>'+
        '</nav>');
} else {
    window.location.href = "404.htm";
}

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function selected(str) {
    $('tbody tr').removeAttr('class');
    $(str).attr('class', 'active');
}

function report() {
    window.open("report.html");
}

function answerts() {
    window.open("answerts.html");
}

function exit() {
    window.location.href = "index.html";
}
//-----------Пользователи-------------------------------------------------------------------------
function users() {
    $('table').remove();
    $('.row').remove();
    $('.container').append(
        '<table class="table table-bordered table-hover">' +
        '<thead><tr class="active"><th>Имя</th><th>Группа</th><th>Пароль</th></tr></thead>' +
        '<tbody id="users"></tbody></table>'
    )
    $.ajax({
        type: "POST",
        url: "server/users.php",
        success: function(data){
            var str = JSON.parse(data);
            for (i = 0; i < str.length; i++)
                $('#users').append(
                    "<tr onclick='selected(this)' id='"+str[i].id+"'>" +
                    "<td class='name'>"+str[i].name+"</td>" +
                    "<td class='group'>"+str[i].group_name+"</td>" +
                    "<td class='pass'></td>" +
                    "</tr>");
        }
    });
    $('.container').append(
        '<div class="row">' +
        '<div class="col-md-2 col-lg-2"></div>' +
        '<div class="col-xs-4 col-sm-4 col-md-3 col-lg-3">' +
        '<button type="button" class="btn btn-success btn-lg"' +
        'onclick="add(this)" id="Add">Добавить</button>' +
        '</div>' +
        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">' +
        '<button type="button"' +
        'class="btn btn-info btn-lg"' +
        'onclick="edit(this)" id="Edit">Изменить</button>' +
        '</div>' +
        '<div class="col-xs-4 col-sm-4 col-md-3 col-lg-3">' +
        '<button type="button" class="btn btn-danger btn-lg"' +
        'onclick="rem(this)" id="Rem">Удалить</button>' +
        '</div>' +
        '<div class="col-md-4 col-lg-4"></div>'
    );
}

function add() {
    $.ajax({
        type: "POST",
        url: "server/group.php",
        success: function(data){
            // console.log(data);
            var str = JSON.parse(data);
            $('.table tbody').append(
                '<tr>' +
                '<td><input type="text" class="form-control" id="name"></td>' +
                '<td><select class="form-control" id="groups"></select></td>' +
                '<td><input type="password" class="form-control" id="pass"></td>' +
                '</tr>');
            $('#Add').html('Сохранить');
            $('#Add').attr('onclick', 'save()');
            $('#Edit').attr('style', 'visibility: hidden');
            $('#Rem').html('Отмена');
            $('#Rem').attr('onclick', 'users()');
            for (i = 0; i < str.length; i++)
                $('#groups').append(
                    '<option value="'+ str[i].id +'">' + str[i].name + '</option>'
                );
        }
    });
}

function save() {
    $.ajax({
        url: "server/usersIns.php",
        type: "POST",
        data: "name="+$('#name').val()+
            "&groups="+$('#groups').val()+
            "&pass="+$('#pass').val(),
        success: function(data) {
            console.log(data)
        }
    })
    users();
}

function edit() {
    $('tbody tr.active td.name').html(
        '<input type="text" id="name" value="' +$('tbody tr.active td.name').html() + '" class="form-control">'
    )
    $.ajax({
        type: "POST",
        url: "server/group.php",
        success: function(data){
            var str = JSON.parse(data);

            var temp = $('tbody tr.active td.group').html();

            $('tbody tr.active td.group').html(
                '<select class="form-control" id="groups"></select>'
            )

            for (i = 0; i < str.length; i++) {
                $('#groups').append(
                    '<option value="' + str[i].id + '">' + str[i].name + '</option>'
                );

                if (temp == str[i].name) {
                    $('#groups option').attr('selected', 'selected');
                }
            }

            $('#Add').html('Сохранить');
            $('#Add').attr('onclick', 'saveEdit()');
            $('#Edit').attr('style', 'visibility: hidden');
            $('#Rem').html('Отмена');
            $('#Rem').attr('onclick', 'users()');
        }
    });

    $('tbody tr.active td.pass').html(
        '<input type="password" id="pass" class="form-control">'
    )
}

function saveEdit() {
    $.ajax({
        url: "server/usersUpd.php",
        type: "POST",
        data: "id="+$('tbody tr.active').attr('id')+
            "&name="+$('#name').val()+
            "&pass="+$('#pass').val()+
            "&groups="+$('#groups').val(),
        success: function(data) {
            console.log(data);
        }
    })

    users();
}

function rem() {
    $.ajax({
        url: "server/usersDel.php",
        type: "POST",
        data: "id="+$('tbody tr.active').attr('id'),
        success: function(data) {
            console.log(data);
        }
    })

    users();
}
//-----------Вопросы------------------------------------------------------------------------------
function question() {
    $('table').remove();
    $('.row').remove();
    $('.container').append(
        '<table class="table table-bordered table-hover">' +
        '<thead><tr class="active"><th>Номер</th><th>Вопрос</th><th>Сезон</th></tr></thead>' +
        '<tbody id="questions"></tbody></table>'
    )

    $.ajax({
        type: "POST",
        url: "server/allquestions.php",
        success: function(data){
            // console.log(data);
            var str = JSON.parse(data);
            for (i = 0; i < str.length; i++)
                $('#questions').append(
                    "<tr onclick='selected(this)' id='"+str[i].id+"'>" +
                    "<td class='num'>"+str[i].num+"</td>" +
                    "<td class='text'>"+str[i].text+"</td>" +
                    "<td class='season'>" + str[i].season_name + "</td>" +
                    "</tr>");
        }
    });

    $('.container').append(
        '<div class="row">' +
        '<div class="col-md-2 col-lg-2"></div>' +
        '<div class="col-xs-4 col-sm-4 col-md-3 col-lg-3">' +
        '<button type="button" class="btn btn-success btn-lg"' +
        'onclick="addQ()" id="Add">Добавить</button>' +
        '</div>' +
        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">' +
        '<button type="button"' +
        'class="btn btn-info btn-lg"' +
        'onclick="editQ()" id="Edit">Изменить</button>' +
        '</div>' +
        '<div class="col-xs-4 col-sm-4 col-md-3 col-lg-3">' +
        '<button type="button" class="btn btn-danger btn-lg"' +
        'onclick="remQ()" id="Rem">Удалить</button>' +
        '</div>' +
        '<div class="col-md-4 col-lg-4"></div>'
    );
}

function addQ() {
    $.ajax({
        type: "POST",
        url: "server/season.php",
        success: function(data){
            var str = JSON.parse(data);
            $('.table tbody').append(
                '<tr>' +
                '<td><input type="text" class="form-control" id="num"></td>' +
                '<td><input type="text" class="form-control" id="text"></td>' +
                '<td><select class="form-control" id="season"></select></td>' +
                '</tr>');
            $('#Add').html('Сохранить');
            $('#Add').attr('onclick', 'Qsave()');
            $('#Edit').attr('style', 'visibility: hidden');
            $('#Rem').html('Отмена');
            $('#Rem').attr('onclick', 'question()');
            for (i = 0; i < str.length; i++)
                $('#season').append(
                    '<option value="'+ str[i].id +'">' + str[i].name + '</option>'
                );
        }
    });
}

function Qsave() {
    // console.log(
    //     $('#num').val() + ' ' +
    //     $('#text').val() + ' ' +
    //     $('#season').val()
    // );

    $.ajax({
        url: "server/questionsIns.php",
        type: "POST",
        data: "num="+$('#num').val()+
            "&text="+$('#text').val() +
            "&season="+$('#season').val(),
        success: function(data) {
            console.log(data)
        }
    })

    question();
}

function editQ() {
    $('tbody tr.active td.num').html(
        '<input type="text" id="num" value="' +$('tbody tr.active td.num').html() + '" class="form-control">'
    )

    $('tbody tr.active td.text').html(
        '<input type="text" id="text" value="' +$('tbody tr.active td.text').html() + '" class="form-control">'
    )

    $.ajax({
        type: "POST",
        url: "server/season.php",
        success: function(data){
            var str = JSON.parse(data);

            var temp = $('tbody tr.active td.season').html();

            $('tbody tr.active td.season').html(
                '<select class="form-control" id="seasons"></select>'
            )

            for (i = 0; i < str.length; i++) {
                $('#seasons').append(
                    '<option value="' + str[i].id + '">' + str[i].name + '</option>'
                );

                if (temp == str[i].name) {
                    $('#seasons option').attr('selected', 'selected');
                }
            }

            $('#Add').html('Сохранить');
            $('#Add').attr('onclick', 'QsaveEdit()');
            $('#Edit').attr('style', 'visibility: hidden');
            $('#Rem').html('Отмена');
            $('#Rem').attr('onclick', 'question()');
        }
    });
}

function QsaveEdit() {
    $.ajax({
        url: "server/questionsUpd.php",
        type: "POST",
        data: "id="+$('tbody tr.active').attr('id')+
            "&num="+$('#num').val()+
            "&text="+$('#text').val()+
            "&season="+$('#seasons').val(),
        success: function(data) {
            console.log(data)
        }
    })
    question();
}

function remQ() {
    // console.log(
    //     $('tbody tr.active').attr('id')
    // );
    $.ajax({
        url: "server/questionsDel.php",
        type: "POST",
        data: "id="+$('tbody tr.active').attr('id'),
        success: function(data) {
            console.log(data);
        }
    })
    question();
}
//-----------Магазины-----------------------------------------------------------------------------
function shops() {
    $('table').remove();
    $('.row').remove();
    $('.container').append(
        '<table class="table table-bordered table-hover">' +
        '<thead><tr class="active"><th>Подразделение</th><th>Адрес</th></tr></thead>' +
        '<tbody id="questions"></tbody></table>'
    )

    $.ajax({
        type: "POST",
        url: "server/points.php",
        success: function(data){
            // console.log(data);
            var str = JSON.parse(data);
            for (i = 0; i < str.length; i++)
                $('#questions').append(
                    "<tr onclick='selected(this)' id='"+str[i].id+"'>" +
                    "<td class='code'>"+str[i].code+"</td>" +
                    "<td class='name'>"+str[i].name+"</td>" +
                    "</tr>");
        }
    });

    $('.container').append(
        '<div class="row">' +
        '<div class="col-md-2 col-lg-2"></div>' +
        '<div class="col-xs-4 col-sm-4 col-md-3 col-lg-3">' +
        '<button type="button" class="btn btn-success btn-lg"' +
        'onclick="addShop()" id="Add">Добавить</button>' +
        '</div>' +
        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">' +
        '<button type="button"' +
        'class="btn btn-info btn-lg"' +
        'onclick="editShop()" id="Edit">Изменить</button>' +
        '</div>' +
        '<div class="col-xs-4 col-sm-4 col-md-3 col-lg-3">' +
        '<button type="button" class="btn btn-danger btn-lg"' +
        'onclick="remShop()" id="Rem">Удалить</button>' +
        '</div>' +
        '<div class="col-md-4 col-lg-4"></div>'
    );
}

function addShop() {
    $('.table tbody').append(
        '<tr>' +
        '<td><input type="text" class="form-control" id="code"></td>' +
        '<td><input type="text" class="form-control" id="name"></td>' +
        '</tr>');
    $('#Add').html('Сохранить');
    $('#Add').attr('onclick', 'saveShop()');
    $('#Edit').attr('style', 'visibility: hidden');
    $('#Rem').html('Отмена');
    $('#Rem').attr('onclick', 'shops()');
}

function saveShop() {
    $.ajax({
        url: "server/pointsIns.php",
        type: "POST",
        data: "code="+$('#code').val()+
            "&name="+$('#name').val(),
        success: function (data) {
            console.log(data);
        }
    })

    shops();
}

function editShop() {
    $('tbody tr.active td.code').html(
        '<input type="text" id="code" value="' +$('tbody tr.active td.code').html() + '" class="form-control">'
    )

    $('tbody tr.active td.name').html(
        '<input type="text" id="name" value="' +$('tbody tr.active td.name').html() + '" class="form-control">'
    )

    $('#Add').html('Сохранить');
    $('#Add').attr('onclick', 'ShopSaveEdit()');
    $('#Edit').attr('style', 'visibility: hidden');
    $('#Rem').html('Отмена');
    $('#Rem').attr('onclick', 'shops()');
}

function ShopSaveEdit() {
    $.ajax({
        url: "server/pointsUpd.php",
        type: "POST",
        data: "id="+ $('tbody tr.active').attr('id') +
            "&code="+ $('#code').val() +
            "&name=" + $('#name').val(),
        success: function (data) {
            console.log(data);
        }
    })

    shops();
}

function remShop() {
    $.ajax({
        url: "server/pointsDel.php",
        type: "POST",
        data: "id="+$('tbody tr.active').attr('id'),
        success: function(data) {
            console.log(data);
        }
    })

    shops();
}