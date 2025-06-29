
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
        'status' => 'error',
        'message' => 'Method not allowed. Only GET requests are accepted.'
    ]);
    exit;
}

try {
    // Get query parameters for pagination and filtering
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $page = isset($_GET['page']) ? $_GET['page'] : null;
    
    // Calculate offset from page if provided
    if (isset($_GET['page']) && is_numeric($_GET['page'])) {
        $pageNum = max(1, (int)$_GET['page']);
        $offset = ($pageNum - 1) * $limit;
    }
    
    // Build the query
    $whereClause = "";
    $params = [];
    
    if ($page && !is_numeric($page)) {
        $whereClause = "WHERE page_visited = ?";
        $params[] = $page;
    }
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM visitor_tracking " . $whereClause;
    $countStmt = $db->prepare($countQuery);
    $countStmt->execute($params);
    $totalCount = $countStmt->fetch()['total'];
    
    // Get visitors data - using proper SQL syntax without quotes around LIMIT and OFFSET
    $query = "SELECT 
                id,
                ip_address,
                page_visited,
                referrer,
                user_agent,
                city,
                country,
                session_id,
                visit_date
              FROM visitor_tracking 
              " . $whereClause . "
              ORDER BY visit_date DESC 
              LIMIT " . (int)$limit . " OFFSET " . (int)$offset;
    
    $stmt = $db->prepare($query);
    
    if (!$stmt) {
        throw new Exception('Failed to prepare statement: ' . $db->errorInfo()[2]);
    }
    
    $result = $stmt->execute($params);
    
    if ($result) {
        $visitors = $stmt->fetchAll();
        
        // Get statistics
        $statsQuery = "SELECT 
                        COUNT(*) as total_visits,
                        COUNT(DISTINCT session_id) as unique_sessions,
                        COUNT(DISTINCT ip_address) as unique_visitors,
                        COUNT(DISTINCT country) as unique_countries,
                        COUNT(CASE WHEN DATE(visit_date) = CURDATE() THEN 1 END) as today_visits
                       FROM visitor_tracking";
        
        $statsStmt = $db->prepare($statsQuery);
        $statsStmt->execute();
        $stats = $statsStmt->fetch();
        
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'data' => [
                'visitors' => $visitors,
                'pagination' => [
                    'total' => (int)$totalCount,
                    'limit' => $limit,
                    'offset' => $offset,
                    'page' => ceil($offset / $limit) + 1,
                    'total_pages' => ceil($totalCount / $limit)
                ],
                'stats' => $stats
            ]
        ]);
    } else {
        throw new Exception('Failed to fetch visitor data: ' . $stmt->errorInfo()[2]);
    }
    
} catch (Exception $e) {
    error_log('Get visitors error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>
