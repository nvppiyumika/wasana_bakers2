<?php
try {
    require_once 'config.php';

    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['message_id'])) {
        throw new Exception('Message ID is required');
    }

    $message_id = filter_var($input['message_id'], FILTER_VALIDATE_INT);
    if ($message_id === false) {
        throw new Exception('Invalid message ID');
    }

    $stmt = $pdo->prepare("UPDATE messages SET status = 'read' WHERE id = ?");
    $stmt->execute([$message_id]);

    if ($stmt->rowCount() === 0) {
        throw new Exception('Message not found or already marked as read');
    }

    echo json_encode(['success' => true, 'message' => 'Message marked as read']);
} catch (Exception $e) {
    error_log('Mark-message-read.php error: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}