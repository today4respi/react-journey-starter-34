
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

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only GET requests are accepted.'
    ]);
    exit;
}

$order_id = isset($_GET['order_id']) ? $_GET['order_id'] : null;

if (empty($order_id)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Order ID is required.'
    ]);
    exit;
}

try {
    $query = "SELECT * FROM delivery_links WHERE order_id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$order_id]);
    
    $delivery_link = $stmt->fetch();
    
    if ($delivery_link) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $delivery_link
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'No delivery link found for this order.'
        ]);
    }
    
} catch (Exception $e) {
    error_log('Get delivery link error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>
