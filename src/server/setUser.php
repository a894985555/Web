<?php
    /**
     * author:zc
     * date:2021-05-18
     * 删除用户、插入用户数据、更新用户密码、身份、头像、状态数据接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["设置失败","修改密码成功","更新用户身份成功","更新用户头像成功","更新用户状态成功"];
    $code = 0;
    $data = array();

    $user_id = $_POST["user_id"];
    $user_pwd = $_POST["user_pwd"];
    $user_identity = $_POST["user_identity"];
    $user_img = $_POST["user_img"];
    $user_name = $_POST["user_name"];
    $new_pwd = $_POST["new_pwd"];
    $repeat_pwd = $_POST["repeat_pwd"];


    if ($user_pwd) {
        if ($new_pwd) {
            if (strlen($new_pwd)<6  || strpos($new_pwd,' ')!=false || $new_pwd!=$repeat_pwd ) {
                $code = 0;
            } else {
                $user_pwd = md5($user_pwd);
                $sql = "SELECT * 
                        from users
                        where user_name = '$user_name' and user_pwd = '$user_pwd' ";
                $result = mysqli_query($conn,$sql);
                if (mysqli_fetch_array($result)) {
                    $code = 1;
                    $new_pwd = md5($new_pwd);
                    $sql = "UPDATE users 
                            set user_pwd = '$new_pwd' 
                            where user_name = '$user_name' ";
                    mysqli_query($conn,$sql);
                } else {
                    $code = 0;
                }
            }
        } else if ($user_id) {
            $code = 1;
            $user_pwd = md5($user_pwd);
            $sql = "UPDATE users 
                    set user_pwd = '$user_pwd' 
                    where user_id = '$user_id' ";
            mysqli_query($conn,$sql);
        }
    } else if ($user_identity) {
        $code = 2;
        $sql = "UPDATE users 
                set user_identity = '$user_identity' 
                where user_id = '$user_id' ";
        mysqli_query($conn,$sql);
    } else if ($user_img) {
        $code = 3;
        $data = $user_img;
        $sql = "UPDATE users
                set user_img = '$user_img'
                where user_name = '$user_name' ";
        mysqli_query($conn,$sql);
    } else if ($user_id) {
        $code = 4;
        $sql = "UPDATE users 
                set user_state = user_state ^ 1 
                where user_id = '$user_id' ";
        mysqli_query($conn,$sql);
    }

    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>