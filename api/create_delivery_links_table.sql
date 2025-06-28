
-- Create delivery links table
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
