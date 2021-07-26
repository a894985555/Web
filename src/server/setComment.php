<?php
    /**
     * author:zc
     * date:2021-05-17
     * 删除、更新、插入评论接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["设置失败","删除评论成功","插入评论成功"];
    $code = 0;
    $data = array();

    $comment_id = $_POST["comment_id"];
    $comment_content = $_POST["comment_content"];
    $comment_create = $_POST["comment_create"];
    $comment_state = $_POST["comment_state"];
    $discuss_id = $_POST["discuss_id"];
    $user_name = $_POST["user_name"];
    $num = 0;

    if ($comment_id) {
        if ($comment_state === '0') {
            $code = 1;
            $sql = "UPDATE comments
                    set comment_state = '$comment_state'
                    where comment_id = '$comment_id' ";
            mysqli_query($conn,$sql);
            $num = -1;
        }
    } else {
        $code = 2;
        $sql = "INSERT into comments (
                    comment_content,
                    comment_create,
                    comment_reply,
                    comment_good,
                    comment_state,
                    discuss_id,
                    user_name
                ) values (
                    '$comment_content',
                    '$comment_create',
                    0,
                    0,
                    1,
                    '$discuss_id',
                    '$user_name'
                )";
        mysqli_query($conn,$sql);
        $num = 1;
    }
    $sql = "UPDATE discusses
            set discuss_reply = discuss_reply + '$num'
            where discuss_id = '$discuss_id' ";
    mysqli_query($conn,$sql);

    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>