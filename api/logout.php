<?php
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