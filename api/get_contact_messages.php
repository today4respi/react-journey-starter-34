
<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Enable CORS for all requests, including preflight OPTIONS requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config/Database.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée'
    ]);
    exit;
}

try {
    // Database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Get page and limit parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;
    
    // Get search parameter
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    
    // Get status filter
    $status = isset($_GET['status']) ? trim($_GET['status']) : '';
    
    // Build the base query
    $whereConditions = [];
    $params = [];
    
    if (!empty($search)) {
        $whereConditions[] = "(name LIKE ? OR email LIKE ? OR message LIKE ?)";
        $searchParam = "%$search%";
        $params[] = $searchParam;
        $params[] = $searchParam;
        $params[] = $searchParam;
    }
    
    if (!empty($status)) {
        $whereConditions[] = "status = ?";
        $params[] = $status;
    }
    
    $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM contact_messages $whereClause";
    $countStmt = $db->prepare($countQuery);
    $countStmt->execute($params);
    $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get messages with pagination
    $query = "SELECT id, name, email, phone, message, created_at, status 
              FROM contact_messages 
              $whereClause 
              ORDER BY created_at DESC 
              LIMIT $limit OFFSET $offset";
    
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Calculate pagination info
    $totalPages = ceil($totalCount / $limit);
    
    echo json_encode([
        'success' => true,
        'messages' => $messages,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_count' => $totalCount,
            'limit' => $limit
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Get contact messages error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la récupération des messages'
    ]);
}
?>
