/**
 * author:zc
 * date:2021-05-23
 */

const PROBLEMNUM = 20;          //一个任务下的题目数量限制
var titleArr = Array();         //缓存所有任务的标题
var deadlineArr = Array();      //缓存所有任务的截止时间
var idArr = Array();            //当前编辑下的任务中所有问题的ID
var num = 0;                    //当前编辑下的任务中问题的索引
var nowId = 0;                  //当前编辑的任务ID


/**
 * @param {*} id        任务ID
 * @param {*} title     任务标题
 * @param {*} create    任务创建时间
 * @param {*} deadline  任务截止时间
 * @param {*} state     任务是否发布
 * @returns 任务的HTML结构
 */
function getTaskHtml(id,title,create,deadline,state) {
    var str = "";
    if (state == 0)return str;
    str =   "<li id=task-"+ id +" class='task-box "+ (state==1?"success":"warning") + " v-between'>" +
                    "<div style='width: 90%;'>" +
                        "<h2 class='color-white'>" + (title?title:"###") + "</h2>" +
                        "<p>创建时间：" + create + "</p>" +
                        "<p>截止时间：" + (deadline?deadline:"###") + "</p>" +
                        "<p>任务状态："+ (state==1?"已发布":"待发布") +"</p>" +
                    "</div>" +
                    "<div class='btn-box'>" +
                        (state==1?"":"<span id=remove-"+ id +" class='glyphicon glyphicon-trash info-box center' style='font-size: 30px;cursor: pointer;'></span>") +
                        (state==1?"<span id=pause-"+ id +" class='glyphicon glyphicon-pause info-box center' style='font-size: 30px;cursor: pointer;'></span>":"") +
                        "<span id=" + (state==1?"ask-":"edit-") + id +" class='glyphicon glyphicon-"+ (state==1?"search":"edit") + " info-box center' style='font-size: 30px;cursor: pointer;'></span>" +
                    "</div>" +
            "</li>";
    return str;
}


/**
 * 点击删除任务事件
 */
function clickTaskRemove() {
    var that = $(this);
    var id = that.attr('id').split('-')[1];
    showModal("信息提示","<h4>确认要删除吗</h4>",CONFIRM);
    $("#btn-confirm").on("click",function() {
        $.ajax({
            type: "POST",
            url: "src/server/setTask.php",
            data: {
                task_id:id,
                task_state:0
            },
            dataType: "json",
            success: function (response) {
                var str = "#task-"+id;
                $(str).remove();
                hideModal();
            }
        });
    })
}


/**
 * 点击查询用户完成清空
 */
function clickAskUser() {
    var id = $(this).attr('id').split('-')[1];
    var str = "";
    var arr = Array();
    var pre ="";
    var num = 0;
    var now = 0;
    $.ajax({
        type: "POST",
        url: "src/server/getTaskRecords.php",
        data: {
            task_id:id,
        },
        dataType: "json",
        success: function (response) {
            str =  "<table class='full-width white'>"+
                            "<thead>" +
                                "<tr class='tr-head'>" +
                                    "<th class='text-center' style='width: 20%;'></th>" +
                                    "<th class='text-center' style='width: 30%;'>用户名</th>" +
                                    "<th class='text-center' style='width: 30%;'>分数</th>" +
                                    "<th class='text-center' style='width: 20%;'>排名</th>" +
                                "</tr>" +
                            "</thead>" +
                            "<tbody>";
            $.each(response[0]["data"], function (i,e) {
                now++;
                if (pre != e["task_record_totalscore"]) {
                    pre = e["task_record_totalscore"];
                    num = now;
                }
                arr[e["user_name"]] = 1;
                str +=  "<tr class='tr-body'>" + 
                            "<td><img src=" + (e["user_img"]?e["user_img"]:'static/image/default.png') + " class='user-img'></td>" +
                            "<td>" + e["user_name"] + "</td>" + 
                            "<td class='color-red'>" + e["task_record_totalscore"] + "</td>" +
                            "<td>" + num + "</td>" +
                        "</tr>";
            });
            now++;
            $.ajax({
                type: "POST",
                url: "src/server/getUsers.php",
                dataType: "json",
                success: function (response) {
                    $.each(response[0]["data"], function (i,e) {
                        if (e["user_identity"]!="superAdmin" && !arr[e["user_name"]]) {
                            str +=  "<tr class='tr-body'>" + 
                                        "<td><img src=" + (e["user_img"]?e["user_img"]:'static/image/default.png') + " class='user-img'></td>" +
                                        "<td>" + e["user_name"] + "</td>" + 
                                        "<td>" + "未完成" + "</td>" +
                                        "<td>" + now + "</td>" +
                                    "</tr>";
                        }
                    });
                    str += "</tbody></table>";
                    showModal("完成情况",str,BUTTON,"h-center");
                }
            });
        }
    });
}

/**
 * 点击暂停任务停止事件
 */
function clickPause() {
    var that = $(this);
    var id = that.attr('id').split('-')[1];

    showModal("信息提示","<h4>暂停任务会清空当前任务下所有用户的答题记录,确认暂停吗</h4>",CONFIRM);
    $("#btn-confirm").on("click",function() {
        $.ajax({
            type: "POST",
            url: "src/server/setTask.php",
            data: {
                task_id:id,
                task_state:-1
            },
            dataType: "json",
            success: function (response) {
                
            }
        });
        $.ajax({
            type: "POST",
            url: "src/server/setTaskRecord.php",
            data: {
                task_id:id,
            },
            dataType: "json",
            success: function (response) {
            }
        });
        window.location.reload();
    });
}


/**
 * 删去任务中的题目自动更新题目前面的序号
 */
function checkProblemNum() {
    var arr = $(".middle-title");
    $.each(arr, function (i, e) { 
        $(this).html("题目#"+(i+1));
    });
}

/**
 * 点击删除编辑中的任务下的某个问题事件
 */
function clickProblemRemove() {
    var that = $(this);
    var id = +that.attr('id').split('-')[2];
    var str = "#problem-"+id;
    $(str).remove();
    idArr.splice(idArr.indexOf(id),1);
    checkProblemNum();
}

/**
 * 点击编辑中的任务增加某个问题的事件
 */
function clickProblemAdd() {
    if (idArr.length==PROBLEMNUM) {
        $("#submit-tip").html("题目限制不超过"+PROBLEMNUM+"条");
        return;
    }
    num++;
    var str =   "<div id=problem-" + num + " class='content-box top-margin white'>" + 
                    "<div class='h-between center'>" +
                        "<p class='middle-title'>题目#" + num + "</p>" +
                        "<button type='button' class='btn btn-danger center' id=btn-remove-" + num + "><span class='glyphicon glyphicon-minus color-white'></span></button>" +
                    "</div>" +
                    "<p>请输入题目内容:</p>" +
                    "<div class='textarea' contenteditable='true' placeholder='题目内容' id=content-" + num + "></div>" +
                    "<p>选项A:</p>" +
                    "<div class='textarea' contenteditable='true' placeholder='选项A' id=option1-" + num + "></div>" +
                    "<p>选项B:</p>" +
                    "<div class='textarea' contenteditable='true' placeholder='选项B' id=option2-" + num + "></div>" +
                    "<p>选项C:</p>" +
                    "<div class='textarea' contenteditable='true' placeholder='选项C' id=option3-" + num + "></div>" +
                    "<p>选项D:</p>" +
                    "<div class='textarea' contenteditable='true' placeholder='选项D' id=option4-" + num + "></div>" +
                    "<div class='top-margin'>" +
                        "<span>正确答案: </span>" +
                        "<input class='answer-input form-control' placeholder='ABCD' id=answer-" + num + ">" +
                        "<span id=answer-tip-"+ num + " class='left-padding' style='color: red;'></span>" +
                    "</div>" + 
                    "<div class='top-margin'>" +
                        "<span>题目得分: </span>" +
                        "<input class='answer-input form-control' placeholder='1-100' id=score-" + num + ">" +
                        "<span id=score-tip-"+ num + " class='left-padding' style='color: red;'></span>" +
                    "</div>" +
                "</div>";
    $("#btn-add-box").before(str);
    var temp = "#btn-remove-"+num;
    $(temp).on("click",clickProblemRemove);
    temp = "#answer-" + num;
    $(temp).on("blur",answerBlur);
    temp = "#score-" +num;
    $(temp).on("blur",scoreBlur);
    idArr.push(num);
    checkProblemNum();
}

/**
 * 保存正在编辑的任务数据
 */
function saveTask() {
    $.ajax({
        type: "POST",
        url: "src/server/setTask.php",
        data: {
            task_title:$("#title").html(),
            task_create:Timer,
            task_deadline:$("#time").val().replace("T"," "),
            task_id:nowId
        },
        dataType:"json",
        success: function (response) {
        }
    });
}

/**
 * 保存当前编辑的任务下的所有问题的数据
 */
function saveProblem() {
    var content = [];
    var option1 = [];
    var option2 = [];
    var option3 = [];
    var option4 = [];
    var answer = [];
    var score = [];
    $.each(idArr, function (i,e) { 
        var str = "#content-" + e;
        content.push($(str).html());
        var str = "#option1-" + e;
        option1.push($(str).html());
        var str = "#option2-" + e;
        option2.push($(str).html());
        var str = "#option3-" + e;
        option3.push($(str).html());
        var str = "#option4-" + e;
        option4.push($(str).html());
        var str = "#answer-" + e;
        answer.push($(str).val());
        var str = "#score-" + e;
        score.push($(str).val());
    });
    $.ajax({
        type: "POST",
        url: "src/server/setProblem.php",
        data: {
            task_id:nowId,
            problem_content:content,
            problem_option1:option1,
            problem_option2:option2,
            problem_option3:option3,
            problem_option4:option4,
            problem_answer:answer,
            problem_score:score,
        },
        dataType:"json",
        success: function (response) {
        }
    });
}

/**
 * 分数输入框失去焦点事件
 */
function answerBlur() {
    var that = $(this);
    var id = that.attr('id').split('-')[1];
    if (that.val()!='A' && that.val()!='B' && that.val()!='C' && that.val()!='D') {
        $("#answer-tip-"+id).html("请输入A或B或C或D");
    } else {
        $("#answer-tip-"+id).html("");
    }

}

/**
 * 分数输入框失去焦点事件
 */
function scoreBlur() {
    var that = $(this);
    var id = that.attr('id').split('-')[1];
    var temp = parseInt(that.val());
    if (isNaN(temp) || temp<1 || temp>100) {
        $("#score-tip-"+id).html("请输入1到100");
    } else {
        $("#score-tip-"+id).html("");
    }
}


/**
 * 点击保存当前任务事件，同时保存任务数据和问题数据
 */
function clickTaskSave() {
    saveTask();
    saveProblem();
    window.location.reload();
}

/**
 * 点击提交正在编辑的任务,同时检验相关输入是否有出错
 */
function clickTaskSubmit() {
    saveProblem();
    var flag = 1;
    var temp = $(".textarea");
    $.each(temp, function (i, e) { 
        if (!$(this).html()) flag = 0;
    });
    temp = $("input");
    $.each(temp,function(i,e){
        if (!$(this).val()) flag = 0;
    });
    $.each(idArr, function (i,e) { 
        temp = "#answer-"+e;
        $("#answer-tip-"+e).html("");
        if ($(temp).val()!='A' && $(temp).val()!='B' && $(temp).val()!='C' && $(temp).val()!='D') {
            $("#answer-tip-"+e).html("请输入A或B或C或D");
            flag = 0;
        }
        temp = "#score-"+e;
        temp = parseInt($(temp).val());
        $("#score-tip-"+e).html("");
        if (isNaN(temp) || temp<1 || temp>100) {
            flag = 0;
            $("#score-tip-"+e).html("请输入1到100");
        }

    });
    $("#submit-tip").html("");
    if (!flag) {
        $("#submit-tip").html("请检查是否有输入错误或未填");
        return;
    }
    if (!idArr.length) {
        $("#submit-tip").html("题目数量不能少于1条");
        return;
    }
    if ($("#time").val().replace("T"," ")<=Timer) {
        $("#submit-tip").html("时间设置出错");
        return;
    }
    $.ajax({
        type: "POST",
        url: "src/server/setTask.php",
        data: {
            task_title:$("#title").html(),
            task_create:Timer,
            task_deadline:$("#time").val().replace("T"," "),
            task_id:nowId
        },
        dataType:"json",
        success: function (response) {
            $.ajax({
                type: "POST",
                url: "src/server/setTask.php",
                data: {
                    task_id:nowId,
                    task_state:1,
                },
                
                dataType: "json",
                success: function (response) {
                    window.location.reload();
                }
            });
        }
    });
}

/**
 * 点击编辑任务事件
 */
function clickTaskEdit() {
    num = 0;
    var that = $(this);
    var id = that.attr('id').split('-')[1];
    nowId = id;
    idArr = [];
    $.ajax({
        type: "POST",
        url: "src/server/getProblems.php",
        data: {
            task_id:id,
        },
        dataType: "json",
        success: function (response) {
            var ti = deadlineArr[id].replace(" ","T");
            if (ti[ti.length-1]=='0' && ti[ti.length-2]=='0') {
                ti=ti.substr(0,ti.length-2)+'01';
            }
            var str =  "<div class='content-box top-margin white'>"+
                            "<p>标题:</p>" +
                            "<div class='textarea' contenteditable='true' placeholder='标题' id='title'>" +titleArr[id]+ "</div><br>" +
                            "<span class='right-padding'>截止时间:</span>" +
                            "<input type='datetime-local' value=" + ti +" class='default' id='time'>" +
                        "</div>";
            $.each(response[0]["data"], function (i,e) {
                var id = e["problem_id"];
                num++;
                str +=  "<div id=problem-" + num + " class='content-box top-margin white'>" + 
                            "<div class='h-between center'>" +
                                "<p class='middle-title'>题目#" + num + "</p>" +
                                "<button type='button' class='btn btn-danger center' id=btn-remove-" + num + " val="+ id +"><span class='glyphicon glyphicon-minus color-white'></span></button>" +
                            "</div>" +
                            "<p>请输入题目内容:</p>" +
                            "<div class='textarea' contenteditable='true' placeholder='题目内容' id=content-" + num + ">"+ e["problem_content"] + "</div>" +
                            "<p>选项A:</p>" +
                            "<div class='textarea' contenteditable='true' placeholder='选项A' id=option1-" + num + ">"+ e["problem_option1"] + "</div>" +
                            "<p>选项B:</p>" +
                            "<div class='textarea' contenteditable='true' placeholder='选项B' id=option2-" + num + ">"+ e["problem_option2"] + "</div>" +
                            "<p>选项C:</p>" +
                            "<div class='textarea' contenteditable='true' placeholder='选项C' id=option3-" + num + ">"+ e["problem_option3"] + "</div>" +
                            "<p>选项D:</p>" +
                            "<div class='textarea' contenteditable='true' placeholder='选项D' id=option4-" + num + ">"+ e["problem_option4"] + "</div>" +
                            "<div class='top-margin'>" +
                                "<span>正确答案: </span>" +
                                "<input class='answer-input form-control' placeholder='ABCD' id=answer-" + num +" value="+e["problem_answer"] + ">" +
                                "<span id=answer-tip-"+ num + " class='left-padding' style='color: red;'></span>" +
                            "</div>" + 
                            "<div class='top-margin'>" +
                                "<span>题目得分: </span>" +
                                "<input class='answer-input form-control' placeholder='1-100' id=score-" + num +" value="+e["problem_score"] + ">" +
                                "<span id=score-tip-"+ num + " class='left-padding' style='color: red;'></span>" +
                            "</div>" + 
                        "</div>";
                idArr.push(num);
            });
            str += "<div class='top-padding' id='btn-add-box'><button type='button' class='btn btn-info' id='btn-add'><span class='glyphicon glyphicon-plus color-white'></span></button></div>"
            var temp =  "<span class='color-red right-padding' id='submit-tip'></span>"+
                        "<button type='button' class='btn btn-primary' id='btn-save'>保存</button>" +
                        "<button type='button' class='btn btn-success' id='btn-submit'>发布任务</button>";
            showModal("编辑任务",str,temp,"h-center");
            for (var i=1;i<=num;i++) {
                temp = "#btn-remove-"+i;
                $(temp).on("click",clickProblemRemove);
                temp = "#answer-"+i;
                $(temp).on("blur",answerBlur);
                temp = "#score-"+i;
                $(temp).on("blur",scoreBlur);
            }
            $("#btn-add").on("click",clickProblemAdd);
            $("#btn-save").on("click",clickTaskSave);
            $("#btn-submit").on("click",clickTaskSubmit);
        }
    });

}


/**
 * 点击增加任务事件
 */
function clickAddTask() {
    var ti = Timer.replace(" ","T");
    var str =   "<div class='content-box white'>"+
                    "<p>标题:</p>" +
                    "<div class='textarea' contenteditable='true' placeholder='标题' id='task-title'></div><br>" +
                    "<span class='right-padding'>截止时间:</span>" +
                    "<input type='datetime-local' value=" + ti +" class='default' id='time'>" +
                "</div>";
    var temp = "<span class='color-red right-padding' id='submit-tip'></span>" + 
                "<button type='button' class='btn btn-success' id='btn-submit'>提交</button>";
    showModal("添加任务",str,temp);
    $("#btn-submit").on("click",function() {
        if($("#task-title").html()) {
            $.ajax({
                type: "POST",
                url: "src/server/setTask.php",
                data: {
                    task_title:$("#task-title").html(),
                    task_create:Timer,
                    task_deadline:$("#time").val()
                },
                dataType: "json",
                success: function (response) {
                    window.location.reload();
                }
            });
        } else {
            $("#submit-tip").html("标题不能为空");
        }
    })
}

/**
 * 动态生成所有任务的HTML结构
 */
function generateTaskOnPage() {
    $.ajax({
        type: "POST",
        url: "src/server/getTasks.php",
        data: {
            task_state:1,
        },
        dataType: "json",
        success: function (response) {
            var str = "";
            $.each(response[0]["data"], function (i, e) { 
                str += getTaskHtml(e["task_id"],e["task_title"],e["task_create"],e["task_deadline"],e["task_state"]);
            });
            $("#task-bar").append(str);
            $.each(response[0]["data"], function (i, e) { 
                var id = e["task_id"];
                titleArr[id] = e["task_title"];
                deadlineArr[id] = e["task_deadline"];
                str = "#remove-"+id;
                $(str).on("click",clickTaskRemove);
                str = "#ask-"+id;
                $(str).on("click",clickAskUser);
                str = "#edit-"+id;
                $(str).on("click",clickTaskEdit);
                str = "#pause-"+id;
                $(str).on("click",clickPause);
            });
        }
    });
}


/**
 * 点击将回收站中的任务恢复事件
 */
function clickTaskRecover() {
    var id = $(this).attr('id').split('-')[1];
    showModal("信息提示","<h4>确认要恢复此任务吗</h4>",BACK);
    $("#btn-confirm").on('click',function() {
        $.ajax({
            type: "POST",
            url: "src/server/setTask.php",
            data: {
                task_state:-1,
                task_id:id,
            },
            dataType:"json",
            success: function(response) {
                $("#trash").click();
            }
        });
    });
    $("#btn-cancel").on("click",function() {
        $("#trash").click();
    })
}

/**
 * 点击将回收站中的任务永久删除事件
 */
function clickTaskDeleteForever() {
    var id = $(this).attr('id').split('-')[1];
    showModal("信息提示","<h4>确认要永久删除此任务吗</h4>",BACK);
    $("#btn-confirm").on('click',function() {
        $.ajax({
            type: "POST",
            url: "src/server/setTask.php",
            data: {
                task_state:-2,
                task_id:id,
            },
            dataType:"json",
            success: function(response) {
                $("#trash").click();
            }
        });
    });
    $("#btn-cancel").on("click",function() {
        $("#trash").click();
    })
}

/**
 * 点击回收站,动态生成所有已被删除的任务
 */
function clickTrash() {
    var str = "<table class='full-width white'>"+
                "<thead class='full-width white'>" +
                    "<tr class='tr-head'>" +
                        "<th class='text-center' style='width: 20%;'>任务名</th>" +
                        "<th class='text-center' style='width: 20%;'>创建时间</th>" +
                        "<th class='text-center' style='width: 20%;'>截止时间</th>" +
                        "<th class='text-center' style='width: 20%;'>删除</th>" +
                        "<th class='text-center' style='width: 20%;'>恢复</th>" +
                    "</tr>" +
                "</thead>" +
                "<tbody>";
    $.ajax({
        type: "POST",
        url: "src/server/getTasks.php",
        data: {
            task_state:0,
        },
        dataType: "json",
        success: function (response) {
            $.each(response[0]["data"], function (i,e) {
                str +=  "<tr class='tr-body' id=trash-" + e["task_id"] + ">" + 
                            "<td>" + e["task_title"] + "</td>" +
                            "<td>" + e["task_create"] + "</td>" + 
                            "<td>" + e["task_deadline"] + "</td>" + 
                            "<td><button class='btn btn-danger' id=delete-"+ e['task_id'] +">彻底删除</button></td>" +
                            "<td><button class='btn btn-success' id=recover-"+ e['task_id'] +">恢复</button></td>" +
                        "</tr>";
            });
            showModal("回收站",str,BUTTON,"h-center");
            $.each(response[0]["data"], function (i,e) {
                str = "#recover-"+e['task_id'];
                $(str).on("click",clickTaskRecover);
            });
            $.each(response[0]["data"], function (i,e) {
                str = "#delete-"+e['task_id'];
                $(str).on("click",clickTaskDeleteForever);
            });
            $("#modal-tip").on("hide.bs.modal",function() {
                window.location.reload();
            })
        }
    });
}

function publishPage() {
    init("#task");
    $("#add").on("click",clickAddTask);
    $("#trash").on("click",clickTrash);
    generateTaskOnPage();
}

$(document).ready(publishPage);