<?php
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/php/logs/php_error_log');

try {
    require_once 'config.php';

    if (!isset($_GET['id'])) {
        header('Content-Type: image/png');
        readfile('../images/placeholder.png');
        exit;
    }

    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
    if ($id === false) {
        header('Content-Type: image/png');
        readfile('../images/placeholder.png');
        exit;
    }

    $stmt = $pdo->prepare("SELECT image FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product || empty($product['image'])) {
        header('Content-Type: image/png');
        readfile('../images/placeholder.png');
        exit;
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->buffer($product['image']);
    $allowed_mimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($mime, $allowed_mimes)) {
        error_log('Invalid image format for product ID ' . $id . ': ' . $mime);
        header('Content-Type: image/png');
        readfile('../images/placeholder.png');
        exit;
    }

    header('Content-Type: ' . $mime);
    header('Content-Length: ' . strlen($product['image']));
    echo $product['image'];
    exit;
} catch (Exception $e) {
    error_log('Get-image.php error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
    header('Content-Type: image/png');
    readfile('../images/placeholder.png');
    exit;
}
?>