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

    if (!$employee_id) {
        echo json_encode(['success' => false, 'message' => 'Invalid employee ID']);
        exit;
    }

    $stmt = $pdo->prepare('SELECT COUNT(*) FROM employees WHERE id = ?');
    $stmt->execute([$employee_id]);
    if ($stmt->fetchColumn() == 0) {
        echo json_encode(['success' => false, 'message' => 'Employee not found']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM employees WHERE id = ?');
    $stmt->execute([$employee_id]);

    echo json_encode(['success' => true, 'message' => 'Employee deleted successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>