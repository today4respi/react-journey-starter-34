-- MySQL compatible tables for MyLittle project
-- Drop all tables first (for clean recreation)

DROP TABLE IF EXISTS delivery_links;
DROP TABLE IF EXISTS order_pdfs;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS children;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS visitor_tracking;
DROP TABLE IF EXISTS newsletter_subscribers;
DROP TABLE IF EXISTS active_sessions;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Children table
CREATE TABLE children (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 18),
    objective VARCHAR(500),
    message TEXT,
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for faster queries by parent
CREATE INDEX idx_children_user_id ON children(user_id);

-- Orders table
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('onetime', 'subscription')),
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
    delivery_status VARCHAR(30) DEFAULT 'en_attente' CHECK (delivery_status IN ('en_attente', 'en_preparation', 'en_livraison', 'livre')),
    payment_intent_id VARCHAR(255),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_address VARCHAR(255),
    customer_city VARCHAR(100),
    customer_postal_code VARCHAR(20),
    stripe_session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for faster queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_delivery_status ON orders(delivery_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Delivery links table
CREATE TABLE delivery_links (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id VARCHAR(36) NOT NULL,
    tracking_url VARCHAR(500) NOT NULL,
    carrier_name VARCHAR(100),
    tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    UNIQUE KEY unique_order_delivery (order_id)
);

-- Index for faster queries
CREATE INDEX idx_delivery_links_order_id ON delivery_links(order_id);

-- Order items table
CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id VARCHAR(36) NOT NULL,
    child_id VARCHAR(36) NOT NULL,
    child_name VARCHAR(100) NOT NULL,
    child_age INTEGER NOT NULL,
    child_objective VARCHAR(500),
    child_message TEXT,
    child_photo_url VARCHAR(500),
    book_title VARCHAR(200),
    book_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Index for faster queries
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_child_id ON order_items(child_id);

-- Order PDFs table
CREATE TABLE order_pdfs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id VARCHAR(36) NOT NULL,
    pdf_type ENUM('cover', 'content') NOT NULL,
    pdf_url VARCHAR(500) NOT NULL,
    original_filename VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    UNIQUE KEY unique_order_pdf (order_id, pdf_type)
);

-- Index for faster queries
CREATE INDEX idx_order_pdfs_order_id ON order_pdfs(order_id);
CREATE INDEX idx_order_pdfs_type ON order_pdfs(pdf_type);

-- Subscriptions table
CREATE TABLE subscriptions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    order_id VARCHAR(36) NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'paused', 'expired')),
    current_period_start TIMESTAMP NULL,
    current_period_end TIMESTAMP NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    cancellation_reason TEXT, -- NEW: Reason for user cancellation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- Index for faster queries
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Addresses table
CREATE TABLE addresses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(20) DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'California',
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'France',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for faster queries
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Visitor tracking table
CREATE TABLE visitor_tracking (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ip_address VARCHAR(45) NOT NULL,
    page_visited VARCHAR(255) NOT NULL,
    referrer VARCHAR(500),
    user_agent TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255)
);

-- Indexes for faster queries on visitor tracking
CREATE INDEX idx_visitor_tracking_ip ON visitor_tracking(ip_address);
CREATE INDEX idx_visitor_tracking_page ON visitor_tracking(page_visited);
CREATE INDEX idx_visitor_tracking_date ON visitor_tracking(visit_date);
CREATE INDEX idx_visitor_tracking_country ON visitor_tracking(country);

-- Newsletter subscribers table
CREATE TABLE newsletter_subscribers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index for faster queries on newsletter
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_created_at ON newsletter_subscribers(created_at);

-- Active sessions table for tracking current users on the website
CREATE TABLE active_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    ip_address VARCHAR(45),
    user_agent TEXT,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    page_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX idx_active_sessions_last_activity ON active_sessions(last_activity);

-- Note: Auto cleanup of old sessions should be handled by your application code
-- or by setting up a scheduled task in your hosting environment, as the event scheduler
-- requires SUPER privileges which are typically not available in shared hosting.
