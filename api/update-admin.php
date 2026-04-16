<?php
require_once 'config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['type'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$admin_id = $input['admin_id'] ?? '';
$username = trim($input['username'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($admin_id) || empty($username) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Username and email are required']);
    exit();
}

try {
    $query = "UPDATE admins SET username = :username, email = :email";
    $params = ['admin_id' => $admin_id, 'username' => $username, 'email' => $email];

    if (!empty($password)) {
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        $query .= ", password = :password";
        $params['password'] = $hashed_password;
    }

    $query .= " WHERE id = :admin_id";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Admin updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Admin not found or no changes made']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to update admin: ' . $e->getMessage()]);
}
?>