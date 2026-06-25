<?php
require_once __DIR__ . '/backend/config/config.php';

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    
    echo "<h1>Database Tables in " . DB_NAME . "</h1>";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li>$table</li>";
    }
    echo "</ul>";

    if (in_array('collections', $tables)) {
        echo "<p style='color:green'>✅ collections table exists</p>";
        $count = $pdo->query("SELECT COUNT(*) FROM collections")->fetchColumn();
        echo "<p>Record count: $count</p>";
    } else {
        echo "<p style='color:red'>❌ collections table DOES NOT exist</p>";
    }

    if (in_array('collection_products', $tables)) {
        echo "<p style='color:green'>✅ collection_products table exists</p>";
    } else {
        echo "<p style='color:red'>❌ collection_products table DOES NOT exist</p>";
    }

    if (in_array('inquiries', $tables)) {
        echo "<p style='color:green'>✅ inquiries table exists</p>";
        $count = $pdo->query("SELECT COUNT(*) FROM inquiries")->fetchColumn();
        echo "<p>Inquiry count: $count</p>";
    } else {
        echo "<p style='color:red'>❌ inquiries table DOES NOT exist</p>";
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
