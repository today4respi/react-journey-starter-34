
<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config/Database.php';
require_once 'models/Child.php';

$database = new Database();
$db = $database->getConnection();

$child = new Child($db);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only POST requests are accepted.'
    ]);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    // Validate required fields
    $required_fields = ['user_id', 'name', 'age'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            throw new Exception("Missing or empty required field: $field");
        }
    }

    // Validate age
    $age = (int)$input['age'];
    if ($age < 1 || $age > 18) {
        throw new Exception('Age must be between 1 and 18 years');
    }

    // Validate name length
    $name = trim($input['name']);
    if (strlen($name) < 2 || strlen($name) > 50) {
        throw new Exception('Name must be between 2 and 50 characters');
    }

    $child->user_id = $input['user_id'];
    $child->name = $name;
    $child->age = $age;
    $child->objective = ''; // Empty for quick add
    $child->message = ''; // Empty for quick add
    $child->photo_url = $input['photo_url'] ?? '';

    if ($child->create()) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Child added successfully',
            'data' => [
                'id' => $child->id,
                'user_id' => $child->user_id,
                'name' => $child->name,
                'age' => $child->age,
                'objective' => $child->objective,
                'message' => $child->message,
                'photo_url' => $child->photo_url
            ]
        ]);
    } else {
        throw new Exception('Failed to add child to database');
    }

} catch (Exception $e) {
    error_log('Add child error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
