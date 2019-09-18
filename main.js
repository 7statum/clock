var api = 'http://worldtimeapi.org/api/timezone';
var xhr = new XMLHttpRequest()
var form = document.getElementById('nav');
var t_dict = [];
var dict_time = {};
var t = false;

function ready() {
    console.log('DOM ready');
    xhr.open('GET', api, true);
    xhr.send();
    checker();
}

form.onclick = function (event) {
    if (event.target.getAttribute('value') == null) {
        console.log('menu')
        
    } else {
        var url = api + '/' + event.target.getAttribute('value') + '.json';
        var xhr_api = new XMLHttpRequest();
        xhr_api.open('GET', url, true);
        xhr_api.send();
        xhr_api.onreadystatechange = function () {
            if (xhr_api.readyState != 4) return;
            if (xhr_api.status != 200) {
                console.log(xhr_api.status + ': ' + xhr_api.statusText);
            } else {
                console.log(xhr_api.status + ': <' + xhr_api.statusText + '> ' + event.target.getAttribute('value'));
                dict_time = JSON.parse(xhr_api.responseText)
                document.getElementById("head_title").innerText = event.target.getAttribute('value');
                checker();
                close();
            }
        }

    }

}


function checker(hours, minutes) {
    var dt = new Date();
    monthA = '0,1,2,3,4,5,6,7,8,сентября,октября,11,12'.split(',');
    if (dict_time.datetime == null) {
        var minutes = dt.getMinutes();
        var hours = dt.getHours();
        var day = dt.getDate();
        var month = monthA[dt.getMonth() + 1];
        var year = dt.getFullYear();
    }
    else {
        var year = dict_time.datetime.slice(0, 4);
        var month = monthA[parseInt(dict_time.datetime.slice(5, 7))];
        var day = dict_time.datetime.slice(8, 10);
        var hours = dict_time.datetime.slice(11, 13);
        var minutes = dict_time.datetime.slice(14, 16);
    }
    if (document.getElementById('checkbox').checked == true) {
        var AmOrPm = hours >= 12 ? 'pm' : 'am';
        hours = (hours % 12) || 12;
        var finalTime = day + "/" + month + "/" + year + " | " + hours + ":" + minutes + " " + AmOrPm;
        console.log(finalTime);
    } else {
        var finalTime = day + " / " + month + " / " + year + " | " + hours + ":" + minutes;
        console.log(finalTime)
    }
    document.getElementById('clock').innerHTML = finalTime.toString().toUpperCase();
}

xhr.onreadystatechange = function () {
    if (xhr.readyState != 4) return;
    if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText);
    } else {
        t_dict = JSON.parse(xhr.responseText);
        for (i in t_dict) {
            // menu
            var node = document.createElement("LI");
            var node_a = document.createElement("A");
            node.classList.add("submenu-item");
            var textnode = document.createTextNode(t_dict[i]);
            node_a.setAttribute("value", t_dict[i]);
            node_a.setAttribute("href", "#top");
            node_a.appendChild(textnode);
            node.appendChild(node_a);
            document.getElementById("timezone").appendChild(node);


        }
    }
}

nav.addEventListener('click', function (e) {
    var target = e.target;

    var targetParent = target.closest('.menu-item');

    if (targetParent) {
        var subm = targetParent.getElementsByClassName('submenu')[0];
        if (subm) {
            subm.style.display = 'block';
        }
    }

});

function close() {
    var s = document.getElementsByClassName('submenu');
    for (var i = 0; i < s.length; i++) {
        s[i].style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", ready);