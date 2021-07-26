<?php
    /**
     * 以对象数组形式返回json数组
     * 这里默认只返回一个对象
     */
    function getApiResult($code,$msg,$data) {
        $arrs = [];
        $arrs[0]["code"]=$code;
        $arrs[0]["data"]=$data;
        $arrs[0]["msg"]=$msg;
        echo json_encode($arrs,JSON_UNESCAPED_UNICODE);
    }

    /**
     * 返回dataTable需要的json格式的数据
     */
    function getApiTableResult($data){
        $arrs=[];
        $arrs["data"]=$data;
        echo json_encode($arrs,JSON_UNESCAPED_UNICODE);
    }

?>
