
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
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
        
        echo json_encode([
            'success' => true,
            'message' => 'Order created successfully',
            'order_id' => $orderId,
            'customer_id' => $customerId,
            'order_number' => $orderNumber
        ]);
        
    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error creating order: ' . $e->getMessage()
    ]);
}
?>
