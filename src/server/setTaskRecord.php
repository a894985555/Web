<?php
    /**
     * author:zc
     * date:2021-05-18
     * 删除、更新、插入用户任务完成记录数据接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["设置失败","设置任务记录成功","删除用户记录成功"];
    $code = 0;
    $data = array();

    $task_record_totalscore = $_POST["task_record_totalscore"];
    $user_name = $_POST["user_name"];
    $task_id = $_POST["task_id"];

    if ($task_id) {
        if ($user_name) {
            $code = 1;
            $sql = "DELETE from task_records
                    where task_id = '$task_id' and user_name = '$user_name' ";
            mysqli_query($conn,$sql);

            $sql = "INSERT INTO task_records (
                        task_record_done,
                        task_record_totalscore,
                        task_id,
                        user_name
                    ) values (
                        1,
                        '$task_record_totalscore',
                        '$task_id',
                        '$user_name'
                    )";
            mysqli_query($conn,$sql);
        } else {
            $code = 2;
            $sql = "DELETE from task_records
                    where task_id = '$task_id'";
            mysqli_query($conn,$sql);
        }
    }

    
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>