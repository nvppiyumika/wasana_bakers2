<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/php/logs/php_error_log');

try {
    // Check if user is logged in
    if (!isset($_SESSION['user_id']) || $_SESSION['type'] !== 'user') {
        http_response_code(401);
        throw new Exception('Please log in to checkout');
    }

    require_once 'config.php';

    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        throw new Exception('Invalid input data');
    }

    $subtotal = isset($input['subtotal']) ? floatval($input['subtotal']) : 0;
    $shipping = isset($input['shipping']) ? floatval($input['shipping']) : 0;
    $total = isset($input['total']) ? floatval($input['total']) : 0;
    $user_id = $_SESSION['user_id'];

    // Validate inputs
    if ($subtotal <= 0 || $shipping < 0 || $total <= 0) {
        throw new Exception('Invalid checkout amounts');
    }

    // Verify cart is not empty
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM cart WHERE user_id = ?");
    $stmt->execute([$user_id]);
    if ($stmt->fetchColumn() == 0) {
        throw new Exception('Cart is empty');
    }

    // Call stored procedure
    $stmt = $pdo->prepare("CALL ProcessCheckout(?, ?, ?, ?)");
    $result = $stmt->execute([$user_id, $subtotal, $shipping, $total]);

    if (!$result) {
        throw new Exception('Failed to process checkout');
    }

    echo json_encode(['success' => true, 'message' => 'Checkout successful']);
} catch (Exception $e) {
    error_log('Checkout.php error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
    http_response_code($e->getCode() === 401 ? 401 : 400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>