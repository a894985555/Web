<?php
    /**
     * author:zc
     * date:2021-05-18
     * 删除、更新、插入问题记录数据接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["设置失败","设置答题记录成功"];
    $code = 0;
    $data = array();

    $problem_record_useroption = $_POST["problem_record_useroption"];
    $user_name = $_POST["user_name"];
    $problem_id = $_POST["problem_id"];
    $task_id = $_POST["task_id"];
    
    $num = count($problem_id);
    for ($i=0;$i<$num;$i++) {
        $id = $problem_id[$i];
        $option = $problem_record_useroption[$i];

        $sql = "DELETE from problem_records
                where problem_id = '$id' and user_name = '$user_name' ";
        mysqli_query($conn,$sql);
    
        $sql = "INSERT INTO problem_records (
                    problem_record_useroption,
                    problem_id,
                    task_id,
                    user_name
                ) values (
                    '$option',
                    '$id',
                    '$task_id',
                    '$user_name'
                )";
        mysqli_query($conn,$sql);
    }

    $code = 1;
    
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>