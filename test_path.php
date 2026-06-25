<?php
echo "PHP_SELF: " . $_SERVER['PHP_SELF'] . "\n";
$currentPath = $_SERVER['PHP_SELF']; 
$apiDir = dirname($currentPath);      
$backendDir = dirname($apiDir);    
$rootDir = dirname($backendDir);   
echo "rootDir: " . $rootDir . "\n";
echo "Full URL base: http://" . $_SERVER['HTTP_HOST'] . $rootDir . "/uploads/gallery/\n";
