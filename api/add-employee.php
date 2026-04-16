<?php
require_once 'config.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $name = strip_tags($data['name'] ?? '');
    $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $role = $data['role'] ?? '';
    $hire_date = $data['hire_date'] ?? '';

    if (!$name || !$email || !$role || !$hire_date) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }

    if (!in_array($role, ['Manager', 'Staff', 'Baker'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid role']);
        exit;
    }

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $hire_date)) {
        echo json_encode(['success' => false, 'message' => 'Invalid hire date format']);
        exit;
    }

    $stmt = $pdo->prepare('SELECT COUNT(*) FROM employees WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO employees (name, email, role, hire_date) VALUES (?, ?, ?, ?)');
    $stmt->execute([$name, $email, $role, $hire_date]);

    echo json_encode(['success' => true, 'message' => 'Employee added successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>