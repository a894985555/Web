/**
 * author:zc
 * date:2021-05-02
 */

var MESSAGES = [
    "用户名不能为空",
    "用户名中不能含有空格",
    "用户名不能少于4位",
    "用户名不能多于16位",
    "密码不能为空",
    "密码中不能含有空格",
    "密码长度不能少于6位"
]

//用户名输入框失去焦点
function userNameBlur() {
    var userName = $(this).val();
    if (!userName) {
        $("#user-tip").html(MESSAGES[0]);
    } else if (~userName.indexOf(" ")) {
        $("#user-tip").html(MESSAGES[1]);
    } else if (userName.length<4) {
        $("#user-tip").html(MESSAGES[2]);
    } else if (userName.length>16) {
        $("#user-tip").html(MESSAGES[3]);
    } else {
        $("#user-tip").html("");
    }
}

//密码输入框失去焦点
function userPwdBlur() {
    var pwd = $(this).val();
    if (!pwd.length) {
        $("#pwd-tip").html(MESSAGES[4]);
    } else if (~pwd.indexOf(" ")) {
        $("#pwd-tip").html(MESSAGES[5]); 
    } else if (pwd.length < 6) {
        $("#pwd-tip").html(MESSAGES[6]);
    } else {
        $("#pwd-tip").html("");
    }
}


//点击提交按钮事件
function submitClick() {
    var userName = $("#user").val();
    var userPwd = $("#pwd").val();
    if (!userName) {
        $("#user-tip").html(MESSAGES[0]);
    }
    if (!userPwd) {
        $("#pwd-tip").html(MESSAGES[4]);
    }
    if (userName && userPwd && !$("#user-tip").html() && !$("#pwd-tip").html()) {
        $.ajax({
            type: "POST",
            url: "src/server/login.php",
            data: {
                user_name:userName,
                user_pwd:userPwd
            },
            dataType: "json",
            success: function (response) {
                showModal("信息提示","<h4>"+response[0]["msg"]+"</h4>",BUTTON);
                $("#modal-tip").on("hide.bs.modal",function() {
                    if (response[0]["code"]) {
                        saveUser(response[0]["data"]["user_name"],response[0]["data"]["user_identity"],response[0]["data"]["user_img"]);
                        window.location.href = "index.html";
                    } else {
                        $("#user").val("");
                        $("#pwd").val("");
                        $("#repeat-pwd").val("");
                        $("#modal-tip").off();
                    }
                });
            }
        });
    }
}


function loginPage() {
    $("#logout").hide();
    $("#user").on("blur",userNameBlur);
    $("#pwd").on("blur",userPwdBlur);
    $("#submit-btn").on("click",submitClick);
}


$(document).ready(loginPage);

