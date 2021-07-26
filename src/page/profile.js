/**
 * author:zc
 * date:2021-05-24
 */

var MESSAGES = [
    "密码不能为空",
    "密码中不能含有空格",
    "密码不能少于6位",
    "密码不一致",
]

/**
 * 更新用户头像数据
 */
function setUserImg() {
    var f = document.getElementById("file").files[0];
    if (!f) return;
    var content = new FormData();
    content.append('file',f);
    $.ajax({
        type: "POST",
        url: "src/server/setImg.php",
        data: content,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (response) {
            var str = response[0]["data"];
            $.ajax({
                type: "POST",
                url: "src/server/setUser.php",
                data: {
                    user_name:userName,
                    user_img:str,
                },
                dataType: "json",
                success: function (response) {
                    showModal("信息提示","<h4>更新用户头像成功</h4>",BUTTON);
                    $(".user-img").attr('src',str);
                    localStorage.setItem('user_img',str);
                }
            });
        }
    });
}

/**
 * 原密码失去焦点事件，检测密码长度和是否含有空格
 */
function oldPwdBlur() {
    var pwd = $(this).val();
    if (!pwd) {
        $("#old-pwd-tip").html(MESSAGES[0]);
    } else if (~pwd.indexOf(" ")) {
        $("#old-pwd-tip").html(MESSAGES[1]);
    } else if (pwd.length < 6) {
        $("#old-pwd-tip").html(MESSAGES[2]);
    } else {
        $("#old-pwd-tip").html("");
    }
}


/**
 * 新密码失去焦点事件，检测密码长度和是否含有空格
 */
function newPwdBlur() {
    var pwd = $(this).val();
    if (!pwd) {
        $("#new-pwd-tip").html(MESSAGES[0]);
    } else if (~pwd.indexOf(" ")) {
        $("#new-pwd-tip").html(MESSAGES[1]);
    } else if (pwd.length < 6) {
        $("#new-pwd-tip").html(MESSAGES[2]);
    } else {
        $("#new-pwd-tip").html("");
        if (pwd == $("#new-repeat-pwd").val()) {
            $("#new-repeat-pwd-tip").html("");
        } else {
            $("#new-repeat-pwd-tip").html(MESSAGES[3]);
        }
    }
}

/**
 * 重复密码失去焦点事件，检测密码长度和是否含有空格和是否和新密码一致
 */
function repeatPwdBlur() {
    var pwd = $(this).val();
    if (pwd != $("#new-pwd").val()) {
        $("#new-repeat-pwd-tip").html(MESSAGES[3]);
    } else {
        $("#new-repeat-pwd-tip").html("");
    }
}


/**
 * 提交修改密码到服务端
 */
function clickModify() {
    var oldPwd = $("#old-pwd").val();
    var newPwd = $("#new-pwd").val();
    var repeatPwd = $("#new-repeat-pwd").val();

    if (!oldPwd) {
        $("#old-pwd-tip").html(MESSAGES[0]);
    }

    if (!newPwd) {
        $("#new-pwd-tip").html(MESSAGES[0]);
    }
    

    if (oldPwd && newPwd && repeatPwd && !$("#old-pwd-tip").html() && !$("#new-pwd-tip").html() && !$("#new-repeat-pwd-tip").html()) {
        $.ajax({
            type: "POST",
            url: "src/server/setUser.php",
            data: {
                user_name:userName,
                user_pwd:oldPwd,
                new_pwd:newPwd,
                repeat_pwd:repeatPwd
            },
            dataType: "json",
            success: function (response) {
                var str;
                if (response[0]["code"]) {
                    str = "修改密码成功";
                } else {
                    str = "修改密码失败";
                }
                showModal("信息提示","<h4>"+str+"</h4>",BUTTON);
                $("#old-pwd").val("");
                $("#new-pwd").val("");
                $("#new-repeat-pwd").val("");
            }
        });
    }
}



function profilePage() {
    init("");
    $("#user-name").val(userName);
    $("#user-identity").val((userIdentity=="superAdmin"?"超级管理员":userIdentity=="admin"?"管理员":"用户"));
    $("#user-img").attr('src',userImg?userImg:"static/image/default.png");
    $("#file-submit").on("click",function() {
        $("#file").click();
    })
    $("#file").on("change",setUserImg);
    $("#old-pwd").on("blur",oldPwdBlur);
    $("#new-pwd").on("blur",newPwdBlur);
    $("#new-repeat-pwd").on("blur",repeatPwdBlur);
    $("#btn-submit").on("click",clickModify);
}

$(document).ready(profilePage);