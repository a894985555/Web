<?php
    /**
     * author:zc
     * date:2021-05-02
     * 用户登录校验接口
     */
    header("content-type:text;charset=utf-8");
    include("conn.php");
    include("function.php");

    $msg = ["登录失败","登录成功"];
    $code = 0;
    $data = array();

    $user_name = $_POST["user_name"];
    $user_pwd = $_POST["user_pwd"];

    //后端再次校验账号密码合法性
    if (strlen($user_name)<4 || strlen($user_name)>16 || strpos($user_name,' ')!=false ||
        strlen($user_pwd)<6  || strpos($user_pwd,' ')!=false) {
        $code = 0;
    } else {
        $sql = "SELECT user_pwd, user_identity, user_img
                from users 
                where user_name = '$user_name' and user_state = 1";
        $result = mysqli_query($conn,$sql);

        //密码使用MD5加密后进行匹配，匹配成功后返回用户数据
        $user_pwd = md5($user_pwd);
        $arr = mysqli_fetch_array($result);
        if ($user_pwd === $arr["user_pwd"]) {
            $code = 1;
            $data["user_name"] = $user_name;
            $data["user_identity"] = $arr["user_identity"];
            $data["user_img"] = $arr["user_img"];
        }
    }
    getApiResult($code,$msg[$code],$data);
    mysqli_close($conn);
?>