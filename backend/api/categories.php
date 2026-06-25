<?php
/**
 * Categories API Endpoint
 * RUMI by Manisha - E-commerce Platform
 * 
 * Endpoints:
 * GET    /api/categories.php              - Get all categories
 * GET    /api/categories.php?id=1         - Get single category
 * GET    /api/categories.php?slug=sarees  - Get category by slug
 * GET    /api/categories.php?tree=1       - Get category tree
 * POST   /api/categories.php              - Create category (Admin)
 * PUT    /api/categories.php?id=1         - Update category (Admin)
 * DELETE /api/categories.php?id=1         - Delete category (Admin)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../models/Category.php';

$categoryModel = new Category();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGet($categoryModel);
            break;

        case 'POST':
            handlePost($categoryModel);
            break;

        case 'PUT':
            handlePut($categoryModel);
            break;

        case 'DELETE':
            handleDelete($categoryModel);
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

function handleGet($categoryModel)
{
    // Get single category by ID
    if (isset($_GET['id'])) {
        $category = $categoryModel->getWithProductCount($_GET['id']);
        if ($category) {
            echo json_encode(['success' => true, 'data' => $category]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Category not found']);
        }
        return;
    }

    // Get category by slug
    if (isset($_GET['slug'])) {
        $category = $categoryModel->getBySlug($_GET['slug']);
        if ($category) {
            echo json_encode(['success' => true, 'data' => $category]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Category not found']);
        }
        return;
    }

    // Get category tree
    if (isset($_GET['tree'])) {
        $status = isset($_GET['status']) ? $_GET['status'] : 'active';
        $tree = $categoryModel->getTree($status);
        echo json_encode(['success' => true, 'data' => $tree]);
        return;
    }

    // Get all categories with counts
    $status = isset($_GET['status']) ? $_GET['status'] : 'active';
    $categories = $categoryModel->getAllWithCounts($status);
    echo json_encode(['success' => true, 'data' => $categories]);
}

function handlePost($categoryModel)
{
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['name']) || empty($data['slug'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Name and slug are required']);
        return;
    }

    $categoryData = [
        'name' => trim($data['name']),
        'slug' => trim($data['slug']),
        'description' => isset($data['description']) ? trim($data['description']) : null,
        'image_url' => isset($data['image_url']) ? trim($data['image_url']) : null,
        'parent_id' => isset($data['parent_id']) ? (int) $data['parent_id'] : null,
        'display_order' => isset($data['display_order']) ? (int) $data['display_order'] : 0,
        'status' => isset($data['status']) ? $data['status'] : 'active'
    ];

    $id = $categoryModel->create($categoryData);

    if ($id) {
        $category = $categoryModel->getById($id);
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create category']);
    }
}

function handlePut($categoryModel)
{
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Category ID is required']);
        return;
    }

    $id = $_GET['id'];
    $data = json_decode(file_get_contents('php://input'), true);

    $existing = $categoryModel->getById($id);
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'Category not found']);
        return;
    }

    $updateData = [];
    $allowedFields = ['name', 'slug', 'description', 'image_url', 'parent_id', 'display_order', 'status'];

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

    $success = $categoryModel->update($id, $updateData);

    if ($success) {
        $category = $categoryModel->getById($id);
        echo json_encode([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update category']);
    }
}

function handleDelete($categoryModel)
{
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Category ID is required']);
        return;
    }

    $id = $_GET['id'];

    $existing = $categoryModel->getById($id);
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'Category not found']);
        return;
    }

    $success = $categoryModel->delete($id);

    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Category deleted successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete category']);
    }
}
