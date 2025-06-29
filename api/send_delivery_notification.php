
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

require_once 'config/Database.php';

function sendDeliveryNotificationEmail($customerEmail, $customerName, $orderNumber, $trackingUrl, $carrierName = '', $trackingNumber = '') {
    $to = $customerEmail;
    $subject = "📦 Votre commande MyLittle est en route ! - Commande N° " . $orderNumber;
    
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
        <title>Votre commande est en route !</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: linear-gradient(135deg, #87CEEB 0%, #FFB6C1 25%, #DDA0DD 50%, #98FB98 75%, #F0E68C 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); margin-top: 20px; margin-bottom: 20px;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 10px; left: 20px; width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; animation: float 3s ease-in-out infinite;"></div>
                <div style="position: absolute; top: 20px; right: 30px; width: 40px; height: 40px; background: rgba(255,255,255,0.3); border-radius: 50%; animation: float 4s ease-in-out infinite reverse;"></div>
                <div style="position: absolute; bottom: 15px; left: 50px; width: 30px; height: 30px; background: rgba(255,255,255,0.2); border-radius: 50%; animation: float 2s ease-in-out infinite;"></div>
                
                <h1 style="color: white; font-size: 48px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); font-weight: bold;">📦 MyLittle</h1>
                <p style="color: white; font-size: 22px; margin: 10px 0 0 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">Votre commande est en route !</p>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #2d3748; font-size: 28px; margin: 0 0 15px 0; font-weight: bold;">Bonjour ' . htmlspecialchars($customerName) . ' ! 🚛</h2>
                    <p style="color: #4a5568; font-size: 18px; line-height: 1.6; margin: 0;">
                        Excellente nouvelle ! Votre commande <strong>' . htmlspecialchars($orderNumber) . '</strong> vient d\'être expédiée et est maintenant en route vers vous ! 🎉
                    </p>
                </div>

                <!-- Order Status -->
                <div style="background: linear-gradient(135deg, #e6fffa, #f0fff4); border-radius: 15px; padding: 25px; margin: 25px 0; border-left: 5px solid #38b2ac;">
                    <h3 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; display: flex; align-items: center;">
                        <span style="font-size: 24px; margin-right: 10px;">🚚</span>
                        Votre commande est en livraison !
                    </h3>
                    <p style="color: #4a5568; line-height: 1.6; margin: 0 0 15px 0; font-size: 16px;">
                        Nous avons confié votre précieux colis à notre transporteur de confiance. Vous devriez le recevoir très bientôt !
                    </p>
                    <div style="background: white; border-radius: 10px; padding: 15px; border: 2px solid #38b2ac;">
                        <p style="margin: 0 0 8px 0; color: #2d3748; font-weight: bold;">📋 Numéro de commande: ' . htmlspecialchars($orderNumber) . '</p>
                        ' . ($carrierName ? '<p style="margin: 0 0 8px 0; color: #2d3748;"><strong>🚛 Transporteur:</strong> ' . htmlspecialchars($carrierName) . '</p>' : '') . '
                        ' . ($trackingNumber ? '<p style="margin: 0 0 8px 0; color: #2d3748;"><strong>📦 N° de suivi:</strong> ' . htmlspecialchars($trackingNumber) . '</p>' : '') . '
                    </div>
                </div>

                <!-- Track Package Button -->
                <div style="text-align: center; margin: 35px 0;">
                    <a href="' . htmlspecialchars($trackingUrl) . '" style="display: inline-block; background: linear-gradient(135deg, #38b2ac, #319795); color: white; text-decoration: none; padding: 15px 35px; border-radius: 25px; font-weight: bold; font-size: 18px; box-shadow: 0 6px 20px rgba(56,178,172,0.3); transition: transform 0.3s ease;">
                        🔍 Suivre mon colis
                    </a>
                    <p style="margin: 15px 0 0 0; font-size: 14px; color: #718096;">
                        Cliquez sur le bouton ci-dessus pour suivre votre colis en temps réel
                    </p>
                </div>

                <!-- Delivery Info -->
                <div style="background: #fff8e1; border-radius: 12px; padding: 20px; margin: 25px 0; border: 2px solid #ffc107;">
                    <h4 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
                        <span style="font-size: 20px; margin-right: 8px;">📋</span>
                        Informations de livraison
                    </h4>
                    <div style="color: #4a5568; font-size: 14px; line-height: 1.6;">
                        <p style="margin: 0 0 8px 0;">📅 <strong>Délai de livraison estimé:</strong> 2-5 jours ouvrés</p>
                        <p style="margin: 0 0 8px 0;">🏠 <strong>Mode de livraison:</strong> À votre domicile</p>
                        <p style="margin: 0 0 8px 0;">📞 <strong>En cas de problème:</strong> Contactez-nous directement</p>
                    </div>
                </div>

                <!-- What to expect -->
                <div style="background: #f0f4f8; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
                    <h4 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">🎁 Ce qui vous attend</h4>
                    <p style="color: #4a5568; margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                        Votre livre personnalisé MyLittle a été soigneusement emballé avec amour. Préparez-vous à voir les yeux de votre enfant s\'illuminer quand il découvrira qu\'il est le héros de sa propre histoire !
                    </p>
                    <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
                        <div style="text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 5px;">📚</div>
                            <div style="font-size: 12px; color: #718096;">Livre personnalisé</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 5px;">🎨</div>
                            <div style="font-size: 12px; color: #718096;">Qualité premium</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 5px;">💝</div>
                            <div style="font-size: 12px; color: #718096;">Emballage soigné</div>
                        </div>
                    </div>
                </div>

                <!-- Support -->
                <div style="background: #f7fafc; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
                    <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px;">💬 Besoin d\'aide ?</h4>
                    <p style="color: #4a5568; margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                        Notre équipe est là pour vous accompagner ! N\'hésitez pas à nous contacter si vous avez des questions sur votre livraison.
                    </p>
                    <p style="color: #4a5568; margin: 0; font-size: 14px;">
                        📧 <a href="mailto:respizen@respizenmedical.com" style="color: #ff6b6b; text-decoration: none;">respizen@respizenmedical.com</a>
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div style="background: #2d3748; color: white; padding: 25px 30px; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">Merci de faire confiance à MyLittle ! 🌟</p>
                <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.8;">
                    Nous espérons que cette livraison vous apportera autant de joie qu\'elle nous en a donné à préparer !
                </p>
                <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; margin-top: 15px;">
                    <p style="margin: 0; font-size: 12px; opacity: 0.7;">
                        © 2024 MyLittle - Tous droits réservés<br>
                        Cet email a été envoyé à ' . htmlspecialchars($customerEmail) . '
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
    
    if (!empty($data->customer_email) && !empty($data->customer_name) && !empty($data->order_number) && !empty($data->tracking_url)) {
        if (sendDeliveryNotificationEmail(
            $data->customer_email, 
            $data->customer_name, 
            $data->order_number, 
            $data->tracking_url,
            $data->carrier_name ?? '',
            $data->tracking_number ?? ''
        )) {
            echo json_encode([
                'success' => true,
                'message' => 'Email de notification de livraison envoyé avec succès'
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
            'message' => 'Email client, nom, numéro de commande et URL de suivi requis'
        ]);
    }
}
?>
