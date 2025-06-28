
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

$order_number = isset($_GET['order_number']) ? trim($_GET['order_number']) : null;

if (empty($order_number)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Order number is required.'
    ]);
    exit;
}

try {
    // Get order details
    $query = "SELECT o.*, 
                     CASE 
                         WHEN o.delivery_status = 'en_attente' THEN 'En attente'
                         WHEN o.delivery_status = 'en_preparation' THEN 'En préparation'
                         WHEN o.delivery_status = 'en_livraison' THEN 'En livraison'
                         WHEN o.delivery_status = 'livre' THEN 'Livré'
                         ELSE 'Inconnu'
                     END as delivery_status_label
              FROM orders o 
              WHERE o.order_number = ?";
    
    $stmt = $db->prepare($query);
    $stmt->execute([$order_number]);
    
    $order = $stmt->fetch();
    
    if (!$order) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Commande pas trouvée ou pas encore traitée.'
        ]);
        exit;
    }
    
    // Get delivery link if exists
    $delivery_link = null;
    if ($order['delivery_status'] === 'en_livraison' || $order['delivery_status'] === 'livre') {
        $link_query = "SELECT * FROM delivery_links WHERE order_id = ?";
        $link_stmt = $db->prepare($link_query);
        $link_stmt->execute([$order['id']]);
        $delivery_link = $link_stmt->fetch();
    }
    
    // Get order items
    $items_query = "SELECT oi.*, c.name as child_name, c.age as child_age 
                    FROM order_items oi 
                    LEFT JOIN children c ON oi.child_id = c.id 
                    WHERE oi.order_id = ?";
    $items_stmt = $db->prepare($items_query);
    $items_stmt->execute([$order['id']]);
    $items = $items_stmt->fetchAll();
    
    $response_data = [
        'order' => $order,
        'items' => $items,
        'delivery_link' => $delivery_link
    ];
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $response_data
    ]);
    
} catch (Exception $e) {
    error_log('Track order error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>
