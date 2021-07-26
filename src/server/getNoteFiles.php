<?php
    /**
     * author:zc
     * date:2021-05-26
     * 根据文件创建时间排序以及给定查询的索引位置和数量
     * 1.根据所给关键词查询包含关键词的笔记文件夹
     * 2.来获取某个用户所有的笔记文件夹
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["查询失败","查询成功"];
    $code = 0;
    $data = array();

    $user_name = $_POST["user_name"];
    $start = $_POST["start"];
    $num = $_POST["num"];
    $query = $_POST["query"];

    if ($query) {
        $sql = "SELECT * 
            from note_files
            where user_name = '$user_name' and note_file_state = 1 and note_file_title like '%$query%'
            order by note_file_create desc
            limit $start,$num ";
        $result = mysqli_query($conn,$sql);   
        while ($arr = mysqli_fetch_array($result)) {
            $code = 1;
            $data[] = $arr;
        }

        $sql = "SELECT count(*) as nums
                from note_files
                where user_name = '$user_name' and note_file_state = 1 and note_file_title like '%$query%' ";
        $result = mysqli_query($conn,$sql);
        $arr = mysqli_fetch_array($result);
        $data[] = $arr;
    } else if ($start!='' && $num!='') {
        $sql = "SELECT * 
            from note_files
            where user_name = '$user_name' and note_file_state = 1
            order by note_file_create desc 
            limit $start,$num ";
        $result = mysqli_query($conn,$sql);   
        while ($arr = mysqli_fetch_array($result)) {
            $code = 2;
            $data[] = $arr;
        }

        $sql = "SELECT count(*) as nums
                from note_files
                where user_name = '$user_name' and note_file_state = 1";
        $result = mysqli_query($conn,$sql);
        $arr = mysqli_fetch_array($result);
        $data[] = $arr;
    } else {
        $sql = "SELECT * 
            from note_files
            where user_name = '$user_name' and note_file_state = 1
            order by note_file_create desc ";
        $result = mysqli_query($conn,$sql);   
        while ($arr = mysqli_fetch_array($result)) {
            $code = 3;
            $data[] = $arr;
        }
    }
    
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>