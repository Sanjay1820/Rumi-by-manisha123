<?php
require 'backend/config/database.php';
try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->query("DESCRIBE faqs");
    foreach($stmt->fetchAll(PDO::FETCH_ASSOC) as $r) {
        echo $r['Field'] . " - " . $r['Type'] . "\n";
    }
} catch(Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
