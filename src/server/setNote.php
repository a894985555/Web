<?php
    /**
     * author:zc
     * date:2021-05-20
     * 删除、更新、插入笔记数据接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["设置失败","删除笔记成功","插入笔记成功","更新笔记内容成功"];
    $code = 0;
    $data = array();

    $note_id = $_POST["note_id"];
    $note_create = $_POST["note_create"];
    $note_state = $_POST["note_state"];
    $note_content = $_POST["note_content"];
    $note_file_id = $_POST["note_file_id"];
    $problem_id = $_POST["problem_id"]; 
    $user_name = $_POST["user_name"];

    if ($note_id) {
        if ($note_state === '0') {
            $code = 1;
            $sql = "UPDATE notes
                    set note_state = '$note_state'
                    where note_id = '$note_id' ";
            mysqli_query($conn,$sql);
        }
        if ($note_content) {
            $code = 3;
            $sql = "UPDATE notes
                    set note_content = '$note_content'
                    where note_id = '$note_id' ";
            mysqli_query($conn,$sql);
        }
    } else if ($note_file_id) {
        if ($problem_id) {
            $code = 2;
            
            $sql = "DELETE from notes
                    where user_name = '$user_name' and note_file_id = '$note_file_id' and problem_id = '$problem_id' ";
            mysqli_query($conn,$sql);

            if ($note_state === '1') {
                $sql = "INSERT into notes (
                            note_create,
                            note_state,
                            note_file_id,
                            note_content,
                            problem_id,
                            user_name
                        ) values (
                            '$note_create',
                            '$note_state',
                            '$note_file_id',
                            '',
                            '$problem_id',
                            '$user_name'
                        )";
                mysqli_query($conn,$sql);
            }
        }
    }
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>