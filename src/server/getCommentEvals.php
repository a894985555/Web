<?php
    /**
     * author:zc
     * date:2021-05-20
     * 用于获取某个用户对所有评论点赞的情况
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["查询失败","查询成功"];
    $code = 0;
    $data = array();
    
    $user_name = $_POST["user_name"];

    $sql = "SELECT * 
            from comment_evals 
            where user_name = '$user_name' ";
    $result = mysqli_query($conn,$sql);
    while ($arr = mysqli_fetch_array($result)) {
        $code = 1;
        $data[] = $arr;
    }
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>