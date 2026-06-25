<?php
/**
 * Products API Endpoint
 * RUMI by Manisha - E-commerce Platform
 * 
 * Endpoints:
 * GET    /api/products.php                 - Get all products (paginated)
 * GET    /api/products.php?id=1            - Get single product
 * GET    /api/products.php?slug=saree-1    - Get product by slug
 * GET    /api/products.php?featured=1      - Get featured products
 * GET    /api/products.php?new=1           - Get new arrivals
 * GET    /api/products.php?bestseller=1    - Get best sellers
 * GET    /api/products.php?search=query    - Search products
 * GET    /api/products.php?collection=1    - Filter by collection
 * POST   /api/products.php                 - Create product (Admin)
 * PUT    /api/products.php?id=1            - Update product (Admin)
 * DELETE /api/products.php?id=1            - Delete product (Admin)
 */

// Prevent any HTML output
error_reporting(E_ALL);
ini_set('display_errors', 0); // content-type: application/json must not have HTML

// Handle CORS
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
    include_once __DIR__ . '/../models/Product.php';

    // Verify Database class exists
    if (!class_exists('Database')) {
        throw new Exception('Database class not found');
    }

    $database = Database::getInstance();
    $db = $database->getConnection();
    
    // Product model uses internal connection via BaseModel, so no argument needed
    $productModel = new Product(); 
} catch (Exception $e) {
    // If initialization fails, clean buffer and return JSON error
    ob_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Initialization error: ' . $e->getMessage()
    ]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGet($productModel);
            break;

        case 'POST':
            handlePost($productModel);
            break;

        case 'PUT':
            handlePut($productModel);
            break;

        case 'DELETE':
            handleDelete($productModel);
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
function handleGet($productModel)
{
    // Get single product by ID
    if (isset($_GET['id'])) {
        $product = $productModel->getWithDetails($_GET['id']);
        if ($product) {
            $product['images'] = $productModel->getImages($_GET['id']);
            $product['variants'] = $productModel->getVariants($_GET['id']);
            echo json_encode(['success' => true, 'data' => $product]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
        }
        return;
    }

    // Get product by slug
    if (isset($_GET['slug'])) {
        $product = $productModel->getBySlug($_GET['slug']);
        if ($product) {
            $product['images'] = $productModel->getImages($product['id']);
            $product['variants'] = $productModel->getVariants($product['id']);
            echo json_encode(['success' => true, 'data' => $product]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
        }
        return;
    }

    // Get featured products
    if (isset($_GET['featured'])) {
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 8;
        $products = $productModel->getFeatured($limit);
        echo json_encode(['success' => true, 'data' => $products]);
        return;
    }

    // Get new arrivals
    if (isset($_GET['new'])) {
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 8;
        $products = $productModel->getNewArrivals($limit);
        echo json_encode(['success' => true, 'data' => $products]);
        return;
    }

    // Get best sellers
    if (isset($_GET['bestseller'])) {
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 8;
        $products = $productModel->getBestSellers($limit);
        echo json_encode(['success' => true, 'data' => $products]);
        return;
    }

    // Search products
    if (isset($_GET['search'])) {
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;
        $products = $productModel->search($_GET['search'], $limit);
        echo json_encode(['success' => true, 'data' => $products]);
        return;
    }

    // Get statistics
    if (isset($_GET['stats'])) {
        $stats = $productModel->getStats();
        echo json_encode(['success' => true, 'data' => $stats]);
        return;
    }

    // Get related products
    if (isset($_GET['related']) && isset($_GET['collection'])) {
        $productId = (int) $_GET['related'];
        $collectionId = (int) $_GET['collection'];
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 4;
        $products = $productModel->getRelated($productId, $collectionId, $limit);
        echo json_encode(['success' => true, 'data' => $products]);
        return;
    }

    // Get all products with filters and pagination
    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;

    $filters = [];
    if (isset($_GET['collection']))
        $filters['collection_id'] = $_GET['collection'];
    if (isset($_GET['status']))
        $filters['status'] = $_GET['status'];
    if (isset($_GET['min_price']))
        $filters['min_price'] = $_GET['min_price'];
    if (isset($_GET['max_price']))
        $filters['max_price'] = $_GET['max_price'];
    if (isset($_GET['q']))
        $filters['search'] = $_GET['q'];

    $result = $productModel->getAllWithFilters($filters, $page, $limit);

    echo json_encode([
        'success' => true,
        'data' => $result['products'],
        'pagination' => $result['pagination']
    ]);
}

/**
 * Handle POST requests (Create)
 */
function handlePost($productModel)
{
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    $required = ['name', 'slug', 'collection_id', 'price'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => ucfirst($field) . ' is required']);
            return;
        }
    }

    // Prepare product data
    $productData = [
        'name' => trim($data['name']),
        'slug' => trim($data['slug']),
        'description' => isset($data['description']) ? trim($data['description']) : '',
        'short_description' => isset($data['short_description']) ? trim($data['short_description']) : '',
        'collection_id' => (int) $data['collection_id'],
        'price' => (float) $data['price'],
        'price_inr' => isset($data['price_inr']) ? (float) $data['price_inr'] : (float) $data['price'] * 83.0, // Default multiplier
        'compare_price' => isset($data['compare_price']) ? (float) $data['compare_price'] : null,
        'cost_price' => isset($data['cost_price']) ? (float) $data['cost_price'] : null,
        'sku' => isset($data['sku']) ? trim($data['sku']) : null,
        'stock_quantity' => isset($data['stock_quantity']) ? (int) $data['stock_quantity'] : 0,
        'fabric' => isset($data['fabric']) ? trim($data['fabric']) : null,
        'care_instructions' => isset($data['care_instructions']) ? trim($data['care_instructions']) : null,
        'featured' => isset($data['featured']) ? (int) $data['featured'] : 0,
        'new_arrival' => isset($data['new_arrival']) ? (int) $data['new_arrival'] : 0,
        'best_seller' => isset($data['best_seller']) ? (int) $data['best_seller'] : 0,
        'status' => isset($data['status']) ? $data['status'] : 'active',
        'seo_title' => isset($data['seo_title']) ? trim($data['seo_title']) : null,
        'seo_description' => isset($data['seo_description']) ? trim($data['seo_description']) : null,
        'seo_keywords' => isset($data['seo_keywords']) ? trim($data['seo_keywords']) : null
    ];

    try {
        $productModel->beginTransaction();

        // Create product
        $productId = $productModel->create($productData);

        // Add images if provided
        if (!empty($data['images']) && is_array($data['images'])) {
            foreach ($data['images'] as $index => $image) {
                $isPrimary = ($index === 0);
                $productModel->addImage(
                    $productId,
                    $image['url'],
                    isset($image['alt']) ? $image['alt'] : '',
                    $isPrimary
                );
            }
        }

        $productModel->commit();

        $product = $productModel->getWithDetails($productId);
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product
        ]);

    } catch (Exception $e) {
        $productModel->rollback();
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create product: ' . $e->getMessage()]);
    }
}

/**
 * Handle PUT requests (Update)
 */
function handlePut($productModel)
{
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID is required']);
        return;
    }

    $id = $_GET['id'];
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if product exists
    $existing = $productModel->getById($id);
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found']);
        return;
    }

    // Prepare update data
    $updateData = [];
    $allowedFields = [
        'name',
        'slug',
        'description',
        'short_description',
        'collection_id',
        'price',
        'price_inr',
        'compare_price',
        'cost_price',
        'sku',
        'stock_quantity',
        'fabric',
        'care_instructions',
        'featured',
        'new_arrival',
        'best_seller',
        'status',
        'seo_title',
        'seo_description',
        'seo_keywords'
    ];

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

    $success = $productModel->update($id, $updateData);

    // Update images if provided
    if (isset($data['images']) && is_array($data['images'])) {
        try {
            // Option 1: Replace all images (simpler for now)
            // Ideally we would sync them, but for a single-image form, this works
            
            // Delete old images first? Or just add new ones?
            // The frontend form seems to handle only one main image.
            
            // For now, let's clear existing images and add new ones if a new list is provided
            // This ensures the DB matches what the frontend sent.
            
            $db = Database::getConn();
            $stmt = $db->prepare("DELETE FROM product_images WHERE product_id = :id");
            $stmt->execute([':id' => $id]);
            
            foreach ($data['images'] as $index => $image) {
                $isPrimary = ($index === 0);
                $productModel->addImage(
                    $id,
                    $image['url'],
                    isset($image['alt']) ? $image['alt'] : '',
                    $isPrimary
                );
            }
        } catch (Exception $e) {
            error_log("Failed to update product images: " . $e->getMessage());
        }
    }

    if ($success) {
        $product = $productModel->getWithDetails($id);
        echo json_encode([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update product']);
    }
}

/**
 * Handle DELETE requests
 */
function handleDelete($productModel)
{
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID is required']);
        return;
    }

    $id = $_GET['id'];

    // Check if product exists
    $existing = $productModel->getById($id);
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found']);
        return;
    }

    $success = $productModel->delete($id);

    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete product']);
    }
}
