<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/php/logs/php_error_log');

try {
    require_once 'config.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['username_email'], $data['password'], $data['type'])) {
        throw new Exception('Missing required fields');
    }

    $username_email = trim($data['username_email']);
    $password = $data['password'];
    $type = $data['type'];

    if (empty($username_email) || empty($password)) {
        throw new Exception('Username/email and password are required');
    }

    if ($type === 'user') {
        $stmt = $pdo->prepare("SELECT id, first_name, email, password FROM users WHERE email = ?");
        $stmt->execute([$username_email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user || !password_verify($password, $user['password'])) {
            throw new Exception('Invalid email or password');
        }
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['type'] = 'user';
        $_SESSION['display_name'] = $user['first_name'];
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'display_name' => $user['first_name']
        ]);
    } elseif ($type === 'admin') {
        $stmt = $pdo->prepare("SELECT id, username, email, password FROM admins WHERE email = ? OR username = ?");
        $stmt->execute([$username_email, $username_email]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$admin || !password_verify($password, $admin['password'])) {
            throw new Exception('Invalid username/email or password');
        }
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['type'] = 'admin';
        $_SESSION['display_name'] = $admin['username'];
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'display_name' => $admin['username']
        ]);
    } else {
        throw new Exception('Invalid user type');
    }
} catch (Exception $e) {
    error_log('Login.php error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>