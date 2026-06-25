<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🔍 Database Connection Diagnostic</h1>";
echo "<hr>";

// 1. Load Config
echo "<h3>1. Checking Configuration</h3>";
if (file_exists(__DIR__ . '/config/config.php')) {
    include __DIR__ . '/config/config.php';
    echo "✅ Config file found.<br>";
    echo "<strong>DB_HOST:</strong> " . DB_HOST . "<br>";
    echo "<strong>DB_NAME:</strong> " . DB_NAME . "<br>";
    echo "<strong>DB_USER:</strong> " . DB_USER . "<br>";
    echo "<strong>DB_PASS:</strong> " . (empty(DB_PASS) ? "<em>(empty)</em>" : "******") . "<br>";
} else {
    echo "❌ Config file MISSING at " . __DIR__ . '/config/config.php<br>';
    exit;
}

echo "<hr>";

// 2. Test Connection
echo "<h3>2. Testing Connection</h3>";
try {
    $dsn = "mysql:host=" . DB_HOST . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 5
    ];
    
    echo "Attempting to connect to MySQL server...<br>";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    echo "✅ Connected to MySQL Server successfully!<br>";
    
    echo "Attempting to select database '<strong>" . DB_NAME . "</strong>'...<br>";
    $pdo->exec("USE " . DB_NAME);
    echo "✅ Database selected successfully!<br>";
    
    // 3. Check Tables
    echo "<hr><h3>3. Checking Tables</h3>";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (empty($tables)) {
        echo "⚠️ Database exists but is EMPTY (No tables found).<br>";
        echo "👉 You need to import the database schema.<br>";
    } else {
        echo "✅ Found " . count($tables) . " tables:<br>";
        echo "<ul>";
        foreach ($tables as $table) {
            echo "<li>$table</li>";
        }
        echo "</ul>";
        
        if (in_array('products', $tables)) {
            $count = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
            echo "✅ <strong>Products table exists</strong> with $count rows.<br>";
        } else {
            echo "❌ <strong>products table MISSING!</strong><br>";
        }
    }
    
} catch (PDOException $e) {
    echo "<h2>❌ CONNECTION FAILED</h2>";
    echo "<div style='background:#ffebee; border:1px solid red; padding:15px; color: #b71c1c;'>";
    echo "<strong>Error Code:</strong> " . $e->getCode() . "<br>";
    echo "<strong>Error Message:</strong> " . $e->getMessage() . "<br>";
    echo "</div>";
    
    echo "<h3>👇 Troubleshooting:</h3>";
    if ($e->getCode() == 1049) {
        echo "The database <strong>" . DB_NAME . "</strong> does not exist.<br>";
        echo "👉 check if you created the database in phpMyAdmin.";
    } elseif ($e->getCode() == 1045) {
        echo "Access denied. Wrong <strong>Username</strong> or <strong>Password</strong>.<br>";
        echo "👉 Check config/config.php.";
    } elseif ($e->getCode() == 2002) {
        echo "Cannot connect to MySQL server.<br>";
        echo "👉 <strong>Is XAMPP MySQL running?</strong> Check XAMPP Control Panel.<br>";
        echo "👉 Is MySQL on a different port (like 3307)?";
    }
}
?>
