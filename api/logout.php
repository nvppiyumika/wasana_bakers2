<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/php/logs/php_error_log');

try {
    session_unset();
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Logout successful']);
} catch (Exception $e) {
    error_log('Logout.php error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Logout failed']);
}
?>