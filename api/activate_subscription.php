
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit;
}

require_once 'config/Database.php';
$db = (new Database())->getConnection();

$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['user_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'user_id required.']); exit;
}
$user_id = $input['user_id'];
$stripe_subscription_id = $input['stripe_subscription_id'] ?? null;
$order_id = $input['order_id'] ?? null; // New: allow passing order_id
$start = date('Y-m-d H:i:s');
$period_days = 30; // Default 1 month period, can be changed if needed
$end = date('Y-m-d H:i:s', strtotime("+$period_days days"));
$status = 'active';

try {
    // If user already has a subscription, update it. Otherwise, insert new
    $sql = "INSERT INTO subscriptions (
                user_id, 
                stripe_subscription_id, 
                order_id,
                status, 
                current_period_start, 
                current_period_end, 
                cancel_at_period_end, 
                updated_at
            )
            VALUES (
                :user_id, :stripe_subscription_id, :order_id, :status, :current_period_start, :current_period_end, 0, NOW()
            )
            ON DUPLICATE KEY UPDATE 
                status=:status, 
                stripe_subscription_id=IFNULL(:stripe_subscription_id, stripe_subscription_id), 
                order_id=IFNULL(:order_id, order_id),
                current_period_start=:current_period_start, 
                current_period_end=:current_period_end,
                cancel_at_period_end=0,
                updated_at=NOW()
            ";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':stripe_subscription_id', $stripe_subscription_id);
    $stmt->bindParam(':order_id', $order_id); // New: update order_id
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':current_period_start', $start);
    $stmt->bindParam(':current_period_end', $end);
    $stmt->execute();

    echo json_encode([
        'success' => true,
        'message' => 'Subscription activated',
        'current_period_start' => $start,
        'current_period_end' => $end,
        'status' => $status
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
