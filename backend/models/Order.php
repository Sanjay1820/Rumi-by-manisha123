<?php
/**
 * Order Model
 * RUMI by Manisha - E-commerce Platform
 */

require_once __DIR__ . '/../config/database.php';

class Order extends BaseModel
{
    protected $table = 'orders';

    /**
     * Get all orders with item count
     */
    public function getAllWithDetails($filters = [], $page = 1, $limit = 20)
    {
        $offset = ($page - 1) * $limit;
        
        $sql = "SELECT 
                    o.*,
                    COUNT(oi.id) as items_count,
                    DATE_FORMAT(o.created_at, '%Y-%m-%d') as formatted_date
                FROM {$this->table} o
                LEFT JOIN order_items oi ON o.id = oi.order_id";

        $where = [];
        $params = [];

        // Filter by status
        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $where[] = "o.status = :status";
            $params[':status'] = $filters['status'];
        }

        // Search by ID or Customer Name
        if (!empty($filters['search'])) {
            $where[] = "(o.order_number LIKE :search OR o.customer_name LIKE :search)";
            $params[':search'] = "%{$filters['search']}%";
        }

        if (!empty($where)) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }

        $sql .= " GROUP BY o.id ORDER BY o.created_at DESC LIMIT :limit OFFSET :offset";

        $stmt = $this->getDb()->prepare($sql);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();

        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get total count for pagination
        $countSql = "SELECT COUNT(*) FROM {$this->table} o";
        if (!empty($where)) {
            $countSql .= " WHERE " . implode(" AND ", $where);
        }
        $countStmt = $this->getDb()->prepare($countSql);
        foreach ($params as $key => $value) {
            $countStmt->bindValue($key, $value);
        }
        $countStmt->execute();
        $total = $countStmt->fetchColumn();

        return [
            'orders' => $orders,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ];
    }

    /**
     * Get single order with items
     */
    public function getById($id)
    {
        // Get order details
        $stmt = $this->getDb()->prepare("SELECT * FROM {$this->table} WHERE id = :id OR order_number = :id_str");
        $stmt->execute([':id' => $id, ':id_str' => $id]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$order) return null;

        // Get items
        $stmtItems = $this->getDb()->prepare("SELECT * FROM order_items WHERE order_id = :order_id");
        $stmtItems->execute([':order_id' => $order['id']]);
        $order['items'] = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

        return $order;
    }

    /**
     * Get order statistics
     */
    public function getStats()
    {
        $sql = "SELECT 
                    COUNT(*) as total_orders,
                    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
                    SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing_orders,
                    SUM(total_amount) as total_revenue,
                    (SELECT SUM(total_amount) FROM {$this->table} WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as monthly_revenue
                FROM {$this->table}";

        $stmt = $this->getDb()->query($sql);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
