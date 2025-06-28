
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once 'config/Database.php';
$db = (new Database())->getConnection();
$user_id = $_GET['user_id'] ?? null;
if (!$user_id) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'user_id required.']); exit;
}

try {
    $stmt = $db->prepare("SELECT 
        id, 
        user_id, 
        stripe_subscription_id, 
        order_id,
        status, 
        current_period_start, 
        current_period_end, 
        cancel_at_period_end, 
        cancellation_reason, 
        created_at, 
        updated_at 
      FROM subscriptions 
      WHERE user_id = :user_id
      ORDER BY created_at DESC
      LIMIT 1
    ");
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();
    $sub = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$sub) throw new Exception("No subscription for this user");
    echo json_encode(['success'=>true, 'subscription'=>$sub]);
} catch (Exception $e) {
    echo json_encode(['success'=>false, 'message'=>$e->getMessage()]);
}
?>
