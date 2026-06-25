<?php
require_once __DIR__ . '/backend/models/CollectionModel.php';

$model = new CollectionModel();
$data = $model->getAllWithProductCount();

echo "<h1>Testing Collections API Data</h1>";
echo "<pre>";
print_r($data);
echo "</pre>";

if (count($data) > 0) {
    echo "<p style='color:green'>✅ Data fetched successfully</p>";
} else {
    echo "<p style='color:red'>❌ No data found</p>";
}
?>
