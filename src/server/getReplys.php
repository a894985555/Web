<?php
    /**
     * author:zc
     * date:2021-05-14
     * 根据某个评论的ID获取这条评论ID下所有的回复数据
     * 并根据点赞数为主关键字和回复数为辅关键字降序排序
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["查询失败","查询成功"];
    $code = 0;
    $data = array();

    $comment_id = $_POST["comment_id"];

    $sql = "SELECT users.user_name,user_img,reply_id,reply_name,comment_id,reply_state,reply_content,reply_create,reply_good 
            from users,replys 
            where users.user_name = replys.user_name and reply_state = 1 and comment_id = '$comment_id' 
            order by reply_good desc, reply_create asc ";
    $result = mysqli_query($conn,$sql);
    while ($arr = mysqli_fetch_array($result)) {
        $code = 1;
        $data[] = $arr;
    }
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>