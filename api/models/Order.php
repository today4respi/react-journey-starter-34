<?php
class Order {
    private $conn;
    private $table = 'orders';

    public $id;
    public $user_id;
    public $order_number;
    public $plan_type;
    public $total_amount;
    public $currency;
    public $status;
    public $payment_intent_id;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get orders by user ID with order items
    public function getByUserId() {
        $query = "SELECT 
                    o.id, o.order_number, o.plan_type, o.total_amount, o.currency, 
                    o.status, o.payment_intent_id, o.created_at, o.updated_at,
                    oi.id as item_id, oi.child_id, oi.book_title, oi.book_description, oi.price,
                    c.name as child_name, c.age as child_age
                 FROM " . $this->table . " o
                 LEFT JOIN order_items oi ON o.id = oi.order_id
                 LEFT JOIN children c ON oi.child_id = c.id
                 WHERE o.user_id = :user_id 
                 ORDER BY o.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->execute();

        $results = $stmt->fetchAll();
        
        // Group orders with their items
        $orders = [];
        foreach ($results as $row) {
            $orderId = $row['id'];
            
            if (!isset($orders[$orderId])) {
                $orders[$orderId] = [
                    'id' => $row['id'],
                    'order_number' => $row['order_number'],
                    'plan_type' => $row['plan_type'],
                    'total_amount' => $row['total_amount'],
                    'currency' => $row['currency'],
                    'status' => $row['status'],
                    'payment_intent_id' => $row['payment_intent_id'],
                    'created_at' => $row['created_at'],
                    'updated_at' => $row['updated_at'],
                    'items' => []
                ];
            }
            
            if ($row['item_id']) {
                $orders[$orderId]['items'][] = [
                    'id' => $row['item_id'],
                    'child_id' => $row['child_id'],
                    'child_name' => $row['child_name'],
                    'child_age' => $row['child_age'],
                    'book_title' => $row['book_title'],
                    'book_description' => $row['book_description'],
                    'price' => $row['price']
                ];
            }
        }
        
        return array_values($orders);
    }

    // Get payment/order history for a user (orders table, subscription included if any)
    public function getPaymentsByUserId() {
        $query = "SELECT 
                    o.id, o.order_number, o.plan_type, o.total_amount, o.currency,
                    o.status, o.payment_intent_id, o.created_at, o.updated_at
                  FROM " . $this->table . " o
                  WHERE o.user_id = :user_id 
                  ORDER BY o.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->execute();
        $results = $stmt->fetchAll();
        // Optionally, you can format or enrich payments data here
        return $results;
    }
}
?>
