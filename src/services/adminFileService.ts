
import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

export interface AdminPdf {
  id: string;
  order_id: string;
  pdf_type: 'cover' | 'content';
  pdf_url: string;
  original_filename: string;
  uploaded_at: string;
  order_number?: string;
  customer_name?: string;
  customer_email?: string;
}

export interface AdminPdfsResponse {
  success: boolean;
  data?: AdminPdf[];
  message?: string;
}

export interface DeletePdfResponse {
  success: boolean;
  message?: string;
}

export const adminFileService = {
  async getAllPdfs(): Promise<AdminPdfsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_all_pdfs.php`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      return {
        success: false,
        message: 'Erreur lors du chargement des fichiers'
      };
    }
  },

  async deletePdf(pdfId: string): Promise<DeletePdfResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/delete_pdf.php`, {
        pdf_id: pdfId
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error deleting PDF:', error);
      return {
        success: false,
        message: 'Erreur lors de la suppression du fichier'
      };
    }
  }
};
