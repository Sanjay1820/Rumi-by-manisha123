<?php
/**
 * Collections API Endpoint
 * RUMI by Manisha - E-commerce Platform
 * 
 * Endpoints:
 * GET    /api/collections.php           - Get all collections
 * GET    /api/collections.php?id=1      - Get single collection
 * GET    /api/collections.php?slug=name - Get collection by slug
 * POST   /api/collections.php           - Create new collection
 * PUT    /api/collections.php?id=1      - Update collection
 * DELETE /api/collections.php?id=1      - Delete collection
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../models/CollectionModel.php';

$collectionModel = new CollectionModel();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGet($collectionModel);
            break;

        case 'POST':
            handlePost($collectionModel);
            break;

        case 'PUT':
            handlePut($collectionModel);
            break;

        case 'DELETE':
            handleDelete($collectionModel);
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

function handleGet($collectionModel)
{
    // Get single collection by ID
    if (isset($_GET['id'])) {
        $collection = $collectionModel->getById($_GET['id']);
        if ($collection) {
            // Get products in this collection
            $products = $collectionModel->getCollectionProducts($_GET['id']);
            $collection['collection_products'] = $products;
            echo json_encode(['success' => true, 'data' => $collection]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Collection not found']);
        }
        return;
    }

    // Get collection by slug
    if (isset($_GET['slug'])) {
        $collection = $collectionModel->getBySlugWithProducts($_GET['slug']);
        if ($collection) {
            $products = $collectionModel->getCollectionProducts($collection['id']);
            $collection['collection_products'] = $products;
            echo json_encode(['success' => true, 'data' => $collection]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Collection not found']);
        }
        return;
    }

    // Get all collections with product count
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = ($page - 1) * $limit;

    $collections = $collectionModel->getAllWithProductCount($limit, $offset);
    echo json_encode(['success' => true, 'data' => $collections]);
}

function handlePost($collectionModel)
{
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['name'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Collection name is required']);
        return;
    }

    // Create the collection
    $collectionId = $collectionModel->create($data);

    if ($collectionId) {
        // If products are provided, add them to the collection
        if (isset($data['products']) && is_array($data['products'])) {
            foreach ($data['products'] as $index => $productId) {
                $collectionModel->addProduct($collectionId, $productId, $index);
            }
        }

        echo json_encode([
            'success' => true,
            'message' => 'Collection created successfully',
            'id' => $collectionId
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create collection']);
    }
}

function handlePut($collectionModel)
{
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Collection ID required']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $id = $_GET['id'];

    // Update collection
    $success = $collectionModel->update($id, $data);

    // If products are provided, update them
    if (isset($data['products']) && is_array($data['products'])) {
        // Remove all existing products first
        $collectionModel->getDb()->prepare("DELETE FROM collection_products WHERE collection_id = :id")
            ->execute([':id' => $id]);
        
        // Add new products
        foreach ($data['products'] as $index => $productId) {
            $collectionModel->addProduct($id, $productId, $index);
        }
    }

    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Collection updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update collection']);
    }
}

function handleDelete($collectionModel)
{
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Collection ID required']);
        return;
    }

    $success = $collectionModel->delete($_GET['id']);

    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Collection deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete collection']);
    }
}
?>
