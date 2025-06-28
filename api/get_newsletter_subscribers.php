
<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config/Database.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only GET requests are accepted.'
    ]);
    exit;
}

try {
    // Get query parameters for pagination and filtering
    $limit = isset($_GET['limit']) ? max(1, min(100, (int)$_GET['limit'])) : 50;
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $status = isset($_GET['status']) ? $_GET['status'] : 'all';
    
    // Calculate offset
    $offset = ($page - 1) * $limit;
    
    // Build the query
    $whereClause = "";
    $params = [];
    
    if ($status !== 'all') {
        $whereClause = "WHERE status = ?";
        $params[] = $status;
    }
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM newsletter_subscribers " . $whereClause;
    $countStmt = $db->prepare($countQuery);
    $countStmt->execute($params);
    $totalCount = $countStmt->fetch()['total'];
    
    // Get subscribers data - using proper SQL syntax without quotes around LIMIT and OFFSET
    $query = "SELECT 
                id,
                email,
                status,
                ip_address,
                created_at,
                updated_at
              FROM newsletter_subscribers 
              " . $whereClause . "
              ORDER BY created_at DESC 
              LIMIT " . (int)$limit . " OFFSET " . (int)$offset;
    
    $stmt = $db->prepare($query);
    
    if (!$stmt) {
        throw new Exception('Failed to prepare statement: ' . $db->errorInfo()[2]);
    }
    
    $result = $stmt->execute($params);
    
    if ($result) {
        $subscribers = $stmt->fetchAll();
        
        // Calculate pagination info
        $totalPages = ceil($totalCount / $limit);
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => [
                'subscribers' => $subscribers,
                'pagination' => [
                    'current_page' => $page,
                    'total_pages' => $totalPages,
                    'total_items' => (int)$totalCount,
                    'items_per_page' => $limit
                ]
            ]
        ]);
    } else {
        throw new Exception('Failed to fetch newsletter subscribers: ' . $stmt->errorInfo()[2]);
    }
    
} catch (Exception $e) {
    error_log('Get newsletter subscribers error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>
