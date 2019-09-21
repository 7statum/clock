var api = 'http://worldtimeapi.org/api/timezone';
var monthA = '0,1,2,3,4,5,6,7,8,сентября,октября,11,12'.split(',');
var get_time = {};
var t_dict = [];
var count = 1;
var form = document.getElementById('nav');
var xhr = new XMLHttpRequest();
var dt = new Date();

var period = 30000;

function ready() {
    console.log('DOM ready');
    xhr.open('GET', api, true);
    xhr.send();
    checker();
}

function httpGet(url) {
    return new Promise(function (resolve, reject) {
        var xhr_api = new XMLHttpRequest();
        xhr_api.open('GET', url, true);
        xhr_api.onload = function () {
            if (this.status == 200) {
                resolve(this.response);
                get_time = JSON.parse(this.response);
                document.getElementById("head_title").innerText = get_time.timezone;
                checker();
            } else {

                var error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
                checker();
            }
        };
        xhr_api.onerror = function () {
            reject(new Error("Network Error"));
        };
        xhr_api.send();
    });
}

form.onclick = function (event) {
    try {
        clearInterval(interval);
    } catch (e) {
        if (e instanceof ReferenceError) {
            // console.log('not found interval')
        }
    }
    if (event.target.getAttribute('value') == null) {
        // console.log('click to menu')
    } else {

        var url = api + '/' + event.target.getAttribute('value') + '.json';
        httpGet(url);


        interval = setInterval(() => {
            console.log('interval count: ', count++)
            httpGet(url);
        }, period);
    }
}

function checker(hours, minutes) {

    if (get_time.datetime == null) {
        var minutes = dt.getMinutes();
        var hours = dt.getHours();
        var day = dt.getDate();
        var month = monthA[dt.getMonth() + 1];
        var year = dt.getFullYear();
    }
    else {
        var year = get_time.datetime.slice(0, 4);
        var month = monthA[parseInt(get_time.datetime.slice(5, 7))];
        var day = get_time.datetime.slice(8, 10);
        var hours = get_time.datetime.slice(11, 13);
        var minutes = get_time.datetime.slice(14, 16);
    }
    if (document.getElementById('checkbox').checked == true) {
        var AmOrPm = hours >= 12 ? 'pm' : 'am';
        hours = (hours % 12) || 12;
        if (AmOrPm == 'am') {
            document.getElementById('body').setAttribute('style', "background-color: rgb(50, 50, 50)");
        } else {
            document.getElementById('body').setAttribute('style', "background-color: rgb(30, 30, 30)");
        }
        var finalTime = day + "/" + month + "/" + year + " | " + hours + ":" + minutes + " " + AmOrPm;
        // console.log(finalTime);
    } else {
        var finalTime = day + " / " + month + " / " + year + " | " + hours + ":" + minutes;
        // console.log(finalTime);
    }
    document.getElementById('clock').innerHTML = finalTime.toString().toUpperCase();
    close();
}

xhr.onreadystatechange = function () {
    if (xhr.readyState != 4) return;
    if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText);
    } else {
        t_dict = JSON.parse(xhr.responseText);
        for (i in t_dict) {
            // generate menu
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

form.addEventListener('click', function (e) {
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
