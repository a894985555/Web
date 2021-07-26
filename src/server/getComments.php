<?php
    /**
     * author:zc
     * date:2021-05-14
     * 根据点赞数为主关键字和回复数辅关键字降序排序
     * 以及给定查询的索引位置和数量
     * 来获取某个讨论ID下所有评论的数据
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["查询失败","查询成功"];
    $code = 0;
    $data = array();

    $discuss_id = $_POST["discuss_id"];
    $start = $_POST["start"];
    $num = $_POST["num"];

    $sql = "SELECT users.user_name,user_img,comment_id,comment_content,comment_create,comment_state,comment_good,comment_reply,discuss_id 
            from users,comments 
            where users.user_name = comments.user_name and comment_state = 1 and discuss_id = '$discuss_id' 
            order by comment_good desc, comment_reply desc, comment_create asc limit $start,$num ";
    $result = mysqli_query($conn,$sql);   
    while ($arr = mysqli_fetch_array($result)) {
        $code = 1;
        $data[] = $arr;
    }
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>