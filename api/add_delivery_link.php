
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

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only POST requests are accepted.'
    ]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['order_id']) || !isset($input['tracking_url'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Order ID and tracking URL are required.'
    ]);
    exit;
}

$order_id = $input['order_id'];
$tracking_url = $input['tracking_url'];
$carrier_name = isset($input['carrier_name']) ? $input['carrier_name'] : null;
$tracking_number = isset($input['tracking_number']) ? $input['tracking_number'] : null;

if (!filter_var($tracking_url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid tracking URL format.'
    ]);
    exit;
}

try {
    // Check if delivery link already exists for this order
    $check_query = "SELECT id FROM delivery_links WHERE order_id = ?";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->execute([$order_id]);
    
    if ($check_stmt->rowCount() > 0) {
        // Update existing delivery link
        $update_query = "UPDATE delivery_links SET tracking_url = ?, carrier_name = ?, tracking_number = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?";
        $update_stmt = $db->prepare($update_query);
        $result = $update_stmt->execute([$tracking_url, $carrier_name, $tracking_number, $order_id]);
        
        if ($result) {
            // Get the updated record
            $select_query = "SELECT * FROM delivery_links WHERE order_id = ?";
            $select_stmt = $db->prepare($select_query);
            $select_stmt->execute([$order_id]);
            $delivery_link = $select_stmt->fetch();
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Delivery link updated successfully.',
                'data' => $delivery_link
            ]);
        } else {
            throw new Exception('Failed to update delivery link');
        }
    } else {
        // Insert new delivery link
        $insert_query = "INSERT INTO delivery_links (order_id, tracking_url, carrier_name, tracking_number) VALUES (?, ?, ?, ?)";
        $insert_stmt = $db->prepare($insert_query);
        $result = $insert_stmt->execute([$order_id, $tracking_url, $carrier_name, $tracking_number]);
        
        if ($result) {
            // Get the inserted record
            $select_query = "SELECT * FROM delivery_links WHERE order_id = ?";
            $select_stmt = $db->prepare($select_query);
            $select_stmt->execute([$order_id]);
            $delivery_link = $select_stmt->fetch();
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Delivery link added successfully.',
                'data' => $delivery_link
            ]);
        } else {
            throw new Exception('Failed to add delivery link');
        }
    }
    
} catch (Exception $e) {
    error_log('Add delivery link error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>
