
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
    // Get query parameters for pagination
    $limit = isset($_GET['limit']) ? max(1, min(100, (int)$_GET['limit'])) : 50;
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    
    // Calculate offset
    $offset = ($page - 1) * $limit;
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM users";
    $countStmt = $db->prepare($countQuery);
    $countStmt->execute();
    $totalCount = $countStmt->fetch()['total'];
    
    // Get users data with children count - using proper SQL syntax without quotes around LIMIT and OFFSET
    $query = "SELECT 
                u.id,
                u.email,
                u.first_name,
                u.last_name,
                u.phone,
                u.created_at,
                u.updated_at,
                COUNT(c.id) as children_count
              FROM users u
              LEFT JOIN children c ON u.id = c.user_id
              GROUP BY u.id, u.email, u.first_name, u.last_name, u.phone, u.created_at, u.updated_at
              ORDER BY u.created_at DESC 
              LIMIT " . (int)$limit . " OFFSET " . (int)$offset;
    
    $stmt = $db->prepare($query);
    
    if (!$stmt) {
        throw new Exception('Failed to prepare statement: ' . $db->errorInfo()[2]);
    }
    
    $result = $stmt->execute();
    
    if ($result) {
        $users = $stmt->fetchAll();
        
        // Calculate pagination info
        $totalPages = ceil($totalCount / $limit);
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => [
                'users' => $users,
                'pagination' => [
                    'current_page' => $page,
                    'total_pages' => $totalPages,
                    'total_items' => (int)$totalCount,
                    'items_per_page' => $limit
                ]
            ]
        ]);
    } else {
        throw new Exception('Failed to fetch users: ' . $stmt->errorInfo()[2]);
    }
    
} catch (Exception $e) {
    error_log('Get users error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>
