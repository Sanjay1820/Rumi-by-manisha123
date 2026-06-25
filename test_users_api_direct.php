<?php
// Direct test of users API
header('Content-Type: application/json');

require_once __DIR__ . '/backend/models/UserModel.php';

try {
    $userModel = new UserModel();
    $users = $userModel->getAllUsers();
    
    echo json_encode([
        'success' => true,
        'data' => $users,
        'count' => count($users)
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo json_encode([
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ], JSON_PRETTY_PRINT);
}
?>
