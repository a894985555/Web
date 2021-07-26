<?php
    /**
     * author:zc
     * date:2021-05-23
     * task_state : -2|被彻底删除 -1|待发布 0|被删除 1|发布 
     * 根据给定的task_state获取相应的任务数据
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["查询失败","查询成功"];
    $code = 0;
    $data = array();

    $task_state = $_POST["task_state"];


    if ($task_state == '1') {
        $sql = "SELECT *
                from tasks
                where task_state <> 0 and task_state<>-2
                order by task_state desc,task_create desc";
    } else if ($task_state == '0') {
        $sql = "SELECT *
                from tasks
                where task_state = 0
                order by task_state desc,task_create desc";
    } else {
        $sql = "SELECT * 
                from tasks
                where task_state = 1
                order by task_create desc";
    }
    
    $result = mysqli_query($conn,$sql);   
    while ($arr = mysqli_fetch_array($result)) {
        $code = 1;
        $data[] = $arr;
    }
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>