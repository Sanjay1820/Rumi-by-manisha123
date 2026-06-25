<?php
require_once __DIR__ . '/config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    
    // Add columns if they don't exist
    $sql = "ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS address VARCHAR(500) NULL AFTER phone,
            ADD COLUMN IF NOT EXISTS city VARCHAR(100) NULL AFTER address,
            ADD COLUMN IF NOT EXISTS pincode VARCHAR(20) NULL AFTER city,
            ADD COLUMN IF NOT EXISTS name VARCHAR(255) NULL AFTER id";
    
    $db->exec($sql);
    echo "Users table updated successfully.\n";
} catch (PDOException $e) {
    die("Error updating users table: " . $e->getMessage() . "\n");
}
?>
