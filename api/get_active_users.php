
<?php
require_once 'config/Database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Clean up old sessions first (older than 3 minutes)
    $cleanup_query = "DELETE FROM active_sessions WHERE last_activity < NOW() - INTERVAL 3 MINUTE";
    $db->exec($cleanup_query);
    
    // Count active sessions (last activity within 3 minutes)
    $count_query = "SELECT COUNT(*) as active_count FROM active_sessions WHERE last_activity >= NOW() - INTERVAL 3 MINUTE";
    $stmt = $db->prepare($count_query);
    $stmt->execute();
    $result = $stmt->fetch();
    
    // Get detailed session info for admin
    $detail_query = "SELECT session_id, ip_address, page_url, last_activity 
                     FROM active_sessions 
                     WHERE last_activity >= NOW() - INTERVAL 3 MINUTE 
                     ORDER BY last_activity DESC";
    $detail_stmt = $db->prepare($detail_query);
    $detail_stmt->execute();
    $sessions = $detail_stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => [
            'active_users' => (int)$result['active_count'],
            'sessions' => $sessions,
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
