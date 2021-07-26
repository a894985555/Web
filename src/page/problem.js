/**
 * author:zc
 * date:2021-05-25
 */

var problemOption = Array();    //缓存问题选项
var problemAnswer = Array();    //缓存问题答案
var problemScore = Array();     //缓存问题分数
var taskDone = '';              //缓存任务是否完成
var taskTitle = Array();        //缓存任务标题
var taskCreate = Array();       //缓存任务创建时间
var taskDeadline = Array();     //缓存任务截止日期
var nowProblemId = Array();     //缓存当前问题ID
var right = Array();            //缓存某条问题是否回答正确



/**
 * 选中的label高光显示
 */
function labelHighlight() {
    $("label").removeClass("highlight")
	$("input[type='radio']:checked").parent().addClass("highlight");
    var id = $(this).parent().parent().data('num');
    $("#complete-"+id).removeClass("problem-info").addClass("problem-info-active");
}

/**
 * 点击索引事件,滚动条移动到索引对应的位置
 */
function clickIndex() {
    var id = $(this).attr('id').split('-')[1];
    $.each($(".problem-box"), function (i,e) { 
        if ($(this).data('num')==id) {
            var top = $(this).offset().top;
            $("html,body").animate({scrollTop:top-200},200);
        }
    });
}


/**
 * 动态生成问题的记录
 */
function generateProblemRecordOnPage(arr) {
    $.each(arr, function (i, e) { 
        var str = "#" + e["problem_id"] +"-"+ e["problem_record_useroption"];
        $(str).parent().addClass("highlight");
        $(str).prop("checked",true);
        var id = $(str).parent().parent().data('num');
        $("#complete-"+id).removeClass("problem-info").addClass("problem-info-active");
    });
}

/**
 * 动态生成问题的HTML结构
 */
function generateProblemOnPage(id,arr) {
    $.ajax({
        type: "POST",
        url: "src/server/getProblems.php",
        data: {
            task_id:id,
        },
        dataType: "json",
        success: function (response) {
            var totScore = 0;
            var str='';
            problemNum = response[0]["data"].length;
            
            if (taskDone == '1') {
                $.each(response[0]["data"], function (i, e) { 
                    var temp = e["problem_id"];
                    problemAnswer[temp] = e["problem_answer"];
                    problemScore[temp] = e["problem_score"];
                    var userOption = problemOption[temp]?problemOption[temp]:"";
                    var userScore = problemOption[temp]===e["problem_answer"]?e["problem_score"]:0;
                    totScore += +userScore;
                    str +=  "<div class='problem-box v-center' data-num="+(i+1)+">" +
                                "<h4>"+ (i+1)+". " + e["problem_content"] + "</h4>" +
                                "<label class='label-box " + ('A' == e["problem_answer"]?"correct-highlight'":'A'==userOption?"fail-highlight' ":"'") +">" + "A. " + e["problem_option1"] + "</label>" +
                                "<label class='label-box " + ('B' == e["problem_answer"]?"correct-highlight'":'B'==userOption?"fail-highlight' ":"'") +">" + "B. " + e["problem_option2"] + "</label>" +
                                "<label class='label-box " + ('C' == e["problem_answer"]?"correct-highlight'":'C'==userOption?"fail-highlight' ":"'") +">" + "C. " + e["problem_option3"] + "</label>" +
                                "<label class='label-box " + ('D' == e["problem_answer"]?"correct-highlight'":'D'==userOption?"fail-highlight' ":"'") +">" + "D. " + e["problem_option4"] + "</label>" +
                                "<div class='full-width h-center-row'>"+
                                    "<div style='width:70%'><p>解析：正确答案：" + e["problem_answer"] + " 我的答案：" + userOption + " 得分：<span class='small-score'>" + userScore + "分</span>" + "</p></div>" +
                                    "<div style='width:30%' class='h-right'><button id=store-"+ temp +" class='btn btn-primary mybtn'><span class='glyphicon glyphicon-bookmark h-center-row color-white' style='font-size:24px'></span></button></div>" + 
                                "</div>" +
                            "</div>";
                    right[i+1] = problemAnswer[temp]==userOption?1:0;
                });
                $("#problem-bar").append(str);
                str =   "<div class='v-center' id='problem-head'>"+
                        "<h4>作业名称："+ taskTitle[id] + "</h4>" +
                        "<p>发布时间：" + taskCreate[id] + "</p>" + 
                        "<p>截止时间：" + taskDeadline[id] + "</p>" +
                        "<h4>总得分：<span class='small-score'>" + totScore + "分</span></h4>"+
				        "</div>";
                $("#problem-head-bar").append(str);
                $.each(response[0]["data"], function (i, e) {
                    $("#store-"+e["problem_id"]).on("click",clickStore);
                });
                str = "";
                for (var i=1;i<=problemNum;i++) {
                    if (right[i]) {
                        str += "<li class='problem-info-active' id=complete-"+ i +">"+i+"</li>";
                    } else {
                        str += "<li class='problem-info' id=complete-"+ i +">"+i+"</li>";
                    }
                }
                $("#complete-bar").append(str);
                for (var i=1;i<=problemNum;i++) {
                    $("#complete-"+i).on("click",clickIndex);
                }

            } else {
                $.each(response[0]["data"], function (i, e) {
                    var temp = e["problem_id"];
                    problemAnswer[temp] = e["problem_answer"];
                    problemScore[temp] = e["problem_score"];
                    totScore += +e["problem_score"];
                    str +=  "<div class='problem-box v-center' data-num="+(i+1)+">" +
                                "<h4>"+ (i+1) + ". " + e["problem_content"] + "</h4>" +
                                "<label class='label-box' style='cursor: pointer;'><input name=" + i + " type='radio' value=" + e["problem_id"] + "-A id=" + (e["problem_id"]+"-A") + "> " + "A. " + e["problem_option1"] + "</label>" +
                                "<label class='label-box' style='cursor: pointer;'><input name=" + i + " type='radio' value=" + e["problem_id"] + "-B id=" + (e["problem_id"]+"-B") + "> " + "B. " + e["problem_option2"] + "</label>" +
                                "<label class='label-box' style='cursor: pointer;'><input name=" + i + " type='radio' value=" + e["problem_id"] + "-C id=" + (e["problem_id"]+"-C") + "> " + "C. " + e["problem_option3"] + "</label>" +
                                "<label class='label-box' style='cursor: pointer;'><input name=" + i + " type='radio' value=" + e["problem_id"] + "-D id=" + (e["problem_id"]+"-D") + "> " + "D. " + e["problem_option4"] + "</label>" +
                            "</div>";

                });
                $("#problem-bar").append(str);
                str =   "<div class='v-center' id='problem-head'>"+
                            "<h4>作业名称："+ taskTitle[id] + "</h4>" +
                            "<p>发布时间：" + taskCreate[id] + "</p>" + 
                            "<p>截止时间：" + taskDeadline[id] + "</p>" +
                            "<h4>总分：<span class='small-score'>" + totScore + "分</span></h4>" + 
                        "</div>";
                $("#problem-head-bar").append(str);

                str = "";
                for (var i=1;i<=problemNum;i++) {
                    str += "<li class='problem-info' id=complete-"+ i +">"+i+"</li>";
                }
                str += "<div class='btn-box'>" +
                            "<button class='btn btn-success mybtn' id='" + id + "-submit'><span class = 'glyphicon glyphicon-ok-sign' style='color:white; font-size:30px'></span></button>" +
                            "<button class='btn btn-primary mybtn' id='" + id + "-save'><span class = 'glyphicon glyphicon-floppy-disk' style='color:white; font-size:30px'></span></button>" +
                        "</div>";
                $("#complete-bar").append(str);
                for (var i=1;i<=problemNum;i++) {
                    $("#complete-"+i).on("click",clickIndex);
                }
                $("input").on("click",labelHighlight);
                var str = "#"+taskId+"-save";
                $(str).on("click",clickSave);
                var str = "#"+taskId+"-submit";
                $(str).on("click",clickSubmit);
                generateProblemRecordOnPage(arr);
            }
        }
    });
}

/**
 * 点击保存答题
 */
function clickSave() {
    var optionArr = [];
    var idArr = [];
    var arr = $("input[type='radio']:checked");
    $.each(arr, function (i,e) { 
        var str = $(e).val();
        var id = str.split("-")[0];
        var option = str.split("-")[1];
        idArr.push(id);
        optionArr.push(option);
    });
    $.ajax({
        type: "POST",
        url: "src/server/setProblemRecord.php",
        data: {
            task_id:taskId,
            user_name:userName,
            problem_record_useroption:optionArr,
            problem_id:idArr
        },
        success: function (response) {
            showModal("信息提示","<h4>保存成功</h4>",BUTTON);
        }
    });
}

/**
 * 点击提交答题
 */
function clickSubmit() {
    var arr = $("input[type='radio']:checked");
    if (arr.length != problemNum) {
        showModal("信息提示","<h4>有未完成的题目,请继续完成</h4>",BUTTON);
    } else {
        showModal("信息提示","<h4>确认提交吗</h4>",CONFIRM);
        $("#btn-confirm").on("click",function() {
            var arr = $("input[type='radio']:checked");
            var got = 0;
            var optionArr = [];
            var idArr = [];
            $.each(arr, function (i,e) { 
                var str = $(e).val();
                var id = str.split("-")[0];
                var option = str.split("-")[1];
                if (option == problemAnswer[id]) {
                    got += +problemScore[id];
                }
                idArr.push(id);
                optionArr.push(option);
            });
            $.ajax({
                type: "POST",
                url: "src/server/setTaskRecord.php",
                data: {
                    task_id:taskId,
                    user_name:userName,
                    task_record_totalscore:got
                },
                dataType: "json",
                success: function (response) {
                    $.ajax({
                        type: "POST",
                        url: "src/server/setProblemRecord.php",
                        data: {
                            task_id:taskId,
                            user_name:userName,
                            problem_record_useroption:optionArr,
                            problem_id:idArr
                        },
                        dataType: "json",
                        success: function (response) {
                            window.location.href = 'task.html';
                        }
                    });
                }
            });
        });
    }
}


/**
 * 将题目保存到文件夹下
 */
function submitStore() {
    var that = $(this);
    var id = that.attr('id').split('-')[1];
    var val;
    if (that.html() == '收藏' ) {
        that.removeClass("btn-default").addClass("btn-danger");
        that.html('取消收藏'); 
        val = 1;
    } else {
        that.removeClass("btn-danger").addClass("btn-default");
        that.html('收藏'); 
        val = 0;
    }
    $.ajax({
        type: "POST",
        url: "src/server/setNote.php",
        data: {
            note_file_id:id,
            problem_id:nowProblemId,
            note_state:val,
            note_create:Timer,
            user_name:userName
        },
        dataType: "json",
        success: function (response) {
            
        }
    });
}



/**
 * 添加文件夹
 */
function addNoteFile() {
    showModal("创建新文件夹","<input type='text' placeholder='请输入文件名' id='noteFile-text' class='input'>",BACK,"h-center");
    $("#btn-cancel").html("返回");
    $("#btn-cancel").on("click",function() {
        $("#store-"+nowProblemId).click();
    });
    $("#btn-confirm").on("click",function() {
        if ($("#noteFile-text").val()) {
            $.ajax({
                type: "POST",
                url: "src/server/setNoteFile.php",
                data: {
                    note_file_title:$("#noteFile-text").val(),
                    note_file_create:Timer,
                    user_name:userName
                },
                dataType: "json",
                success: function (response) {
                    if (response[0]["code"] == '0') {
                        $("#submit-tip").html("文件夹已经存在");
                    } else {
                        $("#store-"+nowProblemId).click();
                    }
                }
            });
        } else {
            $("#submit-tip").html("文件名不能为空");
        }
    });
        
}


/**
 * 点击收藏按钮触发模态框,动态生成文件夹HTML
 */
function clickStore() {
    var id = $(this).attr('id').split('-')[1];
    var noteFileId = Array();
    nowProblemId = id;
    $.ajax({
        type: "POST",
        url: "src/server/getNotes.php",
        data: {
            user_name:userName,
            problem_id:id,
        },
        dataType: "json",
        success: function (response) {
            $.each(response[0]["data"], function (i,e) { 
                noteFileId[e["note_file_id"]] = 1;
            });
            $.ajax({
                type: "POST",
                url: "src/server/getNoteFiles.php",
                data: {
                    user_name:userName,
                },
                dataType: "json",
                success: function (response) {
                    var str =   "<div class='full-width center' style='margin:10px'><button class='btn btn-info' id='submit-noteFile'><span class='glyphicon glyphicon-plus color-white'></button></div>" + 
                                "<table class='full-width white'>"+
                                "<tbody>";
                    $.each(response[0]["data"], function (i,e) { 
                        str +=  "<tr class='tr'>" + 
                                    "<td style='width:10%'><span class='glyphicon glyphicon-folder-close center'></span></td>" +
                                    "<td class='text-left' style='width:70%'>"+e["note_file_title"] +"</td>" +
                                    (noteFileId[e["note_file_id"]]?"<td style='width:20%'><button class='btn btn-danger' id=noteFile-"+ e["note_file_id"] +">取消收藏</button></td>"
                                    :"<td style='width:20%'><button class='btn btn-default' id=noteFile-"+ e["note_file_id"] +">收藏</button></td>") +
                                "</tr>";
                    });
                    str += "</tbody></table>";
                    showModal("收藏题目",str,BUTTON,"h-center");
                    $.each(response[0]["data"], function (i,e) { 
                        $("#noteFile-"+e["note_file_id"]).on("click",submitStore);
                    });
                    $("#submit-noteFile").on("click",addNoteFile);
                }
            });
        }
    });
}

function problemPage() {
    init("#task");
    taskId = window.location.href.split('?')[1].split('=')[1];
    taskDone = window.location.href.split('?')[2].split('=')[1];
    $.ajax({
        type: "POST",
        url: "src/server/getTasks.php",
        dataType: "json",
        success: function (response) {
            $.each(response[0]["data"], function (i,e) {
                taskTitle[e["task_id"]] = e["task_title"];
                taskCreate[e["task_id"]] = e["task_create"];
                taskDeadline[e["task_id"]] = e["task_deadline"];
            });
            $.ajax({
                type: "POST",
                url: "src/server/getProblemRecords.php",
                data: {
                    task_id:taskId,
                    user_name:userName,
                },
                dataType: "json",
                success: function (response) {
                    $.each(response[0]["data"], function (i,e) { 
                        problemOption[e["problem_id"]] = e["problem_record_useroption"];
                    });
                    generateProblemOnPage(taskId,response[0]["data"]);
                }
            });
        }
    });
}

$(document).ready(problemPage);