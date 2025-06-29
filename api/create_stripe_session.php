<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only POST requests are accepted.'
    ]);
    exit;
}

function makeStripeRequest($endpoint, $data, $stripe_key) {
    $url = 'https://api.stripe.com/v1/' . $endpoint;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $stripe_key,
        'Content-Type: application/x-www-form-urlencoded'
    ]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_error($ch)) {
        curl_close($ch);
        throw new Exception('cURL error: ' . curl_error($ch));
    }
    
    curl_close($ch);
    
    $decoded_response = json_decode($response, true);
    
    if ($http_code >= 400) {
        $error_message = isset($decoded_response['error']['message']) 
            ? $decoded_response['error']['message'] 
            : 'Stripe API error';
        throw new Exception($error_message);
    }
    
    return $decoded_response;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    // Validate required fields
    $required_fields = ['plan_type', 'children', 'customer_info', 'amount'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    $plan_type = $input['plan_type'];
    $children = $input['children'];
    $customer_info = $input['customer_info'];
    $amount = $input['amount'];
    
    // Add frontend_url to use for redirects, fallback to server name
    $frontend_url = (isset($input['frontend_url']) && !empty($input['frontend_url']))
        ? rtrim($input['frontend_url'], '/')
        : ('https://' . $_SERVER['HTTP_HOST']);

    // Validate plan_type
    if (!in_array($plan_type, ['onetime', 'subscription'])) {
        throw new Exception('Invalid plan type. Must be onetime or subscription');
    }

    // Validate amount
    if (!is_numeric($amount) || $amount <= 0) {
        throw new Exception('Invalid amount');
    }

    // Validate children array
    if (!is_array($children) || empty($children)) {
        throw new Exception('Children array is required and cannot be empty');
    }

    // Validate customer info
    $required_customer_fields = ['name', 'email', 'address', 'city', 'postalCode'];
    foreach ($required_customer_fields as $field) {
        if (!isset($customer_info[$field]) || empty(trim($customer_info[$field]))) {
            throw new Exception("Missing or empty customer field: $field");
        }
    }

    // Stripe secret key - Updated with your correct key
    $stripe_key = 'sk_test_51RZrq1RAsAdv0igo4Kz31GhsHmDS3cRIDniROzHZXWj4cPlEUF0ebq3Lv91YVD2iJ5HfJsRjg08NHJaWz5BtAv3p00z3pEz5TZ';

    // Create line items data for Stripe
    $line_items = [];
    foreach ($children as $index => $child) {
        if (!isset($child['name']) || empty(trim($child['name']))) {
            throw new Exception('Each child must have a name');
        }

        $line_item_data = [
            "price_data[currency]" => 'eur',
            "price_data[product_data][name]" => 'Livre personnalisé pour ' . $child['name'],
            "price_data[product_data][description]" => 'Un livre magique où ' . $child['name'] . ' devient le héros de sa propre aventure.',
            "price_data[unit_amount]" => intval($amount * 100), // Convert to cents
            "quantity" => 1
        ];

        // Add recurring for subscription mode
        if ($plan_type === 'subscription') {
            $line_item_data["price_data[recurring][interval]"] = 'month';
        }

        // Format for Stripe API (flatten the array for each line item)
        foreach ($line_item_data as $key => $value) {
            $line_items["line_items[$index][$key]"] = $value;
        }
    }

    // Determine the correct mode for Stripe
    $stripe_mode = ($plan_type === 'subscription') ? 'subscription' : 'payment';

    // Prepare checkout session data (addresses removed, any country allowed)
    $session_data = array_merge($line_items, [
        'mode' => $stripe_mode,
        'success_url' => $frontend_url . '/confirmation?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => $frontend_url . '/checkout',
        'customer_email' => $customer_info['email'],
        // Address fields removed: 'billing_address_collection' and 'shipping_address_collection'
        'metadata[plan_type]' => $plan_type,
        'metadata[customer_name]' => $customer_info['name'],
        'metadata[customer_phone]' => $customer_info['phone'] ?? '',
        'metadata[customer_address]' => $customer_info['address'],
        'metadata[customer_city]' => $customer_info['city'],
        'metadata[customer_postal_code]' => $customer_info['postalCode']
    ]);

    // Add payment method types
    $session_data['payment_method_types[0]'] = 'card';

    // Create checkout session
    $session = makeStripeRequest('checkout/sessions', $session_data, $stripe_key);

    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'session_id' => $session['id'],
        'url' => $session['url']
    ]);

} catch (Exception $e) {
    error_log('Create Stripe session error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
