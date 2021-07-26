<?php
    /**
     * author:zc
     * date:2021-05-22
     * 删除、更新、插入评论用户点赞情况接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["设置失败","更新评价成功"];
    $code = 0;
    $data = array();

    $reply_eval_state = $_POST["reply_eval_state"];
    $reply_id = $_POST["reply_id"];
    $user_name = $_POST["user_name"];


    $code = 1;
    $sql = "DELETE from reply_evals
            where user_name = '$user_name' and reply_id = '$reply_id' ";
    mysqli_query($conn,$sql);

    $sql = "INSERT INTO reply_evals (
                reply_eval_state,
                reply_id,
                user_name
            ) values (
                '$reply_eval_state',
                '$reply_id',
                '$user_name'
            )";
    mysqli_query($conn,$sql);

    $num = $reply_eval_state=='1'?1:-1;
    $sql = "UPDATE replys
            set reply_good = reply_good + '$num'
            where reply_id = '$reply_id' ";
    mysqli_query($conn,$sql);
    
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>