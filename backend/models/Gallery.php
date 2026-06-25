<?php
/**
 * Gallery Model
 * RUMI by Manisha - E-commerce Platform
 */

require_once __DIR__ . '/../config/database.php';

class Gallery extends BaseModel
{
    protected $table = 'gallery';

    /**
     * Get gallery items by category
     */
    public function getByCategory($category, $status = 'active')
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE category = :category AND status = :status 
                ORDER BY display_order ASC, id DESC";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([
            ':category' => $category,
            ':status' => $status
        ]);

        return $stmt->fetchAll();
    }

    /**
     * Get gallery items by type
     */
    public function getByType($type, $status = 'active')
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE type = :type AND status = :status 
                ORDER BY display_order ASC, id DESC";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([
            ':type' => $type,
            ':status' => $status
        ]);

        return $stmt->fetchAll();
    }

    /**
     * Get all gallery items grouped by category
     */
    public function getAllGrouped($status = 'active')
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE status = :status 
                ORDER BY category ASC, display_order ASC, id DESC";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':status' => $status]);
        $items = $stmt->fetchAll();

        // Group by category
        $grouped = [];
        foreach ($items as $item) {
            $category = $item['category'];
            if (!isset($grouped[$category])) {
                $grouped[$category] = [];
            }
            $grouped[$category][] = $item;
        }

        return $grouped;
    }

    /**
     * Update display order
     */
    public function updateOrder($id, $order)
    {
        $sql = "UPDATE {$this->table} SET display_order = :order WHERE id = :id";
        $stmt = $this->getDb()->prepare($sql);
        return $stmt->execute([
            ':order' => $order,
            ':id' => $id
        ]);
    }

    /**
     * Get statistics
     */
    public function getStats()
    {
        $sql = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
                    SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
                    SUM(CASE WHEN type = 'image' THEN 1 ELSE 0 END) as images,
                    SUM(CASE WHEN type = 'video' THEN 1 ELSE 0 END) as videos,
                    SUM(CASE WHEN type = 'instagram-post' THEN 1 ELSE 0 END) as instagram_posts,
                    SUM(CASE WHEN type = 'instagram-reel' THEN 1 ELSE 0 END) as instagram_reels
                FROM {$this->table}";

        $stmt = $this->getDb()->query($sql);
        return $stmt->fetch();
    }
}
