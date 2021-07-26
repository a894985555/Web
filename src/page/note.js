/**
 * author:zc
 * date:2021-05-27
 */


var nowNoteFileId = '';     //当前选中的笔记文件夹
var content = Array();      //缓存笔记内容
const PAGENUM = 5;          //一个页面呈现多少分页
const NOTENUM = 5;          //一个分页呈现多少个笔记文件价
var nowPage = 1;            //当前分页的页面


/**
 * 点击删除笔记
 */
function clickNoteDel() {
    var id = $(this).attr('id').split('-')[1];
    showModal("信息提示","<h4>确认删除吗</h4>",CONFIRM);
    $("#btn-confirm").on("click",function() {
        $.ajax({
            type: "POST",
            url: "src/server/setNote.php",
            data: {
                note_id:id,
                note_state:0,
            },
            dataType: "json",
            success: function (response) {
                $("#noteFile-"+nowNoteFileId).click();
                hideModal();
            }
        });
    })
}


/**
 * 点击编辑笔记
 */
function clickNoteEdit() {
    var that = $(this);
    var id = that.attr('id').split('-')[1];
    if (that.data('val')=='1') {
        var str = "<div class='textarea gray' contenteditable='true' id=noteText-"+ id +">" + content[id] + "</div>";
        $("#noteText-"+id).before(str).remove();
        that.children().removeClass("glyphicon-pencil").addClass("glyphicon-floppy-disk");
        that.data('val','0');
    } else {
        content[id] = $("#noteText-"+id).html();
        $.ajax({
            type: "POST",
            url: "src/server/setNote.php",
            data: {
                note_id:id,
                note_content:content[id]
            },
            dataType: "json",
            success: function (response) {
                showModal("信息提示","<h4>保存成功</h4>",BUTTON);
                var str = "<div class='note-text' id=noteText-"+ id +">" + content[id] + "</div>";
                $("#noteText-"+id).before(str).remove();
                that.children().removeClass("glyphicon-floppy-disk").addClass("glyphicon-pencil");
                that.data('val','1');
            }
        });
    }
}


/**
 * 点击笔记文件夹编辑
 */
function clickNoteFileEdit() {
    var temp =  "<div class='full-width h-between'>" +
                    "<button type='button' class='btn btn-danger' id='btn-del'><span class='glyphicon glyphicon-trash color-white center'></span></button>"+
                    "<div><span class='color-red right-padding' id='submit-tip'></span>" +
                    "<button type='button' class='btn btn-default' data-dismiss='modal' id='btn-cancel'>取消</button>"+
                    "<button type='button' class='btn btn-primary' id='btn-confirm'>确定</button></div>" +
                "</div>";
    showModal("编辑文件夹","<input type='text' id='noteFile-text' class='input'>",temp,"h-center");
    var that = $(this);
    var str = that.next().html();
    var id = that.attr('id').split('-')[1];
    $("#noteFile-text").val(str);
    $("#btn-confirm").on("click",function() {
        if ($("#noteFile-text").val()) {
            if ($("#noteFile-text").val() == str) {
                hideModal();
            } else {
                $.ajax({
                    type: "POST",
                    url: "src/server/setNoteFile.php",
                    data: {
                        note_file_id:id,
                        note_file_title:$("#noteFile-text").val(),
                        user_name:userName
                    },
                    dataType: "json",
                    success: function (response) {
                        if (response[0]["code"] == '0') {
                            $("#submit-tip").html("文件夹名已经存在");
                        } else {
                            clickSearch();
                            hideModal();
                        }
                    }
                });
            }
        } else {
            $("#submit-tip").html("文件名不能为空");
        }
    });
    $("#btn-del").on("click",function() {
        showModal("信息提示","<h4>确认删除吗</h4>",BACK);
        $("#btn-cancel").html("返回");
        $("#btn-confirm").on("click",function() {
            $.ajax({
                type: "POST",
                url: "src/server/setNoteFile.php",
                data: {
                    note_file_id:id,
                    note_file_state:0,
                },
                dataType: "json",
                success: function (response) {
                    clickSearch();
                    hideModal();
                }
            });
        });
        $("#btn-cancel").on("click",function() {
            that.click();
        });
    })
}

/**
 * 动态生成笔记
 */
function generateNoteOnPage() {
    var id = $(this).attr('id').split('-')[1];
    nowNoteFileId = id;
    $('.choose').removeClass('choose');
    $(this).addClass('choose');
    var tilte = $(this).html();
    $.ajax({
        type: "POST",
        url: "src/server/getNotes.php",
        data: {
            note_file_id:id,
            user_name:userName,
        },
        dataType: "json",
        success: function (response) {
            var str = "<div class='full-width h-left'><img src='static/image/note.svg' class='note-img'><h2 class='color-white'>" + tilte + "</h2></div>";
            if (response[0]["data"].length==0) str += "<div class='problem-box h-center-row'><h4>快去收录题目吧</h4><img src='static/image/smile.svg' class='note-img'></div>"
            $.each(response[0]["data"], function (i,e) { 
                var userOption = e["problem_record_useroption"];
                var temp = e["note_id"];
                content[temp] = e["note_content"];
                str +=  "<div class='problem-box v-center'>" +
                            "<h4>"+ (i+1)+". " + e["problem_content"] + "</h4>" +
                            "<label class='label-box " + ('A' == e["problem_answer"]?"correct-highlight'":'A'==userOption?"fail-highlight' ":"'") +">" + "A. " + e["problem_option1"] + "</label>" +
                                "<label class='label-box " + ('B' == e["problem_answer"]?"correct-highlight'":'B'==userOption?"fail-highlight' ":"'") +">" + "B. " + e["problem_option2"] + "</label>" +
                                "<label class='label-box " + ('C' == e["problem_answer"]?"correct-highlight'":'C'==userOption?"fail-highlight' ":"'") +">" + "C. " + e["problem_option3"] + "</label>" +
                                "<label class='label-box " + ('D' == e["problem_answer"]?"correct-highlight'":'D'==userOption?"fail-highlight' ":"'") +">" + "D. " + e["problem_option4"] + "</label>" +
                                "<div class='full-width h-center-row'>"+
                                "<div style='width:70%'><p>解析：正确答案：" + e["problem_answer"] + " 我的答案：" + userOption + "</p></div>" +
                                "<div style='width:30%' class='h-right'>" + 
                                    "<button id=noteDel-"+ temp +" class='btn btn-danger'><span class='glyphicon glyphicon-trash h-center-row color-white' style='font-size:24px'></span></button>" +
                                "</div>" + 
                            "</div>" +
                            "<div class='note-content h-end'>" + 
                                "<div class='note-text' id=noteText-" + temp +">" + e["note_content"] + "</div>" +
                                "<div style='margin-left:10px'><button id=noteEdit-"+ temp +" class='btn btn-primary' data-val='1'><span class='glyphicon glyphicon-pencil h-center-row color-white' style='font-size:24px'></span></button></div>" +
                            "</div>" +
                        "</div>";
            });
            $(".note-main").children().remove();
            $(".note-main").append(str);
            $.each(response[0]["data"], function (i,e) { 
                var temp = e["note_id"];
                $("#noteDel-"+temp).on("click",clickNoteDel);
                $("#noteEdit-"+temp).on("click",clickNoteEdit);
            });
        }
    });
}


/**
 * 动态生成笔记文件夹
 * @param {*} query 查询文件夹的关键词
 */
function generateNoteFileOnPage(query="") {
    $.ajax({
        type: "POST",
        url: "src/server/getNoteFiles.php",
        data: {
            user_name:userName,
            start:(nowPage-1)*NOTENUM,
            num:NOTENUM,
            query:query
        },
        dataType: "json",
        success: function (response) {
            var str = "";
            var num;
            $.each(response[0]["data"], function (i,e) {
                if (!e["note_file_id"]) {
                    num = +e['nums'];
                    return false
                } 
                str += "<tr class='tr'>" + 
                            "<td style='width: 20%;' id=editFile-" + e["note_file_id"] + "><span class='glyphicon glyphicon-folder-close info-box center'></span></td>" +
                            "<td style='width: 80%;' id=noteFile-" + e["note_file_id"] + ">" + e["note_file_title"] +"</td>" +
                        "</tr>";
            });
            $("tbody").children().remove();
            $("table").next().remove();

            if (num==0) {
                str = "<div class='center'><h4 class='color-white'>没有相关的文件夹</h4></div>";
                $("tbody").append(str);
            } else {
                $("tbody").append(str);
                $("table").after(getPaginationHtml(parseInt((num+PAGENUM-1)/PAGENUM),NOTENUM,nowPage));
                $.each(response[0]["data"], function (i, e) {
                    $("#noteFile-"+e["note_file_id"]).on("click",generateNoteOnPage);
                    $("#editFile-"+e["note_file_id"]).on("click",clickNoteFileEdit);
                });
                
                $('li').off();
                $('li').on("click",function() {
                    var num = $(this).children().html();
                    if (num=='上一页') {
                        nowPage--;
                    } else if (num=='下一页') {
                        nowPage++;
                    } else {
                        nowPage = +num;
                    }
                    generateNoteFileOnPage();
                })
            }
        }
    });
}

/**
 * 点击搜索事件
 */
function clickSearch() {
    nowPage=1;
    generateNoteFileOnPage($("#search-text").val());
}

/**
 * 注册回车搜索事件
 */
function keyUpSearch(e) {
    if (e.keyCode==13){
        clickSearch();
    }
} 


/**
 * 点击添加文件夹
 */
function clickAddFile() {

    showModal("创建新文件夹","<input type='text' placeholder='请输入文件名' id='noteFile-text' class='input'>",CONFIRM,"h-center");
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
                        $("#submit-tip").html("文件夹名已经存在");
                    } else {
                        $("#search-text").val("");
                        clickSearch();
                        hideModal();
                    }
                }
            });
        } else {
            $("#submit-tip").html("文件夹名不能为空");
        }
    });
}


function notePage() {
    init('#note');
    clickSearch();
    $("#search-text").on("keyup",keyUpSearch);
    $("#search").on("click",clickSearch);
    $("#add").on("click",clickAddFile);
}


$(document).ready(notePage);




