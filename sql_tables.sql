
-- Create products table with all specified fields
CREATE TABLE IF NOT EXISTS `products` (
  `id_product` int(11) NOT NULL AUTO_INCREMENT,
  `reference_product` varchar(100) NOT NULL,
  `nom_product` varchar(255) NOT NULL,
  `img_product` varchar(500) DEFAULT NULL,
  `img2_product` varchar(500) DEFAULT NULL,
  `img3_product` varchar(500) DEFAULT NULL,
  `img4_product` varchar(500) DEFAULT NULL,
  `description_product` text,
  `type_product` varchar(100) DEFAULT NULL,
  `category_product` varchar(100) DEFAULT NULL,
  `itemgroup_product` varchar(100) DEFAULT NULL,
  `price_product` decimal(10,2) NOT NULL,
  `qnty_product` int(11) DEFAULT 0,
  `3xl_size` int(11) DEFAULT 0,
  `s_size` int(11) DEFAULT 0,
  `xs_size` int(11) DEFAULT 0,
  `4xl_size` int(11) DEFAULT 0,
  `m_size` int(11) DEFAULT 0,
  `l_size` int(11) DEFAULT 0,
  `xl_size` int(11) DEFAULT 0,
  `xxl_size` int(11) DEFAULT 0,
  `color_product` varchar(100) DEFAULT NULL,
  `status_product` enum('active','inactive','draft') DEFAULT 'active',
  `related_products` text,
  `discount_product` decimal(5,2) DEFAULT 0.00,
  `createdate_product` timestamp DEFAULT CURRENT_TIMESTAMP,
  `48_size` int(11) DEFAULT 0,
  `50_size` int(11) DEFAULT 0,
  `52_size` int(11) DEFAULT 0,
  `54_size` int(11) DEFAULT 0,
  `56_size` int(11) DEFAULT 0,
  `58_size` int(11) DEFAULT 0,
  PRIMARY KEY (`id_product`),
  KEY `idx_category` (`category_product`),
  KEY `idx_status` (`status_product`),
  KEY `idx_reference` (`reference_product`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create reservations table for private measure appointments
CREATE TABLE IF NOT EXISTS `reservations` (
  `id_reservation` int(11) NOT NULL AUTO_INCREMENT,
  `nom_client` varchar(255) NOT NULL,
  `email_client` varchar(255) NOT NULL,
  `telephone_client` varchar(20) NOT NULL,
  `date_reservation` date NOT NULL,
  `heure_reservation` time NOT NULL,
  `statut_reservation` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `notes_reservation` text,
  `date_creation` timestamp DEFAULT CURRENT_TIMESTAMP,
  `date_confirmation` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_reservation`),
  KEY `idx_date` (`date_reservation`),
  KEY `idx_statut` (`statut_reservation`),
  KEY `idx_email` (`email_client`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create customers table for order management (removed status field)
CREATE TABLE IF NOT EXISTS `customers` (
  `id_customer` int(11) NOT NULL AUTO_INCREMENT,
  `nom_customer` varchar(255) NOT NULL,
  `prenom_customer` varchar(255) NOT NULL,
  `email_customer` varchar(255) NOT NULL,
  `telephone_customer` varchar(20) NOT NULL,
  `adresse_customer` text NOT NULL,
  `ville_customer` varchar(100) NOT NULL,
  `code_postal_customer` varchar(20) NOT NULL,
  `pays_customer` varchar(100) NOT NULL,
  `date_creation_customer` timestamp DEFAULT CURRENT_TIMESTAMP,
  `date_modification_customer` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_customer`),
  UNIQUE KEY `idx_email_customer` (`email_customer`),
  KEY `idx_nom_customer` (`nom_customer`),
  KEY `idx_prenom_customer` (`prenom_customer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create orders table with vue/not vue functionality
CREATE TABLE IF NOT EXISTS `orders` (
  `id_order` int(11) NOT NULL AUTO_INCREMENT,
  `id_customer` int(11) NOT NULL,
  `numero_commande` varchar(50) NOT NULL UNIQUE,
  `sous_total_order` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount_order` decimal(10,2) DEFAULT 0.00,
  `discount_percentage_order` decimal(5,2) DEFAULT 0.00,
  `delivery_cost_order` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_order` decimal(10,2) NOT NULL,
  `status_order` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
  `date_livraison_souhaitee` date DEFAULT NULL,
  `payment_link_konnekt` varchar(500) DEFAULT NULL,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `payment_method` varchar(100) DEFAULT NULL,
  `notes_order` text,
  `vue_par_admin` tinyint(1) DEFAULT 0 COMMENT 'Track if order has been viewed by admin (0 = not viewed, 1 = viewed)',
  `date_vue_admin` timestamp NULL DEFAULT NULL COMMENT 'Date when admin first viewed the order',
  `date_creation_order` timestamp DEFAULT CURRENT_TIMESTAMP,
  `date_modification_order` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `date_confirmation_order` timestamp NULL DEFAULT NULL,
  `date_livraison_order` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_order`),
  FOREIGN KEY (`id_customer`) REFERENCES `customers`(`id_customer`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `idx_numero_commande` (`numero_commande`),
  KEY `idx_status_order` (`status_order`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_date_creation_order` (`date_creation_order`),
  KEY `idx_vue_par_admin` (`vue_par_admin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order_items table for products in each order
CREATE TABLE IF NOT EXISTS `order_items` (
  `id_order_item` int(11) NOT NULL AUTO_INCREMENT,
  `id_order` int(11) NOT NULL,
  `id_product` int(11) NOT NULL,
  `nom_product_snapshot` varchar(255) NOT NULL,
  `reference_product_snapshot` varchar(100) NOT NULL,
  `price_product_snapshot` decimal(10,2) NOT NULL,
  `size_selected` varchar(20) DEFAULT NULL,
  `color_selected` varchar(100) DEFAULT NULL,
  `quantity_ordered` int(11) NOT NULL DEFAULT 1,
  `subtotal_item` decimal(10,2) NOT NULL,
  `discount_item` decimal(10,2) DEFAULT 0.00,
  `total_item` decimal(10,2) NOT NULL,
  `date_creation_item` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_order_item`),
  FOREIGN KEY (`id_order`) REFERENCES `orders`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`id_product`) REFERENCES `products`(`id_product`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `idx_order_item` (`id_order`),
  KEY `idx_product_item` (`id_product`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order_tracking table for order status history
CREATE TABLE IF NOT EXISTS `order_tracking` (
  `id_tracking` int(11) NOT NULL AUTO_INCREMENT,
  `id_order` int(11) NOT NULL,
  `status_previous` varchar(50) DEFAULT NULL,
  `status_new` varchar(50) NOT NULL,
  `notes_tracking` text,
  `date_tracking` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_tracking`),
  FOREIGN KEY (`id_order`) REFERENCES `orders`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `idx_order_tracking` (`id_order`),
  KEY `idx_date_tracking` (`date_tracking`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create delivery_addresses table (for cases where delivery address differs from customer address)
CREATE TABLE IF NOT EXISTS `delivery_addresses` (
  `id_delivery_address` int(11) NOT NULL AUTO_INCREMENT,
  `id_order` int(11) NOT NULL,
  `nom_destinataire` varchar(255) NOT NULL,
  `prenom_destinataire` varchar(255) NOT NULL,
  `telephone_destinataire` varchar(20) DEFAULT NULL,
  `adresse_livraison` text NOT NULL,
  `ville_livraison` varchar(100) NOT NULL,
  `code_postal_livraison` varchar(20) NOT NULL,
  `pays_livraison` varchar(100) NOT NULL,
  `instructions_livraison` text,
  `date_creation_delivery` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_delivery_address`),
  FOREIGN KEY (`id_order`) REFERENCES `orders`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `idx_order_delivery` (`id_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create simplified newsletter_subscribers table for email subscriptions
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id_subscriber` int(11) NOT NULL AUTO_INCREMENT,
  `email_subscriber` varchar(255) NOT NULL,
  `nom_subscriber` varchar(255) DEFAULT NULL,
  `prenom_subscriber` varchar(255) DEFAULT NULL,
  `status_subscriber` enum('active','unsubscribed','bounced','pending') DEFAULT 'active',
  `source_subscriber` enum('website','checkout','social','manual','import') DEFAULT 'website',
  `date_inscription` timestamp DEFAULT CURRENT_TIMESTAMP,
  `date_unsubscribe` timestamp NULL DEFAULT NULL,
  `ip_inscription` varchar(45) DEFAULT NULL,
  `token_unsubscribe` varchar(100) DEFAULT NULL,
  `preferences_subscriber` text COMMENT 'JSON field for subscriber preferences',
  PRIMARY KEY (`id_subscriber`),
  UNIQUE KEY `idx_email_subscriber` (`email_subscriber`),
  KEY `idx_status_subscriber` (`status_subscriber`),
  KEY `idx_date_inscription` (`date_inscription`),
  KEY `idx_source_subscriber` (`source_subscriber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some sample data for products
INSERT INTO `products` (`reference_product`, `nom_product`, `img_product`, `description_product`, `type_product`, `category_product`, `itemgroup_product`, `price_product`, `qnty_product`, `s_size`, `m_size`, `l_size`, `xl_size`, `color_product`, `status_product`, `discount_product`) VALUES
('REF001', 'Chemise en Coton Rayé', '/placeholder.svg', 'Une chemise élégante en coton rayé pour garçons', 'Shirt', 'GARÇONS 8-14 ANS', 'Clothing', 320.00, 50, 10, 15, 20, 5, 'Blue', 'active', 10.00),
('REF002', 'Blouse en Soie Premium', '/placeholder.svg', 'Blouse luxueuse en soie pour femmes', 'Blouse', 'FEMMES', 'Clothing', 420.00, 30, 8, 12, 8, 2, 'White', 'active', 0.00),
('REF003', 'Sac à Main Élégant', '/placeholder.svg', 'Sac à main en cuir véritable', 'Bag', 'ACCESSOIRES', 'Accessories', 650.00, 25, 0, 0, 0, 0, 'Black', 'active', 20.00);

-- Insert some sample reservations
INSERT INTO `reservations` (`nom_client`, `email_client`, `telephone_client`, `date_reservation`, `heure_reservation`, `statut_reservation`, `notes_reservation`) VALUES
('Jean Dupont', 'jean.dupont@email.com', '+33123456789', '2024-01-15', '10:00:00', 'confirmed', 'Mesure pour costume sur mesure'),
('Marie Martin', 'marie.martin@email.com', '+33987654321', '2024-01-16', '14:30:00', 'pending', 'Première consultation pour robe de soirée');

-- Insert sample customer data
INSERT INTO `customers` (`nom_customer`, `prenom_customer`, `email_customer`, `telephone_customer`, `adresse_customer`, `ville_customer`, `code_postal_customer`, `pays_customer`) VALUES
('Dupont', 'Jean', 'jean.dupont@email.com', '+33123456789', '123 Rue de la Paix', 'Paris', '75001', 'France'),
('Martin', 'Marie', 'marie.martin@email.com', '+33987654321', '456 Avenue des Champs', 'Lyon', '69001', 'France');

-- Insert sample order data with vue tracking
INSERT INTO `orders` (`id_customer`, `numero_commande`, `sous_total_order`, `discount_amount_order`, `delivery_cost_order`, `total_order`, `status_order`, `date_livraison_souhaitee`, `vue_par_admin`) VALUES
(1, 'CMD-2024-001', 970.00, 50.00, 15.00, 935.00, 'confirmed', '2024-02-01', 1),
(2, 'CMD-2024-002', 420.00, 0.00, 10.00, 430.00, 'pending', '2024-02-05', 0);

-- Insert sample order items
INSERT INTO `order_items` (`id_order`, `id_product`, `nom_product_snapshot`, `reference_product_snapshot`, `price_product_snapshot`, `size_selected`, `color_selected`, `quantity_ordered`, `subtotal_item`, `total_item`) VALUES
(1, 1, 'Chemise en Coton Rayé', 'REF001', 320.00, 'L', 'Blue', 2, 640.00, 640.00),
(1, 3, 'Sac à Main Élégant', 'REF003', 650.00, NULL, 'Black', 1, 650.00, 650.00),
(2, 2, 'Blouse en Soie Premium', 'REF002', 420.00, 'M', 'White', 1, 420.00, 420.00);

-- Insert sample newsletter subscribers
INSERT INTO `newsletter_subscribers` (`email_subscriber`, `nom_subscriber`, `prenom_subscriber`, `status_subscriber`, `source_subscriber`, `date_inscription`) VALUES
('jean.dupont@email.com', 'Dupont', 'Jean', 'active', 'website', '2024-01-15 10:30:00'),
('marie.martin@email.com', 'Martin', 'Marie', 'active', 'checkout', '2024-01-10 09:15:00'),
('pierre.dubois@email.com', 'Dubois', 'Pierre', 'unsubscribed', 'website', '2023-12-20 16:45:00'),
('sophie.bernard@email.com', 'Bernard', 'Sophie', 'active', 'social', '2024-01-18 14:20:00'),
('claire.moreau@email.com', 'Moreau', 'Claire', 'active', 'website', '2024-01-20 11:30:00'),
('lucas.petit@email.com', 'Petit', 'Lucas', 'active', 'manual', '2024-01-22 15:45:00');
