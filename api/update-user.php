<?php
require_once 'config.php';

if (!isset($_SESSION['admin_id']) || $_SESSION['type'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$user_id = $input['user_id'] ?? '';
$first_name = trim($input['first_name'] ?? '');
$last_name = trim($input['last_name'] ?? '');
$address = trim($input['address'] ?? '');
$phone = trim($input['phone'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($user_id) || empty($first_name) || empty($last_name) || empty($address) || empty($phone) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Required fields are missing']);
    exit();
}

try {
    $query = "UPDATE users SET first_name = :first_name, last_name = :last_name, address = :address, phone = :phone, email = :email";
    $params = [
        'user_id' => $user_id,
        'first_name' => $first_name,
        'last_name' => $last_name,
        'address' => $address,
        'phone' => $phone,
        'email' => $email
    ];

    if (!empty($password)) {
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        $query .= ", password = :password";
        $params['password'] = $hashed_password;
    }

    $query .= " WHERE id = :user_id";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found or no changes made']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to update user: ' . $e->getMessage()]);
}
?>