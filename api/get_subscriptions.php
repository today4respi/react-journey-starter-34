
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once 'config/Database.php';
$db = (new Database())->getConnection();

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
    ORDER BY created_at DESC");
    $stmt->execute();
    $subs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success'=>true, 'subscriptions'=>$subs]);
} catch (Exception $e) {
    echo json_encode(['success'=>false, 'message'=>$e->getMessage()]);
}
?>
