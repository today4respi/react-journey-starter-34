
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
    
    if (!$input || !isset($input['session_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Session ID required']);
        exit;
    }
    
    $session_id = $input['session_id'];
    $page_url = isset($input['page_url']) ? $input['page_url'] : '';
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    // Insert or update session
    $query = "INSERT INTO active_sessions (session_id, ip_address, user_agent, page_url, last_activity) 
              VALUES (:session_id, :ip_address, :user_agent, :page_url, NOW()) 
              ON DUPLICATE KEY UPDATE 
              last_activity = NOW(), 
              page_url = :page_url2";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':session_id', $session_id);
    $stmt->bindParam(':ip_address', $ip_address);
    $stmt->bindParam(':user_agent', $user_agent);
    $stmt->bindParam(':page_url', $page_url);
    $stmt->bindParam(':page_url2', $page_url);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Session updated']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update session']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
