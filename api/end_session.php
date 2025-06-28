
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
    
    // Remove session
    $query = "DELETE FROM active_sessions WHERE session_id = :session_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':session_id', $session_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Session ended']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to end session']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
