<?php
$db_serwer = "localhost";
$db_user = "root";
$db_password = "";
$db_name = "carsdle";

$connection = mysqli_connect($db_serwer, $db_user, $db_password, $db_name);

if (!$connection) {
    die("Nie udało się połączyć z bazą danych: " . mysqli_connect_error());
}
?>