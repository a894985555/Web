<?php
    /**
     * author:zc
     * date:2021-05-22
     * 删除、更新、插入回复数据接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["设置失败","删除回复成功","插入回复成功"];
    $code = 0;
    $data = array();

    $reply_id = $_POST["reply_id"];
    $reply_name = $_POST["reply_name"];
    $reply_state = $_POST["reply_state"];
    $reply_content = $_POST["reply_content"];
    $reply_create = $_POST["reply_create"];
    $comment_id = $_POST["comment_id"];
    $user_name = $_POST["user_name"];
    $num = 0;

    if ($reply_id) {
        if ($reply_state === '0') {
            $code = 1;
            $sql = "UPDATE replys
                    set reply_state = '$reply_state'
                    where reply_id = '$reply_id' ";
            mysqli_query($conn,$sql);
            $num = -1;
        }
    } else {
        $code = 2;
        $sql = "INSERT into replys (
                    reply_name,
                    reply_content,
                    reply_create,
                    reply_good,
                    reply_state,
                    comment_id,
                    user_name
                ) values (
                    '$reply_name',
                    '$reply_content',
                    '$reply_create',
                    0,
                    1,
                    '$comment_id',
                    '$user_name'
                )";
        $num = 1;
        mysqli_query($conn,$sql);
    }
    $sql = "UPDATE comments
            set comment_reply = comment_reply + '$num'
            where comment_id = '$comment_id' ";
    mysqli_query($conn,$sql);

    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>