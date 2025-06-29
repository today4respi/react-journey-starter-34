
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once 'config/Database.php';
$db = (new Database())->getConnection();

$stripe_secret_key = 'sk_test_51RZrq1RAsAdv0igo4Kz31GhsHmDS3cRIDniROzHZXWj4cPlEUF0ebq3Lv91YVD2iJ5HfJsRjg08NHJaWz5BtAv3p00z3pEz5TZ';

$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['user_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'user_id required.']); exit;
}
$user_id = $input['user_id'];
$cancellation_reason = isset($input['cancellation_reason']) ? $input['cancellation_reason'] : null;

try {
    // 1. Lookup the most recent active subscription for user
    $stmt = $db->prepare("SELECT stripe_subscription_id FROM subscriptions WHERE user_id=:user_id AND status='active' ORDER BY created_at DESC LIMIT 1");
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row || empty($row['stripe_subscription_id'])) {
        throw new Exception('No active Stripe subscription found for this user.');
    }
    $stripe_subscription_id = $row['stripe_subscription_id'];

    // 2. Cancel the subscription at Stripe using cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.stripe.com/v1/subscriptions/' . $stripe_subscription_id);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $stripe_secret_key
    ]);
    $cancel_response = curl_exec($ch);

    if (curl_errno($ch)) {
        throw new Exception("Erreur lors de l'annulation Stripe (cURL): " . curl_error($ch));
    }

    $cancel_data = json_decode($cancel_response, true);
    if (isset($cancel_data['error'])) {
        throw new Exception("Erreur Stripe: " . $cancel_data['error']['message']);
    }
    curl_close($ch);

    // 3. Mark as cancelled in your DB, and store the cancellation reason
    $sql = "UPDATE subscriptions 
            SET status='cancelled', cancel_at_period_end=1, cancellation_reason=:cancellation_reason, updated_at=NOW() 
            WHERE user_id=:user_id";
    $stmt2 = $db->prepare($sql);
    $stmt2->bindParam(':user_id', $user_id);
    $stmt2->bindParam(':cancellation_reason', $cancellation_reason);
    $stmt2->execute();

    echo json_encode(['success' => true, 'message' => 'Subscription cancelled at Stripe and in database']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
