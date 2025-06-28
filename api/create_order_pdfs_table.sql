
-- Create table for order PDFs
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
