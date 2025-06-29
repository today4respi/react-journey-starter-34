
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

function sendWelcomeEmail($userEmail, $userName) {
    $to = $userEmail;
    $subject = "🎉 Bienvenue dans l'univers magique de MyLittle - Votre aventure commence maintenant !";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: MyLittle <respizen@respizenmedical.com>" . "\r\n";
    $headers .= "Reply-To: respizen@respizenmedical.com" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    $message = '
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue chez MyLittle</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: linear-gradient(135deg, #87CEEB 0%, #FFB6C1 25%, #DDA0DD 50%, #98FB98 75%, #F0E68C 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); margin-top: 20px; margin-bottom: 20px;">
            
            <div style="background: linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
                <h1 style="color: white; font-size: 48px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); font-weight: bold;">✨ MyLittle ✨</h1>
                <p style="color: white; font-size: 22px; margin: 10px 0 0 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">L\'aventure magique commence !</p>
            </div>

            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #2d3748; font-size: 28px; margin: 0 0 15px 0; font-weight: bold;">Bonjour ' . htmlspecialchars($userName) . ' ! 🎈</h2>
                    <p style="color: #4a5568; font-size: 18px; line-height: 1.6; margin: 0;">
                        Félicitations ! Vous venez de rejoindre la grande famille <strong>MyLittle</strong> et nous sommes absolument ravis de vous accueillir ! 🎉
                    </p>
                </div>

                <div style="background: linear-gradient(135deg, #fff5f5, #f0fff4); border-radius: 15px; padding: 25px; margin: 25px 0; border-left: 5px solid #ff6b6b;">
                    <h3 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; display: flex; align-items: center;">
                        <span style="font-size: 24px; margin-right: 10px;">🌟</span>
                        Votre compte est maintenant actif !
                    </h3>
                    <p style="color: #4a5568; line-height: 1.6; margin: 0; font-size: 16px;">
                        Vous pouvez dès maintenant créer des livres personnalisés magiques pour vos enfants et leur offrir des histoires inoubliables où ils sont les héros ! 📚✨
                    </p>
                </div>

                <div style="margin: 30px 0;">
                    <h3 style="color: #2d3748; font-size: 22px; text-align: center; margin: 0 0 25px 0;">Ce qui vous attend chez MyLittle :</h3>
                    
                    <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
                        <div style="background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); flex: 1; min-width: 200px; text-align: center; border: 2px solid #e2e8f0;">
                            <div style="font-size: 40px; margin-bottom: 10px;">📖</div>
                            <h4 style="color: #2d3748; margin: 0 0 8px 0; font-size: 16px;">Livres Personnalisés</h4>
                            <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.4;">Votre enfant devient le héros de son histoire</p>
                        </div>
                        
                        <div style="background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); flex: 1; min-width: 200px; text-align: center; border: 2px solid #e2e8f0;">
                            <div style="font-size: 40px; margin-bottom: 10px;">🎨</div>
                            <h4 style="color: #2d3748; margin: 0 0 8px 0; font-size: 16px;">Qualité Premium</h4>
                            <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.4;">Impression haute qualité et finitions soignées</p>
                        </div>
                        
                        <div style="background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); flex: 1; min-width: 200px; text-align: center; border: 2px solid #e2e8f0;">
                            <div style="font-size: 40px; margin-bottom: 10px;">🚚</div>
                            <h4 style="color: #2d3748; margin: 0 0 8px 0; font-size: 16px;">Livraison Gratuite</h4>
                            <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.4;">Livraison rapide partout en France</p>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; margin: 35px 0;">
                    <a href="https://mylittle.lovable.app" style="display: inline-block; background: linear-gradient(135deg, #ff6b6b, #feca57); color: white; text-decoration: none; padding: 15px 35px; border-radius: 25px; font-weight: bold; font-size: 18px; box-shadow: 0 6px 20px rgba(255,107,107,0.3);">
                        🚀 Créer mon premier livre
                    </a>
                </div>

                <div style="background: #f7fafc; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
                    <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px;">💬 Besoin d\'aide ?</h4>
                    <p style="color: #4a5568; margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                        Notre équipe est là pour vous accompagner ! N\'hésitez pas à nous contacter si vous avez des questions.
                    </p>
                    <p style="color: #4a5568; margin: 0; font-size: 14px;">
                        📧 <a href="mailto:respizen@respizenmedical.com" style="color: #ff6b6b; text-decoration: none;">respizen@respizenmedical.com</a>
                    </p>
                </div>
            </div>

            <div style="background: #2d3748; color: white; padding: 25px 30px; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">Merci de faire confiance à MyLittle ! 💝</p>
                <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.8;">
                    Ensemble, créons des souvenirs magiques pour vos enfants
                </p>
                <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; margin-top: 15px;">
                    <p style="margin: 0; font-size: 12px; opacity: 0.7;">
                        © 2024 MyLittle - Tous droits réservés<br>
                        Cet email a été envoyé à ' . htmlspecialchars($userEmail) . '
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>';

    return mail($to, $subject, $message, $headers);
}

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    // Check if user already exists
    $user->email = $data->email;
    
    if($user->emailExists()) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Un compte avec cet email existe déjà.'
        ]);
        exit;
    }

    // Generate UUID for user ID
    $user_id = bin2hex(random_bytes(16));
    $user_id = substr($user_id, 0, 8) . '-' . substr($user_id, 8, 4) . '-' . substr($user_id, 12, 4) . '-' . substr($user_id, 16, 4) . '-' . substr($user_id, 20, 12);

    // Set user properties
    $user->id = $user_id;
    $user->email = $data->email;
    $user->password_hash = $data->password;
    $user->first_name = isset($data->first_name) ? $data->first_name : '';
    $user->last_name = isset($data->last_name) ? $data->last_name : '';
    $user->phone = isset($data->phone) ? $data->phone : '';

    // Create user
    if($user->create()) {
        // Send welcome email
        $fullName = trim($user->first_name . ' ' . $user->last_name);
        if (empty($fullName)) {
            $fullName = 'Nouvel utilisateur';
        }
        
        $emailSent = sendWelcomeEmail($user->email, $fullName);
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Compte créé avec succès.',
            'email_sent' => $emailSent,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'phone' => $user->phone
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Erreur lors de la création du compte.'
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
