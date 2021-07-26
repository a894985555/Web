<?php
    /**
     * author:zc
     * date:2021-05-18
     * 删除、更新、插入问题数据接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["设置失败","插入问题成功"];
    $code = 0;
    $data = array();

    $problem_id = $_POST["problem_id"];
    $problem_content = $_POST["problem_content"];
    $problem_option1 = $_POST["problem_option1"];
    $problem_option2 = $_POST["problem_option2"];
    $problem_option3 = $_POST["problem_option3"];
    $problem_option4 = $_POST["problem_option4"];
    $problem_answer = $_POST["problem_answer"];
    $problem_score = $_POST["problem_score"];
    $task_id = $_POST["task_id"];


    $code = 1;
    $sql = "DELETE from problems
            where task_id = '$task_id' ";
    mysqli_query($conn,$sql);
    $num = count($problem_content);
    for ($i = 0;$i < $num;$i++) {
        $content = $problem_content[$i];
        $option1 = $problem_option1[$i];
        $option2 = $problem_option2[$i];
        $option3 = $problem_option3[$i];
        $option4 = $problem_option4[$i];
        $answer = $problem_answer[$i];
        $score = $problem_score[$i];

        $sql = "INSERT into problems (
                    problem_content,
                    problem_option1,
                    problem_option2,
                    problem_option3,
                    problem_option4,
                    problem_answer,
                    problem_score,
                    problem_state,
                    task_id
                ) values (
                    '$content',
                    '$option1',
                    '$option2',
                    '$option3',
                    '$option4',
                    '$answer',
                    '$score',
                    1,
                    '$task_id'
                )";
        mysqli_query($conn,$sql);
    }
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>