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
    "密码长度不能少于6位",
    "密码不一致",
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
    if (!pwd) {
        $("#pwd-tip").html(MESSAGES[4]);
    } else if (~pwd.indexOf(" ")) {
        $("#pwd-tip").html(MESSAGES[5]); 
    } else if (pwd.length < 6) {
        $("#pwd-tip").html(MESSAGES[6]);
    } else {
        $("#pwd-tip").html("");
        if (pwd == $("#repeat-pwd").val()) {
            $("#repeat-pwd-tip").html("");
        } else {
            $("#repeat-pwd-tip").html(MESSAGES[7]);
        }
    }
}

//重复密码输入框失去焦点
function repeatPwdBlur() {
    var repeatPwd = $(this).val();
    if (!repeatPwd) {
        $("#repeat-pwd-tip").html(MESSAGES[4]);
    } else if ($(this).val() != $("#pwd").val()) {
        $("#repeat-pwd-tip").html(MESSAGES[7]);
    } else {
        $("#repeat-pwd-tip").html("");
    }
}


//点击提交按钮
function submitClick() {
    var userName = $("#user").val();
    var userPwd = $("#pwd").val();
    var repeatPwd = $("#repeat-pwd").val();
    if (!userName) {
        $("#user-tip").html(MESSAGES[0]);
    }
    if (!userPwd) {
        $("#pwd-tip").html(MESSAGES[4]);
    }
    if (!repeatPwd) {
        $("#repeat-pwd-tip").html(MESSAGES[4]);
    }
    if (userName && userPwd && repeatPwd && !$("#user-tip").html() && !$("#pwd-tip").html() && !$("#repeat-pwd-tip").html()) {
        $.ajax({
            type: "POST",
            url: "src/server/register.php",
            data: {
                user_name:userName,
                user_pwd:userPwd,
                user_create:Timer,
                repeat_pwd:repeatPwd,
            },
            dataType: "json",
            success: function (response) {
                showModal("信息提示","<h4>"+response[0]["msg"]+"</h4>",BUTTON);
                $("#modal-tip").on("hide.bs.modal",function() {
                    if (response[0]["code"]==2) {
                        window.location.href = "login.html";
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

function registerPage() {
    $("#logout").hide();
    $("#user").on("blur",userNameBlur);
    $("#pwd").on("blur",userPwdBlur);
    $("#repeat-pwd").on("blur",repeatPwdBlur);
    $("#submit-btn").on("click",submitClick);
}


$(document).ready(registerPage);
