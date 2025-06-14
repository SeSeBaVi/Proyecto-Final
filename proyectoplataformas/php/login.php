<?php
// filepath: c:\xampp\htdocs\Plataformas\proyectoplataformas\php\login.php
include 'db.php';
$email = $_POST['email'];
$password = $_POST['password'];
$stmt = $conn->prepare("SELECT id, nombre, password FROM usuarios WHERE email=? AND estado=1");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->bind_result($id, $nombre, $hash);
if($stmt->fetch() && password_verify($password, $hash)){
    echo json_encode(['success'=>true, 'id'=>$id, 'nombre'=>$nombre, 'msg'=>'Bienvenido']);
} else {
    echo json_encode(['success'=>false, 'msg'=>'Credenciales incorrectas']);
}
?>