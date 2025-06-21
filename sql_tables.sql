
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

-- Insert some sample data for products
INSERT INTO `products` (`reference_product`, `nom_product`, `img_product`, `description_product`, `type_product`, `category_product`, `itemgroup_product`, `price_product`, `qnty_product`, `s_size`, `m_size`, `l_size`, `xl_size`, `color_product`, `status_product`, `discount_product`) VALUES
('REF001', 'Chemise en Coton Rayé', '/placeholder.svg', 'Une chemise élégante en coton rayé pour garçons', 'Shirt', 'GARÇONS 8-14 ANS', 'Clothing', 320.00, 50, 10, 15, 20, 5, 'Blue', 'active', 10.00),
('REF002', 'Blouse en Soie Premium', '/placeholder.svg', 'Blouse luxueuse en soie pour femmes', 'Blouse', 'FEMMES', 'Clothing', 420.00, 30, 8, 12, 8, 2, 'White', 'active', 0.00),
('REF003', 'Sac à Main Élégant', '/placeholder.svg', 'Sac à main en cuir véritable', 'Bag', 'ACCESSOIRES', 'Accessories', 650.00, 25, 0, 0, 0, 0, 'Black', 'active', 20.00);

-- Insert some sample reservations
INSERT INTO `reservations` (`nom_client`, `email_client`, `telephone_client`, `date_reservation`, `heure_reservation`, `statut_reservation`, `notes_reservation`) VALUES
('Jean Dupont', 'jean.dupont@email.com', '+33123456789', '2024-01-15', '10:00:00', 'confirmed', 'Mesure pour costume sur mesure'),
('Marie Martin', 'marie.martin@email.com', '+33987654321', '2024-01-16', '14:30:00', 'pending', 'Première consultation pour robe de soirée');
