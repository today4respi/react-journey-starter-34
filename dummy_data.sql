
-- MySQL compatible dummy data for MyLittle project
-- This script inserts realistic test data into all tables

-- Insert dummy users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', '+33123456789', '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
('550e8400-e29b-41d4-a716-446655440002', 'marie.martin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Marie', 'Martin', '+33198765432', '2024-02-10 14:20:00', '2024-02-10 14:20:00'),
('550e8400-e29b-41d4-a716-446655440003', 'pierre.durand@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Pierre', 'Durand', '+33165432198', '2024-03-05 09:15:00', '2024-03-05 09:15:00'),
('550e8400-e29b-41d4-a716-446655440004', 'sophie.bernard@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sophie', 'Bernard', '+33187654321', '2024-04-12 16:45:00', '2024-04-12 16:45:00'),
('550e8400-e29b-41d4-a716-446655440005', 'lucas.petit@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lucas', 'Petit', '+33176543210', '2024-05-08 11:30:00', '2024-05-08 11:30:00'),
('550e8400-e29b-41d4-a716-446655440006', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', '+33123123123', '2024-06-01 08:00:00', '2024-06-01 08:00:00');

-- Insert dummy children
INSERT INTO children (id, user_id, name, age, objective, message, photo_url, created_at, updated_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Emma', 5, 'Apprendre les couleurs', 'Emma adore dessiner et rêve de devenir artiste. Elle aime particulièrement les licornes et les arc-en-ciels.', 'https://example.com/photo1.jpg', '2024-01-15 10:35:00', '2024-01-15 10:35:00'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Lucas', 8, 'Améliorer la lecture', 'Lucas est passionné par les dinosaures et les aventures. Il commence à lire seul et veut des histoires captivantes.', 'https://example.com/photo2.jpg', '2024-01-15 10:40:00', '2024-01-15 10:40:00'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Chloé', 6, 'Développer la confiance', 'Chloé est timide mais très curieuse. Elle aime les animaux et rêve de voyager autour du monde.', 'https://example.com/photo3.jpg', '2024-02-10 14:25:00', '2024-02-10 14:25:00'),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'Nathan', 7, 'Stimuler la créativité', 'Nathan est très énergique et aime construire des châteaux en Lego. Il invente toujours de nouvelles histoires.', 'https://example.com/photo4.jpg', '2024-03-05 09:20:00', '2024-03-05 09:20:00'),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'Léa', 4, 'Apprendre les chiffres', 'Léa commence à compter et adore jouer avec les formes et les couleurs. Elle est très observatrice.', 'https://example.com/photo5.jpg', '2024-04-12 16:50:00', '2024-04-12 16:50:00'),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', 'Tom', 9, 'Découvrir les sciences', 'Tom est fasciné par les étoiles et les planètes. Il pose toujours des questions sur comment fonctionnent les choses.', 'https://example.com/photo6.jpg', '2024-05-08 11:35:00', '2024-05-08 11:35:00'),
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440006', 'Alice', 6, 'Développer l\'imagination', 'Alice aime les contes de fées et invente ses propres histoires avec des princesses et des dragons.', 'https://example.com/photo7.jpg', '2024-06-01 08:05:00', '2024-06-01 08:05:00');

-- Insert dummy orders with delivery status
INSERT INTO orders (id, user_id, order_number, plan_type, total_amount, currency, status, delivery_status, payment_intent_id, customer_name, customer_email, customer_phone, customer_address, customer_city, customer_postal_code, stripe_session_id, created_at, updated_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'ML-2024-001', 'onetime', 24.99, 'EUR', 'paid', 'livre', 'pi_3P1234567890', 'John Doe', 'john.doe@example.com', '+33123456789', '123 Rue de la Paix', 'Paris', '75001', 'cs_test_123456', '2024-01-20 15:30:00', '2024-01-20 15:30:00'),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'ML-2024-002', 'subscription', 19.99, 'EUR', 'paid', 'en_livraison', 'pi_3P2345678901', 'Marie Martin', 'marie.martin@example.com', '+33198765432', '456 Avenue des Champs', 'Lyon', '69001', 'cs_test_234567', '2024-02-15 10:15:00', '2024-02-15 10:15:00'),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'ML-2024-003', 'onetime', 24.99, 'EUR', 'paid', 'en_preparation', 'pi_3P3456789012', 'Pierre Durand', 'pierre.durand@example.com', '+33165432198', '789 Boulevard Saint-Germain', 'Marseille', '13001', 'cs_test_345678', '2024-03-10 14:45:00', '2024-03-10 14:45:00'),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'ML-2024-004', 'subscription', 19.99, 'EUR', 'paid', 'en_preparation', 'pi_3P4567890123', 'Sophie Bernard', 'sophie.bernard@example.com', '+33187654321', '321 Rue de Rivoli', 'Toulouse', '31000', 'cs_test_456789', '2024-04-18 09:30:00', '2024-04-18 09:30:00'),
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'ML-2024-005', 'onetime', 24.99, 'EUR', 'pending', 'en_attente', 'pi_3P5678901234', 'Lucas Petit', 'lucas.petit@example.com', '+33176543210', '654 Place Bellecour', 'Nice', '06000', 'cs_test_567890', '2024-05-12 16:20:00', '2024-05-12 16:20:00'),
('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 'ML-2024-006', 'subscription', 19.99, 'EUR', 'paid', 'en_attente', 'pi_3P6789012345', 'Test User', 'test@example.com', '+33123123123', '987 Rue de la République', 'Bordeaux', '33000', 'cs_test_678901', '2024-06-05 12:10:00', '2024-06-05 12:10:00');

-- Insert dummy order items (ensuring each order has at least one book)
INSERT INTO order_items (id, order_id, child_id, child_name, child_age, child_objective, child_message, child_photo_url, book_title, book_description, price, created_at) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Emma', 5, 'Apprendre les couleurs', 'Emma adore dessiner et rêve de devenir artiste.', 'https://example.com/photo1.jpg', 'Les Aventures Colorées d\'Emma', 'Une histoire magique où Emma découvre un monde plein de couleurs arc-en-ciel.', 24.99, '2024-01-20 15:30:00'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', 'Chloé', 6, 'Développer la confiance', 'Chloé est timide mais très curieuse.', 'https://example.com/photo3.jpg', 'Chloé et le Grand Voyage', 'L\'histoire de Chloé qui découvre le monde et gagne confiance en elle.', 19.99, '2024-02-15 10:15:00'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440004', 'Nathan', 7, 'Stimuler la créativité', 'Nathan est très énergique et aime construire.', 'https://example.com/photo4.jpg', 'Nathan le Constructeur', 'Nathan construit le château de ses rêves dans une aventure créative.', 24.99, '2024-03-10 14:45:00'),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440005', 'Léa', 4, 'Apprendre les chiffres', 'Léa commence à compter et adore jouer.', 'https://example.com/photo5.jpg', 'Léa Compte les Étoiles', 'Léa apprend à compter en explorant un ciel étoilé magique.', 19.99, '2024-04-18 09:30:00'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440006', 'Tom', 9, 'Découvrir les sciences', 'Tom est fasciné par les étoiles.', 'https://example.com/photo6.jpg', 'Tom l\'Explorateur Spatial', 'Tom voyage dans l\'espace pour découvrir les mystères de l\'univers.', 24.99, '2024-05-12 16:20:00'),
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440007', 'Alice', 6, 'Développer l\'imagination', 'Alice aime les contes de fées.', 'https://example.com/photo7.jpg', 'Alice au Royaume Enchanté', 'Alice vit des aventures fantastiques dans un royaume de contes de fées.', 19.99, '2024-06-05 12:10:00');

-- Insert additional order items for some orders to have multiple books
INSERT INTO order_items (id, order_id, child_id, child_name, child_age, child_objective, child_message, child_photo_url, book_title, book_description, price, created_at) VALUES
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 'Lucas', 8, 'Améliorer la lecture', 'Lucas est passionné par les dinosaures.', 'https://example.com/photo2.jpg', 'Lucas et les Dinosaures', 'Une aventure préhistorique avec Lucas et ses amis dinosaures.', 24.99, '2024-01-20 15:30:00'),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', 'Nathan', 7, 'Stimuler la créativité', 'Nathan invente toujours de nouvelles histoires.', 'https://example.com/photo4.jpg', 'Nathan et le Robot Magique', 'Nathan construit un robot qui prend vie et devient son meilleur ami.', 19.99, '2024-04-18 09:30:00');

-- Insert dummy delivery links for orders with delivery status 'en_livraison' or 'livre'
INSERT INTO delivery_links (id, order_id, tracking_url, carrier_name, tracking_number, created_at, updated_at) VALUES
('dl0e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'https://www.dhl.fr/fr/particuliers/suivi-colis.html?submit=1&tracking-id=1234567890123456', 'DHL Express', '1234567890123456', '2024-01-21 09:00:00', '2024-01-21 09:00:00'),
('dl0e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 'https://www.laposte.fr/outils/suivre-vos-envois?code=7A12345678901', 'Colissimo', '7A12345678901', '2024-02-16 11:30:00', '2024-02-16 11:30:00');

-- Insert dummy subscriptions
INSERT INTO subscriptions (id, user_id, stripe_subscription_id, status, current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at) VALUES
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'sub_1P1234567890', 'active', '2024-02-15 10:15:00', '2024-03-15 10:15:00', FALSE, '2024-02-15 10:15:00', '2024-02-15 10:15:00'),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'sub_1P2345678901', 'active', '2024-04-18 09:30:00', '2024-05-18 09:30:00', FALSE, '2024-04-18 09:30:00', '2024-04-18 09:30:00'),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', 'sub_1P3456789012', 'active', '2024-06-05 12:10:00', '2024-07-05 12:10:00', FALSE, '2024-06-05 12:10:00', '2024-06-05 12:10:00');

-- Insert dummy addresses
INSERT INTO addresses (id, user_id, type, street_address, city, state, postal_code, country, is_default, created_at) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'shipping', '123 Rue de la Paix', 'Paris', 'Île-de-France', '75001', 'France', TRUE, '2024-01-15 10:30:00'),
('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'shipping', '456 Avenue des Champs', 'Lyon', 'Auvergne-Rhône-Alpes', '69001', 'France', TRUE, '2024-02-10 14:20:00'),
('a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'shipping', '789 Boulevard Saint-Germain', 'Marseille', 'Provence-Alpes-Côte d\'Azur', '13001', 'France', TRUE, '2024-03-05 09:15:00'),
('a50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'shipping', '321 Rue de Rivoli', 'Toulouse', 'Occitanie', '31000', 'France', TRUE, '2024-04-12 16:45:00'),
('a50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'shipping', '654 Place Bellecour', 'Nice', 'Provence-Alpes-Côte d\'Azur', '06000', 'France', TRUE, '2024-05-08 11:30:00'),
('a50e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 'shipping', '987 Rue de la République', 'Bordeaux', 'Nouvelle-Aquitaine', '33000', 'France', TRUE, '2024-06-01 08:00:00');

-- Insert dummy newsletter subscribers
INSERT INTO newsletter_subscribers (id, email, status, ip_address, user_agent, created_at, updated_at) VALUES
('ns0e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', 'active', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
('ns0e8400-e29b-41d4-a716-446655440002', 'marie.martin@example.com', 'active', '192.168.1.2', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2024-02-10 14:20:00', '2024-02-10 14:20:00'),
('ns0e8400-e29b-41d4-a716-446655440003', 'pierre.durand@example.com', 'active', '192.168.1.3', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)', '2024-03-05 09:15:00', '2024-03-05 09:15:00'),
('ns0e8400-e29b-41d4-a716-446655440004', 'sophie.bernard@example.com', 'unsubscribed', '192.168.1.4', 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0', '2024-04-12 16:45:00', '2024-05-01 10:00:00'),
('ns0e8400-e29b-41d4-a716-446655440005', 'lucas.petit@example.com', 'active', '192.168.1.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-05-08 11:30:00', '2024-05-08 11:30:00'),
('ns0e8400-e29b-41d4-a716-446655440006', 'test@example.com', 'active', '192.168.1.6', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2024-06-01 08:00:00', '2024-06-01 08:00:00'),
('ns0e8400-e29b-41d4-a716-446655440007', 'newsletter1@example.com', 'active', '10.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-01-10 12:00:00', '2024-01-10 12:00:00'),
('ns0e8400-e29b-41d4-a716-446655440008', 'newsletter2@example.com', 'active', '10.0.0.2', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', '2024-01-25 15:30:00', '2024-01-25 15:30:00'),
('ns0e8400-e29b-41d4-a716-446655440009', 'newsletter3@example.com', 'unsubscribed', '10.0.0.3', 'Mozilla/5.0 (Android 12; Mobile; rv:91.0) Gecko/91.0 Firefox/91.0', '2024-02-05 09:45:00', '2024-03-01 14:20:00'),
('ns0e8400-e29b-41d4-a716-446655440010', 'newsletter4@example.com', 'active', '10.0.0.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-02-20 11:15:00', '2024-02-20 11:15:00'),
('ns0e8400-e29b-41d4-a716-446655440011', 'newsletter5@example.com', 'active', '10.0.0.5', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2024-03-15 16:00:00', '2024-03-15 16:00:00'),
('ns0e8400-e29b-41d4-a716-446655440012', 'newsletter6@example.com', 'active', '10.0.0.6', 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', '2024-03-28 13:30:00', '2024-03-28 13:30:00'),
('ns0e8400-e29b-41d4-a716-446655440013', 'newsletter7@example.com', 'unsubscribed', '10.0.0.7', 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0', '2024-04-05 10:45:00', '2024-04-20 09:00:00'),
('ns0e8400-e29b-41d4-a716-446655440014', 'newsletter8@example.com', 'active', '10.0.0.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-04-22 14:15:00', '2024-04-22 14:15:00'),
('ns0e8400-e29b-41d4-a716-446655440015', 'newsletter9@example.com', 'active', '10.0.0.9', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', '2024-05-01 08:30:00', '2024-05-01 08:30:00'),
('ns0e8400-e29b-41d4-a716-446655440016', 'newsletter10@example.com', 'active', '10.0.0.10', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2024-05-15 17:45:00', '2024-05-15 17:45:00'),
('ns0e8400-e29b-41d4-a716-446655440017', 'newsletter11@example.com', 'active', '172.16.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-05-28 12:20:00', '2024-05-28 12:20:00'),
('ns0e8400-e29b-41d4-a716-446655440018', 'newsletter12@example.com', 'unsubscribed', '172.16.0.2', 'Mozilla/5.0 (Android 12; Mobile; rv:91.0) Gecko/91.0 Firefox/91.0', '2024-06-02 15:10:00', '2024-06-10 11:30:00'),
('ns0e8400-e29b-41d4-a716-446655440019', 'newsletter13@example.com', 'active', '172.16.0.3', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', '2024-06-08 09:25:00', '2024-06-08 09:25:00'),
('ns0e8400-e29b-41d4-a716-446655440020', 'newsletter14@example.com', 'active', '172.16.0.4', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2024-06-12 16:40:00', '2024-06-12 16:40:00');

-- Insert dummy visitor tracking data
INSERT INTO visitor_tracking (id, ip_address, page_visited, referrer, user_agent, city, country, visit_date, session_id) VALUES
-- Today's visits (last 24 hours)
('v50e8400-e29b-41d4-a716-446655440001', '192.168.1.1', '/', 'https://google.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Paris', 'France', NOW(), 'sess_001'),
('v50e8400-e29b-41d4-a716-446655440002', '192.168.1.2', '/products', 'https://google.com', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Lyon', 'France', NOW() - INTERVAL 2 HOUR, 'sess_002'),
('v50e8400-e29b-41d4-a716-446655440003', '192.168.1.3', '/about', 'https://facebook.com', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)', 'Marseille', 'France', NOW() - INTERVAL 4 HOUR, 'sess_003'),
('v50e8400-e29b-41d4-a716-446655440004', '192.168.1.4', '/contact', 'direct', 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0', 'Toulouse', 'France', NOW() - INTERVAL 6 HOUR, 'sess_004'),
('v50e8400-e29b-41d4-a716-446655440005', '192.168.1.5', '/', 'https://instagram.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Nice', 'France', NOW() - INTERVAL 8 HOUR, 'sess_005'),
('v50e8400-e29b-41d4-a716-446655440006', '192.168.1.6', '/products', 'https://google.com', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Bordeaux', 'France', NOW() - INTERVAL 10 HOUR, 'sess_006'),
('v50e8400-e29b-41d4-a716-446655440007', '192.168.1.7', '/blog', 'https://twitter.com', 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', 'Strasbourg', 'France', NOW() - INTERVAL 12 HOUR, 'sess_007'),
('v50e8400-e29b-41d4-a716-446655440008', '192.168.1.8', '/', 'https://youtube.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Nantes', 'France', NOW() - INTERVAL 14 HOUR, 'sess_008'),
('v50e8400-e29b-41d4-a716-446655440009', '192.168.1.9', '/about', 'direct', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 'Lille', 'France', NOW() - INTERVAL 16 HOUR, 'sess_009'),
('v50e8400-e29b-41d4-a716-446655440010', '192.168.1.10', '/contact', 'https://google.com', 'Mozilla/5.0 (Android 12; Mobile; rv:91.0) Gecko/91.0 Firefox/91.0', 'Rennes', 'France', NOW() - INTERVAL 18 HOUR, 'sess_010'),

-- Yesterday's visits
('v50e8400-e29b-41d4-a716-446655440011', '10.0.0.1', '/', 'https://google.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Paris', 'France', NOW() - INTERVAL 1 DAY, 'sess_011'),
('v50e8400-e29b-41d4-a716-446655440012', '10.0.0.2', '/products', 'https://google.com', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Lyon', 'France', NOW() - INTERVAL 1 DAY - INTERVAL 2 HOUR, 'sess_012'),
('v50e8400-e29b-41d4-a716-446655440013', '10.0.0.3', '/about', 'https://facebook.com', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)', 'Marseille', 'France', NOW() - INTERVAL 1 DAY - INTERVAL 4 HOUR, 'sess_013'),
('v50e8400-e29b-41d4-a716-446655440014', '10.0.0.4', '/contact', 'direct', 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0', 'Toulouse', 'France', NOW() - INTERVAL 1 DAY - INTERVAL 6 HOUR, 'sess_014'),
('v50e8400-e29b-41d4-a716-446655440015', '10.0.0.5', '/', 'https://instagram.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Nice', 'France', NOW() - INTERVAL 1 DAY - INTERVAL 8 HOUR, 'sess_015'),

-- Older visits for historical data
('v50e8400-e29b-41d4-a716-446655440016', '172.16.0.1', '/', 'https://google.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Brussels', 'Belgium', '2024-06-10 10:30:00', 'sess_016'),
('v50e8400-e29b-41d4-a716-446655440017', '172.16.0.2', '/products', 'https://google.com', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'London', 'United Kingdom', '2024-06-09 14:20:00', 'sess_017'),
('v50e8400-e29b-41d4-a716-446655440018', '172.16.0.3', '/about', 'https://bing.com', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)', 'Madrid', 'Spain', '2024-06-08 16:45:00', 'sess_018'),
('v50e8400-e29b-41d4-a716-446655440019', '172.16.0.4', '/contact', 'direct', 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0', 'Rome', 'Italy', '2024-06-07 11:30:00', 'sess_019'),
('v50e8400-e29b-41d4-a716-446655440020', '172.16.0.5', '/', 'https://google.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Berlin', 'Germany', '2024-06-06 09:15:00', 'sess_020'),

-- International visitors for variety
('v50e8400-e29b-41d4-a716-446655440021', '203.0.113.1', '/', 'https://google.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Montreal', 'Canada', '2024-06-05 08:00:00', 'sess_021'),
('v50e8400-e29b-41d4-a716-446655440022', '203.0.113.2', '/products', 'https://google.com', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'New York', 'United States', '2024-06-04 15:30:00', 'sess_022'),
('v50e8400-e29b-41d4-a716-446655440023', '203.0.113.3', '/about', 'https://yahoo.com', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)', 'Tokyo', 'Japan', '2024-06-03 12:45:00', 'sess_023'),
('v50e8400-e29b-41d4-a716-446655440024', '203.0.113.4', '/contact', 'direct', 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0', 'Sydney', 'Australia', '2024-06-02 18:20:00', 'sess_024'),
('v50e8400-e29b-41d4-a716-446655440025', '203.0.113.5', '/', 'https://google.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'São Paulo', 'Brazil', '2024-06-01 20:10:00', 'sess_025');

-- Additional bulk visitor data for more realistic statistics
INSERT INTO visitor_tracking (ip_address, page_visited, referrer, user_agent, city, country, visit_date, session_id) VALUES
-- More recent visits to boost today's numbers
('192.168.2.1', '/', 'https://google.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Paris', 'France', NOW() - INTERVAL 1 HOUR, 'sess_026'),
('192.168.2.2', '/products', 'https://google.com', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 'Lyon', 'France', NOW() - INTERVAL 2 HOUR, 'sess_027'),
('192.168.2.3', '/', 'https://bing.com', 'Mozilla/5.0 (Android 12; Mobile; rv:91.0) Gecko/91.0 Firefox/91.0', 'Marseille', 'France', NOW() - INTERVAL 3 HOUR, 'sess_028'),
('192.168.2.4', '/about', 'direct', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Toulouse', 'France', NOW() - INTERVAL 4 HOUR, 'sess_029'),
('192.168.2.5', '/contact', 'https://instagram.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Nice', 'France', NOW() - INTERVAL 5 HOUR, 'sess_030'),

-- Weekly data for trends
('10.1.0.1', '/', 'https://google.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Paris', 'France', NOW() - INTERVAL 3 DAY, 'sess_031'),
('10.1.0.2', '/products', 'https://google.com', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 'Lyon', 'France', NOW() - INTERVAL 4 DAY, 'sess_032'),
('10.1.0.3', '/', 'https://bing.com', 'Mozilla/5.0 (Android 12; Mobile; rv:91.0) Gecko/91.0 Firefox/91.0', 'Marseille', 'France', NOW() - INTERVAL 5 DAY, 'sess_033'),
('10.1.0.4', '/about', 'direct', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Toulouse', 'France', NOW() - INTERVAL 6 DAY, 'sess_034'),
('10.1.0.5', '/contact', 'https://twitter.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Nice', 'France', NOW() - INTERVAL 7 DAY, 'sess_035');

-- Note: The user with email 'test@example.com' has password '123123' (hashed with bcrypt)
-- You can use this account to test login functionality.
