/**
 * author:zc
 * date:2021-05-27
 */

/**
 * 整合处理各种按钮的事件处理
 * @param type 0|不操作, 1|修改用户密码, 2|修改用户禁用状态, 3|设置用户的权限
 */
function modifyUser() {
    var that = $(this);
    var type = that.data('type');
    var id = $(this).parents('tr').find('.sorting_1').html();
    if (type=='0') return;
    if (type=='1') {
        var str = "<input type='password' class='myForm white' id='pwd' placeHolder='请输入密码'>";
        showModal("设置密码",str,CONFIRM,"h-center");
        $("#pwd").on("blur",function() {
            str = $(this).val();
            if (str.length==0) {
                $("#submit-tip").html("密码不能为空");
            } else if (~str.indexOf(" ")) {
                $("#submit-tip").html("密码中不能含有空格");
            } else if (str.length<6) {
                $("#submit-tip").html("密码长度不能小于6位");
            } else {
                $("#submit-tip").html("");
            }
        });
        $("#btn-confirm").off();
        $("#btn-confirm").on("click",function() {
            $("#pwd").blur();
            if ($("#submit-tip").html())return;
            $.ajax({
                type: "POST",
                url: "src/server/setUser.php",
                data: {
                    user_id: id,
                    user_pwd: str,
                },
                dataType: "json",
                success: function (response) {
                    showModal("信息提示","<h4>密码修改成功</h4>",BUTTON);
                }
            });
        })
    } else if (type=='2') {
        var content = that.html();
        var str = content=="禁用"?"<h4>确认禁用用户吗</h4>":"<h4>确认解除禁用吗</h4>";
        showModal("信息提示",str,CONFIRM);
        $("#btn-confirm").on("click",function() {
            $.ajax({
                type: "POST",
                url: "src/server/setUser.php",
                data: {
                    user_id:id,
                },
                dataType: "json",
                success: function (response) {
                    if (content=='禁用') that.removeClass('btn-danger').addClass('btn-warning').html('解除禁用');
                    else that.removeClass('btn-warning').addClass('btn-danger').html('禁用');
                    hideModal();
                }
            });
        })
    } else if (type=='3') {
        var content = that.html();
        var str = content=="管理员"?"<h4>确认解除管理员身份吗</h4>":"<h4>确认授予管理员身份吗</h4>";
        var val = content=="管理员"?"user":'admin';
        showModal("信息提示",str,CONFIRM);
        $("#btn-confirm").on("click",function() {
            $.ajax({
                type: "POST",
                url: "src/server/setUser.php",
                data: {
                    user_id:id,
                    user_identity:val,
                },
                dataType: "json",
                success: function (response) {
                    if (content=='管理员') that.removeClass('btn-danger').addClass('btn-default').html('用户');
                    else that.removeClass('btn-default').addClass('btn-danger').html('管理员');
                    hideModal();
                }
            });
        });
    }
}

/**
 * 通过插件datatable获取table数据和排版
 */
function getDataTable() {
    var table = $("#myTable").DataTable({

        bAutoWidth: false,
        responsive: true,
        ajax: {
            url: "src/server/getTableLists.php",
        },
        columnDefs: [
            {
                targets: 0,
                data: "user_id",
                title: "用户编号",
            },
            {
                targets: 1,
                data: "user_create",
                title: "用户注册时间",
                render:function(data) {
                    return data.split(' ')[0];
                }
            },
            {
                targets: 2,
                data: "user_img",
                title: "用户头像",
                render: function (data) {
                    return data?"<img src="+data+" class='user-img'>":"<img src=static/image/default.png class='user-img'>";
                }
            },
            {
                targets: 3,
                data: "user_name",
                title: "用户名",
            },
            {
                targets: 4,
                title: "设置密码",
                render: function () {
                    return "<button data-type=1 class='btn btn-default'>设置密码</button>";
                }
            },
            {
                targets: 5,
                data: {
                },
                title: "用户状态",
                render: function (data) {
                    if (data["user_identity"]=='superAdmin') return "<button data-type=0 class='btn btn-success'>高级</button>";
                    return data['user_state']=='1'?"<button data-type=2 class='btn btn-danger'>禁用</button>":"<button data-type=2 class='btn btn-warning'>解除禁用</button>";
                }
            },
            {
                targets: 6,
                data: "user_identity",
                title: "权限",
                render: function (data) {
                    if (data=='superAdmin') return "<button data-type=0 class='btn btn-success'>超级管理员</button>";
                    return data=='admin'?"<button data-type=3 class='btn btn-danger'>管理员</button>":"<button data-type=3 class='btn btn-default'>用户</button>";
                }
            },
        ],
    });
    table.on("draw",function() {
        $('.btn').on("click",modifyUser);
        $(".table-bar").on("click",function() {
            $('.btn').not("#btn-confirm").off();
            $('.btn').not("#btn-confirm").on("click",modifyUser);
        });
    })
}


function userPage() {
    init('#User');
    getDataTable();

}

$(document).ready(userPage);
