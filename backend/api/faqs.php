<?php
/**
 * FAQ API Endpoint
 * RUMI by Manisha - E-commerce Platform
 * 
 * Endpoints:
 * GET    /api/faqs.php              - Get all FAQs
 * GET    /api/faqs.php?id=1         - Get single FAQ
 * GET    /api/faqs.php?category=x   - Get FAQs by category
 * GET    /api/faqs.php?popular=1    - Get popular FAQs
 * GET    /api/faqs.php?search=query - Search FAQs
 * POST   /api/faqs.php              - Create FAQ (Admin only)
 * PUT    /api/faqs.php?id=1         - Update FAQ (Admin only)
 * DELETE /api/faqs.php?id=1         - Delete FAQ (Admin only)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../models/FAQ.php';

$faqModel = new FAQ();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGet($faqModel);
            break;

        case 'POST':
            handlePost($faqModel);
            break;

        case 'PUT':
            handlePut($faqModel);
            break;

        case 'DELETE':
            handleDelete($faqModel);
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

/**
 * Handle GET requests
 */
function handleGet($faqModel)
{
    // Get single FAQ by ID
    if (isset($_GET['id'])) {
        $faq = $faqModel->getById($_GET['id']);
        if ($faq) {
            echo json_encode(['success' => true, 'data' => $faq]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'FAQ not found']);
        }
        return;
    }

    // Get popular FAQs
    if (isset($_GET['popular'])) {
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 5;
        $faqs = $faqModel->getPopular($limit);
        echo json_encode(['success' => true, 'data' => $faqs]);
        return;
    }

    // Search FAQs
    if (isset($_GET['search'])) {
        $faqs = $faqModel->search($_GET['search']);
        echo json_encode(['success' => true, 'data' => $faqs]);
        return;
    }

    // Get by category
    if (isset($_GET['category'])) {
        $status = isset($_GET['status']) ? $_GET['status'] : 'active';
        $faqs = $faqModel->getByCategory($_GET['category'], $status);
        echo json_encode(['success' => true, 'data' => $faqs]);
        return;
    }

    // Get statistics
    if (isset($_GET['stats'])) {
        $stats = $faqModel->getStats();
        echo json_encode(['success' => true, 'data' => $stats]);
        return;
    }

    // Get grouped FAQs
    if (isset($_GET['grouped'])) {
        $status = isset($_GET['status']) ? $_GET['status'] : 'active';
        $faqs = $faqModel->getAllGrouped($status);
        echo json_encode(['success' => true, 'data' => $faqs]);
        return;
    }

    // Get all FAQs with pagination
    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;
    $offset = ($page - 1) * $limit;

    $filters = [];
    if (isset($_GET['status'])) {
        $filters['status'] = $_GET['status'];
    }

    $faqs = $faqModel->getAll($filters, $limit, $offset);
    $total = $faqModel->count($filters);

    echo json_encode([
        'success' => true,
        'data' => $faqs,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => ceil($total / $limit)
        ]
    ]);
}

/**
 * Handle POST requests (Create)
 */
function handlePost($faqModel)
{
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (empty($data['question']) || empty($data['answer']) || empty($data['category'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Question, answer, and category are required']);
        return;
    }

    // Prepare data
    $faqData = [
        'question' => trim($data['question']),
        'answer' => trim($data['answer']),
        'category' => trim($data['category']),
        'popular' => isset($data['popular']) ? (int) $data['popular'] : 0,
        'display_order' => isset($data['display_order']) ? (int) $data['display_order'] : 0,
        'status' => isset($data['status']) ? $data['status'] : 'active'
    ];

    $id = $faqModel->create($faqData);

    if ($id) {
        $faq = $faqModel->getById($id);
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'FAQ created successfully',
            'data' => $faq
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create FAQ']);
    }
}

/**
 * Handle PUT requests (Update)
 */
function handlePut($faqModel)
{
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'FAQ ID is required']);
        return;
    }

    $id = $_GET['id'];
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if FAQ exists
    $existing = $faqModel->getById($id);
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'FAQ not found']);
        return;
    }

    // Prepare update data
    $updateData = [];
    if (isset($data['question']))
        $updateData['question'] = trim($data['question']);
    if (isset($data['answer']))
        $updateData['answer'] = trim($data['answer']);
    if (isset($data['category']))
        $updateData['category'] = trim($data['category']);
    if (isset($data['popular']))
        $updateData['popular'] = (int) $data['popular'];
    if (isset($data['display_order']))
        $updateData['display_order'] = (int) $data['display_order'];
    if (isset($data['status']))
        $updateData['status'] = $data['status'];

    if (empty($updateData)) {
        http_response_code(400);
        echo json_encode(['error' => 'No data to update']);
        return;
    }

    $success = $faqModel->update($id, $updateData);

    if ($success) {
        $faq = $faqModel->getById($id);
        echo json_encode([
            'success' => true,
            'message' => 'FAQ updated successfully',
            'data' => $faq
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update FAQ']);
    }
}

/**
 * Handle DELETE requests
 */
function handleDelete($faqModel)
{
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'FAQ ID is required']);
        return;
    }

    $id = $_GET['id'];

    // Check if FAQ exists
    $existing = $faqModel->getById($id);
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'FAQ not found']);
        return;
    }

    $success = $faqModel->delete($id);

    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'FAQ deleted successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete FAQ']);
    }
}
