/**
 * author:zc
 * date:2021-05-22
 */

//任务的图标颜色
const COLOR = ["default","success","fail"];

//任务的图标
const INFO = ["glyphicon-book","glyphicon-ok","glyphicon-remove"];

//任务状态
const STATE = ["待做","已完成","已过期"];

var timeArr = Array();          //缓存所有任务的ID、创建时间和截止时间
var taskDone = Array();         //缓存当前用户任务完成清空
var taskDeadline = Array();     //缓存当前任务的截止时间
var score = Array();            //缓存当前任务的用户获取的分数


/**
 * 每秒检查时间进度条的情况,更新进度条的百分比和长度
 * 如果当前页面有任务过期会自动刷新
 */
function checkProcess() {
    $.each(timeArr, function (i, e) {
        var id = e["id"];
        var create = e["create"];
        var deadline = e["deadline"];
        if (Timer >= deadline) {
            window.location.reload();
        }
        var width = (getTime(deadline)-getTime(Timer)) / (getTime(deadline) - getTime(create));
        // console.log(deadline,getTime(deadline)-getTime(Timer),(getTime(deadline) - getTime(create)));
        width = 100 - 100*width;
        // console.log(width);
        width = width + '%';
        var str = "#task-progress-" + id;
        $(str).css("width",width);
        $(str).html(parseInt(width)+'%');
    });
    setTimeout(checkProcess,1000);
}

/**
 * 点击任务事件，如果超时则提示已经过期,否则跳转到答题页面
 */
function clickTask() {
    var id = $(this).attr('id').split("-")[1];
    if (Timer>=taskDeadline[id] && !taskDone[id]) {
        showModal("信息提示","<h4>已过期</h4>",BUTTON);
        return;
    }
    window.location.href = "problem.html?task_id=" + id +"?task_done="+(taskDone[id]?'1':'0'); 
}

/**
 * 获取任务的HTML结构
 */
function getTaskHtml(id,title,create,deadline,state) {
    var str = "<li class='nav-box " + COLOR[state]  +"'id=task-" + id + ">" +
                "<div class='full-width'>" +
                    "<div class='full-width h-left'>"
        if (state==1) {
            str += "<span class='info-box-big center big-score'>" + score[id] +"</span>";
        } else {
            str += "<span class='info-box-big center icon-"+ COLOR[state] + " glyphicon " + INFO[state] + "' id=task-icon-" + id + "></span>";
        }
        str +=  "<div class='task-title'>" + title + "</div></div>" +
                "<div class='top-margin full-width'>" +
                    "<p>发布时间：" + create + "</p>" +
                    "<p>截止时间：" + deadline + "</p>";
        str += "<p>任务状态：" + STATE[state] + "<p>";
        str+="</div></div>";
    if (state==0) {
        var width = (getTime(deadline)-getTime(Timer)) / (getTime(deadline) - getTime(create));
        width = 100 - 100*width;
        str += "<div class='progress-box'>" + 
                    "<div class='progress'>" +
                        "<div style='min-width: 2em;' class='progress-bar progress-bar-striped active' id=task-progress-"+ id + "></div>" + 
                    "</div>" + 
                "</div>";
        var temp = Array();
        temp["id"] = id;
        temp["create"] = create;
        temp["deadline"] = deadline;
        timeArr.push(temp);
    }
    str += "</li>";
    return str;
}

/**
 * 在页面上动态生成任务HTML
 */
function generateTaskOnPage() {
    $.ajax({
        type: "POST",
        url: "src/server/getTasks.php",
        dataType: "json",
        success: function (response) {
            var str = "";
            $.each(response[0]["data"], function (i,e) {
                taskDeadline[e["task_id"]] = e["task_deadline"];
                if (taskDone[e["task_id"]]) {
                    str += getTaskHtml(e["task_id"],e["task_title"],e["task_create"],e["task_deadline"],1);
                } else {
                    if (Timer >= e["task_deadline"]) {
                        str += getTaskHtml(e["task_id"],e["task_title"],e["task_create"],e["task_deadline"],2);
                    } else {
                        str += getTaskHtml(e["task_id"],e["task_title"],e["task_create"],e["task_deadline"],0);
                    }
                }         
            });
            $("#task-bar").append(str);
            checkProcess();
            $.each(response[0]["data"],function(i,e) {
                str = "#task-" + e["task_id"];
                $(str).on("click",clickTask);
            });
        }
    });
}


function taskPage() {
    init("#task");
    $.ajax({
        type: "POST",
        url: "src/server/getTaskRecords.php",
        data: {
            user_name:userName,
        },
        dataType: "json",
        success: function (response) {
            $.each(response[0]["data"], function (i, e) {
                taskDone[e["task_id"]] = e["task_record_done"];
                score[e["task_id"]] = e["task_record_totalscore"];
            });
            generateTaskOnPage();
        }
    });
}

$(document).ready(taskPage);