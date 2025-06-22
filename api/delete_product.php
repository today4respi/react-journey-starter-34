
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Only allow DELETE method
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        echo json_encode([
            'success' => false,
            'message' => 'Only DELETE method allowed'
        ]);
        exit;
    }
    
    // Get product ID from URL parameter
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Product ID is required'
        ]);
        exit;
    }
    
    $productId = (int)$_GET['id'];
    
    // Check if product exists
    $checkQuery = "SELECT id_product FROM products WHERE id_product = ?";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->execute([$productId]);
    
    if (!$checkStmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'Product not found'
        ]);
        exit;
    }
    
    // Delete the product
    $deleteQuery = "DELETE FROM products WHERE id_product = ?";
    $deleteStmt = $db->prepare($deleteQuery);
    
    if ($deleteStmt->execute([$productId])) {
        echo json_encode([
            'success' => true,
            'message' => 'Product deleted successfully',
            'deleted_id' => $productId
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to delete product'
        ]);
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
