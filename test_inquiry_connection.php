<?php
require_once __DIR__ . '/backend/config/config.php';
require_once __DIR__ . '/backend/config/database.php';
require_once __DIR__ . '/backend/models/Inquiry.php';

header('Content-Type: text/plain');

echo "=== Inquiry Connection Test ===\n";

try {
    $db = Database::getInstance();
    $conn = $db->getConnection();
    echo "✅ Database connection established.\n";

    $inquiryModel = new Inquiry();
    $count = $inquiryModel->count();
    echo "✅ Inquiry table found. Total records: $count\n";

    echo "\nLatest Inquiries:\n";
    $latest = $inquiryModel->getAll([], 5);
    foreach ($latest as $row) {
        echo "- [{$row['created_at']}] {$row['name']} ({$row['email']}): {$row['subject']}\n";
    }

    echo "\nChecking schema...\n";
    $stmt = $conn->query("DESCRIBE inquiries");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $col) {
        echo "Field: {$col['Field']} | Type: {$col['Type']} | Null: {$col['Null']}\n";
    }

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
