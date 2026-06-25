<?php
/**
 * Database Configuration
 * RUMI by Manisha - E-commerce Platform
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'rumi_boutique');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');
define('DB_TIMEOUT', 30); // Connection timeout in seconds
define('DB_PERSISTENT', true); // Use persistent connections

// Application Configuration
define('APP_NAME', 'RUMI by Manisha');
define('APP_URL', 'http://localhost:5173');
define('API_URL', 'http://localhost/Rumi-Final-main/backend/api');

// Security Configuration
define('JWT_SECRET', 'your-secret-key-change-this-in-production');
define('JWT_EXPIRY', 86400); // 24 hours

// File Upload Configuration
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 5242880); // 5MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'webp']);

// Pagination
define('ITEMS_PER_PAGE', 20);

// CORS Configuration
define('ALLOWED_ORIGINS', [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
]);

// Error Reporting (Set to 0 in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Timezone
date_default_timezone_set('Asia/Kolkata');
