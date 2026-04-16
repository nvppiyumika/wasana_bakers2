<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

if (!isset($_SESSION['admin_id']) || $_SESSION['type'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Please log in as an admin']);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        exit;
    }

    $product_id = filter_var($_POST['product_id'] ?? null, FILTER_VALIDATE_INT);
    $name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);
    $category = filter_var($_POST['category'] ?? '', FILTER_SANITIZE_STRING);
    $price = filter_var($_POST['price'] ?? 0, FILTER_VALIDATE_FLOAT);
    $availability = filter_var($_POST['availability'] ?? '', FILTER_SANITIZE_STRING);

    if (!$product_id || !$name || !$category || $price <= 0 || !in_array($availability, ['in_stock', 'out_of_stock'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid input data']);
        exit;
    }

    $image = null;
    $bind_image = false;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $maxSizeMB = 16;
        $maxSizeBytes = $maxSizeMB * 1024 * 1024;
        if ($_FILES['image']['size'] > $maxSizeBytes) {
            echo json_encode(['success' => false, 'message' => 'Image size exceeds 16MB']);
            exit;
        }
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($_FILES['image']['tmp_name']);
        $allowed_mimes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($mime, $allowed_mimes)) {
            echo json_encode(['success' => false, 'message' => 'Invalid image format. Only JPEG, PNG, and GIF are allowed.']);
            exit;
        }
        $image = file_get_contents($_FILES['image']['tmp_name']);
        if ($image === false || strlen($image) === 0) {
            error_log('Failed to read image file for product ID: ' . $product_id);
            echo json_encode(['success' => false, 'message' => 'Failed to read image file']);
            exit;
        }
        $bind_image = true;
    }

    $sql = "UPDATE products SET name = ?, category = ?, price = ?, availability = ?";
    $params = [$name, $category, $price, $availability];
    if ($bind_image) {
        $sql .= ", image = ?";
        $params[] = $image;
    }
    $sql .= " WHERE id = ?";
    $params[] = $product_id;

    $stmt = $pdo->prepare($sql);
    if ($bind_image) {
        $stmt->bindParam(count($params), $image, PDO::PARAM_LOB);
    }

    if ($stmt->execute($params)) {
        echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
    } else {
        error_log('Failed to update product ID ' . $product_id . ': ' . json_encode($stmt->errorInfo()));
        echo json_encode(['success' => false, 'message' => 'Failed to update product']);
    }
} catch (Exception $e) {
    error_log('Update-product.php error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>