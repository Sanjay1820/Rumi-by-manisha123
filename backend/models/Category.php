<?php
/**
 * Category Model
 * RUMI by Manisha - E-commerce Platform
 */

require_once __DIR__ . '/../config/database.php';

class Category extends BaseModel
{
    protected $table = 'categories';

    /**
     * Get category with product count
     */
    public function getWithProductCount($id)
    {
        $sql = "SELECT 
                    c.*,
                    COUNT(p.id) as product_count
                FROM {$this->table} c
                LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
                WHERE c.id = :id
                GROUP BY c.id";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    /**
     * Get all categories with product counts
     */
    public function getAllWithCounts($status = 'active')
    {
        $sql = "SELECT 
                    c.*,
                    COUNT(p.id) as product_count
                FROM {$this->table} c
                LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
                WHERE c.status = :status
                GROUP BY c.id
                ORDER BY c.display_order ASC, c.name ASC";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':status' => $status]);
        return $stmt->fetchAll();
    }

    /**
     * Get category by slug
     */
    public function getBySlug($slug)
    {
        $sql = "SELECT * FROM {$this->table} WHERE slug = :slug";
        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':slug' => $slug]);
        return $stmt->fetch();
    }

    /**
     * Get parent categories
     */
    public function getParents($status = 'active')
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE parent_id IS NULL AND status = :status
                ORDER BY display_order ASC, name ASC";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':status' => $status]);
        return $stmt->fetchAll();
    }

    /**
     * Get child categories
     */
    public function getChildren($parentId, $status = 'active')
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE parent_id = :parent_id AND status = :status
                ORDER BY display_order ASC, name ASC";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([
            ':parent_id' => $parentId,
            ':status' => $status
        ]);
        return $stmt->fetchAll();
    }

    /**
     * Get category tree
     */
    public function getTree($status = 'active')
    {
        $parents = $this->getParents($status);

        foreach ($parents as &$parent) {
            $parent['children'] = $this->getChildren($parent['id'], $status);
        }

        return $parents;
    }
}
