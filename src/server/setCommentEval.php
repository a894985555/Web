<?php
    /**
     * author:zc
     * date:2021-05-17
     * 删除、更新、插入评论点赞情况接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["设置失败","更新评价成功"];
    $code = 0;
    $data = array();

    $comment_eval_state = $_POST["comment_eval_state"];
    $comment_id = $_POST["comment_id"];
    $user_name = $_POST["user_name"];

    $code = 1;
    $sql = "DELETE from comment_evals
            where user_name = '$user_name' and comment_id = '$comment_id' ";
    mysqli_query($conn,$sql);
    
    $sql = "INSERT INTO comment_evals (
                comment_eval_state,
                comment_id,
                user_name
            ) values (
                '$comment_eval_state',
                '$comment_id',
                '$user_name'
            )";
    mysqli_query($conn,$sql);
    
    $num = $comment_eval_state=='1'?1:-1;
    $sql = "UPDATE comments
            set comment_good = comment_good + '$num'
            where comment_id = '$comment_id' ";
    mysqli_query($conn,$sql);
    
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>