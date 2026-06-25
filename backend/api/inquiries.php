<?php
/**
 * Inquiries API Endpoint
 * RUMI by Manisha - E-commerce Platform
 * 
 * Endpoints:
 * GET    /api/inquiries.php                - Get all inquiries
 * GET    /api/inquiries.php?id=1           - Get single inquiry
 * GET    /api/inquiries.php?status=new     - Get by status
 * GET    /api/inquiries.php?type=general   - Get by type
 * GET    /api/inquiries.php?priority=high  - Get by priority
 * GET    /api/inquiries.php?search=query   - Search inquiries
 * POST   /api/inquiries.php                - Create inquiry
 * PUT    /api/inquiries.php?id=1           - Update inquiry
 * PUT    /api/inquiries.php?assign=1       - Assign inquiry
 * DELETE /api/inquiries.php?id=1           - Delete inquiry
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../models/Inquiry.php';

$inquiryModel = new Inquiry();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGet($inquiryModel);
            break;

        case 'POST':
            handlePost($inquiryModel);
            break;

        case 'PUT':
            handlePut($inquiryModel);
            break;

        case 'DELETE':
            handleDelete($inquiryModel);
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

function handleGet($inquiryModel)
{
    // Get single inquiry
    if (isset($_GET['id'])) {
        $inquiry = $inquiryModel->getById($_GET['id']);
        if ($inquiry) {
            echo json_encode(['success' => true, 'data' => $inquiry]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Inquiry not found']);
        }
        return;
    }

    // Get by status
    if (isset($_GET['status'])) {
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;
        $offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
        $inquiries = $inquiryModel->getByStatus($_GET['status'], $limit, $offset);
        echo json_encode(['success' => true, 'data' => $inquiries]);
        return;
    }

    // Get by type
    if (isset($_GET['type'])) {
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;
        $offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
        $inquiries = $inquiryModel->getByType($_GET['type'], $limit, $offset);
        echo json_encode(['success' => true, 'data' => $inquiries]);
        return;
    }

    // Get by priority
    if (isset($_GET['priority'])) {
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;
        $offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
        $inquiries = $inquiryModel->getByPriority($_GET['priority'], $limit, $offset);
        echo json_encode(['success' => true, 'data' => $inquiries]);
        return;
    }

    // Search inquiries
    if (isset($_GET['search'])) {
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;
        $inquiries = $inquiryModel->search($_GET['search'], $limit);
        echo json_encode(['success' => true, 'data' => $inquiries]);
        return;
    }

    // Get statistics
    if (isset($_GET['stats'])) {
        $stats = $inquiryModel->getStats();
        echo json_encode(['success' => true, 'data' => $stats]);
        return;
    }

    // Get all inquiries with pagination
    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;
    $offset = ($page - 1) * $limit;

    $inquiries = $inquiryModel->getAll([], $limit, $offset);
    $total = $inquiryModel->count();

    echo json_encode([
        'success' => true,
        'data' => $inquiries,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => ceil($total / $limit)
        ]
    ]);
}

function handlePost($inquiryModel)
{
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, email, and message are required']);
        return;
    }

    // --- PERMANENT BACKUP LOGGING ---
    try {
        $logDir = __DIR__ . '/../logs';
        if (!is_dir($logDir)) {
            mkdir($logDir, 0777, true);
        }
        $logFile = $logDir . '/inquiries_backup.log';
        $logEntry = "[" . date('Y-m-d H:i:s') . "] NEW INQUIRY: " . json_encode($data) . PHP_EOL;
        file_put_contents($logFile, $logEntry, FILE_APPEND);
    } catch (Exception $e) {
        error_log("Failed to write to inquiry backup log: " . $e->getMessage());
    }
    // --------------------------------

    $inquiryData = [
        'name' => trim($data['name']),
        'email' => trim($data['email']),
        'phone' => isset($data['phone']) ? trim($data['phone']) : null,
        'subject' => isset($data['subject']) ? trim($data['subject']) : (isset($data['product_name']) ? "Inquiry: " . $data['product_name'] : "General Inquiry"),
        'product_id' => isset($data['product_id']) ? $data['product_id'] : null,
        'product_name' => isset($data['product_name']) ? $data['product_name'] : null,
        'city' => isset($data['city']) ? $data['city'] : null,
        'address' => isset($data['address']) ? $data['address'] : null,
        'message' => trim($data['message']),
        'preferred_date' => isset($data['preferred_date']) && !empty($data['preferred_date']) ? $data['preferred_date'] : null,
        'preferred_time' => isset($data['preferred_time']) ? $data['preferred_time'] : null,
        'inquiry_type' => isset($data['inquiry_type']) ? $data['inquiry_type'] : 'general',
        'status' => 'new',
        'priority' => isset($data['priority']) ? $data['priority'] : 'medium'
    ];

    $id = $inquiryModel->create($inquiryData);

    if ($id) {
        $inquiry = $inquiryModel->getById($id);
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Inquiry submitted successfully',
            'data' => $inquiry
        ]);
    } else {
        http_response_code(500);
        $errorInfo = \Database::getConn()->errorInfo();
        echo json_encode(['error' => 'Failed to create inquiry', 'db_error' => $errorInfo]);
    }
}

function handlePut($inquiryModel)
{
    // Assign inquiry
    if (isset($_GET['assign'])) {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['user_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID is required']);
            return;
        }

        $success = $inquiryModel->assign($_GET['assign'], $data['user_id']);

        if ($success) {
            echo json_encode([
                'success' => true,
                'message' => 'Inquiry assigned successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to assign inquiry']);
        }
        return;
    }

    // Update status
    if (isset($_GET['status'])) {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Status is required']);
            return;
        }

        $success = $inquiryModel->updateStatus($_GET['status'], $data['status']);

        if ($success) {
            echo json_encode([
                'success' => true,
                'message' => 'Status updated successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update status']);
        }
        return;
    }

    // Update inquiry
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Inquiry ID is required']);
        return;
    }

    $id = $_GET['id'];
    $data = json_decode(file_get_contents('php://input'), true);

    $existing = $inquiryModel->getById($id);
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'Inquiry not found']);
        return;
    }

    $updateData = [];
    $allowedFields = ['status', 'priority', 'notes', 'assigned_to'];

    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $updateData[$field] = $data[$field];
        }
    }

    if (empty($updateData)) {
        http_response_code(400);
        echo json_encode(['error' => 'No data to update']);
        return;
    }

    $success = $inquiryModel->update($id, $updateData);

    if ($success) {
        $inquiry = $inquiryModel->getById($id);
        echo json_encode([
            'success' => true,
            'message' => 'Inquiry updated successfully',
            'data' => $inquiry
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update inquiry']);
    }
}

function handleDelete($inquiryModel)
{
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Inquiry ID is required']);
        return;
    }

    $id = $_GET['id'];

    $existing = $inquiryModel->getById($id);
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'Inquiry not found']);
        return;
    }

    $success = $inquiryModel->delete($id);

    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Inquiry deleted successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete inquiry']);
    }
}
