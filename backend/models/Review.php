<?php
/**
 * Review Model
 * RUMI by Manisha - E-commerce Platform
 */

require_once __DIR__ . '/../config/database.php';

class Review extends BaseModel
{
    protected $table = 'reviews';

    /**
     * Get reviews by product
     */
    public function getByProduct($productId, $status = 'approved')
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE product_id = :product_id AND status = :status 
                ORDER BY created_at DESC";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([
            ':product_id' => $productId,
            ':status' => $status
        ]);

        return $stmt->fetchAll();
    }

    /**
     * Get reviews by user
     */
    public function getByUser($userId)
    {
        $sql = "SELECT r.*, p.name as product_name, p.slug as product_slug 
                FROM {$this->table} r
                LEFT JOIN products p ON r.product_id = p.id
                WHERE r.user_id = :user_id 
                ORDER BY r.created_at DESC";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':user_id' => $userId]);

        return $stmt->fetchAll();
    }

    /**
     * Get average rating for product
     */
    public function getAverageRating($productId)
    {
        $sql = "SELECT AVG(rating) as avg_rating, COUNT(*) as review_count 
                FROM {$this->table} 
                WHERE product_id = :product_id AND status = 'approved'";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':product_id' => $productId]);

        return $stmt->fetch();
    }

    /**
     * Get rating distribution
     */
    public function getRatingDistribution($productId)
    {
        $sql = "SELECT 
                    rating,
                    COUNT(*) as count
                FROM {$this->table}
                WHERE product_id = :product_id AND status = 'approved'
                GROUP BY rating
                ORDER BY rating DESC";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':product_id' => $productId]);

        return $stmt->fetchAll();
    }

    /**
     * Get pending reviews
     */
    public function getPending($limit = 20, $offset = 0)
    {
        $sql = "SELECT r.*, p.name as product_name, p.slug as product_slug, pi.image_url as product_image, u.first_name, u.last_name 
                FROM {$this->table} r
                LEFT JOIN products p ON r.product_id = p.id
                LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
                LEFT JOIN users u ON r.user_id = u.id
                WHERE r.status = 'pending'
                ORDER BY r.created_at DESC
                LIMIT :limit OFFSET :offset";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int) $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Approve review
     */
    public function approve($id)
    {
        $sql = "UPDATE {$this->table} SET status = 'approved' WHERE id = :id";
        $stmt = $this->getDb()->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    /**
     * Reject review
     */
    public function reject($id)
    {
        $sql = "UPDATE {$this->table} SET status = 'rejected' WHERE id = :id";
        $stmt = $this->getDb()->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    /**
     * Increment helpful count
     */
    public function incrementHelpful($id)
    {
        $sql = "UPDATE {$this->table} SET helpful_count = helpful_count + 1 WHERE id = :id";
        $stmt = $this->getDb()->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    /**
     * Get all reviews with optional filters and join product name
     */
    public function getAll($filters = [], $limit = null, $offset = 0)
    {
        $sql = "SELECT r.*, p.name as product_name, p.slug as product_slug, pi.image_url as product_image
                FROM {$this->table} r
                LEFT JOIN products p ON r.product_id = p.id
                LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1";
        
        $params = [];
        if (!empty($filters)) {
            $conditions = [];
            foreach ($filters as $key => $value) {
                // Handle ambiguous column matching by prefixing with table alias 'r'
                $conditions[] = "r.$key = :$key";
                $params[":$key"] = $value;
            }
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }

        $sql .= " ORDER BY r.created_at DESC";

        if ($limit !== null) {
            $sql .= " LIMIT :limit OFFSET :offset";
        }

        $stmt = $this->getDb()->prepare($sql);

        if ($limit !== null) {
            $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int) $offset, PDO::PARAM_INT);
        }

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get statistics
     */
    public function getStats()
    {
        $sql = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
                    AVG(rating) as avg_rating,
                    SUM(CASE WHEN verified_purchase = 1 THEN 1 ELSE 0 END) as verified
                FROM {$this->table}";

        $stmt = $this->getDb()->query($sql);
        return $stmt->fetch();
    }
}
