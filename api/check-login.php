<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
// Restrict CORS to your domain (replace 'http://localhost' with your actual domain in production)
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Credentials: true');

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/php/logs/php_error_log');

try {
    require_once 'config.php'; // Include database configuration

    $response = [
        'loggedIn' => false,
        'display_name' => null,
        'type' => null,
        'session_id' => session_id() // Include session ID for debugging (optional)
    ];

    if (isset($_SESSION['user_id']) && $_SESSION['type'] === 'user') {
        // Optional: Verify user exists in the database
        $stmt = $pdo->prepare("SELECT first_name FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            $response['loggedIn'] = true;
            $response['display_name'] = $_SESSION['display_name'];
            $response['type'] = 'user';
        } else {
            // User no longer exists; clear session
            unset($_SESSION['user_id'], $_SESSION['type'], $_SESSION['display_name']);
            error_log('Check-login.php: User ID ' . $_SESSION['user_id'] . ' not found in database');
        }
    } elseif (isset($_SESSION['admin_id']) && $_SESSION['type'] === 'admin') {
        // Optional: Verify admin exists in the database
        $stmt = $pdo->prepare("SELECT username FROM admins WHERE id = ?");
        $stmt->execute([$_SESSION['admin_id']]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($admin) {
            $response['loggedIn'] = true;
            $response['display_name'] = $_SESSION['display_name'];
            $response['type'] = 'admin';
        } else {
            // Admin no longer exists; clear session
            unset($_SESSION['admin_id'], $_SESSION['type'], $_SESSION['display_name']);
            error_log('Check-login.php: Admin ID ' . $_SESSION['admin_id'] . ' not found in database');
        }
    } else {
        error_log('Check-login.php: No valid session found. Session data: ' . json_encode($_SESSION));
    }

    echo json_encode($response);
} catch (Exception $e) {
    error_log('Check-login.php error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'session_id' => session_id() // Include for debugging
    ]);
}
?>