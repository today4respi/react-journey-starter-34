
<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config/Database.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only POST requests are accepted.'
    ]);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($input['order_id']) || !isset($input['delivery_status'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Order ID and delivery status are required.'
    ]);
    exit;
}

$order_id = $input['order_id'];
$delivery_status = $input['delivery_status'];

// Validate delivery status
$allowed_statuses = ['en_attente', 'en_preparation', 'en_livraison', 'livre'];
if (!in_array($delivery_status, $allowed_statuses)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid delivery status. Allowed values: ' . implode(', ', $allowed_statuses)
    ]);
    exit;
}

try {
    // Update the order delivery status
    $query = "UPDATE orders SET delivery_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    $stmt = $db->prepare($query);
    
    if (!$stmt) {
        throw new Exception('Failed to prepare statement: ' . $db->errorInfo()[2]);
    }
    
    $result = $stmt->execute([$delivery_status, $order_id]);
    
    if ($result) {
        // Check if any row was actually updated
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Order delivery status updated successfully.',
                'data' => [
                    'order_id' => $order_id,
                    'delivery_status' => $delivery_status
                ]
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Order not found or no changes made.'
            ]);
        }
    } else {
        throw new Exception('Failed to update order: ' . $stmt->errorInfo()[2]);
    }
    
} catch (Exception $e) {
    error_log('Update order status error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>
