<?php
/**
 * Gallery API Endpoint
 * RUMI by Manisha - E-commerce Platform
 * 
 * Endpoints:
 * GET    /api/gallery.php                 - Get all gallery items
 * GET    /api/gallery.php?id=1            - Get single item
 * GET    /api/gallery.php?category=x      - Get by category
 * GET    /api/gallery.php?type=image      - Get by type
 * GET    /api/gallery.php?grouped=1       - Get grouped by category
 * POST   /api/gallery.php                 - Create item (Admin)
 * PUT    /api/gallery.php?id=1            - Update item (Admin)
 * DELETE /api/gallery.php?id=1            - Delete item (Admin)
 */

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Debug Logging (Optional - can be disabled)
/*
$logFile = __DIR__ . '/debug.log';
$logEntry = date('Y-m-d H:i:s') . " - Method: " . $_SERVER['REQUEST_METHOD'] . "\n";
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = file_get_contents('php://input');
    $logEntry .= "Input: " . $input . "\n";
}
file_put_contents($logFile, $logEntry, FILE_APPEND);
*/

require_once __DIR__ . '/../models/Gallery.php';

$galleryModel = new Gallery();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGet($galleryModel);
            break;

        case 'POST':
            handlePost($galleryModel);
            break;

        case 'PUT':
            handlePut($galleryModel);
            break;

        case 'DELETE':
            handleDelete($galleryModel);
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

function handleGet($galleryModel)
{
    // Get single item by ID
    if (isset($_GET['id'])) {
        $item = $galleryModel->getById($_GET['id']);
        if ($item) {
            echo json_encode(['success' => true, 'data' => $item]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Gallery item not found']);
        }
        return;
    }

    // Get by category
    if (isset($_GET['category'])) {
        $status = isset($_GET['status']) ? $_GET['status'] : 'active';
        $items = $galleryModel->getByCategory($_GET['category'], $status);
        echo json_encode(['success' => true, 'data' => $items]);
        return;
    }

    // Get by type
    if (isset($_GET['type'])) {
        $status = isset($_GET['status']) ? $_GET['status'] : 'active';
        $items = $galleryModel->getByType($_GET['type'], $status);
        echo json_encode(['success' => true, 'data' => $items]);
        return;
    }

    // Get statistics
    if (isset($_GET['stats'])) {
        $stats = $galleryModel->getStats();
        echo json_encode(['success' => true, 'data' => $stats]);
        return;
    }

    // Get grouped by category
    if (isset($_GET['grouped'])) {
        $status = isset($_GET['status']) ? $_GET['status'] : 'active';
        $items = $galleryModel->getAllGrouped($status);
        echo json_encode(['success' => true, 'data' => $items]);
        return;
    }

    // Get all items with pagination
    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;
    $offset = ($page - 1) * $limit;

    $filters = [];
    if (isset($_GET['status'])) {
        $filters['status'] = $_GET['status'];
    }

    $items = $galleryModel->getAll($filters, $limit, $offset);
    $total = $galleryModel->count($filters);

    echo json_encode([
        'success' => true,
        'data' => $items,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => ceil($total / $limit)
        ]
    ]);
}

function handlePost($galleryModel)
{
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['url']) || empty($data['title']) || empty($data['category']) || empty($data['type'])) {
        http_response_code(400);
        echo json_encode(['error' => 'URL, title, category, and type are required']);
        return;
    }

    // Map frontend camelCase to backend snake_case
    $instagram_url = null;
    if (isset($data['instagram_url'])) $instagram_url = $data['instagram_url'];
    else if (isset($data['instagramUrl'])) $instagram_url = $data['instagramUrl'];

    $itemData = [
        'url' => trim($data['url']),
        'title' => trim($data['title']),
        'category' => trim($data['category']),
        'type' => $data['type'],
        'thumbnail' => isset($data['thumbnail']) ? trim($data['thumbnail']) : null,
        'instagram_url' => $instagram_url ? trim($instagram_url) : null,
        'status' => isset($data['status']) ? $data['status'] : 'active',
        'display_order' => isset($data['display_order']) ? (int) $data['display_order'] : 0
    ];

    $id = $galleryModel->create($itemData);

    if ($id) {
        $item = $galleryModel->getById($id);
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Gallery item created successfully',
            'data' => $item
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create gallery item']);
    }
}

function handlePut($galleryModel)
{
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Gallery item ID is required']);
        return;
    }

    $id = $_GET['id'];
    $data = json_decode(file_get_contents('php://input'), true);

    $existing = $galleryModel->getById($id);
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'Gallery item not found']);
        return;
    }

    $updateData = [];
    $allowedFields = ['url', 'title', 'category', 'type', 'thumbnail', 'instagram_url', 'status', 'display_order'];

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

    $success = $galleryModel->update($id, $updateData);

    if ($success) {
        $item = $galleryModel->getById($id);
        echo json_encode([
            'success' => true,
            'message' => 'Gallery item updated successfully',
            'data' => $item
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update gallery item']);
    }
}

function handleDelete($galleryModel)
{
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Gallery item ID is required']);
        return;
    }

    $id = $_GET['id'];

    $existing = $galleryModel->getById($id);
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'Gallery item not found']);
        return;
    }

    $success = $galleryModel->delete($id);

    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Gallery item deleted successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete gallery item']);
    }
}
