<?php
/**
 * Authentication API Endpoint
 * RUMI by Manisha - E-commerce Platform
 * 
 * Endpoints:
 * POST /api/auth.php?action=register - Register new user
 * POST /api/auth.php?action=login    - Login user
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../models/UserModel.php';

$userModel = new UserModel();
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed. Use POST for authentication.']);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'), true);

    switch ($action) {
        case 'register':
            handleRegister($userModel, $data);
            break;

        case 'login':
            handleLogin($userModel, $data);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action specified.']);
            break;
    }
} catch (Throwable $e) {
    error_log("AUTH API ERROR: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
}

function handleRegister($userModel, $data)
{
    // Validate required fields
    if (empty($data['email']) || empty($data['password']) || empty($data['name'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, email, and password are required']);
        return;
    }

    // Check if user already exists
    if ($userModel->getByEmail($data['email'])) {
        http_response_code(409);
        echo json_encode(['error' => 'An account with this email already exists']);
        return;
    }

    // --- PERMANENT BACKUP LOGGING ---
    try {
        $logDir = __DIR__ . '/../logs';
        if (!is_dir($logDir)) {
            mkdir($logDir, 0777, true);
        }
        $logFile = $logDir . '/users_backup.log';
        $logEntry = "[" . date('Y-m-d H:i:s') . "] NEW REGISTRATION: " . json_encode($data) . PHP_EOL;
        file_put_contents($logFile, $logEntry, FILE_APPEND);
    } catch (Exception $e) {
        error_log("Failed to write to user backup log: " . $e->getMessage());
    }
    // --------------------------------

    // Split name into first and last name
    $nameParts = explode(' ', trim($data['name']), 2);
    $firstName = $nameParts[0];
    $lastName = isset($nameParts[1]) ? $nameParts[1] : '';

    // Prepare data for DB
    $userData = [
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => trim($data['email']),
        'password' => $data['password'],
        'phone' => isset($data['phone']) ? trim($data['phone']) : null,
        // The address, city, and pincode need to be saved in the `user_addresses` table, not `users`
        'role' => 'customer',
        'status' => 'active'
    ];

    $id = $userModel->register($userData);

    if ($id) {
        // Also save address if provided
        if (isset($data['address']) || isset($data['city']) || isset($data['pincode'])) {
            $userModel->addAddress($id, [
                'full_name' => trim($data['name']),
                'phone' => isset($data['phone']) ? trim($data['phone']) : '0000000000',
                'address_line1' => isset($data['address']) ? trim($data['address']) : '',
                'city' => isset($data['city']) ? trim($data['city']) : '',
                'state' => '', // Assuming empty for now
                'postal_code' => isset($data['pincode']) ? trim($data['pincode']) : '',
                'is_default' => 1
            ]);
        }

        $user = $userModel->getById($id);
        unset($user['password']); // Safety first
        if (!isset($user['name']) && isset($user['first_name'])) {
            $user['name'] = trim($user['first_name'] . ' ' . ($user['last_name'] ?? ''));
        }
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Account created successfully',
            'data' => $user
        ]);
    } else {
        http_response_code(500);
        
        // Debug
        $errorInfo = Database::getConn()->errorInfo();
        echo json_encode(['error' => 'Failed to create account', 'db_error' => $errorInfo]);
    }
}

function handleLogin($userModel, $data)
{
    if (empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Email/Phone and password are required']);
        return;
    }

    $user = $userModel->authenticate($data['email'], $data['password']);

    if ($user) {
        if (!isset($user['name']) && isset($user['first_name'])) {
            $user['name'] = trim($user['first_name'] . ' ' . ($user['last_name'] ?? ''));
        }
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'data' => $user
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
}
?>
