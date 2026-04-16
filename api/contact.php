<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/php/logs/php_error_log');

try {
    require_once 'config.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Handle contact form submission
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['name'], $data['email'], $data['message'])) {
            throw new Exception('Missing required fields');
        }

        $name = trim($data['name']);
        $email = trim($data['email']);
        $message = trim($data['message']);

        if (empty($name) || empty($email) || empty($message)) {
            throw new Exception('All fields are required');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format');
        }

        $stmt = $pdo->prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)");
        $stmt->execute([$name, $email, $message]);

        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    } else {
        // Fetch all messages (for admin view)
        if (!isset($_SESSION['admin_id']) || $_SESSION['type'] !== 'admin') {
            throw new Exception('Unauthorized access');
        }

        $stmt = $pdo->query("SELECT id, name, email, message, created_at FROM messages ORDER BY created_at DESC");
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($messages);
    }
} catch (Exception $e) {
    error_log('Contact.php error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>