
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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only POST requests are accepted.'
    ]);
    exit;
}

require_once 'config/Database.php';

try {
    // Define upload directory with absolute path
    $upload_dir = __DIR__ . '/uploads/order_pdfs/';
    
    // Create uploads directory recursively if it doesn't exist
    if (!file_exists($upload_dir)) {
        if (!mkdir($upload_dir, 0755, true)) {
            error_log('Failed to create upload directory: ' . $upload_dir);
            throw new Exception('Failed to create upload directory. Please check permissions.');
        }
        error_log('Created upload directory: ' . $upload_dir);
    }

    // Check if directory is writable
    if (!is_writable($upload_dir)) {
        error_log('Upload directory is not writable: ' . $upload_dir);
        throw new Exception('Upload directory is not writable. Please check permissions.');
    }

    // Validate required fields
    if (!isset($_POST['order_id']) || !isset($_POST['pdf_type'])) {
        throw new Exception('Order ID and PDF type are required');
    }

    $order_id = trim($_POST['order_id']);
    $pdf_type = trim($_POST['pdf_type']);

    // Validate PDF type
    if (!in_array($pdf_type, ['cover', 'content'])) {
        throw new Exception('Invalid PDF type. Must be cover or content.');
    }

    // Check if file was uploaded
    if (!isset($_FILES['pdf']) || $_FILES['pdf']['error'] !== UPLOAD_ERR_OK) {
        $error_message = 'No PDF file uploaded';
        if (isset($_FILES['pdf']['error'])) {
            switch ($_FILES['pdf']['error']) {
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    $error_message = 'File too large';
                    break;
                case UPLOAD_ERR_PARTIAL:
                    $error_message = 'File upload was interrupted';
                    break;
                case UPLOAD_ERR_NO_FILE:
                    $error_message = 'No file was uploaded';
                    break;
                case UPLOAD_ERR_NO_TMP_DIR:
                    $error_message = 'Missing temporary folder';
                    break;
                case UPLOAD_ERR_CANT_WRITE:
                    $error_message = 'Failed to write file to disk';
                    break;
            }
        }
        throw new Exception($error_message);
    }

    $file = $_FILES['pdf'];
    
    // Validate file type more thoroughly
    $file_info = new finfo(FILEINFO_MIME_TYPE);
    $detected_type = $file_info->file($file['tmp_name']);
    
    if ($detected_type !== 'application/pdf' && $file['type'] !== 'application/pdf') {
        throw new Exception('Invalid file type. Only PDF files are allowed. Detected: ' . $detected_type);
    }

    // Validate file size (max 10MB)
    if ($file['size'] > 10 * 1024 * 1024) {
        throw new Exception('File too large. Maximum size is 10MB.');
    }

    // Generate unique filename
    $extension = 'pdf';
    $filename = $order_id . '_' . $pdf_type . '_' . uniqid() . '.' . $extension;
    $filepath = $upload_dir . $filename;

    // Log the file upload attempt
    error_log('Attempting to upload file: ' . $file['name'] . ' to: ' . $filepath);
    error_log('File size: ' . $file['size'] . ' bytes');
    error_log('Temporary file: ' . $file['tmp_name']);

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        error_log('Failed to move uploaded file from ' . $file['tmp_name'] . ' to ' . $filepath);
        throw new Exception('Failed to save uploaded file. Please try again.');
    }

    // Verify the file was actually created
    if (!file_exists($filepath)) {
        error_log('File was not created at: ' . $filepath);
        throw new Exception('File upload failed - file not found after upload');
    }

    error_log('File successfully uploaded to: ' . $filepath);

    // Save to database
    $database = new Database();
    $db = $database->getConnection();

    // Check if PDF already exists for this order and type
    $check_query = "SELECT id, pdf_url FROM order_pdfs WHERE order_id = :order_id AND pdf_type = :pdf_type";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':order_id', $order_id);
    $check_stmt->bindParam(':pdf_type', $pdf_type);
    $check_stmt->execute();

    // Generate URL for the PDF (relative path for URL)
    $pdf_url = 'https://www.respizenmedical.com/mylittle/api/uploads/order_pdfs/' . $filename;

    if ($check_stmt->rowCount() > 0) {
        // Update existing record and remove old file
        $existing_pdf = $check_stmt->fetch();
        if ($existing_pdf['pdf_url']) {
            $old_filename = basename($existing_pdf['pdf_url']);
            $old_filepath = $upload_dir . $old_filename;
            if (file_exists($old_filepath)) {
                unlink($old_filepath);
                error_log('Removed old PDF file: ' . $old_filepath);
            }
        }

        $update_query = "UPDATE order_pdfs SET pdf_url = :pdf_url, original_filename = :original_filename, uploaded_at = CURRENT_TIMESTAMP WHERE order_id = :order_id AND pdf_type = :pdf_type";
        $stmt = $db->prepare($update_query);
        $stmt->bindParam(':pdf_url', $pdf_url);
        $stmt->bindParam(':original_filename', $file['name']);
        $stmt->bindParam(':order_id', $order_id);
        $stmt->bindParam(':pdf_type', $pdf_type);
    } else {
        // Insert new record
        $insert_query = "INSERT INTO order_pdfs (order_id, pdf_type, pdf_url, original_filename) VALUES (:order_id, :pdf_type, :pdf_url, :original_filename)";
        $stmt = $db->prepare($insert_query);
        $stmt->bindParam(':order_id', $order_id);
        $stmt->bindParam(':pdf_type', $pdf_type);
        $stmt->bindParam(':pdf_url', $pdf_url);
        $stmt->bindParam(':original_filename', $file['name']);
    }

    if (!$stmt->execute()) {
        // If database save fails, remove the uploaded file
        if (file_exists($filepath)) {
            unlink($filepath);
        }
        throw new Exception('Failed to save PDF information to database');
    }

    error_log('PDF successfully saved to database with URL: ' . $pdf_url);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'pdf_url' => $pdf_url,
            'filename' => $filename,
            'pdf_type' => $pdf_type,
            'file_size' => $file['size'],
            'original_filename' => $file['name']
        ],
        'message' => 'PDF uploaded successfully'
    ]);

} catch (Exception $e) {
    error_log('PDF upload error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
