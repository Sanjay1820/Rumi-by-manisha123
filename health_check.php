<?php
/**
 * Comprehensive API Health Check
 * Verifies all major endpoints are responding correctly
 */
require_once __DIR__ . '/backend/config/config.php';

$endpoints = [
    'Products' => '/products.php',
    'Categories' => '/categories.php',
    'Collections' => '/collections.php',
    'FAQs' => '/faqs.php',
    'Gallery' => '/gallery.php',
    'Reviews' => '/reviews.php',
    'Inquiries' => '/inquiries.php',
    'Users' => '/users.php',
    'Orders' => '/orders.php'
];

echo "<h1>🔍 RUMI System-Wide Connection Health Check</h1>";
echo "<table border='1' cellpadding='10' style='border-collapse: collapse; width: 80%;'>";
echo "<tr style='background: #f4f4f4;'><th>Module</th><th>Endpoint</th><th>Status</th><th>Record Count</th><th>Notes</th></tr>";

$baseUrl = "http://localhost/Rumi-Final-main/backend/api";

foreach ($endpoints as $name => $path) {
    $url = $baseUrl . $path;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $statusColor = ($httpCode == 200) ? "green" : "red";
    $statusText = ($httpCode == 200) ? "CONNECTED ✅" : "ERROR ($httpCode) ❌";
    
    $count = "N/A";
    $notes = "";
    
    if ($httpCode == 200) {
        $data = json_decode($response, true);
        if (isset($data['success']) && $data['success']) {
            if (isset($data['data']) && is_array($data['data'])) {
                $count = count($data['data']);
            }
        } else {
            $notes = "API returned success: false. Check backend logs.";
            $statusText = "API ERROR ⚠️";
            $statusColor = "orange";
        }
    }

    echo "<tr>";
    echo "<td><strong>$name</strong></td>";
    echo "<td><code>$path</code></td>";
    echo "<td style='color: $statusColor; font-weight: bold;'>$statusText</td>";
    echo "<td>$count</td>";
    echo "<td>$notes</td>";
    echo "</tr>";
}

echo "</table>";

echo "<h3>Database Check:</h3>";
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME;
    $pdo = new PDO($dsn, DB_USER, DB_PASS);
    echo "<p style='color: green;'>✅ Database Connection Active (PDO)</p>";
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Database Connection Failed: " . $e->getMessage() . "</p>";
}
?>
