<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');

require_once 'config.php';

try {
    if (isset($_GET['id'])) {
        // Fetch a single employee
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        if ($id === false || $id <= 0) {
            echo json_encode(['success' => false, 'message' => 'Invalid employee ID']);
            exit;
        }

        $stmt = $pdo->prepare('SELECT * FROM employees WHERE id = ?');
        $stmt->execute([$id]);
        $employee = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($employee) {
            echo json_encode($employee);
        } else {
            echo json_encode(['success' => false, 'message' => 'Employee not found']);
        }
    } else {
        // Fetch all employees
        $stmt = $pdo->query('SELECT * FROM employees ORDER BY created_at DESC');
        $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($employees);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>