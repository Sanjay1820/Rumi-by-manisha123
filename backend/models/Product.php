<?php
/**
 * Product Model
 * RUMI by Manisha - E-commerce Platform
 */

require_once __DIR__ . '/../config/database.php';

class Product extends BaseModel
{
    protected $table = 'products';

    /**
     * Get products with images and category
     */
    public function getWithDetails($id)
    {
        $sql = "SELECT 
                    p.*,
                    col.name as collection_name,
                    col.slug as collection_slug,
                    GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.display_order) as images
                FROM {$this->table} p
                LEFT JOIN collections col ON p.collection_id = col.id
                LEFT JOIN product_images pi ON p.id = pi.product_id
                WHERE p.id = :id
                GROUP BY p.id";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':id' => $id]);
        $product = $stmt->fetch();

        if ($product && $product['images']) {
            $product['images'] = explode(',', $product['images']);
        }

        return $product;
    }

    /**
     * Get all products with pagination and filters
     */
    public function getAllWithFilters($filters = [], $page = 1, $limit = 20)
    {
        $offset = ($page - 1) * $limit;
        $params = [];
        $conditions = [];

        // Build WHERE clause
        if (!empty($filters['collection_id'])) {
            $conditions[] = "p.collection_id = :collection_id";
            $params[':collection_id'] = $filters['collection_id'];
        }

        if (!empty($filters['status'])) {
            $conditions[] = "p.status = :status";
            $params[':status'] = $filters['status'];
        } else {
            $conditions[] = "p.status = 'active'";
        }

        if (!empty($filters['featured'])) {
            $conditions[] = "p.featured = 1";
        }

        if (!empty($filters['new_arrival'])) {
            $conditions[] = "p.new_arrival = 1";
        }

        if (!empty($filters['best_seller'])) {
            $conditions[] = "p.best_seller = 1";
        }

        if (!empty($filters['min_price'])) {
            $conditions[] = "p.price >= :min_price";
            $params[':min_price'] = $filters['min_price'];
        }

        if (!empty($filters['max_price'])) {
            $conditions[] = "p.price <= :max_price";
            $params[':max_price'] = $filters['max_price'];
        }

        if (!empty($filters['search'])) {
            $conditions[] = "(p.name LIKE :search OR p.description LIKE :search OR p.seo_keywords LIKE :search)";
            $params[':search'] = "%{$filters['search']}%";
        }

        $whereClause = !empty($conditions) ? "WHERE " . implode(" AND ", $conditions) : "";

        // Get total count
        $countSql = "SELECT COUNT(DISTINCT p.id) as total FROM {$this->table} p $whereClause";
        $countStmt = $this->getDb()->prepare($countSql);
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];

        // Get products
        $sql = "SELECT 
                    p.*,
                    col.name as collection_name,
                    col.slug as collection_slug,
                    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image,
                    (SELECT AVG(rating) FROM reviews WHERE product_id = p.id AND status = 'approved') as avg_rating,
                    (SELECT COUNT(*) FROM reviews WHERE product_id = p.id AND status = 'approved') as review_count
                FROM {$this->table} p
                LEFT JOIN collections col ON p.collection_id = col.id
                $whereClause
                ORDER BY p.created_at DESC
                LIMIT :limit OFFSET :offset";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int) $offset, PDO::PARAM_INT);

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        $stmt->execute();
        $products = $stmt->fetchAll();

        return [
            'products' => $products,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ];
    }

    /**
     * Get product by slug
     */
    public function getBySlug($slug)
    {
        $sql = "SELECT 
                    p.*,
                    col.name as collection_name,
                    col.slug as collection_slug
                FROM {$this->table} p
                LEFT JOIN collections col ON p.collection_id = col.id
                WHERE p.slug = :slug";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':slug' => $slug]);
        return $stmt->fetch();
    }

    /**
     * Get product images
     */
    public function getImages($productId)
    {
        $sql = "SELECT * FROM product_images 
                WHERE product_id = :product_id 
                ORDER BY display_order ASC, id ASC";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':product_id' => $productId]);
        return $stmt->fetchAll();
    }

    /**
     * Add product image
     */
    public function addImage($productId, $imageUrl, $altText = '', $isPrimary = false)
    {
        $sql = "INSERT INTO product_images (product_id, image_url, alt_text, is_primary) 
                VALUES (:product_id, :image_url, :alt_text, :is_primary)";

        $stmt = $this->getDb()->prepare($sql);
        return $stmt->execute([
            ':product_id' => $productId,
            ':image_url' => $imageUrl,
            ':alt_text' => $altText,
            ':is_primary' => $isPrimary ? 1 : 0
        ]);
    }

    /**
     * Get product variants
     */
    public function getVariants($productId)
    {
        $sql = "SELECT * FROM product_variants 
                WHERE product_id = :product_id AND status = 'active'
                ORDER BY id ASC";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':product_id' => $productId]);
        return $stmt->fetchAll();
    }

    /**
     * Get featured products
     */
    public function getFeatured($limit = 8)
    {
        $sql = "SELECT 
                    p.*,
                    col.name as collection_name,
                    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                FROM {$this->table} p
                LEFT JOIN collections col ON p.collection_id = col.id
                WHERE p.featured = 1 AND p.status = 'active'
                ORDER BY p.created_at DESC
                LIMIT :limit";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get new arrivals
     */
    public function getNewArrivals($limit = 8)
    {
        $sql = "SELECT 
                    p.*,
                    col.name as collection_name,
                    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                FROM {$this->table} p
                LEFT JOIN collections col ON p.collection_id = col.id
                WHERE p.new_arrival = 1 AND p.status = 'active'
                ORDER BY p.created_at DESC
                LIMIT :limit";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get best sellers
     */
    public function getBestSellers($limit = 8)
    {
        $sql = "SELECT 
                    p.*,
                    col.name as collection_name,
                    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                FROM {$this->table} p
                LEFT JOIN collections col ON p.collection_id = col.id
                WHERE p.best_seller = 1 AND p.status = 'active'
                ORDER BY p.created_at DESC
                LIMIT :limit";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get related products
     */
    public function getRelated($productId, $collectionId, $limit = 4)
    {
        $sql = "SELECT 
                    p.*,
                    col.name as collection_name,
                    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                FROM {$this->table} p
                LEFT JOIN collections col ON p.collection_id = col.id
                WHERE p.collection_id = :collection_id 
                AND p.id != :product_id 
                AND p.status = 'active'
                ORDER BY RAND()
                LIMIT :limit";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':collection_id', $collectionId, PDO::PARAM_INT);
        $stmt->bindValue(':product_id', $productId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Update stock quantity
     */
    public function updateStock($productId, $quantity)
    {
        $sql = "UPDATE {$this->table} SET stock_quantity = :quantity WHERE id = :id";
        $stmt = $this->getDb()->prepare($sql);
        return $stmt->execute([
            ':quantity' => $quantity,
            ':id' => $productId
        ]);
    }

    /**
     * Decrease stock
     */
    public function decreaseStock($productId, $quantity)
    {
        $sql = "UPDATE {$this->table} 
                SET stock_quantity = stock_quantity - :quantity 
                WHERE id = :id AND stock_quantity >= :quantity";

        $stmt = $this->getDb()->prepare($sql);
        return $stmt->execute([
            ':quantity' => $quantity,
            ':id' => $productId
        ]);
    }

    /**
     * Get product statistics
     */
    public function getStats()
    {
        $sql = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
                    SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
                    SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END) as featured,
                    SUM(CASE WHEN new_arrival = 1 THEN 1 ELSE 0 END) as new_arrivals,
                    SUM(CASE WHEN best_seller = 1 THEN 1 ELSE 0 END) as best_sellers,
                    SUM(CASE WHEN stock_quantity <= low_stock_threshold THEN 1 ELSE 0 END) as low_stock,
                    SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock
                FROM {$this->table}";

        $stmt = $this->getDb()->query($sql);
        return $stmt->fetch();
    }

    /**
     * Search products
     */
    public function search($query, $limit = 20)
    {
        $sql = "SELECT 
                    p.*,
                    col.name as collection_name,
                    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                FROM {$this->table} p
                LEFT JOIN collections col ON p.collection_id = col.id
                WHERE (p.name LIKE :query OR p.description LIKE :query OR p.seo_keywords LIKE :query)
                AND p.status = 'active'
                ORDER BY p.created_at DESC
                LIMIT :limit";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':query', "%{$query}%");
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
