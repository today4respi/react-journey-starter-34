
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

// Stripe configuration
$stripe_secret_key = 'sk_test_51RZrq1RAsAdv0igo4Kz31GhsHmDS3cRIDniROzHZXWj4cPlEUF0ebq3Lv91YVD2iJ5HfJsRjg08NHJaWz5BtAv3p00z3pEz5TZ';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only POST requests are accepted.'
    ]);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['payment_intent_id'])) {
        throw new Exception('Payment intent ID is required');
    }

    $payment_intent_id = $input['payment_intent_id'];

    // Verify payment with Stripe
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.stripe.com/v1/payment_intents/$payment_intent_id");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $stripe_secret_key
    ]);

    $stripe_response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code !== 200) {
        throw new Exception('Failed to verify payment with Stripe');
    }

    $payment_intent = json_decode($stripe_response, true);
    
    if (!$payment_intent) {
        throw new Exception('Invalid Stripe response');
    }

    // Update order status based on payment status
    $new_status = ($payment_intent['status'] === 'succeeded') ? 'paid' : $payment_intent['status'];

    $update_query = "UPDATE orders SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE payment_intent_id = :payment_intent_id";
    $stmt = $db->prepare($update_query);
    $stmt->bindParam(':status', $new_status);
    $stmt->bindParam(':payment_intent_id', $payment_intent_id);
    
    if (!$stmt->execute()) {
        throw new Exception('Failed to update order status');
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'payment_status' => $payment_intent['status'],
            'order_status' => $new_status
        ]
    ]);

} catch (Exception $e) {
    error_log('Confirm payment error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>
