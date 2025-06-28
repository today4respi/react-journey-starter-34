
<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/Database.php';
require_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));

    if (!$data || !isset($data->user_id)) {
        echo json_encode([
            'success' => false,
            'message' => 'ID utilisateur requis'
        ]);
        exit;
    }

    // Set user properties
    $user->id = $data->user_id;
    
    // Get current user data first
    $currentUser = $user->getById();
    if (!$currentUser) {
        echo json_encode([
            'success' => false,
            'message' => 'Utilisateur non trouvé'
        ]);
        exit;
    }

    // Update only provided fields
    if (isset($data->first_name)) {
        $user->first_name = htmlspecialchars(strip_tags($data->first_name));
    }
    if (isset($data->last_name)) {
        $user->last_name = htmlspecialchars(strip_tags($data->last_name));
    }
    if (isset($data->email)) {
        $user->email = htmlspecialchars(strip_tags($data->email));
    }
    if (isset($data->phone)) {
        $user->phone = htmlspecialchars(strip_tags($data->phone));
    }
    if (isset($data->password) && !empty($data->password)) {
        $user->password_hash = $data->password; // Will be hashed in the model
    }

    if ($user->updateProfile()) {
        // Get updated user data
        $updatedUser = $user->getById();
        
        echo json_encode([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'user' => [
                'id' => $updatedUser['id'],
                'email' => $updatedUser['email'],
                'first_name' => $updatedUser['first_name'],
                'last_name' => $updatedUser['last_name'],
                'phone' => $updatedUser['phone']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Erreur lors de la mise à jour du profil'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée'
    ]);
}
?>
