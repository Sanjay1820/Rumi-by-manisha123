<?php
/**
 * User Model
 * RUMI by Manisha - E-commerce Platform
 */

require_once __DIR__ . '/../config/database.php';

class UserModel extends BaseModel
{
    protected $table = 'users';


    public function getByEmail($email)
    {
        $stmt = $this->getDb()->prepare("SELECT * FROM {$this->table} WHERE email = :email");
        $stmt->execute([':email' => $email]);
        return $stmt->fetch();
    }

    /**
     * Get user by phone
     */
    public function getByPhone($phone)
    {
        $stmt = $this->getDb()->prepare("SELECT * FROM {$this->table} WHERE phone = :phone");
        $stmt->execute([':phone' => $phone]);
        return $stmt->fetch();
    }

    /**
     * Create new user with password hashing
     */
    public function register($data)
    {
        // Hash password before saving
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        return $this->create($data);
    }

    /**
     * Verify user credentials
     */
    public function authenticate($emailOrPhone, $password)
    {
        // Debug check
        $colsStmt = $this->getDb()->query("SHOW COLUMNS FROM `users` ");
        $cols = $colsStmt->fetchAll(PDO::FETCH_ASSOC);
        $colNames = array_map(function($c) { return $c['Field']; }, $cols);
        error_log("LIVE AUTH CHECK - Columns in users: " . implode(", ", $colNames));

        $sql = "SELECT * FROM `users` WHERE `email` = :email OR `phone` = :phone";
        $stmt = $this->getDb()->prepare($sql);
        $stmt->execute([':email' => $emailOrPhone, ':phone' => $emailOrPhone]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Remove password from returned data
            unset($user['password']);
            return $user;
        }

        return false;
    }

    /**
     * Add a new address for a user
     */
    public function addAddress($userId, $addressData)
    {
        $addressData['user_id'] = $userId;
        
        // If this is the default address, unset others
        if (!empty($addressData['is_default'])) {
            $stmt = $this->getDb()->prepare("UPDATE user_addresses SET is_default = 0 WHERE user_id = :user_id");
            $stmt->execute([':user_id' => $userId]);
        }

        $fields = array_keys($addressData);
        $placeholders = array_map(function ($field) {
            return ":$field";
        }, $fields);

        $sql = "INSERT INTO user_addresses (" . implode(", ", $fields) . ") 
                VALUES (" . implode(", ", $placeholders) . ")";

        $stmt = $this->getDb()->prepare($sql);

        foreach ($addressData as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }

        $stmt->execute();
        return $this->getDb()->lastInsertId();
    }

    /**
     * Get all users with stats
     */
    public function getAllUsers($limit = 50, $offset = 0)
    {
        $sql = "SELECT id, CONCAT(first_name, ' ', last_name) as name, email, phone, role, status, created_at as joinedDate 
                FROM {$this->table} 
                ORDER BY created_at DESC 
                LIMIT :limit OFFSET :offset";
        
        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }
}
?>
