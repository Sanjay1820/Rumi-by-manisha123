<?php
/**
 * Users management API Endpoint (Admin)
 * RUMI by Manisha - E-commerce Platform
 * 
 * Endpoints:
 * GET    /api/users.php            - Get all users
 * GET    /api/users.php?id=1       - Get single user
 * PUT    /api/users.php?id=1       - Update user
 * DELETE /api/users.php?id=1       - Delete user
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../models/UserModel.php';

$userModel = new UserModel();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGet($userModel);
            break;

        case 'PUT':
            handlePut($userModel);
            break;

        case 'DELETE':
            handleDelete($userModel);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function handleGet($userModel)
{
    if (isset($_GET['id'])) {
        $user = $userModel->getById($_GET['id']);
        if ($user) {
            unset($user['password']);
            if (!isset($user['name']) && isset($user['first_name'])) {
                $user['name'] = trim($user['first_name'] . ' ' . ($user['last_name'] ?? ''));
            }
            echo json_encode(['success' => true, 'data' => $user]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
        return;
    }

    $users = $userModel->getAllUsers();
    echo json_encode(['success' => true, 'data' => $users]);
}

function handlePut($userModel)
{
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID required']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $id = $_GET['id'];

    // If password is being updated, hash it
    if (isset($data['password']) && !empty($data['password'])) {
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
    } else {
        unset($data['password']);
    }

    // Handle name split
    if (isset($data['name'])) {
        $nameParts = explode(' ', trim($data['name']), 2);
        $data['first_name'] = $nameParts[0];
        $data['last_name'] = isset($nameParts[1]) ? $nameParts[1] : '';
        unset($data['name']);
    }

    // Remove fields that do not exist in the users table
    $allowedFields = ['first_name', 'last_name', 'email', 'phone', 'role', 'status', 'password'];
    foreach (array_keys($data) as $key) {
        if (!in_array($key, $allowedFields)) {
            unset($data[$key]);
        }
    }

    $success = $userModel->update($id, $data);

    if ($success) {
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update user']);
    }
}

function handleDelete($userModel)
{
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID required']);
        return;
    }

    $id = $_GET['id'];

    if ($id === 'all') {
        // Special case: Delete all users except admins for safety
        $db = Database::getConn();
        $stmt = $db->prepare("DELETE FROM users WHERE role != 'admin'");
        $success = $stmt->execute();
        $message = 'All non-admin user identities terminated.';
    } else {
        $success = $userModel->delete($id);
        $message = 'User identity terminated.';
    }

    if ($success) {
        echo json_encode(['success' => true, 'message' => $message]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to terminate identity']);
    }
}
?>
