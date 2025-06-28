
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

// Only allow POST requests for sending emails
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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
if (!$input || !isset($input['name']) || !isset($input['email']) || !isset($input['message'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Tous les champs obligatoires doivent être remplis'
    ]);
    exit;
}

$name = trim($input['name']);
$email = trim($input['email']);
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$message = trim($input['message']);

// Basic validation
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode([
        'success' => false,
        'message' => 'Tous les champs obligatoires doivent être remplis'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Adresse email invalide'
    ]);
    exit;
}

try {
    // Database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Store the contact message in database (optional)
    $query = "INSERT INTO contact_messages (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, NOW())";
    $stmt = $db->prepare($query);
    $stmt->execute([$name, $email, $phone, $message]);
    
    // Prepare email content
    $to = "contact@mylittlehero.fr";
    $subject = "Nouveau message de contact - " . $name;
    
    $email_body = "
    <html>
    <head>
        <title>Nouveau message de contact</title>
    </head>
    <body>
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> " . htmlspecialchars($name) . "</p>
        <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
        <p><strong>Téléphone:</strong> " . htmlspecialchars($phone) . "</p>
        <p><strong>Message:</strong></p>
        <p>" . nl2br(htmlspecialchars($message)) . "</p>
        <hr>
        <p><small>Message envoyé depuis le site My Little Hero</small></p>
    </body>
    </html>
    ";
    
    // Email headers
    $headers = array(
        'MIME-Version' => '1.0',
        'Content-type' => 'text/html; charset=utf-8',
        'From' => 'noreply@mylittlehero.fr',
        'Reply-To' => $email,
        'X-Mailer' => 'PHP/' . phpversion()
    );
    
    // Convert headers array to string
    $header_string = '';
    foreach ($headers as $key => $value) {
        $header_string .= $key . ': ' . $value . "\r\n";
    }
    
    // Send email
    $mail_sent = mail($to, $subject, $email_body, $header_string);
    
    if ($mail_sent) {
        echo json_encode([
            'success' => true,
            'message' => 'Message envoyé avec succès'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Erreur lors de l\'envoi du message'
        ]);
    }
    
} catch (Exception $e) {
    error_log("Contact form error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur est survenue lors de l\'envoi du message'
    ]);
}
?>
