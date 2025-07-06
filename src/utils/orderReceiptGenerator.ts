import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const generateOrderReceiptPDF = (orderData: any, language: 'fr' | 'en' = 'fr') => {
  const doc = new jsPDF();

  // Define some constants for styling
  const textColor = '#333333';
  const primaryColor = '#000000';
  const lightGray = '#AAAAAA';
  const fontSizeH1 = 24;
  const fontSizeH2 = 18;
  const fontSizeH3 = 16;
  const fontSizeBody = 12;
  const lineHeight = 7;
  const margin = 15;

  // Function to add a styled text
  function addStyledText(doc: jsPDF, text: string, x: number, y: number, fontSize: number, color: string, fontWeight: 'normal' | 'bold' = 'normal') {
    doc.setFontSize(fontSize);
    doc.setTextColor(color);
    doc.setFont('', fontWeight);
    doc.text(text, x, y);
  }

  // Function to add a line separator
  function addLineSeparator(doc: jsPDF, y: number) {
    doc.setLineWidth(0.5);
    doc.setDrawColor(lightGray);
    doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y);
  }

  // Function to format the date in French
  function formatDate(date: string): string {
    return format(new Date(date), 'd MMMM yyyy', { locale: fr });
  }

  // Function to format the price
  function formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  }

  // Add logo
  const logo = '/logo.png';
  doc.addImage(logo, 'PNG', margin, margin, 50, 15);

  // Add document title
  addStyledText(doc, 'Facture', doc.internal.pageSize.getWidth() - margin - 40, margin + 10, fontSizeH2, textColor, 'bold');

  // Add order information
  const orderNumber = orderData.order_number || orderData.numero_commande || 'N/A';
  const orderDate = orderData.date_creation || orderData.date_creation_order ? formatDate(orderData.date_creation || orderData.date_creation_order) : 'N/A';
  addStyledText(doc, `Numéro de commande: ${orderNumber}`, margin, 50, fontSizeBody, textColor);
  addStyledText(doc, `Date de commande: ${orderDate}`, margin, 50 + lineHeight, fontSizeBody, textColor);

  // Add customer information
  const customerInfo = orderData.customer_info || orderData.customer || {};
  const billingAddress = customerInfo.billing_address || customerInfo;
  const customerName = billingAddress.firstname && billingAddress.lastname ? `${billingAddress.firstname} ${billingAddress.lastname}` : 
                      billingAddress.prenom && billingAddress.nom ? `${billingAddress.prenom} ${billingAddress.nom}` : 'N/A';
  const customerAddress = billingAddress.address1 || billingAddress.adresse || 'N/A';
  const customerCity = billingAddress.city || billingAddress.ville || 'N/A';
  const customerZipCode = billingAddress.zipcode || billingAddress.code_postal || 'N/A';
  const customerCountry = billingAddress.country || billingAddress.pays || 'N/A';
  const customerEmail = customerInfo.email || 'N/A';
  const customerPhone = customerInfo.telephone || 'N/A';

  addStyledText(doc, 'Informations du client:', margin, 75, fontSizeH3, primaryColor, 'bold');
  addStyledText(doc, `Nom: ${customerName}`, margin, 75 + lineHeight * 2, fontSizeBody, textColor);
  addStyledText(doc, `Adresse: ${customerAddress}, ${customerZipCode} ${customerCity}, ${customerCountry}`, margin, 75 + lineHeight * 3, fontSizeBody, textColor);
  addStyledText(doc, `Email: ${customerEmail}`, margin, 75 + lineHeight * 4, fontSizeBody, textColor);
  addStyledText(doc, `Téléphone: ${customerPhone}`, margin, 75 + lineHeight * 5, fontSizeBody, textColor);

  // Add delivery information
  const deliveryInfo = orderData.delivery_info || orderData.delivery_address || {};
  const deliveryName = deliveryInfo.firstname && deliveryInfo.lastname ? `${deliveryInfo.firstname} ${deliveryInfo.lastname}` : 
                      deliveryInfo.prenom_destinataire && deliveryInfo.nom_destinataire ? `${deliveryInfo.prenom_destinataire} ${deliveryInfo.nom_destinataire}` : 'N/A';
  const deliveryAddress = deliveryInfo.address1 || deliveryInfo.adresse_livraison || 'N/A';
  const deliveryCity = deliveryInfo.city || deliveryInfo.ville_livraison || 'N/A';
  const deliveryZipCode = deliveryInfo.zipcode || deliveryInfo.code_postal_livraison || 'N/A';
  const deliveryCountry = deliveryInfo.country || deliveryInfo.pays_livraison || 'N/A';
  const telephone = deliveryInfo.telephone_destinataire || deliveryInfo.telephone || '';

  addStyledText(doc, 'Informations de livraison:', margin, 135, fontSizeH3, primaryColor, 'bold');
  addStyledText(doc, `Nom: ${deliveryName}`, margin, 135 + lineHeight * 2, fontSizeBody, textColor);
  addStyledText(doc, `Adresse: ${deliveryAddress}, ${deliveryZipCode} ${deliveryCity}, ${deliveryCountry}`, margin, 135 + lineHeight * 3, fontSizeBody, textColor);
  addStyledText(doc, `Téléphone: ${telephone}`, margin, 135 + lineHeight * 4, fontSizeBody, textColor);

  // Add line separator
  addLineSeparator(doc, 185);

  // Prepare product items for the table
  const productItems = orderData.product_items || orderData.items || [];
  const tableData = productItems.map((item: any) => [
    item.name || item.nom_product_snapshot || 'N/A',
    item.quantity || item.quantity_ordered || 1,
    formatPrice(item.price || item.price_product_snapshot || 0),
  ]);

  // Define table headers
  const headers = ['Produit', 'Quantité', 'Prix'];

  // Configure table styling
  const tableConfig = {
    startY: 200,
    head: [headers],
    body: tableData,
    headStyles: { fillColor: primaryColor, textColor: '#FFFFFF', fontStyle: 'bold' },
    bodyStyles: { textColor: textColor },
    columnStyles: {
      0: { fontStyle: 'bold' },
    },
    styles: {
      fontSize: fontSizeBody - 2,
      lineColor: lightGray,
    },
  };

  // Add product table
  (doc as any).autoTable(tableConfig);

  // Fetch the final Y position of the table
  const finalY = (doc as any).autoTable.previous.finalY;

  // Add line separator
  addLineSeparator(doc, finalY + 15);

  // Add total amounts
  const totalAmount = orderData.total_amount || orderData.sous_total_order || 0;
  const shippingCost = orderData.shipping_cost || orderData.delivery_cost_order || 0;
  const discountAmount = orderData.discount_amount || orderData.discount_amount_order || 0;
  const grandTotal = orderData.total_order || (totalAmount + shippingCost - discountAmount);

  addStyledText(doc, `Total: ${formatPrice(totalAmount)}`, doc.internal.pageSize.getWidth() - margin - 100, finalY + 30, fontSizeH3, primaryColor, 'bold');
  addStyledText(doc, `Livraison: ${formatPrice(shippingCost)}`, doc.internal.pageSize.getWidth() - margin - 100, finalY + 30 + lineHeight * 2, fontSizeH3, primaryColor, 'bold');
  addStyledText(doc, `Réduction: ${formatPrice(discountAmount)}`, doc.internal.pageSize.getWidth() - margin - 100, finalY + 30 + lineHeight * 3, fontSizeH3, primaryColor, 'bold');
  addStyledText(doc, `Total à payer: ${formatPrice(grandTotal)}`, doc.internal.pageSize.getWidth() - margin - 100, finalY + 30 + lineHeight * 4, fontSizeH3, primaryColor, 'bold');

  // Add footer
  const footerText = 'Merci de votre commande!';
  addStyledText(doc, footerText, margin, doc.internal.pageSize.getHeight() - margin, fontSizeBody, lightGray);

  // Save the PDF
  doc.save(`facture_commande_${orderNumber}.pdf`);
};

// Keep the old export for backward compatibility
export const generateOrderReceipt = generateOrderReceiptPDF;
