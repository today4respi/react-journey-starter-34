import { AdminOrder } from './adminOrderService';

export const orderPdfGenerationService = {
  generateOrderPdf: (order: AdminOrder): void => {
    // Create a new window for the PDF content
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Popup bloqué. Veuillez autoriser les popups pour télécharger le PDF.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Commande ${order.order_number} - My Little Hero</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #ffffff;
            font-size: 14px;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: white;
          }
          
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 30px;
            margin-bottom: 40px;
            border-bottom: 3px solid #f97316;
            position: relative;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .logo {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            object-fit: contain;
          }
          
          .brand-info {
            display: flex;
            flex-direction: column;
          }
          
          .brand-name {
            font-size: 28px;
            font-weight: 700;
            color: #f97316;
            margin-bottom: 2px;
          }
          
          .brand-tagline {
            font-size: 12px;
            color: #6b7280;
            font-weight: 400;
          }
          
          .order-header {
            text-align: right;
          }
          
          .order-number {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 5px;
          }
          
          .order-date {
            font-size: 13px;
            color: #6b7280;
            font-weight: 500;
          }
          
          .section {
            margin-bottom: 30px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            position: relative;
            overflow: hidden;
          }
          
          .section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(180deg, #f97316 0%, #ea580c 100%);
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 16px;
            padding-left: 8px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 12px;
          }
          
          .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          
          .info-label {
            font-size: 12px;
            font-weight: 500;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .info-value {
            font-size: 14px;
            font-weight: 500;
            color: #111827;
          }
          
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .status-pending { background: #fef3c7; color: #92400e; border: 1px solid #fbbf24; }
          .status-paid { background: #dcfce7; color: #166534; border: 1px solid #22c55e; }
          .status-processing { background: #dbeafe; color: #1e40af; border: 1px solid #3b82f6; }
          .status-shipped { background: #dcfce7; color: #166534; border: 1px solid #22c55e; }
          .status-delivered { background: #ecfdf5; color: #14532d; border: 1px solid #10b981; }
          .status-cancelled { background: #fee2e2; color: #991b1b; border: 1px solid #ef4444; }
          .status-refunded { background: #f3f4f6; color: #374151; border: 1px solid #6b7280; }
          
          .delivery-en_attente { background: #f3f4f6; color: #374151; border: 1px solid #6b7280; }
          .delivery-en_preparation { background: #dbeafe; color: #1e40af; border: 1px solid #3b82f6; }
          .delivery-en_livraison { background: #fed7aa; color: #c2410c; border: 1px solid #f97316; }
          .delivery-livre { background: #dcfce7; color: #166534; border: 1px solid #22c55e; }
          
          .address-block {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            font-size: 14px;
            line-height: 1.6;
          }
          
          .books-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          
          .book-item {
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
            border: 1px solid #fed7aa;
            border-radius: 12px;
            padding: 20px;
            position: relative;
            overflow: hidden;
          }
          
          .book-item::before {
            content: '📚';
            position: absolute;
            top: 16px;
            right: 16px;
            font-size: 24px;
            opacity: 0.3;
          }
          
          .book-title {
            font-size: 16px;
            font-weight: 600;
            color: #9a3412;
            margin-bottom: 12px;
          }
          
          .book-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
          }
          
          .book-detail-item {
            font-size: 13px;
            color: #78350f;
          }
          
          .book-detail-label {
            font-weight: 600;
            margin-right: 4px;
          }
          
          .book-price {
            text-align: right;
            font-size: 18px;
            font-weight: 700;
            color: #9a3412;
            margin-top: 8px;
          }
          
          .total-section {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 2px solid #10b981;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            margin-top: 20px;
            position: relative;
            overflow: hidden;
          }
          
          .total-section::before {
            content: '💰';
            position: absolute;
            top: 20px;
            left: 20px;
            font-size: 24px;
            opacity: 0.3;
          }
          
          .total-label {
            font-size: 14px;
            font-weight: 500;
            color: #065f46;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .total-amount {
            font-size: 32px;
            font-weight: 800;
            color: #065f46;
            margin-bottom: 4px;
          }
          
          .total-subtitle {
            font-size: 12px;
            color: #047857;
            font-weight: 500;
          }
          
          .footer {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            background: #f9fafb;
            margin-left: -40px;
            margin-right: -40px;
            margin-bottom: -40px;
            padding-left: 40px;
            padding-right: 40px;
            padding-bottom: 30px;
          }
          
          .footer-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }
          
          .footer-brand {
            font-size: 16px;
            font-weight: 600;
            color: #f97316;
          }
          
          .footer-tagline {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 8px;
          }
          
          .footer-info {
            font-size: 11px;
            color: #9ca3af;
          }
          
          .books-count {
            background: #f97316;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 8px;
          }
          
          @media print {
            body { 
              margin: 0;
              font-size: 12px;
            }
            .container {
              padding: 20px;
            }
            .no-print { 
              display: none; 
            }
            .section {
              break-inside: avoid;
              margin-bottom: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-section">
              <img src="/lovable-uploads/c91f2f1f-d57c-466e-806a-e0648f9ac238.png" alt="My Little Hero Logo" class="logo" />
              <div class="brand-info">
                <div class="brand-name">My Little Hero</div>
                <div class="brand-tagline">Livres personnalisés pour enfants</div>
              </div>
            </div>
            <div class="order-header">
              <div class="order-number">Commande N° ${order.order_number}</div>
              <div class="order-date">${new Date(order.created_at).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">👤 Informations Client</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Nom complet</div>
                <div class="info-value">${order.customer_name}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value">${order.customer_email}</div>
              </div>
              ${order.customer_phone ? `
              <div class="info-item">
                <div class="info-label">Téléphone</div>
                <div class="info-value">${order.customer_phone}</div>
              </div>
              ` : ''}
            </div>
          </div>

          <div class="section">
            <div class="section-title">📍 Adresse de Livraison</div>
            <div class="address-block">
              ${order.customer_address}<br>
              ${order.customer_city} ${order.customer_postal_code}
            </div>
          </div>

          <div class="section">
            <div class="section-title">📊 Statut de la Commande</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Statut de paiement</div>
                <div class="info-value">
                  <span class="status-badge status-${order.status}">${orderPdfGenerationService.getStatusText(order.status)}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Statut de livraison</div>
                <div class="info-value">
                  <span class="status-badge delivery-${order.delivery_status}">${orderPdfGenerationService.getDeliveryStatusText(order.delivery_status)}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Type de plan</div>
                <div class="info-value">${order.plan_type === 'onetime' ? 'Paiement unique' : 'Abonnement'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Date de commande</div>
                <div class="info-value">${new Date(order.created_at).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              📚 Livres Commandés
              <span class="books-count">${(order.items || []).length} livre(s)</span>
            </div>
            <div class="books-container">
              ${(order.items || []).map((item, index) => `
                <div class="book-item">
                  <div class="book-title">${item.book_title}</div>
                  <div class="book-details">
                    <div class="book-detail-item">
                      <span class="book-detail-label">Enfant:</span>
                      ${item.child_name}
                    </div>
                    <div class="book-detail-item">
                      <span class="book-detail-label">Âge:</span>
                      ${item.child_age} ans
                    </div>
                    ${item.child_objective ? `
                    <div class="book-detail-item" style="grid-column: 1 / -1;">
                      <span class="book-detail-label">Objectif:</span>
                      ${item.child_objective}
                    </div>
                    ` : ''}
                    ${item.child_message ? `
                    <div class="book-detail-item" style="grid-column: 1 / -1;">
                      <span class="book-detail-label">Message personnalisé:</span>
                      ${item.child_message}
                    </div>
                    ` : ''}
                  </div>
                  <div class="book-price">€${Number(item.price || 0).toFixed(2)}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="total-section">
            <div class="total-label">Total de la Commande</div>
            <div class="total-amount">€${Number(order.total_amount || 0).toFixed(2)}</div>
            <div class="total-subtitle">Toutes taxes comprises</div>
          </div>

          <div class="footer">
            <div class="footer-content">
              <div class="footer-brand">My Little Hero</div>
              <div class="footer-tagline">Créateur de rêves, une histoire à la fois</div>
              <div class="footer-info">
                Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            // Wait for images to load before printing
            const images = document.querySelectorAll('img');
            let loadedImages = 0;
            
            if (images.length === 0) {
              setTimeout(() => {
                window.print();
                setTimeout(() => window.close(), 1000);
              }, 500);
              return;
            }
            
            images.forEach(img => {
              if (img.complete) {
                loadedImages++;
              } else {
                img.onload = () => {
                  loadedImages++;
                  if (loadedImages === images.length) {
                    setTimeout(() => {
                      window.print();
                      setTimeout(() => window.close(), 1000);
                    }, 500);
                  }
                };
                img.onerror = () => {
                  loadedImages++;
                  if (loadedImages === images.length) {
                    setTimeout(() => {
                      window.print();
                      setTimeout(() => window.close(), 1000);
                    }, 500);
                  }
                };
              }
            });
            
            if (loadedImages === images.length) {
              setTimeout(() => {
                window.print();
                setTimeout(() => window.close(), 1000);
              }, 500);
            }
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  },

  getStatusText: (status: string): string => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'paid': return 'Payé';
      case 'processing': return 'Traitement';
      case 'shipped': return 'Expédié';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      case 'refunded': return 'Remboursé';
      default: return status;
    }
  },

  getDeliveryStatusText: (deliveryStatus: string): string => {
    switch (deliveryStatus) {
      case 'en_attente': return 'En attente';
      case 'en_preparation': return 'En préparation';
      case 'en_livraison': return 'En livraison';
      case 'livre': return 'Livré';
      default: return deliveryStatus;
    }
  }
};
