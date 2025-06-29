
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

try {
    $database = new Database();
    $db = $database->getConnection();

    $query = "SELECT op.*, o.order_number, o.customer_name, o.customer_email 
              FROM order_pdfs op 
              LEFT JOIN orders o ON op.order_id = o.id 
              ORDER BY op.uploaded_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $pdfs = $stmt->fetchAll();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $pdfs
    ]);

} catch (Exception $e) {
    error_log('Get all PDFs error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
