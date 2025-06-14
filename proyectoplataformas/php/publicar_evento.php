<?php
// filepath: c:\xampp\htdocs\Plataformas\proyectoplataformas\php\publicar_evento.php
include 'db.php';
$titulo = $_POST['titulo'];
$descripcion = $_POST['descripcion'];
$fecha_evento = $_POST['fecha_evento'];
$hora_evento = $_POST['hora_evento'];
$lugar = $_POST['lugar'];
$id_creador = $_POST['id_creador'];

// Manejo de imagen opcional
$imagen = '';
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] == UPLOAD_ERR_OK) {
    $ext = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
    $nombre_archivo = uniqid('evento_') . '.' . $ext;
    $ruta_destino = '../uploads/' . $nombre_archivo;
    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $ruta_destino)) {
        $imagen = $nombre_archivo;
    }
}

// Cambia el estado a 'aprobado' para que el evento se muestre inmediatamente
$stmt = $conn->prepare("INSERT INTO eventos (titulo, descripcion, fecha_evento, hora_evento, lugar, id_creador, estado, imagen) VALUES (?, ?, ?, ?, ?, ?, 'aprobado', ?)");
$stmt->bind_param("sssssis", $titulo, $descripcion, $fecha_evento, $hora_evento, $lugar, $id_creador, $imagen);
if($stmt->execute()){
    echo json_encode(['success'=>true, 'msg'=>'Evento publicado exitosamente']);
} else {
    echo json_encode(['success'=>false, 'msg'=>'Error al publicar']);
}
?>