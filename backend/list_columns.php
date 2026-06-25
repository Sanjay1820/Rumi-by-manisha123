<?php
require 'backend/config/database.php';
try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->query("DESC reviews");
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "COLUMNS:\n";
    foreach ($res as $row) {
        echo $row['Field'] . " - " . $row['Type'] . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
