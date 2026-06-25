<?php
require_once __DIR__ . '/config/database.php';
$db = Database::getInstance()->getConnection();
$dbName = $db->query('SELECT DATABASE()')->fetchColumn();
$stmt = $db->query('DESCRIBE users');
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
$output = "Current Database: $dbName\n\n";
foreach($rows as $row) {
    $output .= $row['Field'] . " | " . $row['Type'] . "\n";
}
file_put_contents(__DIR__ . '/users_schema_v2.txt', $output);
?>
