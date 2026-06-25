<?php
/**
 * Database Connection Class
 * RUMI by Manisha - E-commerce Platform
 */

require_once __DIR__ . '/../config/config.php';

class Database
{
    private static $instance = null;
    private $connection;

    private function __construct()
    {
        $this->connect();
    }

    private function connect() 
    {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET,
                PDO::ATTR_PERSISTENT => DB_PERSISTENT, 
                PDO::ATTR_TIMEOUT => DB_TIMEOUT,
            ];

            $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);
            
            // Verify connection is actually alive
            $this->connection->query('SELECT 1');
            
        } catch (PDOException $e) {
            error_log("Database Initial Connection Error: " . $e->getMessage());
            $this->connection = null;
        }
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection()
    {
        // If connection is null, try to connect
        if ($this->connection === null) {
            $this->connect();
        }
        
        // Return connection without redundant verification every call
        // Persistent connections handle keep-alive internally

        if ($this->connection === null) {
            error_log("FATAL: Could not establish or re-establish database connection.");
            throw new Exception("Database connection lost permanently.");
        }

        return $this->connection;
    }

    /**
     * Helper to get connection directly (Shortcut)
     */
    public static function getConn() {
        return self::getInstance()->getConnection();
    }

    // Prevent cloning
    private function __clone()
    {
    }

    // Prevent unserialization
    public function __wakeup()
    {
        throw new Exception("Cannot unserialize singleton");
    }
}

/**
 * Base Model Class
 */
class BaseModel
{
    protected $table;

    /**
     * Get the database connection (always verified)
     */
    protected function getDb()
    {
        return Database::getInstance()->getConnection();
    }

    public function __construct()
    {
        // No longer storing connection in property to avoid stale connections
    }

    /**
     * Get all records with optional filters
     */
    public function getAll($filters = [], $limit = null, $offset = 0)
    {
        $sql = "SELECT * FROM {$this->table}";
        $params = [];

        if (!empty($filters)) {
            $conditions = [];
            foreach ($filters as $key => $value) {
                $conditions[] = "$key = :$key";
                $params[":$key"] = $value;
            }
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }

        $sql .= " ORDER BY id DESC";

        if ($limit) {
            $sql .= " LIMIT :limit OFFSET :offset";
        }

        $stmt = $this->getDb()->prepare($sql);

        if ($limit) {
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
     * Get single record by ID
     */
    public function getById($id)
    {
        $stmt = $this->getDb()->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    /**
     * Insert new record
     */
    public function create($data)
    {
        try {
            $fields = array_keys($data);
            $placeholders = array_map(function ($field) {
                return ":$field";
            }, $fields);

            $sql = "INSERT INTO {$this->table} (" . implode(", ", $fields) . ") 
                    VALUES (" . implode(", ", $placeholders) . ")";

            $db = $this->getDb();
            $stmt = $db->prepare($sql);

            foreach ($data as $key => $value) {
                $stmt->bindValue(":$key", $value);
            }

            if ($stmt->execute()) {
                return $db->lastInsertId();
            } else {
                error_log("DB_ERROR_CREATE [{$this->table}]: " . json_encode($stmt->errorInfo()));
                return false;
            }
        } catch (PDOException $e) {
            error_log("DB_EXCEPTION_CREATE [{$this->table}]: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update record
     */
    public function update($id, $data)
    {
        $fields = [];
        foreach (array_keys($data) as $field) {
            $fields[] = "$field = :$field";
        }

        $sql = "UPDATE {$this->table} SET " . implode(", ", $fields) . " WHERE id = :id";

        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':id', $id);

        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }

        return $stmt->execute();
    }

    /**
     * Delete record
     */
    public function delete($id)
    {
        $stmt = $this->getDb()->prepare("DELETE FROM {$this->table} WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    /**
     * Count records
     */
    public function count($filters = [])
    {
        $sql = "SELECT COUNT(*) as total FROM {$this->table}";
        $params = [];

        if (!empty($filters)) {
            $conditions = [];
            foreach ($filters as $key => $value) {
                $conditions[] = "$key = :$key";
                $params[":$key"] = $value;
            }
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }

        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetch();
        return $result['total'];
    }

    /**
     * Execute custom query
     */
    public function query($sql, $params = [])
    {
        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Begin transaction
     */
    public function beginTransaction()
    {
        return $this->getDb()->beginTransaction();
    }

    /**
     * Commit transaction
     */
    public function commit()
    {
        return $this->getDb()->commit();
    }

    /**
     * Rollback transaction
     */
    public function rollback()
    {
        return $this->getDb()->rollBack();
    }
}
