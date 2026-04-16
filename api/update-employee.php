<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $employee_id = filter_var($data['employee_id'] ?? 0, FILTER_VALIDATE_INT);
    $name = filter_var($data['name'] ?? '', FILTER_SANITIZE_STRING);
    $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $role = $data['role'] ?? '';
    $hire_date = $data['hire_date'] ?? '';

    if (!$employee_id || !$name || !$email || !$role || !$hire_date) {
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

    $stmt = $pdo->prepare('SELECT COUNT(*) FROM employees WHERE email = ? AND id != ?');
    $stmt->execute([$email, $employee_id]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        exit;
    }

    $stmt = $pdo->prepare('UPDATE employees SET name = ?, email = ?, role = ?, hire_date = ? WHERE id = ?');
    $stmt->execute([$name, $email, $role, $hire_date, $employee_id]);

    echo json_encode(['success' => true, 'message' => 'Employee updated successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>