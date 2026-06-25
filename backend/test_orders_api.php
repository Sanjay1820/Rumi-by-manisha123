<?php
/**
 * Test Orders API
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Testing Orders API</h1>";
echo "<hr>";

$apiUrl = "http://localhost/chic-boutique-hub-main/backend/api/orders.php";

// Test 1: Get All Orders
echo "<h2>Test 1: Fetch All Orders</h2>";
echo "URL: <a href='$apiUrl' target='_blank'>$apiUrl</a><br>";

$response = @file_get_contents($apiUrl);
if ($response) {
    $data = json_decode($response, true);
    if ($data && isset($data['success']) && $data['success']) {
        echo "✅ Success! Found " . count($data['data']) . " orders.<br>";
        
        if (!empty($data['data'])) {
            $firstOrder = $data['data'][0];
            echo "First Order ID: " . $firstOrder['id'] . " (" . $firstOrder['order_number'] . ")<br>";
            
            // Test 2: Get Single Order Details
            echo "<h2>Test 2: Fetch Details for Order #" . $firstOrder['order_number'] . "</h2>";
            $detailUrl = $apiUrl . "?id=" . $firstOrder['id']; // Use DB ID or Order Number depending on implementation
            // My implementation checks both
            echo "URL: <a href='$detailUrl' target='_blank'>$detailUrl</a><br>";
             
            $detailResponse = @file_get_contents($detailUrl);
            $detailData = json_decode($detailResponse, true);
            
            if ($detailData && isset($detailData['success']) && $detailData['success']) {
                $order = $detailData['data'];
                echo "✅ Success!<br>";
                echo "Customer: " . $order['customer_name'] . "<br>";
                echo "Items Found: " . (isset($order['items']) ? count($order['items']) : 0) . "<br>";
                if (isset($order['items'][0])) {
                    echo "First Item: " . $order['items'][0]['product_name'] . "<br>";
                }
            } else {
                echo "❌ Failed to fetch details.<br>";
            }
        }
    } else {
        echo "❌ API returned error: " . (isset($data['error']) ? $data['error'] : 'Unknown error') . "<br>";
        echo "Raw: " . htmlspecialchars(substr($response, 0, 500));
    }
} else {
    echo "❌ Connect failed.<br>";
}
?>
