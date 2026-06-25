<?php
require_once 'config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->query("DESCRIBE categories");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h1>Categories Table Schema</h1>";
    echo "<pre>";
    print_r($columns);
    echo "</pre>";

    $stmt2 = $db->query("SELECT * FROM categories");
    $categories = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    echo "<h2>Existing Categories</h2>";
    echo "<pre>";
    print_r($categories);
    echo "</pre>";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
