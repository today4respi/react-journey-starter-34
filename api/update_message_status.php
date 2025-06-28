
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

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée'
    ]);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id']) || !isset($input['status'])) {
        echo json_encode([
            'success' => false,
            'message' => 'ID et statut requis'
        ]);
        exit;
    }
    
    $messageId = (int)$input['id'];
    $status = trim($input['status']);
    
    // Validate status
    $allowedStatuses = ['new', 'read', 'replied'];
    if (!in_array($status, $allowedStatuses)) {
        echo json_encode([
            'success' => false,
            'message' => 'Statut invalide'
        ]);
        exit;
    }
    
    // Database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Update message status
    $query = "UPDATE contact_messages SET status = ? WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$status, $messageId]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Statut du message mis à jour'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Message non trouvé ou statut déjà à jour'
        ]);
    }
    
} catch (Exception $e) {
    error_log("Update message status error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la mise à jour du statut'
    ]);
}
?>
