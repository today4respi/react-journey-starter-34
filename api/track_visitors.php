
<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed. Only POST requests are accepted.'
    ]);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($input['page_visitors']) || empty($input['page_visitors'])) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Page name is required'
    ]);
    exit;
}

try {
    // Get visitor information
    $page_visited = trim($input['page_visitors']);
    $referrer = isset($input['referrer']) ? trim($input['referrer']) : null;
    
    // Get IP address (handle proxies and load balancers)
    $ip_address = '';
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip_address = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
    } elseif (!empty($_SERVER['HTTP_X_REAL_IP'])) {
        $ip_address = $_SERVER['HTTP_X_REAL_IP'];
    } else {
        $ip_address = $_SERVER['REMOTE_ADDR'];
    }
    
    // Get user agent
    $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : null;
    
    // Generate session ID based on IP and user agent
    $session_id = md5($ip_address . $user_agent . date('Y-m-d'));
    
    // Get location data from the frontend or try to get it server-side
    $city = null;
    $country = null;
    
    if (isset($input['user_location'])) {
        $location = $input['user_location'];
        $city = isset($location['city']) ? trim($location['city']) : null;
        $country = isset($location['country']) ? trim($location['country']) : null;
        
        // If frontend provided an IP, use it (might be more accurate)
        if (isset($location['ip']) && !empty($location['ip'])) {
            $ip_address = $location['ip'];
        }
    }
    
    // If no location data from frontend, try to get it server-side (basic implementation)
    if (!$country && function_exists('geoip_country_name_by_name')) {
        $country = geoip_country_name_by_name($ip_address);
    }
    
    // Prepare SQL statement with proper UUID generation
    $query = "INSERT INTO visitor_tracking 
              (id, ip_address, page_visited, referrer, user_agent, city, country, session_id, visit_date) 
              VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $stmt = $db->prepare($query);
    
    if (!$stmt) {
        throw new Exception('Failed to prepare statement: ' . $db->errorInfo()[2]);
    }
    
    // Execute the statement
    $result = $stmt->execute([
        $ip_address,
        $page_visited,
        $referrer,
        $user_agent,
        $city,
        $country,
        $session_id
    ]);
    
    if ($result) {
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Visitor tracked successfully',
            'data' => [
                'ip' => $ip_address,
                'city' => $city,
                'country' => $country,
                'page' => $page_visited,
                'referrer' => $referrer,
                'date' => date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        throw new Exception('Failed to insert visitor data: ' . $stmt->errorInfo()[2]);
    }
    
} catch (Exception $e) {
    error_log('Visitor tracking error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>
