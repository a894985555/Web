<?php
    /**
     * author:zc
     * date:2021-05-17
     * 删除、更新、插入问题接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["设置失败","删除问题成功","插入问题成功"];
    $code = 0;
    $data = array();

    $discuss_id = $_POST["discuss_id"];
    $discuss_content = $_POST["discuss_content"];
    $discuss_reply = $_POST["discuss_reply"];
    $discuss_create = $_POST["discuss_create"];
    $discuss_good = $_POST["discuss_good"];
    $discuss_state = $_POST["discuss_state"];
    $user_name = $_POST["user_name"];

    if ($discuss_id) {
        if ($discuss_state === '0') {
            $code = 1;
            $sql = "UPDATE discusses
                    set discuss_state = '$discuss_state'
                    where discuss_id = '$discuss_id' ";
            mysqli_query($conn,$sql);
        }
    } else {
        $code = 2;
        $sql = "INSERT into discusses (
                    discuss_content,
                    discuss_create,
                    discuss_reply,
                    discuss_good,
                    discuss_state,
                    user_name
                ) values (
                    '$discuss_content',
                    '$discuss_create',
                    0,
                    0,
                    1,
                    '$user_name'
                )";
        mysqli_query($conn,$sql);
    }

    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>