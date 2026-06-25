<?php
/**
 * Test Products API Connection & JSON Validity
 * This file tests if the products API returns VALID JSON
 */

// Enable error reporting for this test script only
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Testing Products API JSON Validity</h1>";
echo "<hr>";

$apiUrl = "http://localhost/chic-boutique-hub-main/backend/api/products.php?limit=5";
echo "Testing URL: <a href='$apiUrl' target='_blank'>$apiUrl</a><br><br>";

// Method 1: cURL (Better for simulating real request)
echo "<h2>Test 1: Fetch via cURL</h2>";
if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Follow redirects
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        echo "❌ cURL Failed: $curlError<br>";
    } else {
        echo "HTTP Status Code: <strong>$httpCode</strong><br>";
        
        // Check if JSON
        $data = json_decode($response, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            echo "✅ <strong>Valid JSON detected!</strong><br>";
            echo "Success: " . ($data['success'] ? 'Yes' : 'No') . "<br>";
            echo "Product Count: " . (isset($data['data']) ? count($data['data']) : 0) . "<br>";
            echo "<pre style='background:#f4f4f4;padding:10px;max-height:200px;overflow:auto;'>" . htmlspecialchars(substr($response, 0, 1000)) . "...</pre>";
        } else {
            echo "❌ <strong>INVALID JSON</strong><br>";
            echo "JSON Error: " . json_last_error_msg() . "<br>";
            echo "<h3>Raw Response (First 1000 chars):</h3>";
            echo "<pre style='background:#ffebee;padding:10px;border:1px solid red;'>" . htmlspecialchars(substr($response, 0, 1000)) . "</pre>";
        }
    }
} else {
    echo "⚠️ cURL not available, skipping Test 1<br>";
}

echo "<hr>";

// Method 2: file_get_contents
echo "<h2>Test 2: Fetch via file_get_contents</h2>";
try {
    $response = @file_get_contents($apiUrl);
    if ($response) {
        // Check if JSON
        $data = json_decode($response, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            echo "✅ <strong>Valid JSON detected!</strong><br>";
        } else {
            echo "❌ <strong>INVALID JSON</strong><br>";
            echo "JSON Error: " . json_last_error_msg() . "<br>";
            echo "<h3>Raw Response:</h3>";
            echo "<pre style='background:#ffebee;padding:10px;border:1px solid red;'>" . htmlspecialchars(substr($response, 0, 1000)) . "</pre>";
        }
    } else {
        echo "❌ Could not fetch URL (check allow_url_fopen in php.ini)<br>";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

echo "<hr>";
echo "<p><strong>Troubleshooting:</strong></p>";
echo "<ul>";
echo "<li>If you see 'INVALID JSON', look at the Raw Response. It usually contains PHP Warnings or Fatal Errors.</li>";
echo "<li>If the Raw Response is empty, the server might be crashing silently (check Apache error logs).</li>";
echo "<li>If you see HTML tags like <code>&lt;br /&gt;</code>, it means display_errors is ON in the API.</li>";
echo "</ul>";
?>
