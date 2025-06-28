
<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config/Database.php';

// Only allow PUT requests
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée'
    ]);
    exit;
}

// Get the input data
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!$input || !isset($input['id']) || !isset($input['status'])) {
    echo json_encode([
        'success' => false,
        'message' => 'ID et statut requis'
    ]);
    exit;
}

$id = (int)$input['id'];
$status = trim($input['status']);

// Validate status
if (!in_array($status, ['new', 'read', 'replied'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Statut invalide'
    ]);
    exit;
}

try {
    // Database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Update message status
    $query = "UPDATE contact_messages SET status = ? WHERE id = ?";
    $stmt = $db->prepare($query);
    $result = $stmt->execute([$status, $id]);
    
    if ($result && $stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Statut mis à jour avec succès'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Message non trouvé ou aucune modification effectuée'
        ]);
    }
    
} catch (Exception $e) {
    error_log("Update contact message status error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la mise à jour du statut'
    ]);
}
?>
