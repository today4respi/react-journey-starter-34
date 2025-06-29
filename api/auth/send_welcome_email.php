
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

function sendWelcomeEmail($userEmail, $userName) {
    $to = $userEmail;
    $subject = "🎉 Bienvenue dans l'univers magique de MyLittle - Votre aventure commence maintenant !";
    
    // Headers for HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: MyLittle <respizen@respizenmedical.com>" . "\r\n";
    $headers .= "Reply-To: respizen@respizenmedical.com" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Beautiful HTML email template in French
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
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 10px; left: 20px; width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; animation: float 3s ease-in-out infinite;"></div>
                <div style="position: absolute; top: 20px; right: 30px; width: 40px; height: 40px; background: rgba(255,255,255,0.3); border-radius: 50%; animation: float 4s ease-in-out infinite reverse;"></div>
                <div style="position: absolute; bottom: 15px; left: 50px; width: 30px; height: 30px; background: rgba(255,255,255,0.2); border-radius: 50%; animation: float 2s ease-in-out infinite;"></div>
                
                <h1 style="color: white; font-size: 48px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); font-weight: bold;">✨ MyLittle ✨</h1>
                <p style="color: white; font-size: 22px; margin: 10px 0 0 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">L\'aventure magique commence !</p>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #2d3748; font-size: 28px; margin: 0 0 15px 0; font-weight: bold;">Bonjour ' . htmlspecialchars($userName) . ' ! 🎈</h2>
                    <p style="color: #4a5568; font-size: 18px; line-height: 1.6; margin: 0;">
                        Félicitations ! Vous venez de rejoindre la grande famille <strong>MyLittle</strong> et nous sommes absolument ravis de vous accueillir ! 🎉
                    </p>
                </div>

                <!-- Welcome Message -->
                <div style="background: linear-gradient(135deg, #fff5f5, #f0fff4); border-radius: 15px; padding: 25px; margin: 25px 0; border-left: 5px solid #ff6b6b;">
                    <h3 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; display: flex; align-items: center;">
                        <span style="font-size: 24px; margin-right: 10px;">🌟</span>
                        Votre compte est maintenant actif !
                    </h3>
                    <p style="color: #4a5568; line-height: 1.6; margin: 0; font-size: 16px;">
                        Vous pouvez dès maintenant créer des livres personnalisés magiques pour vos enfants et leur offrir des histoires inoubliables où ils sont les héros ! 📚✨
                    </p>
                </div>

                <!-- Features -->
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

                <!-- CTA Button -->
                <div style="text-align: center; margin: 35px 0;">
                    <a href="https://mylittle.lovable.app" style="display: inline-block; background: linear-gradient(135deg, #ff6b6b, #feca57); color: white; text-decoration: none; padding: 15px 35px; border-radius: 25px; font-weight: bold; font-size: 18px; box-shadow: 0 6px 20px rgba(255,107,107,0.3); transition: transform 0.3s ease;">
                        🚀 Créer mon premier livre
                    </a>
                </div>

                <!-- Support -->
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

            <!-- Footer -->
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

        <style>
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
        </style>
    </body>
    </html>';

    if (mail($to, $subject, $message, $headers)) {
        return true;
    } else {
        return false;
    }
}

// Handle POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->email) && !empty($data->name)) {
        if (sendWelcomeEmail($data->email, $data->name)) {
            echo json_encode([
                'success' => true,
                'message' => 'Email de bienvenue envoyé avec succès'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi de l\'email'
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Email et nom requis'
        ]);
    }
}
?>
