<?php
require_once __DIR__ . '/backend/config/config.php';
$pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
$stmt = $pdo->query("DESCRIBE orders");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
