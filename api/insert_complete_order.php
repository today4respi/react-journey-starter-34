
<?php
require_once 'config.php';

// Function to save order to fallback text file
function saveToFallbackFile($orderData, $isSuccess = true, $errorMessage = '') {
    $fallbackFile = 'fallbackorders.txt';
    
    $timestamp = date('Y-m-d H:i:s');
    $status = $isSuccess ? 'SUCCESS' : 'FAILED';
    
    $logEntry = "\n=== ORDER LOG ===\n";
    $logEntry .= "Timestamp: {$timestamp}\n";
    $logEntry .= "Status: {$status}\n";
    
    if (!$isSuccess && $errorMessage) {
        $logEntry .= "Error: {$errorMessage}\n";
    }
    
    $logEntry .= "Customer Data:\n";
    if (isset($orderData['customer'])) {
        $customer = $orderData['customer'];
        $logEntry .= "  - Name: {$customer['prenom']} {$customer['nom']}\n";
        $logEntry .= "  - Email: {$customer['email']}\n";
        $logEntry .= "  - Phone: {$customer['telephone']}\n";
        $logEntry .= "  - Address: {$customer['adresse']}, {$customer['ville']}, {$customer['code_postal']}, {$customer['pays']}\n";
    }
    
    $logEntry .= "Order Data:\n";
    if (isset($orderData['order'])) {
        $order = $orderData['order'];
        $logEntry .= "  - Total: {$order['total_order']} TND\n";
        $logEntry .= "  - Payment Method: " . ($order['payment_method'] ?? 'N/A') . "\n";
        $logEntry .= "  - Status: " . ($order['status'] ?? 'pending') . "\n";
        
        if (isset($order['items']) && is_array($order['items'])) {
            $logEntry .= "  - Items:\n";
            foreach ($order['items'] as $item) {
                $logEntry .= "    * {$item['nom_product']} - Qty: {$item['quantity']} - Price: {$item['price']} TND\n";
                if (isset($item['size'])) $logEntry .= "      Size: {$item['size']}\n";
                if (isset($item['color'])) $logEntry .= "      Color: {$item['color']}\n";
            }
        }
        
        if (isset($order['delivery_address'])) {
            $delivery = $order['delivery_address'];
            $logEntry .= "  - Delivery Address: {$delivery['adresse']}, {$delivery['ville']}, {$delivery['code_postal']}, {$delivery['pays']}\n";
        }
        
        if (isset($order['notes'])) {
            $logEntry .= "  - Notes: {$order['notes']}\n";
        }
    }
    
    $logEntry .= "Raw JSON: " . json_encode($orderData, JSON_PRETTY_PRINT) . "\n";
    $logEntry .= "===================\n\n";
    
    // Append to file (create if doesn't exist)
    file_put_contents($fallbackFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// Function to send confirmation email
function sendConfirmationEmail($orderData, $orderNumber, $language = 'fr') {
    try {
        // Prepare email data
        $emailData = [
            'customer' => $orderData['customer'],
            'order' => $orderData['order'],
            'order_number' => $orderNumber,
            'language' => $language
        ];
        
        // Call email service
        $emailUrl = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/send_order_confirmation.php';
        
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => 'Content-Type: application/json',
                'content' => json_encode($emailData),
                'timeout' => 10
            ]
        ]);
        
        $result = file_get_contents($emailUrl, false, $context);
        
        if ($result !== false) {
            $response = json_decode($result, true);
            return $response && isset($response['success']) && $response['success'];
        }
        
        return false;
    } catch (Exception $e) {
        error_log("Email sending failed: " . $e->getMessage());
        return false;
    }
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Handle payment confirmation from success page
    if (isset($input['action']) && $input['action'] === 'confirm_payment') {
        if (isset($input['payment_ref']) && isset($input['order_id'])) {
            try {
                // Update payment status for successful payment
                $updatePaymentQuery = "
                    UPDATE orders 
                    SET payment_status = 'paid',
                        payment_link_konnekt = :payment_ref,
                        status_order = 'confirmed',
                        date_confirmation_order = CURRENT_TIMESTAMP
                    WHERE numero_commande = :order_id
                ";
                
                $updateStmt = $db->prepare($updatePaymentQuery);
                $updateStmt->bindParam(':payment_ref', $input['payment_ref']);
                $updateStmt->bindParam(':order_id', $input['order_id']);
                $updateStmt->execute();
                
                // Log payment success to fallback file
                $paymentData = [
                    'payment_ref' => $input['payment_ref'],
                    'order_id' => $input['order_id'],
                    'action' => 'payment_confirmation_from_frontend'
                ];
                saveToFallbackFile($paymentData, true);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Payment confirmed successfully'
                ]);
                exit;
                
            } catch (Exception $e) {
                saveToFallbackFile($input, false, "Payment confirmation failed: " . $e->getMessage());
                throw $e;
            }
        }
    }
    
    // Handle payment success callback from Konnect (original webhook handler)
    if (isset($input['payment_ref']) && isset($input['order_id']) && !isset($input['action'])) {
        try {
            // Update payment status for successful payment
            $updatePaymentQuery = "
                UPDATE orders 
                SET payment_status = 'paid',
                    payment_link_konnekt = :payment_ref,
                    status_order = 'confirmed',
                    date_confirmation_order = CURRENT_TIMESTAMP
                WHERE numero_commande = :order_id
            ";
            
            $updateStmt = $db->prepare($updatePaymentQuery);
            $updateStmt->bindParam(':payment_ref', $input['payment_ref']);
            $updateStmt->bindParam(':order_id', $input['order_id']);
            $updateStmt->execute();
            
            // Log payment success to fallback file
            $paymentData = [
                'payment_ref' => $input['payment_ref'],
                'order_id' => $input['order_id'],
                'action' => 'payment_success_webhook'
            ];
            saveToFallbackFile($paymentData, true);
            
            echo json_encode([
                'success' => true,
                'message' => 'Payment status updated successfully'
            ]);
            exit;
            
        } catch (Exception $e) {
            saveToFallbackFile($input, false, "Payment update failed: " . $e->getMessage());
            throw $e;
        }
    }
    
    // Validate required fields for new order
    $requiredFields = [
        'customer' => ['nom', 'prenom', 'email', 'telephone', 'adresse', 'ville', 'code_postal', 'pays'],
        'order' => ['items', 'total_order'],
        'items' => [] // Will be validated separately
    ];
    
    if (!isset($input['customer']) || !isset($input['order'])) {
        throw new Exception('Customer and order information are required');
    }
    
    $customer = $input['customer'];
    $orderData = $input['order'];
    $language = isset($input['language']) ? $input['language'] : 'fr';
    
    // Validate customer fields
    foreach ($requiredFields['customer'] as $field) {
        if (!isset($customer[$field]) || empty($customer[$field])) {
            throw new Exception("Customer field '$field' is required");
        }
    }
    
    // Validate order fields
    if (!isset($orderData['items']) || empty($orderData['items'])) {
        throw new Exception('Order must contain at least one item');
    }
    
    // Start transaction
    $db->beginTransaction();
    
    try {
        // Check if customer exists by email
        $checkCustomerQuery = "SELECT id_customer FROM customers WHERE email_customer = :email";
        $checkCustomerStmt = $db->prepare($checkCustomerQuery);
        $checkCustomerStmt->bindParam(':email', $customer['email']);
        $checkCustomerStmt->execute();
        $existingCustomer = $checkCustomerStmt->fetch();
        
        if ($existingCustomer) {
            $customerId = $existingCustomer['id_customer'];
            
            // Update customer information
            $updateCustomerQuery = "
                UPDATE customers 
                SET nom_customer = :nom,
                    prenom_customer = :prenom,
                    telephone_customer = :telephone,
                    adresse_customer = :adresse,
                    ville_customer = :ville,
                    code_postal_customer = :code_postal,
                    pays_customer = :pays,
                    date_modification_customer = CURRENT_TIMESTAMP
                WHERE id_customer = :id
            ";
            
            $updateCustomerStmt = $db->prepare($updateCustomerQuery);
            $updateCustomerStmt->bindParam(':nom', $customer['nom']);
            $updateCustomerStmt->bindParam(':prenom', $customer['prenom']);
            $updateCustomerStmt->bindParam(':telephone', $customer['telephone']);
            $updateCustomerStmt->bindParam(':adresse', $customer['adresse']);
            $updateCustomerStmt->bindParam(':ville', $customer['ville']);
            $updateCustomerStmt->bindParam(':code_postal', $customer['code_postal']);
            $updateCustomerStmt->bindParam(':pays', $customer['pays']);
            $updateCustomerStmt->bindParam(':id', $customerId);
            $updateCustomerStmt->execute();
        } else {
            // Insert new customer
            $insertCustomerQuery = "
                INSERT INTO customers (
                    nom_customer,
                    prenom_customer,
                    email_customer,
                    telephone_customer,
                    adresse_customer,
                    ville_customer,
                    code_postal_customer,
                    pays_customer
                ) VALUES (
                    :nom,
                    :prenom,
                    :email,
                    :telephone,
                    :adresse,
                    :ville,
                    :code_postal,
                    :pays
                )
            ";
            
            $insertCustomerStmt = $db->prepare($insertCustomerQuery);
            $insertCustomerStmt->bindParam(':nom', $customer['nom']);
            $insertCustomerStmt->bindParam(':prenom', $customer['prenom']);
            $insertCustomerStmt->bindParam(':email', $customer['email']);
            $insertCustomerStmt->bindParam(':telephone', $customer['telephone']);
            $insertCustomerStmt->bindParam(':adresse', $customer['adresse']);
            $insertCustomerStmt->bindParam(':ville', $customer['ville']);
            $insertCustomerStmt->bindParam(':code_postal', $customer['code_postal']);
            $insertCustomerStmt->bindParam(':pays', $customer['pays']);
            
            if (!$insertCustomerStmt->execute()) {
                throw new Exception('Failed to insert customer');
            }
            
            $customerId = $db->lastInsertId();
        }
        
        // Generate order number
        $orderNumber = 'CMD-' . date('Y') . '-' . str_pad($customerId . time(), 6, '0', STR_PAD_LEFT);
        
        // Insert order
        $sousTotal = isset($orderData['sous_total']) ? $orderData['sous_total'] : 0;
        $discountAmount = isset($orderData['discount_amount']) ? $orderData['discount_amount'] : 0;
        $discountPercentage = isset($orderData['discount_percentage']) ? $orderData['discount_percentage'] : 0;
        $deliveryCost = isset($orderData['delivery_cost']) ? $orderData['delivery_cost'] : 0;
        $totalOrder = $orderData['total_order'];
        $status = isset($orderData['status']) ? $orderData['status'] : 'pending';
        $paymentMethod = isset($orderData['payment_method']) ? $orderData['payment_method'] : null;
        $notes = isset($orderData['notes']) ? $orderData['notes'] : null;
        
        // Determine order status based on payment method
        $status = isset($orderData['status']) ? $orderData['status'] : 'pending';
        $paymentStatus = 'pending';
        
        // Set appropriate status based on payment method
        if (isset($orderData['payment_method'])) {
            switch ($orderData['payment_method']) {
                case 'Cash on Delivery':
                    $status = 'pending_cash_payment';
                    $paymentStatus = 'pending_cash';
                    break;
                case 'Test Payment':
                    $status = 'confirmed';
                    $paymentStatus = 'test_payment';
                    break;
                case 'Konnect':
                default:
                    $status = 'pending';
                    $paymentStatus = 'pending';
                    break;
            }
        }
        
        $insertOrderQuery = "
            INSERT INTO orders (
                id_customer,
                numero_commande,
                sous_total_order,
                discount_amount_order,
                discount_percentage_order,
                delivery_cost_order,
                total_order,
                status_order,
                payment_method,
                payment_status,
                notes_order,
                vue_par_admin
            ) VALUES (
                :customer_id,
                :numero_commande,
                :sous_total,
                :discount_amount,
                :discount_percentage,
                :delivery_cost,
                :total_order,
                :status,
                :payment_method,
                :payment_status,
                :notes,
                0
            )
        ";
        
        $insertOrderStmt = $db->prepare($insertOrderQuery);
        $insertOrderStmt->bindParam(':customer_id', $customerId);
        $insertOrderStmt->bindParam(':numero_commande', $orderNumber);
        $insertOrderStmt->bindParam(':sous_total', $sousTotal);
        $insertOrderStmt->bindParam(':discount_amount', $discountAmount);
        $insertOrderStmt->bindParam(':discount_percentage', $discountPercentage);
        $insertOrderStmt->bindParam(':delivery_cost', $deliveryCost);
        $insertOrderStmt->bindParam(':total_order', $totalOrder);
        $insertOrderStmt->bindParam(':status', $status);
        $insertOrderStmt->bindParam(':payment_method', $paymentMethod);
        $insertOrderStmt->bindParam(':payment_status', $paymentStatus);
        $insertOrderStmt->bindParam(':notes', $notes);
        
        if (!$insertOrderStmt->execute()) {
            throw new Exception('Failed to insert order');
        }
        
        $orderId = $db->lastInsertId();
        
        // Insert order items
        foreach ($orderData['items'] as $item) {
            if (!isset($item['nom_product']) || !isset($item['price']) || !isset($item['quantity'])) {
                throw new Exception('Each item must have nom_product, price, and quantity');
            }
            
            $reference = isset($item['reference']) ? $item['reference'] : '';
            $size = isset($item['size']) ? $item['size'] : null;
            $color = isset($item['color']) ? $item['color'] : null;
            $quantity = $item['quantity'];
            $price = $item['price'];
            $discount = isset($item['discount']) ? $item['discount'] : 0;
            $subtotal = $quantity * $price;
            $total = $subtotal - $discount;
            
            $insertItemQuery = "
                INSERT INTO order_items (
                    id_order,
                    id_product,
                    nom_product_snapshot,
                    reference_product_snapshot,
                    price_product_snapshot,
                    size_selected,
                    color_selected,
                    quantity_ordered,
                    subtotal_item,
                    discount_item,
                    total_item
                ) VALUES (
                    :order_id,
                    :product_id,
                    :nom_product,
                    :reference,
                    :price,
                    :size,
                    :color,
                    :quantity,
                    :subtotal,
                    :discount,
                    :total
                )
            ";
            
            $insertItemStmt = $db->prepare($insertItemQuery);
            $insertItemStmt->bindParam(':order_id', $orderId);
            $insertItemStmt->bindParam(':product_id', isset($item['product_id']) ? $item['product_id'] : null);
            $insertItemStmt->bindParam(':nom_product', $item['nom_product']);
            $insertItemStmt->bindParam(':reference', $reference);
            $insertItemStmt->bindParam(':price', $price);
            $insertItemStmt->bindParam(':size', $size);
            $insertItemStmt->bindParam(':color', $color);
            $insertItemStmt->bindParam(':quantity', $quantity);
            $insertItemStmt->bindParam(':subtotal', $subtotal);
            $insertItemStmt->bindParam(':discount', $discount);
            $insertItemStmt->bindParam(':total', $total);
            
            if (!$insertItemStmt->execute()) {
                throw new Exception('Failed to insert order item');
            }
        }
        
        // Insert delivery address if different from customer address
        if (isset($orderData['delivery_address'])) {
            $delivery = $orderData['delivery_address'];
            
            $insertDeliveryQuery = "
                INSERT INTO delivery_addresses (
                    id_order,
                    nom_destinataire,
                    prenom_destinataire,
                    telephone_destinataire,
                    adresse_livraison,
                    ville_livraison,
                    code_postal_livraison,
                    pays_livraison,
                    instructions_livraison
                ) VALUES (
                    :order_id,
                    :nom,
                    :prenom,
                    :telephone,
                    :adresse,
                    :ville,
                    :code_postal,
                    :pays,
                    :instructions
                )
            ";
            
            $insertDeliveryStmt = $db->prepare($insertDeliveryQuery);
            $insertDeliveryStmt->bindParam(':order_id', $orderId);
            $insertDeliveryStmt->bindParam(':nom', $delivery['nom']);
            $insertDeliveryStmt->bindParam(':prenom', $delivery['prenom']);
            $insertDeliveryStmt->bindParam(':telephone', isset($delivery['telephone']) ? $delivery['telephone'] : null);
            $insertDeliveryStmt->bindParam(':adresse', $delivery['adresse']);
            $insertDeliveryStmt->bindParam(':ville', $delivery['ville']);
            $insertDeliveryStmt->bindParam(':code_postal', $delivery['code_postal']);
            $insertDeliveryStmt->bindParam(':pays', $delivery['pays']);
            $insertDeliveryStmt->bindParam(':instructions', isset($delivery['instructions']) ? $delivery['instructions'] : null);
            
            $insertDeliveryStmt->execute();
        }
        
        $db->commit();
        
        // Save successful order to fallback file
        $successData = $input;
        $successData['generated_order_id'] = $orderId;
        $successData['generated_order_number'] = $orderNumber;
        $successData['generated_customer_id'] = $customerId;
        saveToFallbackFile($successData, true);
        
        // Send confirmation email (non-blocking)
        $emailSent = sendConfirmationEmail($input, $orderNumber, $language);
        
        echo json_encode([
            'success' => true,
            'message' => 'Order created successfully',
            'order_id' => $orderId,
            'customer_id' => $customerId,
            'order_number' => $orderNumber,
            'email_sent' => $emailSent
        ]);
        
    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    // Save failed order to fallback file
    saveToFallbackFile($input ?? [], false, $e->getMessage());
    
    echo json_encode([
        'success' => false,
        'message' => 'Error creating order: ' . $e->getMessage()
    ]);
}
?>
