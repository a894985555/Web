/**
 * author:zc
 * date:2021-05-26
 */

var userPic = Array();          //所有用户头像数组
var discussEval = Array();      //当前用户对所有讨论的评价
var commentEval = Array();      //当前用户对所有评论的评价
var replyEval = Array();        //当前用户对所有回复的评价
var nowPage = Array();          //某个问题下回答的当前分页处在第几页
const PAGENUM = 5;              //一个页面呈现多少分页
const COMMENTNUM = 5;           //一个分页呈现多少条评论



/**
 * 将用户发表的讨论、评论、回复数据发送到后端
 */
function setMessage() {
    if (!userName) {
        window.location.href="login.html";
        return;
    }
    var that = $(this);
    var type = that.data('type');
    var id = that.data('id');
    var str = '';
    if (!type) {
        str = that.parents('.modal-content').find('.edit-text').html();
        if (str) {
            $.ajax({
                type: "POST",
                url: "src/server/setDiscuss.php",
                data: {
                    discuss_content:str,
                    discuss_create:Timer,
                    user_name:userName
                },
                dataType: "json",
                success: function (response) {
                    clickSearch();
                    hideModal();
                }
            });
        } else {
            $("#submit-tip").html("内容不能为空");
        }
    } else if (type=='2') {
        str = that.parents('.edit-box').find('.edit-text').html();
        if (str) {
            $.ajax({
                type: "POST",
                url: "src/server/setComment.php",
                data: {
                    comment_content:str,
                    comment_create:Timer,
                    discuss_id:id,
                    user_name:userName
                },
                dataType: "json",
                success: function (response) {
                    that = that.parents(".discuss-box").find('.glyphicon-comment');
                    that.html(+(that.html())+1);
                    that.click().click();
                    showModal("信息提示","<h4>回复成功</h4>",BUTTON);
                }
            });
        }
    } else {
        str = that.parents('.edit-box').find('.edit-text').html();
        replyName = that.parents('.comment-box').find('.user-name').eq(0).html();
        if (str) {
            $.ajax({
                type: "POST",
                url: "src/server/setReply.php",
                data: {
                    reply_content:str,
                    reply_create:Timer,
                    reply_name:replyName,
                    comment_id:id,
                    user_name:userName
                },
                dataType: "json",
                success: function (response) {
                    that = $(that.parents().find('.discuss-bar').find('.glyphicon-comment'));
                    $.each(that, function (i,e) { 
                        if ($(this).data('id')==id) {
                            $(this).html(+$(this).html()+1);
                            $(this).click();
                            return false;
                        }  
                    });
                }
            });
        }
    }
}

/**
 * 将用户点击的图片存储到本地
 */
function setImg() {
    var that = $(this);
    if (!that[0].files[0]) return;
    var content = new FormData();
    content.append('file',that[0].files[0]);
    $.ajax({
        type: "POST",
        url: "src/server/setImg.php",
        data: content,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (response) {
            var str = "<img src=" + response[0]["data"] + " class='img-box'>";
            that.next().append(str);
            that.value = "";
        }
    });
}

/**
 * 获取编辑框的HTML结构
 */
function getEditHtml(type,id) {
    return  "<div class='edit-box'>"+
                "<input type='file' class='file' accept='image/*' style='display: none;'>" + 
                "<div class='edit-text' contenteditable='true' placeholder='要不写点什么...'></div>" + 
                "<div class='h-between' style='margin-top:10px'>" + 
                    "<span class='file-submit glyphicon glyphicon-picture' style='font-size:30px;cursor:pointer;'></span>" +
                    "<button class='btn btn-primary btn-submit' data-type=" + type + " data-id="+ id +">提交</button>" +
                "</div>" + 
            "</div>";
}

/**
 * @param type 1|问题 2|回答 3|评论
 * @param id 某个问题、回答或评论的ID
 * @param query 查询的内容
 * @param that 传递对象指针
 * 用于动态生成相关的问题、回答和评论在页面上
 */
function generate(type,id='',query='',that='') {
    if (type=='1') {
        $('.search-bar').nextAll().remove();
        $.ajax({
            type: "POST",
            url: "src/server/getDiscusses.php",
            data: {
                query:query,
            },
            dataType: "json",
            success: function (response) {
                var str = "";
                $.each(response[0]["data"], function (i,e) { 
                    var id = e["discuss_id"];
                    nowPage[id] = 1;
                    str += "<div class='discuss-box h-center"+ (i==0?" top-padding":"") + "'>" + 
                                "<div class='content-box'>" + 
                                    "<div class='h-between center'>" + 
                                        "<div class='h-center-row'>" +
                                            "<img src=" + (e["user_img"]?e["user_img"]:"static/image/default.png") + " class='user-img'>" +
                                            "<span class='user-name'>" + e["user_name"] + "</span>" +
                                        "</div>" + 
                                        (!userIdentity || userIdentity=="user"?"":"<button type='button' class='btn btn-danger center btn-del' style='height:30px' data-type=1 data-id=" + id + "><span class='glyphicon glyphicon-minus color-white'></span></button>")+ 
                                    "</div>" + 
                                    "<div class='inner-box'>" + e["discuss_content"] + "</div>" +
                                "</div>" + 
                                "<div class='h-left foot-box'>" +
                                    "<span class='" + (discussEval[id]=='1'?"eval-box-active":"eval-box") + " glyphicon glyphicon-heart h-center-row' data-val = "+(discussEval[id]=='1'?'1':'0')+ " data-type=1 data-id=" + id + ">" + e["discuss_good"] + "</span>" +
                                    "<span class='left-padding'><span class='reply-box glyphicon glyphicon-comment h-center-row' data-val=0 data-type=2 data-id=" + id + ">" + e["discuss_reply"] + "</span></span>" +
                                    "<span class='full-width'><span class='h-right'>" + e["discuss_create"].split(" ")[0] + "</span></span>" + 
                                "</div>" + 
                            "</div>";
                });

                //如果获取内容为空,呈现搜索出错的标记
                if (str=='') str = "<div class='center' style='margin:50px'><img src='static/image/no.svg' class='img-box'><h2 class='color-white'>换个问题试试看吧</h2><button class='btn btn-default mybtn' style='margin:20px'>继续</button></div>";

                //开启每个回答的评论和点赞事件
                $(".discuss-bar").append(str);
                $(".glyphicon-heart").off();
                $(".glyphicon-heart").on("click",clickGood);
                $(".glyphicon-comment").off();
                $(".glyphicon-comment").on("click",clickShow);
                $(".btn-del").off();
                $(".btn-del").on("click",clickDel);
                $(".mybtn").on("click",function() {
                    $("#search-text").val("");
                    clickSearch();
                })
            }
        });
    } else if(type=='2') {
        $.ajax({
            type: "POST",
            url: "src/server/getComments.php",
            data: {
                discuss_id:id,
                start:(nowPage[id]-1)*COMMENTNUM,
                num:COMMENTNUM
            },
            dataType: "json",
            success: function (response) {
                var str = "<div class='comment-bar'><h4 class='full-width'>总共有"+that.find('.glyphicon-comment').html()+"条回答</h4>";
                $.each(response[0]["data"], function (i,e) { 
                    var id = e["comment_id"];
                    str += "<div class='comment-box h-center'>" + 
                                "<div class='content-box'>" + 
                                    "<div class='h-between center'>" + 
                                        "<div class='h-center-row'>" +
                                            "<img src=" + (e["user_img"]?e["user_img"]:"static/image/default.png") + " class='user-img'>" +
                                            "<span class='user-name'>" + e["user_name"] + "</span>" +
                                        "</div>" + 
                                        (!userIdentity || userIdentity=="user"?"":"<button type='button' class='btn btn-danger center btn-del' style='height:30px' data-type=2 data-id=" + id + "><span class='glyphicon glyphicon-minus color-white'></span></button>")+ 
                                    "</div>" + 
                                    "<div class='inner-box'>" + e["comment_content"] + "</div>" +
                                "</div>" + 
                                "<div class='h-left foot-box'>" +
                                    "<span class='" + (commentEval[id]=='1'?"eval-box-active":"eval-box") + " glyphicon glyphicon-heart h-center-row' data-val = "+(commentEval[id]=='1'?'1':'0')+ " data-type=2 data-id=" + id + ">" + e["comment_good"] + "</span>" +
                                    "<span class='left-padding'><span class='reply-box glyphicon glyphicon-comment h-center-row' data-val=0 data-type=3 data-id=" + id + ">" + e["comment_reply"] + "</span></span>" +
                                    "<span class='full-width'><span class='h-right'>" + e["comment_create"].split(" ")[0] + "</span></span>" + 
                                "</div>" + 
                            "</div>";
                });

                //动态生成回答的分页结构
                str += getPaginationHtml(parseInt((+that.find('.glyphicon-comment').html()+COMMENTNUM-1)/COMMENTNUM),PAGENUM,nowPage[id]);
                str += "</div>";
                str += getEditHtml(type,id);
                that.append(str);


                // 注册图片上传事件
                $('.file').off();
                $('.file').on("change",setImg);
                
                $('.file-submit').off();
                $(".file-submit").on("click",function() {
                    $(this).parent().prevAll('.file').click();
                });

                $('.btn-submit').on('click',setMessage);


                $(".glyphicon-heart").off();
                $(".glyphicon-heart").on("click",clickGood);
                $(".glyphicon-comment").off();
                $(".glyphicon-comment").on("click",clickShow);
                $(".btn-del").off();
                $(".btn-del").on("click",clickDel);


                //给分页添加事件
                $('li').off();
                $('li').on("click",function() {
                    var num = $(this).children().html();
                    var that = $(this).parents('.discuss-box').find('.glyphicon-comment').eq(0);
                    var id = that.data('id');
                    if (num=='上一页') {
                        nowPage[id]--;
                    } else if (num=='下一页') {
                        nowPage[id]++;
                    } else {
                        nowPage[id] = +num;
                    }
                    
                    that.click().click();
                    that = that.parents(".discuss-box");

                    //点击后注册一个滚轮事件回到当前问题的位置
                    var top = that.offset().top;
                    $("html,body").animate({scrollTop:top-20},200);
                })
            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: "src/server/getReplys.php",
            data: {
                comment_id:id,
            },
            dataType: "json",
            success: function (response) {
                var str = that[0].outerHTML;
                    str += "<h4 class='full-width'>总共有"+that.find('.glyphicon-comment').html()+"条评论</h4>";
                $.each(response[0]["data"], function (i,e) {
                    str += "<div class='comment-box h-center'>" + 
                                "<div class='content-box'>" + 
                                    "<div class='h-between center'>" + 
                                        "<div class='h-center-row'>" +
                                            "<img src=" + (e["user_img"]?e["user_img"]:"static/image/default.png") + " class='user-img'>" +
                                            "<span class='user-name'>" + e["user_name"] + "</span>";
                                            if (e["user_name"]!=e["reply_name"]) {
                                                str += "<span class='glyphicon glyphicon-arrow-right' style='padding-left:5px'></span>" +
                                                "<img src=" + (userPic[e["reply_name"]]?userPic[e["reply_name"]]:"static/image/default.png") + " class='user-img'>" +
                                                "<span class='user-name'>" + e["reply_name"] + "</span>";
                                            }
                    str +=               "</div>" + 
                                        (!userIdentity || userIdentity=="user"?"":"<button type='button' class='btn btn-danger center btn-del' style='height:30px' data-type=3 data-id=" + e["reply_id"] + "><span class='glyphicon glyphicon-minus color-white'></span></button>")+ 
                                    "</div>" + 
                                    "<div class='inner-box'>" + e["reply_content"] + "</div>" +
                                "</div>" + 
                                "<div class='h-left foot-box'>" +
                                    "<span class='" + (replyEval[e["reply_id"]]=='1'?"eval-box-active":"eval-box") + " glyphicon glyphicon-heart h-center-row' data-val="+(replyEval[e["reply_id"]]=='1'?'1':'0')+ " data-type=3 data-id=" + e["reply_id"] + ">" + e["reply_good"] + "</span>" +
                                    "<span class='left-padding'><span class='reply-box glyphicon glyphicon-comment h-center-row' data-type=4 data-id=" + id + "></span></span>" +
                                    "<span class='full-width'><span class='h-right'>" + e["reply_create"].split(" ")[0] + "</span></span>" + 
                                "</div>" + 
                            "</div>";
                });

                //以模态框的形式呈现第三层评论
                showModal("查看评论",str,BUTTON);
                $("#modal-tip").on('hide.bs.modal',function() {
                    that.find(".glyphicon-comment").data('val','0');
                    that.find(".glyphicon-comment").removeClass("reply-box-active").addClass("reply-box");
                });

                that = $("#modal-tip").find('.comment-box');
                that.find('.glyphicon-heart').eq(0).data('val',commentEval[id]);
                that.find('.glyphicon-comment').eq(0).data('type','4');
                that.find('.btn-del').eq(0).remove();


                $(".glyphicon-heart").off();
                $(".glyphicon-heart").on("click",clickGood);
                $(".glyphicon-comment").off();
                $(".glyphicon-comment").on("click",clickShow);
                $(".btn-del").off();
                $(".btn-del").on("click",clickDel);
            }
        });
    }
}


/**
 * 点击点赞事件
 */
function clickGood() {
    var that = $(this);
    var id = that.data('id');
    var type = that.data('type');
    var state = that.data('val')=='1'?'0':'1';

    //将点赞添加active的CSS或者删除并且改变其点赞数量
    $.each($(".glyphicon-heart"), function (i,e) {
        if ($(this).data('type')==type && $(this).data('id')==id ) {
            if (state=='1') {
                $(this).removeClass("eval-box").addClass("eval-box-active");
                $(this).html(+($(this).html())+1);
            } else {
                $(this).removeClass("eval-box-active").addClass("eval-box");
                $(this).html(+($(this).html())-1);
            }
            $(this).data('val',state);
        }
    });

    //如果用户未登录不记录数据
    if (!userName) return;

    /**
     * 根据type来判断存储到哪个问题种类评价下
     */
    if (type=='1') {
        discussEval[id] = state;
        $.ajax({
            type: "POST",
            url: "src/server/setDiscussEval.php",
            data: {
                discuss_eval_state:state,
                discuss_id:id,
                user_name:userName
            },
            dataType: "json",
            success: function (response) {
            }
        });
    } else if (type=='2') {
        commentEval[id] = state;
        $.ajax({
            type: "POST",
            url: "src/server/setCommentEval.php",
            data: {
                comment_eval_state:state,
                comment_id:id,
                user_name:userName
            },
            dataType: "json",
            success: function (response) {
            }
        });
    } else {
        replyEval[id] = state;
        $.ajax({
            type: "POST",
            url: "src/server/setReplyEval.php",
            data: {
                reply_eval_state:state,
                reply_id:id,
                user_name:userName
            },
            dataType: "json",
            success: function (response) {
            }
        });

    }
}

/**
 * 点击删除事件
 */
function clickDel() {
    var that = $(this);
    var id = that.data('id');
    var type = that.data('type');
    if (type == '1') {
        showModal("信息提示","<h4>确认删除吗</h4>",CONFIRM);
        $("#btn-confirm").on("click",function() {
            $.ajax({
                type: "POST",
                url: "src/server/setDiscuss.php",
                data: {
                    discuss_id:id,
                    discuss_state:0,
                },
                dataType: "json",
                success: function (response) {
                    clickSearch();
                    hideModal();
                }
            });
        });
    } else if (type == '2') {
        showModal("信息提示","<h4>确认删除吗</h4>",CONFIRM);
        that = that.parents(".discuss-box").find('.glyphicon-comment');
        $("#btn-confirm").on("click",function() {
            $.ajax({
                type: "POST",
                url: "src/server/setComment.php",
                data: {
                    comment_id:id,
                    comment_state:0,
                    discuss_id:that.data('id'),
                },
                dataType: "json",
                success: function (response) {
                    that.html(+that.html()-1).click().click();
                    hideModal();
                }
            });
        })
    } else {
        var ID = that.parents(".comment-box").find('.glyphicon-comment').data('id');
        that = that.parents().find('.glyphicon-comment');
        $.each(that, function (i,e) { 
            console.log($(this));
            if ($(this).data('type')=='3' && $(this).data('id')==ID) {
                that = $(this);
                return false;
            }
        });
        that = that.parents(".comment-box").find('.glyphicon-comment');
        showModal("信息提示","<h4>确认删除吗</h4>",BACK);
        $("#btn-confirm").on("click",function() {
            $.ajax({
                type: "POST",
                url: "src/server/setReply.php",
                data: {
                    reply_id:id,
                    reply_state:0,
                    comment_id:ID,
                },
                dataType: "json",
                success: function (response) {
                    that.html(+that.html()-1).click();
                }
            });
        })

        $("#btn-cancel").on("click",function() {
            that.click();
        });
    }
}


/**
 * 点击显示评论事件
 */
function clickShow() {
    var that = $(this);
    var id = that.data('id');
    var type = that.data('type');
    var state = that.data('val')=='1'?'0':'1';
    that.data('val',state);
    if (type == '2') {
        if (state=='1') {
            that.removeClass("reply-box").addClass("reply-box-active");
            generate(type,id,'',that.parents(".discuss-box"));
        } else {
            that.removeClass("reply-box-active").addClass("reply-box");
            that.parents('.foot-box').nextAll().remove();
        }
    } else if (type == '3') {
        generate(type,id,'',that.parents('.comment-box'));
    } else if (type == '4') {
        if (state=='1') {
            that.removeClass("reply-box").addClass("reply-box-active");
            that.parents('.foot-box').after(getEditHtml(type,id));
            $('.file').off();
            $('.file').on("change",setImg);

            $('.file-submit').off();
            $(".file-submit").on("click",function() {
                $(this).parent().prevAll('.file').click();
            });

            $('.btn-submit').on('click',setMessage);
        } else {
            that.removeClass("reply-box-active").addClass("reply-box");
            that.parents('.foot-box').nextAll().remove();
        }
    }

}



/**
 * 点击搜索事件
 */
function clickSearch() {
    generate('1',"",$("#search-text").val());
}

/**
 * 回车触发搜索事件
 */
function keyUpSearch(e) {
    if (e.keyCode==13){
        clickSearch();
    }
}

/**
 * 点击添加问题事件
 */
function clickAsk() {

    if (!userName) {
        window.location.href="login.html";
        return;
    }

    var temp =  "<input type='file' id='file' accept='image/*' style='display: none;'>" + 
                "<div class='edit-text' contenteditable='true' placeholder='要不问点什么...'></div>" +
                "<span id='file-submit' class='glyphicon glyphicon-picture ' style='font-size:30px;cursor:pointer;'></span>";

    showModal("提问",temp,CONFIRM);


    $('#file').on("change",setImg);

    $("#file-submit").on("click",function() {
        $('#file').click();
    });
 
    $("#btn-confirm").on("click",setMessage);
}

/**
 * 提问页面初始化
 */
function discussPage() {
    init("#discuss");
    
    //获取用户数据
    $.ajax({
        type: "POST",
        url: "src/server/getUsers.php",
        async:false,
        dataType: "json",
        success: function (response) {
            $.each(response[0]["data"], function (i,e) { 
                userPic[e["user_name"]] = e["user_img"];
            });
        }
    });

    //获取当前用户对问题的点赞评价
    $.ajax({
        type: "POST",
        url: "src/server/getDiscussEvals.php",
        data: {
            user_name:userName,
        },
        async:false,
        dataType: "json",
        success: function (response) {
            $.each(response[0]["data"], function (i,e) { 
                discussEval[e["discuss_id"]] = e["discuss_eval_state"];
            });
        }
    });

    //获取当前用户对回答的点赞评价
    $.ajax({
        type: "POST",
        url: "src/server/getCommentEvals.php",
        data: {
            user_name:userName,
        },
        async:false,
        dataType: "json",
        success: function (response) {
            $.each(response[0]["data"], function (i,e) { 
                commentEval[e["comment_id"]] = e["comment_eval_state"];
            });
        }
    });

    //获取当前用户对评论的点赞评价
    $.ajax({
        type: "POST",
        url: "src/server/getReplyEvals.php",
        data: {
            user_name:userName,
        },
        async:false,
        dataType: "json",
        success: function (response) {
            $.each(response[0]["data"], function (i,e) { 
                replyEval[e["reply_id"]] = e["reply_eval_state"];
            });
        }
    });

    /**
     * 开启搜索事件和添加问题事件
     */
    clickSearch();
    $("#search-text").on("keyup",keyUpSearch);
    $("#search").on("click",clickSearch);
    $("#ask").on("click",clickAsk);
}

$(document).ready(discussPage);