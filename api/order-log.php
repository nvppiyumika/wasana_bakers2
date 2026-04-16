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

try {
    // Fetch sales data grouped by date
    $stmt = $pdo->prepare("
        SELECT DATE(created_at) as sale_date, SUM(total) as daily_total
        FROM order_log
        WHERE status = 'completed'
        GROUP BY DATE(created_at)
        ORDER BY sale_date ASC
        LIMIT 30
    ");
    $stmt->execute();
    $sales = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $sales[] = [
            'date' => $row['sale_date'],
            'total' => floatval($row['daily_total'])
        ];
    }
    echo json_encode(['success' => true, 'sales' => $sales]);
} catch (PDOException $e) {
    error_log('order-log.php error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch sales data: ' . $e->getMessage()]);
}
?>