<?php
// filepath: c:\xampp\htdocs\Plataformas\proyectoplataformas\php\register.php
include 'db.php';
$nombre = $_POST['nombre'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$tipo = 'cliente';
$stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password, tipo) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nombre, $email, $password, $tipo);
if($stmt->execute()){
    echo json_encode(['success'=>true, 'msg'=>'Usuario registrado']);
} else {
    echo json_encode(['success'=>false, 'msg'=>'Error: correo ya registrado']);
}
?>