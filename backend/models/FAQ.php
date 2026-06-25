<?php
/**
 * FAQ Model
 * RUMI by Manisha - E-commerce Platform
 */

require_once __DIR__ . '/../config/database.php';

class FAQ extends BaseModel
{
    protected $table = 'faqs';

    /**
     * Get FAQs by category
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
     * Get popular FAQs
     */
    public function getPopular($limit = 5, $status = 'active')
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE popular = 1 AND status = :status 
                ORDER BY display_order ASC, id DESC 
                LIMIT :limit";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':status', $status);
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Search FAQs
     */
    public function search($query, $status = 'active')
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE (question LIKE :query OR answer LIKE :query) 
                AND status = :status 
                ORDER BY display_order ASC, id DESC";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([
            ':query' => "%$query%",
            ':status' => $status
        ]);

        return $stmt->fetchAll();
    }

    /**
     * Get FAQs grouped by category
     */
    public function getAllGrouped($status = 'active')
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE status = :status 
                ORDER BY category ASC, display_order ASC, id DESC";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':status' => $status]);
        $faqs = $stmt->fetchAll();

        // Group by category
        $grouped = [];
        foreach ($faqs as $faq) {
            $category = $faq['category'];
            if (!isset($grouped[$category])) {
                $grouped[$category] = [];
            }
            $grouped[$category][] = $faq;
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
     * Toggle popular status
     */
    public function togglePopular($id)
    {
        $sql = "UPDATE {$this->table} SET popular = NOT popular WHERE id = :id";
        $stmt = $this->getDb()->prepare($sql);
        return $stmt->execute([':id' => $id]);
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
                    SUM(CASE WHEN popular = 1 THEN 1 ELSE 0 END) as popular,
                    category,
                    COUNT(*) as category_count
                FROM {$this->table}
                GROUP BY category";

        $stmt = $this->getDb()->query($sql);
        return $stmt->fetchAll();
    }
}
