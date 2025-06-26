
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get today's date
    $today = date('Y-m-d');
    $startOfToday = $today . ' 00:00:00';
    $endOfToday = $today . ' 23:59:59';
    
    // Orders statistics
    $ordersToday = $db->prepare("
        SELECT COUNT(*) as count 
        FROM orders 
        WHERE DATE(date_creation_order) = :today
    ");
    $ordersToday->bindParam(':today', $today);
    $ordersToday->execute();
    $ordersTodayCount = $ordersToday->fetch()['count'];
    
    $ordersTotal = $db->prepare("SELECT COUNT(*) as count FROM orders");
    $ordersTotal->execute();
    $ordersTotalCount = $ordersTotal->fetch()['count'];
    
    // Revenue statistics
    $revenueToday = $db->prepare("
        SELECT COALESCE(SUM(total_order), 0) as total 
        FROM orders 
        WHERE DATE(date_creation_order) = :today 
        AND payment_status = 'paid'
    ");
    $revenueToday->bindParam(':today', $today);
    $revenueToday->execute();
    $revenueTodayAmount = $revenueToday->fetch()['total'];
    
    $revenueTotal = $db->prepare("
        SELECT COALESCE(SUM(total_order), 0) as total 
        FROM orders 
        WHERE payment_status = 'paid'
    ");
    $revenueTotal->execute();
    $revenueTotalAmount = $revenueTotal->fetch()['total'];
    
    // Visitors statistics
    $visitorsToday = $db->prepare("
        SELECT COUNT(DISTINCT ip_address) as count 
        FROM visitor_tracking 
        WHERE DATE(visit_date) = :today
    ");
    $visitorsToday->bindParam(':today', $today);
    $visitorsToday->execute();
    $visitorsTodayCount = $visitorsToday->fetch()['count'];
    
    $visitorsTotal = $db->prepare("
        SELECT COUNT(DISTINCT ip_address) as count 
        FROM visitor_tracking
    ");
    $visitorsTotal->execute();
    $visitorsTotalCount = $visitorsTotal->fetch()['count'];
    
    // Newsletter subscribers
    $newsletterSubscribers = $db->prepare("
        SELECT COUNT(*) as count 
        FROM newsletter_subscribers 
        WHERE status_subscriber = 'active'
    ");
    $newsletterSubscribers->execute();
    $newsletterCount = $newsletterSubscribers->fetch()['count'];
    
    // Recent orders
    $recentOrders = $db->prepare("
        SELECT o.id_order, o.numero_commande, o.total_order, o.status_order,
               CONCAT(c.prenom_customer, ' ', c.nom_customer) as customer_name,
               TIME(o.date_creation_order) as order_time
        FROM orders o
        JOIN customers c ON o.id_customer = c.id_customer
        WHERE DATE(o.date_creation_order) = :today
        ORDER BY o.date_creation_order DESC
        LIMIT 5
    ");
    $recentOrders->bindParam(':today', $today);
    $recentOrders->execute();
    $recentOrdersList = $recentOrders->fetchAll();
    
    // Monthly chart data (last 6 months)
    $chartData = [];
    for ($i = 5; $i >= 0; $i--) {
        $monthStart = date('Y-m-01', strtotime("-$i months"));
        $monthEnd = date('Y-m-t', strtotime("-$i months"));
        $monthName = date('M', strtotime("-$i months"));
        
        $monthOrders = $db->prepare("
            SELECT COUNT(*) as orders, COALESCE(SUM(total_order), 0) as revenue
            FROM orders 
            WHERE date_creation_order BETWEEN :start AND :end
            AND payment_status = 'paid'
        ");
        $monthOrders->bindParam(':start', $monthStart);
        $monthOrders->bindParam(':end', $monthEnd . ' 23:59:59');
        $monthOrders->execute();
        $monthData = $monthOrders->fetch();
        
        $chartData[] = [
            'name' => $monthName,
            'orders' => (int)$monthData['orders'],
            'revenue' => (float)$monthData['revenue']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => [
            'ordersToday' => (int)$ordersTodayCount,
            'ordersTotal' => (int)$ordersTotalCount,
            'revenueToday' => (float)$revenueTodayAmount,
            'revenueTotal' => (float)$revenueTotalAmount,
            'visitorsToday' => (int)$visitorsTodayCount,
            'visitorsTotal' => (int)$visitorsTotalCount,
            'newsletterSubscribers' => (int)$newsletterCount,
            'recentOrders' => $recentOrdersList,
            'chartData' => $chartData
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error retrieving statistics: ' . $e->getMessage()
    ]);
}
?>
