<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

// Check if user is logged in as admin
if (!isset($_SESSION['admin_id']) || $_SESSION['type'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$order_id = filter_var($input['order_id'] ?? '', FILTER_VALIDATE_INT);
$status = $input['status'] ?? '';

if (!$order_id || !$status || !in_array(strtolower($status), ['pending', 'completed', 'cancelled'])) {
    echo json_encode(['success' => false, 'message' => 'Valid order ID and status (Pending, Completed, Cancelled) are required']);
    exit();
}

try {
    // Start transaction
    $pdo->beginTransaction();

    // Update orders table
    $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([strtolower($status), $order_id]);
    $orders_updated = $stmt->rowCount();

    if ($orders_updated === 0) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Order not found']);
        exit();
    }

    // Check if order_log record exists
    $stmt = $pdo->prepare("SELECT log_id FROM order_log WHERE order_id = ?");
    $stmt->execute([$order_id]);
    $log_exists = $stmt->rowCount() > 0;

    if ($log_exists) {
        // Update order_log table
        $stmt = $pdo->prepare("UPDATE order_log SET status = ? WHERE order_id = ?");
        $stmt->execute([strtolower($status), $order_id]);
        if ($stmt->rowCount() === 0) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => 'Failed to update order log']);
            exit();
        }
    } else {
        // Optionally insert order_log record if missing
        $stmt = $pdo->prepare("SELECT user_id, subtotal, shipping, total, created_at FROM orders WHERE id = ?");
        $stmt->execute([$order_id]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($order) {
            $stmt = $pdo->prepare("INSERT INTO order_log (order_id, user_id, subtotal, shipping, total, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$order_id, $order['user_id'], $order['subtotal'], $order['shipping'], $order['total'], $order['created_at'], strtolower($status)]);
        } else {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => 'Order data not found for logging']);
            exit();
        }
    }

    // Commit transaction
    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Order status updated']);
} catch (PDOException $e) {
    $pdo->rollBack();
    error_log('Update-order.php error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update order: ' . $e->getMessage()]);
}
?>