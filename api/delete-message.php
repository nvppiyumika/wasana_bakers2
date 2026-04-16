<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/php/logs/php_error_log');

try {
    require_once 'config.php';

    // Check if admin is logged in
    if (!isset($_SESSION['admin_id']) || $_SESSION['type'] !== 'admin') {
        throw new Exception('Unauthorized access');
    }

    // Verify request method and data
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['message_id'])) {
        throw new Exception('Missing message ID');
    }

    $message_id = filter_var($data['message_id'], FILTER_VALIDATE_INT);
    if ($message_id === false) {
        throw new Exception('Invalid message ID');
    }

    // Delete message
    $stmt = $pdo->prepare("DELETE FROM messages WHERE id = ?");
    $stmt->execute([$message_id]);

    // Check if deletion was successful
    if ($stmt->rowCount() === 0) {
        throw new Exception('Message not found or already deleted');
    }

    echo json_encode(['success' => true, 'message' => 'Message deleted successfully']);
} catch (Exception $e) {
    error_log('Delete-message.php error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>