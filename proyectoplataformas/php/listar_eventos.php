<?php
// filepath: c:\xampp\htdocs\Plataformas\proyectoplataformas\php\listar_eventos.php
include 'db.php';
$res = $conn->query("SELECT id, titulo, descripcion, fecha_evento, hora_evento, lugar, imagen FROM eventos WHERE estado='aprobado' ORDER BY fecha_evento ASC");
$eventos = [];
while($row = $res->fetch_assoc()) $eventos[] = $row;
echo json_encode($eventos);
?>