<?php
require_once __DIR__ . '/config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    
    // Make legacy fields nullable
    $sql = "ALTER TABLE users 
            MODIFY COLUMN first_name VARCHAR(100) NULL,
            MODIFY COLUMN last_name VARCHAR(100) NULL";
    
    $db->exec($sql);
    echo "Users table standardized successfully.\n";
} catch (PDOException $e) {
    die("Error standardizing users table: " . $e->getMessage() . "\n");
}
?>
