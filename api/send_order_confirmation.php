
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

function sendOrderConfirmationEmail($orderData, $language = 'fr') {
    $to = $orderData['customer']['email'];
    
    // Set language-specific content
    if ($language === 'en') {
        $subject = "🎉 Order Confirmation - Luccy by E.Y - Order #" . $orderData['order_number'];
        $fromName = "Luccy by E.Y";
        $translations = [
            'title' => 'Order Confirmed!',
            'subtitle' => 'Your luxury journey begins now',
            'thank_you' => 'Thank you',
            'received_message' => 'We have received your order and are already preparing your luxury items!',
            'order_summary' => 'Order Summary',
            'order_number' => 'Order Number:',
            'order_date' => 'Order Date:',
            'payment_method' => 'Payment Method:',
            'total_amount' => 'Total Amount:',
            'items_ordered' => 'Items Ordered',
            'quantity' => 'Qty:',
            'price' => 'Price:',
            'size' => 'Size:',
            'color' => 'Color:',
            'delivery_info' => 'Delivery Information',
            'address' => 'Address:',
            'city' => 'City:',
            'postal_code' => 'Postal Code:',
            'country' => 'Country:',
            'delivery_time' => 'Delivery Time:',
            'delivery_cost' => 'Free delivery in Tunisia',
            'next_steps' => 'Next Steps',
            'step1' => 'Confirmation received - Your order is validated',
            'step2' => 'Preparation in progress - Our team prepares your items',
            'step3' => 'Quality control - Final inspection',
            'step4' => 'Shipping - Delivery within 3-5 business days',
            'track_order' => '📱 Track my order',
            'support_title' => '💬 Questions or concerns?',
            'support_message' => 'Our team is here for you! Feel free to contact us for any questions about your order.',
            'footer_thanks' => 'Thank you for trusting Luccy by E.Y! 💝',
            'footer_care' => 'will be processed with the utmost care',
            'footer_rights' => 'All rights reserved',
            'footer_sent' => 'This email was sent to'
        ];
    } else {
        $subject = "🎉 Confirmation de commande - Luccy by E.Y - Commande #" . $orderData['order_number'];
        $fromName = "Luccy by E.Y";
        $translations = [
            'title' => 'Commande Confirmée !',
            'subtitle' => 'Votre voyage de luxe commence maintenant',
            'thank_you' => 'Merci',
            'received_message' => 'Nous avons bien reçu votre commande et préparons déjà vos articles de luxe !',
            'order_summary' => 'Résumé de votre commande',
            'order_number' => 'Numéro de commande:',
            'order_date' => 'Date de commande:',
            'payment_method' => 'Mode de paiement:',
            'total_amount' => 'Montant total:',
            'items_ordered' => 'Articles commandés',
            'quantity' => 'Qté:',
            'price' => 'Prix:',
            'size' => 'Taille:',
            'color' => 'Couleur:',
            'delivery_info' => 'Informations de livraison',
            'address' => 'Adresse:',
            'city' => 'Ville:',
            'postal_code' => 'Code postal:',
            'country' => 'Pays:',
            'delivery_time' => 'Délai de livraison:',
            'delivery_cost' => 'Livraison gratuite en Tunisie',
            'next_steps' => 'Prochaines étapes',
            'step1' => 'Confirmation reçue - Votre commande est validée',
            'step2' => 'Préparation en cours - Notre équipe prépare vos articles',
            'step3' => 'Contrôle qualité - Inspection finale',
            'step4' => 'Expédition - Livraison sous 3-5 jours ouvrés',
            'track_order' => '📱 Suivre ma commande',
            'support_title' => '💬 Questions ou préoccupations ?',
            'support_message' => 'Notre équipe est là pour vous ! N\'hésitez pas à nous contacter pour toute question concernant votre commande.',
            'footer_thanks' => 'Merci de faire confiance à Luccy by E.Y ! 💝',
            'footer_care' => 'sera traitée avec le plus grand soin',
            'footer_rights' => 'Tous droits réservés',
            'footer_sent' => 'Cet email a été envoyé à'
        ];
    }
    
    // Headers for HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: " . $fromName . " <contact@draminesaid.com>" . "\r\n";
    $headers .= "Reply-To: contact@draminesaid.com" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Format items list
    $itemsList = '';
    foreach ($orderData['order']['items'] as $item) {
        $itemsList .= '<div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 15px 0; border-left: 5px solid #1f2937;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 24px; margin-right: 12px;">✨</span>
                <span style="font-weight: bold; color: #1f2937; font-size: 18px;">' . htmlspecialchars($item['nom_product']) . '</span>
            </div>
            <div style="color: #4b5563; font-size: 14px; margin-left: 36px; line-height: 1.6;">
                <div style="margin-bottom: 5px;"><strong>' . $translations['quantity'] . '</strong> ' . htmlspecialchars($item['quantity']) . '</div>
                <div style="margin-bottom: 5px;"><strong>' . $translations['price'] . '</strong> ' . number_format($item['price'], 2) . ' TND</div>';
        
        if (!empty($item['size'])) {
            $itemsList .= '<div style="margin-bottom: 5px;"><strong>' . $translations['size'] . '</strong> ' . htmlspecialchars($item['size']) . '</div>';
        }
        
        if (!empty($item['color'])) {
            $itemsList .= '<div style="margin-bottom: 5px;"><strong>' . $translations['color'] . '</strong> ' . htmlspecialchars($item['color']) . '</div>';
        }
        
        if (!empty($item['reference'])) {
            $itemsList .= '<div style="margin-bottom: 5px;"><strong>Ref:</strong> ' . htmlspecialchars($item['reference']) . '</div>';
        }
        
        $itemsList .= '</div></div>';
    }

    // Delivery address
    $deliveryAddress = '';
    if (isset($orderData['order']['delivery_address'])) {
        $delivery = $orderData['order']['delivery_address'];
        $deliveryAddress = '
        <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
                <span style="font-size: 20px; margin-right: 8px;">🚚</span>
                ' . $translations['delivery_info'] . '
            </h4>
            <div style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                <div><strong>' . $translations['address'] . '</strong> ' . htmlspecialchars($delivery['adresse']) . '</div>
                <div><strong>' . $translations['city'] . '</strong> ' . htmlspecialchars($delivery['ville']) . '</div>
                <div><strong>' . $translations['postal_code'] . '</strong> ' . htmlspecialchars($delivery['code_postal']) . '</div>
                <div><strong>' . $translations['country'] . '</strong> ' . htmlspecialchars($delivery['pays']) . '</div>';
        
        if (!empty($delivery['instructions'])) {
            $deliveryAddress .= '<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #cbd5e0;">
                <strong>Instructions:</strong> ' . htmlspecialchars($delivery['instructions']) . '</div>';
        }
        
        $deliveryAddress .= '
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #cbd5e0;">
                    <strong>' . $translations['delivery_time'] . '</strong> 3-5 ' . ($language === 'en' ? 'business days' : 'jours ouvrés') . '<br>
                    <strong>' . ($language === 'en' ? 'Delivery:' : 'Livraison:') . '</strong> ' . $translations['delivery_cost'] . '
                </div>
            </div>
        </div>';
    }

    // Payment method display
    $paymentMethod = $orderData['order']['payment_method'] ?? 'N/A';
    if ($paymentMethod === 'Cash on Delivery') {
        $paymentMethod = $language === 'en' ? 'Cash on Delivery' : 'Paiement à la livraison';
    } elseif ($paymentMethod === 'Test Payment') {
        $paymentMethod = $language === 'en' ? 'Test Payment' : 'Paiement test';
    } else {
        $paymentMethod = $language === 'en' ? 'Card Payment' : 'Paiement par carte';
    }

    // Beautiful HTML email template
    $message = '
    <!DOCTYPE html>
    <html lang="' . $language . '">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>' . $translations['title'] . '</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.15); margin-top: 20px; margin-bottom: 20px;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1f2937, #374151, #4b5563); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 10px; left: 20px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                <div style="position: absolute; top: 20px; right: 30px; width: 40px; height: 40px; background: rgba(255,255,255,0.15); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 15px; left: 50px; width: 30px; height: 30px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                
                <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 40px;">✅</span>
                </div>
                <h1 style="color: white; font-size: 32px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); font-weight: bold;">' . $translations['title'] . '</h1>
                <p style="color: white; font-size: 18px; margin: 10px 0 0 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.2); opacity: 0.9;">' . $translations['subtitle'] . '</p>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 15px 0; font-weight: bold;">' . $translations['thank_you'] . ' ' . htmlspecialchars($orderData['customer']['prenom'] . ' ' . $orderData['customer']['nom']) . ' ! 🎈</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0;">
                        ' . $translations['received_message'] . '
                    </p>
                </div>

                <!-- Order Summary -->
                <div style="background: linear-gradient(135deg, #f9fafb, #f3f4f6); border-radius: 15px; padding: 25px; margin: 25px 0; border: 2px solid #1f2937;">
                    <h3 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0; display: flex; align-items: center;">
                        <span style="font-size: 24px; margin-right: 10px;">📋</span>
                        ' . $translations['order_summary'] . '
                    </h3>
                    
                    <div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #1f2937; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="font-weight: bold; color: #1f2937;">' . $translations['order_number'] . '</span>
                            <span style="color: #1f2937; font-weight: bold; font-family: monospace;">' . htmlspecialchars($orderData['order_number']) . '</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="font-weight: bold; color: #1f2937;">' . $translations['order_date'] . '</span>
                            <span style="color: #4b5563;">' . date('d/m/Y \à H:i') . '</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="font-weight: bold; color: #1f2937;">' . $translations['payment_method'] . '</span>
                            <span style="color: #4b5563;">' . $paymentMethod . '</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                            <span style="font-weight: bold; color: #1f2937; font-size: 16px;">' . $translations['total_amount'] . '</span>
                            <span style="color: #1f2937; font-weight: bold; font-size: 20px;">' . number_format($orderData['order']['total_order'], 2) . ' TND</span>
                        </div>
                    </div>
                </div>

                <!-- Items List -->
                <div style="margin: 30px 0;">
                    <h3 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0; display: flex; align-items: center;">
                        <span style="font-size: 24px; margin-right: 10px;">🛍️</span>
                        ' . $translations['items_ordered'] . '
                    </h3>
                    ' . $itemsList . '
                </div>

                ' . $deliveryAddress . '

                <!-- Next Steps -->
                <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                    <h4 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
                        <span style="font-size: 20px; margin-right: 8px;">⏰</span>
                        ' . $translations['next_steps'] . '
                    </h4>
                    <div style="color: #4b5563; font-size: 14px; line-height: 1.8;">
                        <div style="margin-bottom: 8px;">✅ <strong>' . $translations['step1'] . '</strong></div>
                        <div style="margin-bottom: 8px;">🎨 <strong>' . $translations['step2'] . '</strong></div>
                        <div style="margin-bottom: 8px;">🔍 <strong>' . $translations['step3'] . '</strong></div>
                        <div>🚚 <strong>' . $translations['step4'] . '</strong></div>
                    </div>
                </div>

                <!-- Support -->
                <div style="background: #f9fafb; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
                    <h4 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">' . $translations['support_title'] . '</h4>
                    <p style="color: #4b5563; margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                        ' . $translations['support_message'] . '
                    </p>
                    <p style="color: #4b5563; margin: 0; font-size: 14px;">
                        📧 <a href="mailto:contact@draminesaid.com" style="color: #1f2937; text-decoration: none; font-weight: bold;">contact@draminesaid.com</a>
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div style="background: #1f2937; color: white; padding: 25px 30px; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">' . $translations['footer_thanks'] . '</p>
                <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.8;">
                    ' . ($language === 'en' ? 'Your order' : 'Votre commande') . ' #' . htmlspecialchars($orderData['order_number']) . ' ' . $translations['footer_care'] . '
                </p>
                <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; margin-top: 15px;">
                    <p style="margin: 0; font-size: 12px; opacity: 0.7;">
                        © ' . date('Y') . ' Luccy by E.Y - ' . $translations['footer_rights'] . '<br>
                        ' . $translations['footer_sent'] . ' ' . htmlspecialchars($orderData['customer']['email']) . '
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
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (!empty($input) && isset($input['customer']) && isset($input['order'])) {
        $language = isset($input['language']) ? $input['language'] : 'fr';
        
        if (sendOrderConfirmationEmail($input, $language)) {
            echo json_encode([
                'success' => true,
                'message' => $language === 'en' ? 'Confirmation email sent successfully' : 'Email de confirmation envoyé avec succès'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $language === 'en' ? 'Error sending confirmation email' : 'Erreur lors de l\'envoi de l\'email de confirmation'
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Order data required'
        ]);
    }
}
?>
