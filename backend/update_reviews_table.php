<?php
require 'backend/config/database.php';
try {
    $db = Database::getInstance()->getConnection();
    
    $columns = [
        'author_email' => "ALTER TABLE reviews ADD COLUMN author_email VARCHAR(255) AFTER author_name",
        'title' => "ALTER TABLE reviews ADD COLUMN title VARCHAR(255) AFTER rating",
        'verified_purchase' => "ALTER TABLE reviews ADD COLUMN verified_purchase TINYINT(1) DEFAULT 0 AFTER comment"
    ];

    foreach ($columns as $col => $sql) {
        $check = $db->query("SHOW COLUMNS FROM reviews LIKE '$col'");
        if (!$check->fetch()) {
            echo "Adding $col...\n";
            $db->exec($sql);
            echo "$col added.\n";
        } else {
            echo "$col already exists.\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
