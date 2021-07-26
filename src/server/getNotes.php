<?php
    /**
     * author:zc
     * date:2021-05-26
     * 根据文件创建时间排序
     * 1.来获取某个问题下所有的笔记
     * 2.来获取某个用户某个笔记文件夹下所有的笔记
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["查询失败","查询成功"];
    $code = 0;
    $data = array();

    $user_name = $_POST["user_name"];
    $problem_id = $_POST["problem_id"];
    $note_file_id = $_POST["note_file_id"];

    if ($problem_id) {
        $sql = "SELECT * 
                from notes 
                where user_name = '$user_name' and note_state = 1 and problem_id = '$problem_id' 
                order by note_create asc ";
    } else if ($note_file_id && $user_name) {
        $sql = "SELECT * from notes,problems,problem_records 
                where notes.problem_id = problems.problem_id and problems.problem_id = problem_records.problem_id 
                and notes.user_name = problem_records.user_name and notes.user_name = '$user_name' 
                and notes.note_file_id = '$note_file_id' and notes.note_state = 1";
    }
    $result = mysqli_query($conn,$sql);   
    while ($arr = mysqli_fetch_array($result)) {
        $code = 1;
        $data[] = $arr;
    }
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>