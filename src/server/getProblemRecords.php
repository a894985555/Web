<?php
    /**
     * author:zc
     * date:2021-05-17
     * 根据任务ID和用户名获取某个任务下所有的答题记录
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["查询失败","查询成功"];
    $code = 0;
    $data = array();

    $user_name = $_POST["user_name"];
    $task_id = $_POST["task_id"];

    if ($task_id) {
        $sql = "SELECT * 
                from problem_records 
                where user_name = '$user_name' and task_id = '$task_id' ";
        $result = mysqli_query($conn,$sql);   
        while ($arr = mysqli_fetch_array($result)) {
            $code = 1;
            $data[] = $arr;
        }
    }
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>