<?php
    /**
     * author:zc
     * date:2021-05-17
     * 删除、更新、插入问题点赞情况接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["设置失败","更新评价成功"];
    $code = 0;
    $data = array();

    $discuss_eval_state = $_POST["discuss_eval_state"];
    $discuss_id = $_POST["discuss_id"];
    $user_name = $_POST["user_name"];


    $code = 1;
    $sql = "DELETE from discuss_evals
            where user_name = '$user_name' and discuss_id = '$discuss_id' ";
    mysqli_query($conn,$sql);

    $sql = "INSERT INTO discuss_evals (
                discuss_eval_state,
                discuss_id,
                user_name
            ) values (
                '$discuss_eval_state',
                '$discuss_id',
                '$user_name'
            )";
    mysqli_query($conn,$sql);

    $num = $discuss_eval_state=='1'?1:-1;
    $sql = "UPDATE discusses
            set discuss_good = discuss_good + '$num'
            where discuss_id = '$discuss_id' ";
    mysqli_query($conn,$sql);

    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>