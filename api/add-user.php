<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/php/logs/php_error_log');

try {
    // Check admin session
    if (!isset($_SESSION['admin_id']) || $_SESSION['type'] !== 'admin') {
        http_response_code(401);
        throw new Exception('Unauthorized');
    }

    require_once 'config.php';

    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        throw new Exception('Invalid input data');
    }

    $first_name = trim($input['first_name'] ?? '');
    $last_name = trim($input['last_name'] ?? '');
    $address = trim($input['address'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';

    // Validate inputs
    if (!$first_name || !$last_name || !$address || !$phone || !$email || !$password) {
        throw new Exception('All fields are required');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }
    if (!preg_match('/^\+?\d{10,15}$/', $phone)) {
        throw new Exception('Invalid phone number');
    }
    if (strlen($password) < 6) {
        throw new Exception('Password must be at least 6 characters');
    }

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        throw new Exception('Email already registered');
    }

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    if (!$hashed_password) {
        throw new Exception('Failed to hash password');
    }

    // Insert user
    $stmt = $pdo->prepare("
        INSERT INTO users (first_name, last_name, address, phone, email, password)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $result = $stmt->execute([$first_name, $last_name, $address, $phone, $email, $hashed_password]);

    if (!$result) {
        throw new Exception('Failed to add user');
    }

    echo json_encode(['success' => true, 'message' => 'User added successfully']);
} catch (Exception $e) {
    error_log('Add-user.php error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
    http_response_code($e->getCode() === 401 ? 401 : 400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>