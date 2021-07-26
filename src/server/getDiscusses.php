<?php
    /**
     * author:zc
     * date:2021-05-14
     * 根据点赞数为主关键字和回复数辅关键字降序排序
     * 以及给定查询的关键词来获取含有相关关键词的讨论的数据
     * 如果没有关键词传入,则返回所有讨论的数据
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["查询失败","查询成功"];
    $code = 0;
    $data = array();

    $query = $_POST["query"];

    if ($query) {
        $sql = "SELECT users.user_name,user_img,discuss_id,discuss_content,discuss_reply,discuss_create,discuss_state,discuss_good 
                from users, discusses 
                where users.user_name = discusses.user_name and discuss_state = 1 and discuss_content like '%$query%'
                order by discuss_good desc, discuss_reply desc, discuss_create asc ";
    } else {
        $sql = "SELECT users.user_name,user_img,discuss_id,discuss_content,discuss_reply,discuss_create,discuss_state,discuss_good 
                from users, discusses 
                where users.user_name = discusses.user_name and discuss_state = 1
                order by discuss_good desc, discuss_reply desc, discuss_create asc ";
    }
    $result = mysqli_query($conn,$sql);   
    while ($arr = mysqli_fetch_array($result)) {
        $code = 1;
        $data[] = $arr;
    }
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>