<?php
/**
 * Reviews API Endpoint
 * RUMI by Manisha - E-commerce Platform
 * 
 * Endpoints:
 * GET    /api/reviews.php                 - Get all reviews
 * GET    /api/reviews.php?id=1            - Get single review
 * GET    /api/reviews.php?product=1       - Get reviews by product
 * GET    /api/reviews.php?user=1          - Get reviews by user
 * GET    /api/reviews.php?pending=1       - Get pending reviews
 * POST   /api/reviews.php                 - Create review
 * PUT    /api/reviews.php?id=1            - Update review
 * PUT    /api/reviews.php?approve=1       - Approve review
 * PUT    /api/reviews.php?reject=1        - Reject review
 * DELETE /api/reviews.php?id=1            - Delete review
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../models/Review.php';

$reviewModel = new Review();
$method = $_SERVER['REQUEST_METHOD'];
try {
    switch ($method) {
        case 'GET':
            handleGet($reviewModel);
            break;

        case 'POST':
            handlePost($reviewModel);
            break;

        case 'PUT':
            handlePut($reviewModel);
            break;

        case 'DELETE':
            handleDelete($reviewModel);
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

function handleGet($reviewModel)
{
    // Get single review
    if (isset($_GET['id'])) {
        $review = $reviewModel->getById($_GET['id']);
        if ($review) {
            echo json_encode(['success' => true, 'data' => $review]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Review not found']);
        }
        return;
    }

    // Get reviews by product
    if (isset($_GET['product'])) {
        $status = isset($_GET['status']) ? $_GET['status'] : 'approved';
        $reviews = $reviewModel->getByProduct($_GET['product'], $status);

        // Get rating stats
        $stats = $reviewModel->getAverageRating($_GET['product']);
        $distribution = $reviewModel->getRatingDistribution($_GET['product']);

        echo json_encode([
            'success' => true,
            'data' => $reviews,
            'stats' => $stats,
            'distribution' => $distribution
        ]);
        return;
    }

    // Get reviews by user
    if (isset($_GET['user'])) {
        $reviews = $reviewModel->getByUser($_GET['user']);
        echo json_encode(['success' => true, 'data' => $reviews]);
        return;
    }

    // Get pending reviews
    if (isset($_GET['pending'])) {
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;
        $offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
        $reviews = $reviewModel->getPending($limit, $offset);
        echo json_encode(['success' => true, 'data' => $reviews]);
        return;
    }

    // Get statistics
    if (isset($_GET['stats'])) {
        $stats = $reviewModel->getStats();
        echo json_encode(['success' => true, 'data' => $stats]);
        return;
    }

    // Get all reviews with pagination
    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;
    $offset = ($page - 1) * $limit;

    $filters = [];
    if (isset($_GET['status'])) {
        $filters['status'] = $_GET['status'];
    }

    $reviews = $reviewModel->getAll($filters, $limit, $offset);
    $total = $reviewModel->count($filters);

    echo json_encode([
        'success' => true,
        'data' => $reviews,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => ceil($total / $limit)
        ]
    ]);
}

function handlePost($reviewModel)
{
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (empty($data['product_id']) || empty($data['rating']) || empty($data['comment']) || empty($data['author_name'])) {
        http_response_code(400);
        $missing = [];
        if (empty($data['product_id'])) $missing[] = 'product_id';
        if (empty($data['rating'])) $missing[] = 'rating';
        if (empty($data['comment'])) $missing[] = 'comment';
        if (empty($data['author_name'])) $missing[] = 'author_name';
        
        echo json_encode(['error' => 'Required fields missing: ' . implode(', ', $missing)]);
        return;
    }

    // Validate rating
    if ($data['rating'] < 1 || $data['rating'] > 5) {
        http_response_code(400);
        echo json_encode(['error' => 'Rating must be between 1 and 5']);
        return;
    }

    $reviewData = [
        'product_id' => (int) $data['product_id'],
        'user_id' => isset($data['user_id']) ? (int) $data['user_id'] : null,
        'author_name' => trim($data['author_name']),
        'author_email' => isset($data['author_email']) ? trim($data['author_email']) : null,
        'rating' => (int) $data['rating'],
        'title' => isset($data['title']) ? trim($data['title']) : null,
        'comment' => trim($data['comment']),
        'verified_purchase' => isset($data['verified_purchase']) ? (int) $data['verified_purchase'] : 0,
        'status' => isset($data['status']) ? $data['status'] : 'pending'
    ];

    try {
        $id = $reviewModel->create($reviewData);

        if ($id) {
            $review = $reviewModel->getById($id);
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Review submitted successfully',
                'data' => $review
            ]);
        } else {
            throw new Exception('Failed to create review: lastInsertId returned 0');
        }
    } catch (Exception $e) {
        error_log("[" . date('Y-m-d H:i:s') . "] Review Submit Error: " . $e->getMessage() . "\n", 3, "debug_reviews.log");
        http_response_code(500);
        echo json_encode(['error' => 'Failed to submit review: ' . $e->getMessage()]);
    }
}

function handlePut($reviewModel)
{
    // Approve review
    if (isset($_GET['approve'])) {
        $id = $_GET['approve'];
        $success = $reviewModel->approve($id);

        if ($success) {
            echo json_encode([
                'success' => true,
                'message' => 'Review approved successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to approve review']);
        }
        return;
    }

    // Reject review
    if (isset($_GET['reject'])) {
        $id = $_GET['reject'];
        $success = $reviewModel->reject($id);

        if ($success) {
            echo json_encode([
                'success' => true,
                'message' => 'Review rejected successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to reject review']);
        }
        return;
    }

    // Increment helpful
    if (isset($_GET['helpful'])) {
        $id = $_GET['helpful'];
        $success = $reviewModel->incrementHelpful($id);

        if ($success) {
            echo json_encode([
                'success' => true,
                'message' => 'Helpful count updated'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update helpful count']);
        }
        return;
    }

    // Update review
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Review ID is required']);
        return;
    }

    $id = $_GET['id'];
    $data = json_decode(file_get_contents('php://input'), true);

    $existing = $reviewModel->getById($id);
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'Review not found']);
        return;
    }

    $updateData = [];
    $allowedFields = ['rating', 'title', 'comment', 'status'];

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

    $success = $reviewModel->update($id, $updateData);

    if ($success) {
        $review = $reviewModel->getById($id);
        echo json_encode([
            'success' => true,
            'message' => 'Review updated successfully',
            'data' => $review
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update review']);
    }
}

function handleDelete($reviewModel)
{
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Review ID is required']);
        return;
    }

    $id = $_GET['id'];

    $existing = $reviewModel->getById($id);
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'Review not found']);
        return;
    }

    $success = $reviewModel->delete($id);

    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Review deleted successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete review']);
    }
}
