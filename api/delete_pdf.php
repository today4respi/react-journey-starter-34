
<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

require_once 'config/Database.php';

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['pdf_id'])) {
        throw new Exception('PDF ID is required');
    }

    $pdf_id = $input['pdf_id'];

    $database = new Database();
    $db = $database->getConnection();

    // Get PDF info before deletion
    $query = "SELECT pdf_url FROM order_pdfs WHERE id = :pdf_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':pdf_id', $pdf_id);
    $stmt->execute();

    $pdf = $stmt->fetch();
    if (!$pdf) {
        throw new Exception('PDF not found');
    }

    // Extract file path from URL
    $pdf_url = $pdf['pdf_url'];
    $file_path = str_replace('https://www.respizenmedical.com/mylittle/api/', '', $pdf_url);

    // Delete from database first
    $delete_query = "DELETE FROM order_pdfs WHERE id = :pdf_id";
    $delete_stmt = $db->prepare($delete_query);
    $delete_stmt->bindParam(':pdf_id', $pdf_id);
    
    if (!$delete_stmt->execute()) {
        throw new Exception('Failed to delete PDF record from database');
    }

    // Delete physical file
    if (file_exists($file_path)) {
        if (!unlink($file_path)) {
            error_log('Warning: Failed to delete physical file: ' . $file_path);
        }
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'PDF deleted successfully'
    ]);

} catch (Exception $e) {
    error_log('Delete PDF error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
