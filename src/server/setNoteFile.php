<?php
    /**
     * author:zc
     * date:2021-05-20
     * 删除、更新、插入笔记文件夹数据接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["设置失败","删除文件夹成功","更新文件夹成功","插入文件夹成功"];
    $code = 0;
    $data = array();

    $note_file_id = $_POST["note_file_id"];
    $note_file_title = $_POST["note_file_title"];
    $note_file_create = $_POST["note_file_create"];
    $note_file_state = $_POST["note_file_state"];
    $user_name = $_POST["user_name"];

    if ($note_file_id) {
        if ($note_file_state === '0') {
            $code = 1;
            $sql = "UPDATE note_files
                    set note_file_state = '$note_file_state'
                    where note_file_id = '$note_file_id' ";
            mysqli_query($conn,$sql);
        } else {
            $sql = "SELECT * 
                    from note_files 
                    where note_file_title = '$note_file_title' and user_name = '$user_name'";
            $result = mysqli_query($conn,$sql);
            if (!mysqli_fetch_array($result)) {
                $code = 2;
                $sql = "UPDATE note_files
                        set note_file_title = '$note_file_title'
                        where note_file_id = '$note_file_id' ";
                mysqli_query($conn,$sql);
            }
        }
    } else {
        $sql = "SELECT * 
                from note_files 
                where note_file_title = '$note_file_title' and user_name = '$user_name'";
        $result = mysqli_query($conn,$sql);
        if (!mysqli_fetch_array($result)) {
            $code = 3;
            $sql = "INSERT into note_files (
                        note_file_title,
                        note_file_create,
                        note_file_state,
                        user_name
                    ) values (
                        '$note_file_title',
                        '$note_file_create',
                        1,
                        '$user_name'
                    )";
            mysqli_query($conn,$sql);
        }
    }
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>