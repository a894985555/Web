<?php 

   $user = 'root';
   $pwd = 'Acai123456';
   $db = 'db201945';
   $host = 'localhost';
   $port = 3306;

   $conn = mysqli_init();
   $success = mysqli_real_connect (
      $conn, 
      $host, 
      $user, 
      $pwd, 
      $db,
      $port
   );
   if ($success!=1) {
      die("数据库连接失败");
   }
?>