<?php
// Habilitar la visualización de todos los errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "biblioteca";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta SQL para obtener los datos de la tabla "libros"
$sql = "SELECT id, titulo AS title, autor AS author FROM libros";
$result = $conn->query($sql);

// Verificar si la consulta tiene éxito
if ($result === false) {
    die("Error en la consulta: " . $conn->error);
}

$books = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $books[] = $row;
    }
} 

$conn->close();

// Devolver los datos en formato JSON
header('Content-Type: application/json');
echo json_encode($books);
?>
