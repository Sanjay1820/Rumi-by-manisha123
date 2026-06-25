<?php
require_once 'config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    
    foreach (['product_images', 'product_variants'] as $table) {
        $stmt = $db->query("DESCRIBE $table");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "<h1>$table Table Schema</h1>";
        echo "<pre>";
        print_r($columns);
        echo "</pre>";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
