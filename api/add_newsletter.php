
<?php
require_once 'config/Database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (!$input || !isset($input['email']) || empty($input['email'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email is required']);
        exit;
    }
    
    $email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }
    
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    // Check if email already exists
    $check_query = "SELECT id, status FROM newsletter_subscribers WHERE email = :email";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':email', $email);
    $check_stmt->execute();
    $existing = $check_stmt->fetch();
    
    if ($existing) {
        if ($existing['status'] === 'active') {
            echo json_encode(['success' => false, 'message' => 'Email already subscribed']);
            exit;
        } else {
            // Reactivate subscription
            $update_query = "UPDATE newsletter_subscribers SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE email = :email";
            $update_stmt = $db->prepare($update_query);
            $update_stmt->bindParam(':email', $email);
            
            if ($update_stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Successfully resubscribed to newsletter']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to resubscribe']);
            }
            exit;
        }
    }
    
    // Insert new subscription
    $query = "INSERT INTO newsletter_subscribers (email, ip_address, user_agent) VALUES (:email, :ip_address, :user_agent)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':ip_address', $ip_address);
    $stmt->bindParam(':user_agent', $user_agent);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Successfully subscribed to newsletter']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to subscribe']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
