
import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

export interface OrderPdf {
  id: string;
  order_id: string;
  pdf_type: 'cover' | 'content';
  pdf_url: string;
  original_filename: string;
  uploaded_at: string;
}

export const orderPdfService = {
  async uploadPdf(orderId: string, pdfType: 'cover' | 'content', file: File): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('order_id', orderId);
      formData.append('pdf_type', pdfType);

      const response = await axios.post(`${API_BASE_URL}/upload_order_pdf.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      return {
        success: false,
        message: 'Erreur lors du téléchargement du PDF'
      };
    }
  },

  async getOrderPdfs(orderId: string): Promise<{ success: boolean; data?: OrderPdf[]; message?: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_order_pdfs.php?order_id=${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order PDFs:', error);
      return {
        success: false,
        message: 'Erreur lors du chargement des PDFs'
      };
    }
  }
};
