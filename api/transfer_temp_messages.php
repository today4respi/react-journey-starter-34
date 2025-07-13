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
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $tempSessionId = $input['temp_session_id'] ?? '';
        $realSessionId = $input['real_session_id'] ?? '';
        $clientName = $input['client_name'] ?? '';
        
        if (!$tempSessionId || !$realSessionId || !$clientName) {
            echo json_encode(['success' => false, 'message' => 'Required fields missing']);
            exit;
        }
        
        // Begin transaction
        $db->beginTransaction();
        
        try {
            // Get all temporary messages for this temp session
            $stmt = $db->prepare("
                SELECT * FROM temp_messages 
                WHERE temp_session_id = ? AND transferred = FALSE 
                ORDER BY date_sent ASC
            ");
            $stmt->execute([$tempSessionId]);
            $tempMessages = $stmt->fetchAll();
            
            // Transfer each message to the real chat_messages table
            foreach ($tempMessages as $tempMsg) {
                $insertStmt = $db->prepare("
                    INSERT INTO chat_messages 
                    (id_session, sender_type, sender_name, message_content, message_type, 
                     image_url, image_name, date_sent) 
                    VALUES (?, 'client', ?, ?, ?, ?, ?, ?)
                ");
                
                $insertStmt->execute([
                    $realSessionId,
                    $clientName,
                    $tempMsg['message_content'],
                    $tempMsg['message_type'],
                    $tempMsg['image_url'],
                    $tempMsg['image_name'],
                    $tempMsg['date_sent']
                ]);
            }
            
            // Mark temp messages as transferred
            $updateStmt = $db->prepare("
                UPDATE temp_messages 
                SET transferred = TRUE 
                WHERE temp_session_id = ?
            ");
            $updateStmt->execute([$tempSessionId]);
            
            // Update session activity
            $sessionUpdateStmt = $db->prepare("
                UPDATE chat_sessions 
                SET last_activity = CURRENT_TIMESTAMP 
                WHERE id_session = ?
            ");
            $sessionUpdateStmt->execute([$realSessionId]);
            
            $db->commit();
            
            echo json_encode([
                'success' => true,
                'message' => 'Messages transferred successfully',
                'transferred_count' => count($tempMessages)
            ]);
            
        } catch (Exception $e) {
            $db->rollback();
            throw $e;
        }
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>