<?php
require 'backend/config/database.php';
$db = Database::getInstance()->getConnection();
$stmt = $db->query("DESC reviews");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "COL: " . $row['Field'] . "\n";
}
