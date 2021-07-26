<?php
    /**
     * author:zc
     * date :2021-05-27
     * 以dataTable要求的json形式返回用户数据
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["查询失败","查询成功"];
    $code = 0;
    $data = array();

    $sql = "SELECT * 
            from users";
    $result = mysqli_query($conn,$sql);   
    while ($arr = mysqli_fetch_array($result)) {
        $data[] = $arr;
    }
    getApiTableResult($data);
    mysqli_close($conn);
?>