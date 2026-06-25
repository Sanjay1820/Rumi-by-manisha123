<?php
$url = 'http://localhost/Rumi-Final-main/backend/api/inquiries.php';

$response = file_get_contents($url);
echo "GET Response:\n";
echo $response . "\n";
