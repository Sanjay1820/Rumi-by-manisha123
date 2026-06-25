<?php
require_once __DIR__ . '/config/database.php';

try {
    echo "Testing Database Singleton...\n";
    $dbInstance = Database::getInstance();
    if ($dbInstance === null) {
        echo "FAILURE: Database::getInstance() returned null!\n";
    } else {
        echo "SUCCESS: Database instance created.\n";
        $conn = $dbInstance->getConnection();
        if ($conn === null) {
            echo "FAILURE: getConnection() returned null!\n";
        } else {
            echo "SUCCESS: Connection established: " . get_class($conn) . "\n";
        }
    }
} catch (Exception $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
}
?>
