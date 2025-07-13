<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Create temporary messages table if it doesn't exist
    $createTempMessagesSQL = "CREATE TABLE IF NOT EXISTS temp_messages (
        id_temp_message INT AUTO_INCREMENT PRIMARY KEY,
        temp_session_id VARCHAR(255) NOT NULL,
        message_content TEXT NOT NULL,
        message_type ENUM('text', 'image') DEFAULT 'text',
        image_url VARCHAR(512) NULL,
        image_name VARCHAR(255) NULL,
        date_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        transferred BOOLEAN DEFAULT FALSE,
        INDEX idx_temp_session (temp_session_id),
        INDEX idx_transferred (transferred)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $db->exec($createTempMessagesSQL);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $tempSessionId = $input['temp_session_id'] ?? '';
        $messageContent = $input['message_content'] ?? '';
        $messageType = $input['message_type'] ?? 'text';
        $imageUrl = $input['image_url'] ?? null;
        $imageName = $input['image_name'] ?? null;
        
        if (!$tempSessionId || !$messageContent) {
            echo json_encode(['success' => false, 'message' => 'Required fields missing']);
            exit;
        }
        
        // Store initial message temporarily
        $stmt = $db->prepare("
            INSERT INTO temp_messages (temp_session_id, message_content, message_type, image_url, image_name) 
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $tempSessionId,
            $messageContent,
            $messageType,
            $imageUrl,
            $imageName
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Initial message stored successfully',
            'temp_message_id' => $db->lastInsertId()
        ]);
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>