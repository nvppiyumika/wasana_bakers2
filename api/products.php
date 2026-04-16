<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/php/logs/php_error_log');

try {
    require_once 'config.php';

    $category = isset($_GET['category']) && $_GET['category'] !== 'all' ? $_GET['category'] : null;
    $isAdmin = isset($_SESSION['admin_id']) && $_SESSION['type'] === 'admin';

    if (isset($_GET['id'])) {
        // Fetch single product
        $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
        if ($id === false) {
            throw new Exception('Invalid product ID');
        }
        $stmt = $pdo->prepare("SELECT id, name, category, price, availability, CONCAT('get-image.php?id=', id) AS image FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$product) {
            throw new Exception('Product not found');
        }
        echo json_encode($product);
    } else {
        // Fetch multiple products
        if ($isAdmin) {
            // Admins see all products
            $query = "SELECT id, name, category, price, availability, CONCAT('get-image.php?id=', id) AS image FROM products";
            if ($category) {
                $query .= " WHERE category = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$category]);
            } else {
                $stmt = $pdo->query($query);
            }
        } else {
            // Non-admins see only in-stock products via view
            $query = "SELECT id, name, category, price, availability, image FROM availableproducts";
            if ($category) {
                $query .= " WHERE category = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$category]);
            } else {
                $stmt = $pdo->query($query);
            }
        }
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Validate image URLs
        foreach ($products as &$product) {
            if (empty($product['image']) || !preg_match('/^get-image\.php\?id=\d+$/', $product['image'])) {
                error_log('Invalid image URL for product ID ' . $product['id'] . ': ' . ($product['image'] ?? 'null'));
                $product['image'] = 'images/placeholder.jpg';
            }
        }
        unset($product);

        echo json_encode($products);
    }
} catch (Exception $e) {
    error_log('Products.php error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>