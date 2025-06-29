
<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config/Database.php';
require_once 'models/Order.php';

$database = new Database();
$db = $database->getConnection();
$order = new Order($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only GET requests are accepted.'
    ]);
    exit;
}

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if (empty($user_id)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'User ID is required.'
    ]);
    exit;
}

try {
    $order->user_id = $user_id;
    $payments = $order->getPaymentsByUserId();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $payments
    ]);
} catch (Exception $e) {
    error_log('Get payments error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>
