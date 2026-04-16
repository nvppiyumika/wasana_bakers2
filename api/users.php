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

    if (isset($_GET['id'])) {
        // Fetch single user
        $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
        if ($id === false) {
            throw new Exception('Invalid user ID');
        }
        $stmt = $pdo->prepare("SELECT id, first_name, last_name, address, phone, email FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user) {
            throw new Exception('User not found');
        }
        echo json_encode($user);
    } else {
        // Fetch all users
        $stmt = $pdo->query("SELECT id, first_name, last_name, address, phone, email FROM users");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
    }
} catch (Exception $e) {
    error_log('Users.php error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>