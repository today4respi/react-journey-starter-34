
<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config/Database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            throw new Exception('Invalid JSON input');
        }

        // Validate required fields according to database schema
        $required_fields = ['user_id', 'name', 'age'];
        foreach ($required_fields as $field) {
            if (!isset($input[$field])) {
                throw new Exception("Missing required field: $field");
            }
        }

        // Validate age constraint (1-18)
        $age = (int)$input['age'];
        if ($age < 1 || $age > 18) {
            throw new Exception('Age must be between 1 and 18');
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Create new child - generate UUID
            $child_id = bin2hex(random_bytes(16));
            $child_id = substr($child_id, 0, 8) . '-' . substr($child_id, 8, 4) . '-' . substr($child_id, 12, 4) . '-' . substr($child_id, 16, 4) . '-' . substr($child_id, 20, 12);
            
            $query = "INSERT INTO children (id, user_id, name, age, objective, message, photo_url) 
                     VALUES (:id, :user_id, :name, :age, :objective, :message, :photo_url)";
            
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $child_id);
            $stmt->bindParam(':user_id', $input['user_id']);
            $stmt->bindParam(':name', $input['name']);
            $stmt->bindParam(':age', $age);
            $stmt->bindParam(':objective', $input['objective'] ?? '');
            $stmt->bindParam(':message', $input['message'] ?? '');
            $stmt->bindParam(':photo_url', $input['photo_url'] ?? '');
            
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Child created successfully',
                    'data' => [
                        'id' => $child_id,
                        'user_id' => $input['user_id'],
                        'name' => $input['name'],
                        'age' => $age,
                        'objective' => $input['objective'] ?? '',
                        'message' => $input['message'] ?? '',
                        'photo_url' => $input['photo_url'] ?? ''
                    ]
                ]);
            } else {
                throw new Exception('Failed to create child');
            }
        } else {
            // Update existing child
            if (!isset($input['id'])) {
                throw new Exception('Child ID is required for update');
            }
            
            $query = "UPDATE children SET 
                     name = :name, 
                     age = :age, 
                     objective = :objective, 
                     message = :message, 
                     photo_url = :photo_url,
                     updated_at = CURRENT_TIMESTAMP
                     WHERE id = :id AND user_id = :user_id";
            
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $input['id']);
            $stmt->bindParam(':user_id', $input['user_id']);
            $stmt->bindParam(':name', $input['name']);
            $stmt->bindParam(':age', $age);
            $stmt->bindParam(':objective', $input['objective'] ?? '');
            $stmt->bindParam(':message', $input['message'] ?? '');
            $stmt->bindParam(':photo_url', $input['photo_url'] ?? '');
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Child updated successfully',
                    'data' => [
                        'id' => $input['id'],
                        'user_id' => $input['user_id'],
                        'name' => $input['name'],
                        'age' => $age,
                        'objective' => $input['objective'] ?? '',
                        'message' => $input['message'] ?? '',
                        'photo_url' => $input['photo_url'] ?? ''
                    ]
                ]);
            } else {
                throw new Exception('Failed to update child');
            }
        }

    } catch (Exception $e) {
        error_log('Save child error: ' . $e->getMessage());
        
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
?>
