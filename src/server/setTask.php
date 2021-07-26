<?php
    /**
     * author:zc
     * date:2021-05-18
     * 删除、更新、插入任务数据接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["设置失败","删除任务成功","更新任务成功","插入任务成功"];
    $code = 0;
    $data = array();

    $task_id = $_POST["task_id"];
    $task_title = $_POST["task_title"];
    $task_create = $_POST["task_create"];
    $task_deadline = $_POST["task_deadline"];
    $task_state = $_POST["task_state"];

    if ($task_id) {
        if ($task_state != "") {
            $code = 1;
            $sql = "UPDATE tasks
                    set task_state = '$task_state'
                    where task_id = '$task_id' ";
            mysqli_query($conn,$sql);
        } else {
            $code = 2;
            $sql = "UPDATE tasks
                    set task_title = '$task_title',
                        task_create = '$task_create',
                        task_deadline = '$task_deadline'
                    where task_id = '$task_id' ";
            mysqli_query($conn,$sql);
        }
    } else {
        $code = 3;
        $sql = "INSERT into tasks (
                    task_title,
                    task_create,
                    task_deadline,
                    task_state
                ) values (
                    '$task_title',
                    '$task_create',
                    '$task_deadline',
                    -1
                )";
        mysqli_query($conn,$sql);
    }

    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>