<?php
    /**
     * author:zc
     * date:2021-05-17
     * 获取某个任务ID下所有的问题
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["查询失败","查询成功"];
    $code = 0;
    $data = array();

    $task_id = $_POST["task_id"];
    
    if ($task_id) {
        $sql = "SELECT * 
                from problems 
                where task_id = '$task_id' and problem_state = 1";
        $result = mysqli_query($conn,$sql);   
        while ($arr = mysqli_fetch_array($result)) {
            $code = 1;
            $data[] = $arr;
        }
    } 
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>