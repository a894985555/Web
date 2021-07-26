<?php
    /**
     * author:zc
     * date:2021-05-02
     * 用户注册校验接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["注册失败","该用户名已被注册","注册成功"];
    $code = 0;
    $data = array();


    $user_name = $_POST["user_name"];
    $user_pwd = $_POST["user_pwd"];
    $user_create = $_POST["user_create"];
    $repeat_pwd = $_POST["repeat_pwd"];

    //后端再次校验账号密码合法性
    if (strlen($user_name)<4 || strlen($user_name)>16 || strpos($user_name,' ')!=false ||
        strlen($user_pwd)<6  || strpos($user_pwd,' ')!=false || $user_pwd!=$repeat_pwd ) {
        $code = 0;
    } else {
        $sql = "SELECT user_name 
                from users 
                where user_name = '$user_name'";
        $result = mysqli_query($conn,$sql);
        if (mysqli_fetch_array($result)) {
            $code = 1;
        } else {
            $code = 2;
            $user_pwd = md5($user_pwd);
            $sql = "INSERT INTO users (
                        user_name, 
                        user_pwd, 
                        user_identity, 
                        user_state, 
                        user_img,
                        user_create
                    ) values (
                        '$user_name',
                        '$user_pwd',
                        'user',
                        1,
                        '',
                        '$user_create'
                    )";
            mysqli_query($conn,$sql);
        }
    }
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>