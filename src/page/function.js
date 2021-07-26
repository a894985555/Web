/**
 * author:zc
 * date:2021-05-04
 */

//普通确认消失按钮
const BUTTON = "<button type='button' class='btn btn-primary' data-dismiss='modal'>确认</button>";

//确认不消失的按钮
const CONFIRM = "<span class='color-red right-padding' id='submit-tip'></span>" +
                "<button type='button' class='btn btn-default' data-dismiss='modal' id='btn-cancel'>取消</button>"+
                "<button type='button' class='btn btn-primary' id='btn-confirm'>确定</button>";

//确认不消失和取消不消失的按钮
const BACK =    "<span class='color-red right-padding' id='submit-tip'></span>" +
                "<button type='button' class='btn btn-default' id='btn-cancel'>取消</button>"+
                "<button type='button' class='btn btn-primary' id='btn-confirm'>确定</button>";             

var userName;       //用户名
var userIdentity;   //用户权限
var userImg;        //用户头像



/**
 * @param {*} str 传入时间例如：2021-05-01 12:12:12 
 * @returns 将时间格式转化为秒的格式
 */
function getTime(str) {
    return Date.parse(str); 
}



/**
 * 显示模态框
 * @param head 头部内容
 * @param content 身体内容
 * @param foot 尾部内容
 * @param css 给身体添加的css
 */
function showModal(head,content,foot,css="") {
    $('#modal-head').html(head);
    $("#modal-body-content").removeClass();
    $("#modal-body-content").addClass(css);
    $("#modal-body-content").children().remove();
    $("#modal-body-content").append(content);
    $(".modal-footer").children().remove();
    $(".modal-footer").append(foot);
    $("#modal-tip").modal("show");
}

/**
 * 隐藏模态框
 */
function hideModal() {
    $("#modal-tip").modal("hide");
}

/**
 * 将用户数据贮存到本地浏览器
 */
function saveUser(userName,userIdentity,userImg) {
    localStorage.setItem("user_name",userName);
    localStorage.setItem("user_identity",userIdentity);
    localStorage.setItem("user_img",userImg);
}

/**
 * 每次页面刷新都需要先进行这个函数
 * 1、开启滚动条监听和注册返回顶部事件
 * 2、填充当前用户名称和用户头像
 * 3、注册退出按钮事件
 * 4、根据页面添加active的css
 */
function init(page) {
    $(window).scroll(function() {  
        var len = document.documentElement.scrollTop + document.body.scrollTop; 
        if (len > 200 ){  
            $("#back").fadeIn(400);
        } else {
            $("#back").stop().fadeOut(400); 
        }
    });
    $("#back").on("click",function() {
        $("html,body").animate({scrollTop:0},500);
    })

    userName = localStorage.getItem("user_name");
    userIdentity = localStorage.getItem("user_identity");
    userImg = localStorage.getItem("user_img");
    if (userName) {
        $("#login").hide();
        $("#register").hide();

        var str =  "<span>" + userName +"</span><span class='caret'></span>";
        $("#user-info").html(str);
        str = "<img src=" + (userImg?userImg:"static/image/default.png") + " class='user-img' >";
        $("#user-info").before(str);
        str = (userIdentity=="superAdmin"?"<li id='task'><a href='publish.html'>任务</a></li>":"<li id='task'><a href='task.html'>任务</a></li>") +
            (userIdentity=="superAdmin"?"":"<li id='note'><a href='note.html'>笔记</a></li>") +
            (userIdentity=="superAdmin"?"<li id='User'><a href='user.html'>用户</a></li>":"");
        $("#discuss").after(str);
        $('#logout').on("click",function() {
            showModal("信息提示","<h4>退出成功</h4>",BUTTON);
            localStorage.removeItem("user_name");
            localStorage.removeItem("user_identity");
            localStorage.removeItem("user_img");
            $("#modal-tip").on("hide.bs.modal",function() {
                window.location.href="index.html";
            });
        });
    } else {
        $("#logout").hide();
        $("#profile").hide();
    }
    $(page).addClass("active");
    return userName;
}

/**
 * 安排分页的页数排版
 * @param {*} totNum 计算得到的总页数
 * @param {*} needNum 需要呈现在页面上多少页
 * @param {*} start 当前在第几页
 * @returns 返回分页的hmtl结构
 */
function getPaginationHtml(totNum,needNum,start) {

    totNum = Math.max(1,totNum);
    //去掉自己
    needNum--;
    var where = start;
    var end = start;
    
    //从中心点开始向外拓展能取则取,剩下的用左边或右边来填
    while (start>1 && end<totNum && needNum>1) {
        needNum -= 2;
        start--;
        end++;
    }
    while (start>1 && needNum) {
        needNum--;
        start--;
    }
    while (end<totNum && needNum) {
        needNum--;
        end++;
    }

    var str = "<nav>" + 
                "<ul class='pagination h-center-row' >";
        if (where!=1) str +=    "<li>" +
                                    "<a>上一页</a>" +
                                "</li>";
        for (var i=start;i<=end;i++) {
            if (i==where) {
                str += "<li class='active'><a>" + i + "</a></li>";
            } else {
                str += "<li><a>" + i + "</a></li>";
            }
        }
        if (where!=totNum) str +=   "<li>" +
                                        "<a>下一页</a>" +
                                    "</li>";
        str += "</ul></nav>"
        return str;
}


//将模态框中间内容变成灰色
$(".modal-body").addClass("gray");



