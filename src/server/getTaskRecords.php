<?php
    /**
     * author:zc
     * date:2021-05-23
     * 1.用于获取某个用户的所有任务完成记录
     * 2.获取所有用户的任务完成情况
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["查询失败","查询成功"];
    $code = 0;
    $data = array();

    $task_id = $_POST["task_id"];
    $user_name = $_POST["user_name"];

    if ($task_id) {
        $sql = "SELECT users.user_name,user_img,task_record_totalscore 
                from users,task_records 
                where task_records.user_name=users.user_name and task_id = '$task_id' 
                order by task_record_totalscore desc";
    } else {
        $sql = "SELECT * 
                from task_records 
                where user_name = '$user_name'";
    }


    $result = mysqli_query($conn,$sql);   
    while ($arr = mysqli_fetch_array($result)) {
        $code = 1;
        $data[] = $arr;
    }
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>