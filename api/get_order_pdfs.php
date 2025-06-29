
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
    $order_id = isset($_GET['order_id']) ? $_GET['order_id'] : null;

    if (empty($order_id)) {
        throw new Exception('Order ID is required');
    }

    $database = new Database();
    $db = $database->getConnection();

    $query = "SELECT * FROM order_pdfs WHERE order_id = :order_id ORDER BY pdf_type, uploaded_at DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':order_id', $order_id);
    $stmt->execute();

    $pdfs = $stmt->fetchAll();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $pdfs
    ]);

} catch (Exception $e) {
    error_log('Get order PDFs error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
