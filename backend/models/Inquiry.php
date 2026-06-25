<?php
/**
 * Inquiry Model
 * RUMI by Manisha - E-commerce Platform
 */

require_once __DIR__ . '/../config/database.php';

class Inquiry extends BaseModel
{
    protected $table = 'inquiries';

    /**
     * Get inquiries by status
     */
    public function getByStatus($status, $limit = 20, $offset = 0)
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE status = :status 
                ORDER BY created_at DESC
                LIMIT :limit OFFSET :offset";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':status', $status);
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int) $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Get inquiries by type
     */
    public function getByType($type, $limit = 20, $offset = 0)
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE inquiry_type = :type 
                ORDER BY created_at DESC
                LIMIT :limit OFFSET :offset";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':type', $type);
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int) $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Get inquiries by priority
     */
    public function getByPriority($priority, $limit = 20, $offset = 0)
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE priority = :priority 
                ORDER BY created_at DESC
                LIMIT :limit OFFSET :offset";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':priority', $priority);
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int) $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Assign inquiry to user
     */
    public function assign($id, $userId)
    {
        $sql = "UPDATE {$this->table} 
                SET assigned_to = :user_id, status = 'in_progress' 
                WHERE id = :id";

        $stmt = $this->getDb()->prepare($sql);
        return $stmt->execute([
            ':user_id' => $userId,
            ':id' => $id
        ]);
    }

    /**
     * Update status
     */
    public function updateStatus($id, $status)
    {
        $sql = "UPDATE {$this->table} SET status = :status";

        if ($status === 'resolved') {
            $sql .= ", resolved_at = NOW()";
        }

        $sql .= " WHERE id = :id";

        $stmt = $this->getDb()->prepare($sql);
        return $stmt->execute([
            ':status' => $status,
            ':id' => $id
        ]);
    }

    /**
     * Add notes
     */
    public function addNotes($id, $notes)
    {
        $sql = "UPDATE {$this->table} SET notes = :notes WHERE id = :id";
        $stmt = $this->getDb()->prepare($sql);
        return $stmt->execute([
            ':notes' => $notes,
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
                    SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
                    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
                    SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
                    SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed,
                    SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent,
                    SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high
                FROM {$this->table}";

        $stmt = $this->getDb()->query($sql);
        return $stmt->fetch();
    }

    /**
     * Search inquiries
     */
    public function search($query, $limit = 20)
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE name LIKE :query 
                OR email LIKE :query 
                OR subject LIKE :query 
                OR message LIKE :query
                ORDER BY created_at DESC
                LIMIT :limit";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':query', "%$query%");
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }
}
