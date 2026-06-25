<?php
/**
 * User System Verification Script
 */
$apiUrl = 'http://localhost/chic-boutique-hub-main/backend/api/auth.php?action=register';
$testUser = [
    'name' => 'Security Audit User',
    'email' => 'audit_test_' . time() . '@test.com',
    'password' => 'securePassword123',
    'phone' => '8888888888',
    'city' => 'Verification Hub',
    'address' => 'Core Sector 7',
    'pincode' => '400001'
];

echo "--- Testing Registration ---\n";
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testUser));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status: " . $httpCode . "\n";
echo "Response: " . $response . "\n";

if ($httpCode === 201) {
    echo "SUCCESS: Registration endpoint functioning correctly.\n";
    
    // Check backup log
    echo "\n--- Checking Backup Log ---\n";
    $logFile = __DIR__ . '/backend/logs/users_backup.log';
    if (file_exists($logFile)) {
        $content = file_get_contents($logFile);
        if (strpos($content, $testUser['email']) !== false) {
            echo "SUCCESS: Redundant record found in users_backup.log.\n";
        } else {
            echo "FAILURE: Redundant record NOT found in log.\n";
        }
    } else {
        echo "FAILURE: users_backup.log does not exist.\n";
    }
} else {
    echo "FAILURE: Registration failed.\n";
}

echo "\n--- Testing Login ---\n";
$loginUrl = 'http://localhost/chic-boutique-hub-main/backend/api/auth.php?action=login';
$loginData = [
    'email' => $testUser['email'],
    'password' => $testUser['password']
];

$ch = curl_init($loginUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status: " . $httpCode . "\n";
echo "Response: " . $response . "\n";
$result = json_decode($response, true);
if (isset($result['success']) && $result['success']) {
    echo "SUCCESS: Live authentication verified.\n";
} else {
    echo "FAILURE: Login failed.\n";
}
?>
