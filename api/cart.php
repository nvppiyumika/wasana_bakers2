<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

try {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Please log in to manage cart']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        // Fetch cart items
        $stmt = $pdo->prepare("
            SELECT c.id, c.quantity, p.id AS product_id, p.name, p.price, p.image
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        ");
        $stmt->execute([$user_id]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Encode images as base64
        foreach ($items as &$item) {
            if ($item['image']) {
                $item['image'] = 'data:image/jpeg;base64,' . base64_encode($item['image']);
            } else {
                $item['image'] = null;
            }
        }
        unset($item);

        echo json_encode(['success' => true, 'items' => $items]);
    } elseif ($method === 'POST') {
        // Add to cart
        $data = json_decode(file_get_contents('php://input'), true);
        $product_id = filter_var($data['product_id'] ?? null, FILTER_VALIDATE_INT);
        $quantity = filter_var($data['quantity'] ?? 1, FILTER_VALIDATE_INT);

        if (!$product_id || $quantity < 1) {
            echo json_encode(['success' => false, 'message' => 'Invalid product ID or quantity']);
            exit;
        }

        // Check product availability
        $stmt = $pdo->prepare("SELECT availability FROM products WHERE id = ?");
        $stmt->execute([$product_id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$product || $product['availability'] === 'out_of_stock') {
            echo json_encode(['success' => false, 'message' => 'Product is out of stock']);
            exit;
        }

        // Check if product is already in cart
        $stmt = $pdo->prepare("SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$user_id, $product_id]);
        $cart_item = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cart_item) {
            $new_quantity = $cart_item['quantity'] + $quantity;
            $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
            $stmt->execute([$new_quantity, $cart_item['id']]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
            $stmt->execute([$user_id, $product_id, $quantity]);
        }

        echo json_encode(['success' => true, 'message' => 'Product added to cart']);
    } elseif ($method === 'PATCH') {
        // Update quantity
        $data = json_decode(file_get_contents('php://input'), true);
        $cart_id = filter_var($data['cart_id'] ?? null, FILTER_VALIDATE_INT);
        $quantity = filter_var($data['quantity'] ?? null, FILTER_VALIDATE_INT);

        if (!$cart_id || $quantity < 1) {
            echo json_encode(['success' => false, 'message' => 'Invalid cart ID or quantity']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$quantity, $cart_id, $user_id]);

        echo json_encode(['success' => true, 'message' => 'Cart updated']);
    } elseif ($method === 'DELETE') {
        // Remove from cart
        $data = json_decode(file_get_contents('php://input'), true);
        $cart_id = filter_var($data['cart_id'] ?? null, FILTER_VALIDATE_INT);

        if (!$cart_id) {
            echo json_encode(['success' => false, 'message' => 'Invalid cart ID']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM cart WHERE id = ? AND user_id = ?");
        $stmt->execute([$cart_id, $user_id]);

        echo json_encode(['success' => true, 'message' => 'Item removed from cart']);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>