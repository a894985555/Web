<?php
    /**
     * author:zc
     * date:2021-05-20
     * 存储图片接口
     */
    include("function.php");
    $msg = ["获取失败","获取成功"];
    $code = 0;
    $data = array();


    $filesName = $_FILES['file']['name'];  //文件名数组
	$filesTmpName = $_FILES['file']['tmp_name'];  //临时文件名数组
	$filePath = '../../static/image/'.time().'-'.$filesName; //文件路径

    if (move_uploaded_file($filesTmpName, $filePath)) {
        $code = 1;
        $data = 'static/image/'.time().'-'.$filesName;
    }

    getApiResult($code,$msg[$code],$data);

?>