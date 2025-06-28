
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

require_once '../config/Database.php';
require_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    $user->email = $data->email;
    
    if($user->emailExists()) {
        if($user->verifyPassword($data->password)) {
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Connexion réussie.',
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'phone' => $user->phone
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Mot de passe incorrect.'
            ]);
        }
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Aucun compte trouvé avec cet email.'
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Email et mot de passe requis.'
    ]);
}
?>
