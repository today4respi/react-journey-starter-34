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
        $whereClause = "WHERE o.status = ?";
        $params[] = $status;
    }
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM orders o " . $whereClause;
    $countStmt = $db->prepare($countQuery);
    $countStmt->execute($params);
    $totalCount = $countStmt->fetch()['total'];
    
    // Get orders data with user information
    $query = "SELECT 
                o.id,
                o.order_number,
                o.plan_type,
                o.total_amount,
                o.currency,
                o.status,
                o.delivery_status,
                o.customer_name,
                o.customer_email,
                o.customer_phone,
                o.customer_address,
                o.customer_city,
                o.customer_postal_code,
                o.created_at,
                o.updated_at,
                u.first_name,
                u.last_name,
                u.email as user_email
              FROM orders o
              LEFT JOIN users u ON o.user_id = u.id
              " . $whereClause . "
              ORDER BY o.created_at DESC 
              LIMIT " . (int)$limit . " OFFSET " . (int)$offset;
    
    $stmt = $db->prepare($query);
    
    if (!$stmt) {
        throw new Exception('Failed to prepare statement: ' . $db->errorInfo()[2]);
    }
    
    $result = $stmt->execute($params);
    
    if ($result) {
        $orders = $stmt->fetchAll();
        
        // Fetch order items for each order with child photo data
        foreach ($orders as &$order) {
            $itemsQuery = "SELECT 
                            oi.id,
                            oi.order_id,
                            oi.child_id,
                            oi.child_name,
                            oi.child_age,
                            oi.child_objective,
                            oi.child_message,
                            oi.child_photo_url as child_photo,
                            oi.book_title,
                            oi.book_description,
                            oi.price,
                            oi.created_at
                          FROM order_items oi
                          WHERE oi.order_id = ?";
            
            $itemsStmt = $db->prepare($itemsQuery);
            $itemsStmt->execute([$order['id']]);
            $order['items'] = $itemsStmt->fetchAll();
        }
        
        // Calculate basic statistics
        $statsQuery = "SELECT 
                        COUNT(*) as total_orders,
                        COALESCE(SUM(total_amount), 0) as total_revenue,
                        COALESCE(AVG(total_amount), 0) as avg_order_value,
                        COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today_orders,
                        COALESCE(SUM(CASE WHEN DATE(created_at) = CURDATE() THEN total_amount ELSE 0 END), 0) as today_revenue
                      FROM orders";
        
        $statsStmt = $db->prepare($statsQuery);
        $statsStmt->execute();
        $stats = $statsStmt->fetch();
        
        // Get monthly trend (last 6 months)
        $monthlyQuery = "SELECT 
                          DATE_FORMAT(created_at, '%Y-%m') as month,
                          COUNT(*) as orders_count,
                          COALESCE(SUM(total_amount), 0) as revenue
                        FROM orders 
                        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                        ORDER BY month DESC";
        
        $monthlyStmt = $db->prepare($monthlyQuery);
        $monthlyStmt->execute();
        $monthlyTrend = $monthlyStmt->fetchAll();
        
        // Get status distribution
        $statusQuery = "SELECT 
                         status,
                         COUNT(*) as count
                       FROM orders
                       GROUP BY status";
        
        $statusStmt = $db->prepare($statusQuery);
        $statusStmt->execute();
        $statusDistribution = $statusStmt->fetchAll();
        
        // Get plan distribution
        $planQuery = "SELECT 
                       plan_type,
                       COUNT(*) as count,
                       COALESCE(SUM(total_amount), 0) as revenue
                     FROM orders
                     GROUP BY plan_type";
        
        $planStmt = $db->prepare($planQuery);
        $planStmt->execute();
        $planDistribution = $planStmt->fetchAll();
        
        // Prepare statistics response
        $statistics = [
            'daily' => [
                'revenue' => (float)$stats['today_revenue'],
                'orders_count' => (int)$stats['today_orders'],
                'date' => date('Y-m-d')
            ],
            'total' => [
                'revenue' => (float)$stats['total_revenue'],
                'orders_count' => (int)$stats['total_orders'],
                'avg_order_value' => (float)$stats['avg_order_value']
            ],
            'monthly_trend' => $monthlyTrend,
            'status_distribution' => $statusDistribution,
            'plan_distribution' => $planDistribution
        ];
        
        // Calculate pagination info
        $totalPages = ceil($totalCount / $limit);
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => [
                'orders' => $orders,
                'statistics' => $statistics,
                'pagination' => [
                    'current_page' => $page,
                    'total_pages' => $totalPages,
                    'total_items' => (int)$totalCount,
                    'items_per_page' => $limit
                ]
            ]
        ]);
    } else {
        throw new Exception('Failed to fetch orders: ' . $stmt->errorInfo()[2]);
    }
    
} catch (Exception $e) {
    error_log('Get all orders error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>
