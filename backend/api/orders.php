<?php
/**
 * Orders API Endpoint
 * Handles GET, PUT, DELETE
 */

// Prevent HTML output and enforce JSON
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Buffer output to catch any accidental echos
ob_start();

try {
    include_once __DIR__ . '/../config/database.php';
    include_once __DIR__ . '/../models/Order.php';

    if (!class_exists('Database')) {
        throw new Exception('Database class not found');
    }

    $database = Database::getInstance();
    $db = $database->getConnection();
    $orderModel = new Order();

    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            handleGet($orderModel);
            break;
        case 'DELETE':
            handleDelete($orderModel);
            break;
        case 'PUT':
            handlePut($orderModel);
            break;
        default:
            throw new Exception('Method not allowed');
    }

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
exit();

function handleGet($orderModel) {
    // Get statistics
    if (isset($_GET['stats'])) {
        $stats = $orderModel->getStats();
        ob_clean();
        echo json_encode(['success' => true, 'data' => $stats]);
        return;
    }

    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($id) {
        // Get Single Order
        $order = $orderModel->getById($id);
        if ($order) {
            ob_clean();
            echo json_encode(['success' => true, 'data' => $order]);
        } else {
            ob_clean();
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Order not found']);
        }
    } else {
        // Get All Orders
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        $search = isset($_GET['search']) ? $_GET['search'] : null;

        $result = $orderModel->getAllWithDetails(
            ['status' => $status, 'search' => $search],
            $page,
            $limit
        );

        ob_clean();
        echo json_encode([
            'success' => true,
            'data' => $result['orders'],
            'pagination' => $result['pagination']
        ]);
    }
}

function handleDelete($orderModel) {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    if (!$id) {
        throw new Exception('Order ID is required');
    }
    
    // Check if order exists
    $order = $orderModel->getById($id);
    if (!$order) {
        ob_clean();
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Order not found']);
        return;
    }
    
    // Basic deletion
    // In a real app we might want to delete order_items first or rely on cascade
    // Assuming cascade or simple delete for now based on BaseModel
    if ($orderModel->delete($id)) {
        ob_clean();
        echo json_encode(['success' => true, 'message' => 'Order deleted successfully']);
    } else {
        throw new Exception('Failed to delete order from database');
    }
}

function handlePut($orderModel) {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    if (!$id) {
        throw new Exception('Order ID is required');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data)) {
        throw new Exception('No data provided');
    }

    // Filter allowed fields
    $allowed = ['status', 'tracking_number', 'notes']; 
    $updateData = array_intersect_key($data, array_flip($allowed));

    if (empty($updateData)) {
         throw new Exception('No valid update data provided');
    }

    if ($orderModel->update($id, $updateData)) {
        $updatedOrder = $orderModel->getById($id); // Re-fetch
        ob_clean();
        echo json_encode(['success' => true, 'data' => $updatedOrder]);
    } else {
        throw new Exception('Failed to update order');
    }
}
?>
