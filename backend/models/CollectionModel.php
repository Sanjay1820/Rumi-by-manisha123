<?php
/**
 * Collection Model
 * RUMI by Manisha - E-commerce Platform
 */

require_once __DIR__ . '/../config/database.php';

class CollectionModel extends BaseModel
{
    protected $table = 'collections';

    // Use inherited getDb() from BaseModel

    /**
     * Get all collections with product count
     */
    public function getAllWithProductCount($limit = 50, $offset = 0)
    {
        $sql = "SELECT 
                    c.id, 
                    c.name, 
                    c.slug, 
                    c.description, 
                    c.image_url as image, 
                    c.display_order, 
                    c.status, 
                    c.created_at, 
                    c.updated_at,
                    COUNT(cp.product_id) as products
                FROM {$this->table} c
                LEFT JOIN collection_products cp ON c.id = cp.collection_id
                GROUP BY c.id
                ORDER BY c.display_order ASC, c.created_at DESC
                LIMIT :limit OFFSET :offset";
        
        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }

    /**
     * Get collection by slug with products
     */
    public function getBySlugWithProducts($slug)
    {
        $sql = "SELECT 
                    c.*,
                    COUNT(cp.product_id) as product_count
                FROM {$this->table} c
                LEFT JOIN collection_products cp ON c.id = cp.collection_id
                WHERE c.slug = :slug
                GROUP BY c.id";
        
        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':slug' => $slug]);
        
        return $stmt->fetch();
    }

    /**
     * Get products in a collection
     */
    public function getCollectionProducts($collectionId)
    {
        $sql = "SELECT 
                    p.*,
                    cp.display_order as collection_order
                FROM products p
                INNER JOIN collection_products cp ON p.id = cp.product_id
                WHERE cp.collection_id = :collection_id
                ORDER BY cp.display_order ASC";
        
        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':collection_id' => $collectionId]);
        
        return $stmt->fetchAll();
    }

    /**
     * Add product to collection
     */
    public function addProduct($collectionId, $productId, $displayOrder = 0)
    {
        $sql = "INSERT INTO collection_products (collection_id, product_id, display_order) 
                VALUES (:collection_id, :product_id, :display_order)
                ON DUPLICATE KEY UPDATE display_order = :display_order";
        
        $stmt = $this->getDb()->prepare($sql);
        return $stmt->execute([
            ':collection_id' => $collectionId,
            ':product_id' => $productId,
            ':display_order' => $displayOrder
        ]);
    }

    /**
     * Remove product from collection
     */
    public function removeProduct($collectionId, $productId)
    {
        $sql = "DELETE FROM collection_products 
                WHERE collection_id = :collection_id AND product_id = :product_id";
        
        $stmt = $this->getDb()->prepare($sql);
        return $stmt->execute([
            ':collection_id' => $collectionId,
            ':product_id' => $productId
        ]);
    }

    /**
     * Create slug from name
     */
    private function createSlug($name)
    {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
        return $slug;
    }

    /**
     * Override create to auto-generate slug
     */
    public function create($data)
    {
        if (!isset($data['slug']) && isset($data['name'])) {
            $data['slug'] = $this->createSlug($data['name']);
        }
        
        return parent::create($data);
    }

    /**
     * Override update to regenerate slug if name changes
     */
    public function update($id, $data)
    {
        if (isset($data['name']) && !isset($data['slug'])) {
            $data['slug'] = $this->createSlug($data['name']);
        }
        
        return parent::update($id, $data);
    }
}
?>
