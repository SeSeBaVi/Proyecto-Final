<?php
// filepath: c:\xampp\htdocs\Plataformas\proyectoplataformas\php\db.php
$host = "localhost";
$user = "root";
$pass = "";
$db = "eventos_culturales_cusco";
$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4");
if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);
?>