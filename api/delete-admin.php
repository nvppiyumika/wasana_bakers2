<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

// Check if user is logged in as admin
if (!isset($_SESSION['admin_id']) || $_SESSION['type'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$admin_id = filter_var($input['admin_id'] ?? '', FILTER_VALIDATE_INT);

if (!$admin_id) {
    echo json_encode(['success' => false, 'message' => 'Admin ID is required']);
    exit();
}

try {
    // Prevent self-deletion
    if ($admin_id == $_SESSION['admin_id']) {
        echo json_encode(['success' => false, 'message' => 'Cannot delete your own account']);
        exit();
    }

    $stmt = $pdo->prepare("DELETE FROM admins WHERE id = ?");
    $stmt->execute([$admin_id]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Admin deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Admin not found']);
    }
} catch (PDOException $e) {
    error_log('Delete-admin.php error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to delete admin: ' . $e->getMessage()]);
}
?>