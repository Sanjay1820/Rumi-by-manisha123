<?php
/**
 * File Upload API Endpoint
 * RUMI by Manisha - E-commerce Platform
 */

header('Content-Type: application/json');
// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Check if file was uploaded
if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
    exit();
}

$file = $_FILES['file'];
$uploadDir = __DIR__ . '/../../uploads/gallery/';

// Create directory if not exists
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('img_') . '.' . $extension;
$targetPath = $uploadDir . $filename;

// Validate file type
$allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm'];
if (!in_array(strtolower($extension), $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type. Allowed: ' . implode(', ', $allowedTypes)]);
    exit();
}

    // Move file
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    // Return the URL
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
    $host = $_SERVER['HTTP_HOST'];
    
    // Dynamically determine the base path
    // The script is at /Rumi-Final-main/backend/api/upload.php
    // We want /Rumi-Final-main/uploads/gallery/
    $currentPath = $_SERVER['PHP_SELF']; // e.g. /Rumi-Final-main/backend/api/upload.php
    $apiDir = dirname($currentPath);      // e.g. /Rumi-Final-main/backend/api
    $backendDir = dirname($apiDir);    // e.g. /Rumi-Final-main/backend
    $rootDir = dirname($backendDir);   // e.g. /Rumi-Final-main
    
    $baseUrl = $protocol . $host . $rootDir . '/uploads/gallery/';
    
    echo json_encode([
        'success' => true,
        'url' => $baseUrl . $filename,
        'filename' => $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded file']);
}
