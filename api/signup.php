<?php
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
    if (!$data || !isset($data['first_name'], $data['last_name'], $data['address'], $data['phone'], $data['email'], $data['password'], $data['confirm_password'])) {
        throw new Exception('Missing required fields');
    }

    $first_name = trim($data['first_name']);
    $last_name = trim($data['last_name']);
    $address = trim($data['address']);
    $phone = trim($data['phone']);
    $email = trim($data['email']);
    $password = $data['password'];
    $confirm_password = $data['confirm_password'];

    if (empty($first_name) || empty($last_name) || empty($address) || empty($phone) || empty($email) || empty($password)) {
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

    if ($password !== $confirm_password) {
        throw new Exception('Passwords do not match');
    }

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        throw new Exception('Email already registered');
    }

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user
    $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, address, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$first_name, $last_name, $address, $phone, $email, $hashed_password]);

    echo json_encode(['success' => true, 'message' => 'Signup successful']);
} catch (Exception $e) {
    error_log('Signup.php error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>