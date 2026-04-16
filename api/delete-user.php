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
$user_id = filter_var($input['user_id'] ?? '', FILTER_VALIDATE_INT);

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit();
}

try {
    $pdo->beginTransaction();

    // Delete related orders
    $stmt = $pdo->prepare("DELETE FROM orders WHERE user_id = ?");
    $stmt->execute([$user_id]);

    // Delete related order_log entries (if applicable)
    $stmt = $pdo->prepare("DELETE FROM order_log WHERE user_id = ?");
    $stmt->execute([$user_id]);

    // Delete the user
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$user_id]);

    if ($stmt->rowCount() > 0) {
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'User and related orders deleted successfully']);
    } else {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
} catch (PDOException $e) {
    $pdo->rollBack();
    error_log('Delete-user.php error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to delete user: ' . $e->getMessage()]);
}
?>