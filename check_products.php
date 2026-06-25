<?php
require_once __DIR__ . '/backend/config/config.php';
$pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
$ids = $pdo->query("SELECT id FROM products")->fetchAll(PDO::FETCH_COLUMN);
echo "Product IDs: " . implode(',', $ids);
?>
