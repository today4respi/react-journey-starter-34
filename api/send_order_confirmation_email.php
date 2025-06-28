
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

function sendOrderConfirmationEmail($orderData) {
    $to = $orderData['customer_email'];
    $subject = "🎉 Confirmation de votre commande MyLittle - Commande #" . $orderData['order_number'];
    
    // Headers for HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: MyLittle <respizen@respizenmedical.com>" . "\r\n";
    $headers .= "Reply-To: respizen@respizenmedical.com" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Format children list
    $childrenList = '';
    foreach ($orderData['children'] as $child) {
        $childrenList .= '<div style="background: #f8fafc; border-radius: 8px; padding: 15px; margin: 10px 0; border-left: 4px solid #ff6b6b;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 20px; margin-right: 8px;">📚</span>
                <span style="font-weight: bold; color: #2d3748; font-size: 16px;">Livre pour ' . htmlspecialchars($child['name']) . '</span>
            </div>
            <div style="color: #4a5568; font-size: 14px; margin-left: 28px;">
                <div>Âge: ' . htmlspecialchars($child['age']) . ' ans</div>';
        
        if (!empty($child['objective'])) {
            $childrenList .= '<div>Objectif: ' . htmlspecialchars($child['objective']) . '</div>';
        }
        
        if (!empty($child['message'])) {
            $childrenList .= '<div>Message personnel: ' . htmlspecialchars($child['message']) . '</div>';
        }
        
        $childrenList .= '</div></div>';
    }

    // Plan details
    $planTitle = ($orderData['plan_type'] === 'subscription') ? 'Abonnement mensuel' : 'Paiement unique';
    $planPrice = ($orderData['plan_type'] === 'subscription') ? '22,49€' : '29,99€';

    // Beautiful HTML email template in French
    $message = '
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de commande MyLittle</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: linear-gradient(135deg, #87CEEB 0%, #FFB6C1 25%, #DDA0DD 50%, #98FB98 75%, #F0E68C 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); margin-top: 20px; margin-bottom: 20px;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981, #34d399, #6ee7b7); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 10px; left: 20px; width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%;"></div>
                <div style="position: absolute; top: 20px; right: 30px; width: 40px; height: 40px; background: rgba(255,255,255,0.3); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 15px; left: 50px; width: 30px; height: 30px; background: rgba(255,255,255,0.2); border-radius: 50%;"></div>
                
                <div style="background: rgba(255,255,255,0.2); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 40px;">✅</span>
                </div>
                <h1 style="color: white; font-size: 32px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); font-weight: bold;">Commande Confirmée !</h1>
                <p style="color: white; font-size: 18px; margin: 10px 0 0 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">Votre aventure magique va bientôt commencer</p>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #2d3748; font-size: 24px; margin: 0 0 15px 0; font-weight: bold;">Merci ' . htmlspecialchars($orderData['customer_name']) . ' ! 🎈</h2>
                    <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0;">
                        Nous avons bien reçu votre commande et nous commençons déjà à préparer les livres magiques pour vos enfants !
                    </p>
                </div>

                <!-- Order Summary -->
                <div style="background: linear-gradient(135deg, #fff5f5, #f0fff4); border-radius: 15px; padding: 25px; margin: 25px 0; border: 2px solid #10b981;">
                    <h3 style="color: #2d3748; font-size: 20px; margin: 0 0 20px 0; display: flex; align-items: center;">
                        <span style="font-size: 24px; margin-right: 10px;">📋</span>
                        Résumé de votre commande
                    </h3>
                    
                    <div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #10b981;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="font-weight: bold; color: #2d3748;">Numéro de commande:</span>
                            <span style="color: #10b981; font-weight: bold; font-family: monospace;">' . htmlspecialchars($orderData['order_number']) . '</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="font-weight: bold; color: #2d3748;">Plan sélectionné:</span>
                            <span style="color: #4a5568;">' . $planTitle . '</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="font-weight: bold; color: #2d3748;">Montant total:</span>
                            <span style="color: #10b981; font-weight: bold; font-size: 18px;">' . number_format($orderData['total_amount'], 2) . '€</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-weight: bold; color: #2d3748;">Date de commande:</span>
                            <span style="color: #4a5568;">' . date('d/m/Y à H:i') . '</span>
                        </div>
                    </div>
                </div>

                <!-- Children List -->
                <div style="margin: 30px 0;">
                    <h3 style="color: #2d3748; font-size: 20px; margin: 0 0 20px 0; display: flex; align-items: center;">
                        <span style="font-size: 24px; margin-right: 10px;">👶</span>
                        Livres commandés
                    </h3>
                    ' . $childrenList . '
                </div>

                <!-- Delivery Info -->
                <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #3b82f6;">
                    <h4 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
                        <span style="font-size: 20px; margin-right: 8px;">🚚</span>
                        Informations de livraison
                    </h4>
                    <div style="color: #4a5568; font-size: 14px; line-height: 1.6;">
                        <div><strong>Adresse:</strong> ' . htmlspecialchars($orderData['customer_address']) . '</div>
                        <div><strong>Ville:</strong> ' . htmlspecialchars($orderData['customer_city']) . '</div>
                        <div><strong>Code postal:</strong> ' . htmlspecialchars($orderData['customer_postal_code']) . '</div>
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #cbd5e0;">
                            <strong>Délai de livraison:</strong> 5-7 jours ouvrés<br>
                            <strong>Livraison:</strong> Gratuite partout en France
                        </div>
                    </div>
                </div>

                <!-- Next Steps -->
                <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                    <h4 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
                        <span style="font-size: 20px; margin-right: 8px;">⏰</span>
                        Prochaines étapes
                    </h4>
                    <div style="color: #4a5568; font-size: 14px; line-height: 1.8;">
                        <div style="margin-bottom: 8px;">✅ <strong>Confirmation reçue</strong> - Votre commande est validée</div>
                        <div style="margin-bottom: 8px;">🎨 <strong>Création en cours</strong> - Nos artistes préparent vos livres</div>
                        <div style="margin-bottom: 8px;">📦 <strong>Impression & emballage</strong> - Impression haute qualité</div>
                        <div>🚚 <strong>Expédition</strong> - Livraison sous 5-7 jours ouvrés</div>
                    </div>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 35px 0;">
                    <a href="https://mylittle.lovable.app/account" style="display: inline-block; background: linear-gradient(135deg, #10b981, #34d399); color: white; text-decoration: none; padding: 15px 35px; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 6px 20px rgba(16,185,129,0.3);">
                        📱 Suivre ma commande
                    </a>
                </div>

                <!-- Support -->
                <div style="background: #f7fafc; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
                    <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px;">💬 Questions ou préoccupations ?</h4>
                    <p style="color: #4a5568; margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                        Notre équipe est là pour vous ! N\'hésitez pas à nous contacter pour toute question concernant votre commande.
                    </p>
                    <p style="color: #4a5568; margin: 0; font-size: 14px;">
                        📧 <a href="mailto:respizen@respizenmedical.com" style="color: #10b981; text-decoration: none;">respizen@respizenmedical.com</a>
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div style="background: #2d3748; color: white; padding: 25px 30px; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">Merci de faire confiance à MyLittle ! 💝</p>
                <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.8;">
                    Votre commande #' . htmlspecialchars($orderData['order_number']) . ' sera traitée avec le plus grand soin
                </p>
                <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; margin-top: 15px;">
                    <p style="margin: 0; font-size: 12px; opacity: 0.7;">
                        © 2024 MyLittle - Tous droits réservés<br>
                        Cet email a été envoyé à ' . htmlspecialchars($orderData['customer_email']) . '
                    </p>
                </div>
            </div>
        </div>
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
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!empty($data)) {
        if (sendOrderConfirmationEmail($data)) {
            echo json_encode([
                'success' => true,
                'message' => 'Email de confirmation envoyé avec succès'
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
            'message' => 'Données de commande requises'
        ]);
    }
}
?>
