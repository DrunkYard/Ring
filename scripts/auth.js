function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Получаем список пользователей
$.ajax({
    type: "POST",
    url: "server/users.php",
    success: function(data){
        var str = JSON.parse(data);
        for (i = 0; i < str.length; i++)
            $('#users').append("<option>"+str[i].name+"</option>");
    }
});

// Получаем список торговых центров
$.ajax({
    type: "POST",
    url: "server/points.php",
    success: function(data){
        var str = JSON.parse(data);
        for (i = 0; i < str.length; i++)
            $('#point').append("<option>"+str[i].name+"</option>");
    }
});

// Если нажата кнопка Вход
function enter() {
    $.ajax({
        type: "POST",
        url: "server/auth.php",
        data: "pass="+$('#pass').val()+"&user="+$('#users').val(),
        success: function(data){
            var us = JSON.parse(data);
            if (us.group > 0) {
                document.cookie = "User=" + us.id;
                document.cookie = "Group=" + us.group;

                $.ajax({
                    type: "POST",
                    url: "server/points.php",
                    success: function(data){
                        var str = JSON.parse(data);
                        for (i = 0; i < str.length; i++)
                            if (str[i].name == $('#point').val()) {
                                document.cookie = "Point=" + str[i].code;
                            }
                    }
                });

                var now = new Date();
                var day = now.getDate();
                var month = now.getMonth() + 1;
                var year = now.getFullYear();
                var hour = now.getHours();
                var minutes = now.getMinutes();

                document.cookie = "Date="+day + "." +
                    month + "." + year;
                document.cookie = "Time="+ hour + ":" + minutes;

                if ((month >= 4) && (month <= 10)) {
                    document.cookie = "Season=1";
                } else {
                    document.cookie = "Season=2";
                }

                switch (us.group) {
                    case '1': { window.location.href = "cabinet.html"; break; }
                    case '2': { window.location.href = "report.html"; break; }
                    case '3': { window.location.href = "answerts.html"; break; }
                    default: { break;}
                }

                $('#msg').html("")
            } else {
                $('#msg').html("Пароль не верен !")
            }
        }
    });
}