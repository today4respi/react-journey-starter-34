
import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RZrq1RAsAdv0igokkM3KeaDCdu1GaMdlE0ZYEUyXlrl0sMEtcMCsvpbZubKFlnlE1yt0mR2j5hC38k8Qzz9LnLL00kEVqKuaN';

export interface Child {
  id?: string;
  name: string;
  age: number;
  objective?: string;
  message?: string;
  photoUrl?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface CreateOrderRequest {
  user_id: string;
  plan_type: 'onetime' | 'subscription';
  children: Child[];
  customer_info: CustomerInfo;
  payment_intent_id?: string;
  stripe_session_id?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data?: {
    order_id: string;
    order_number: string;
    total_amount: number;
    currency: string;
  };
  message?: string;
}

export interface StripeCheckoutData {
  plan_type: 'onetime' | 'subscription';
  children: Child[];
  customer_info: CustomerInfo;
  amount: number;
}

export const paymentService = {
  async createStripeCheckout(checkoutData: StripeCheckoutData): Promise<{ sessionId: string; url: string }> {
    try {
      console.log('Creating Stripe checkout with data:', checkoutData);

      // Validate data before sending
      if (!checkoutData.children || checkoutData.children.length === 0) {
        throw new Error('Au moins un enfant doit être sélectionné');
      }

      if (!checkoutData.customer_info) {
        throw new Error('Les informations client sont requises');
      }

      const requiredFields = ['name', 'email', 'address', 'city', 'postalCode'];
      for (const field of requiredFields) {
        if (!checkoutData.customer_info[field as keyof CustomerInfo] ||
            !String(checkoutData.customer_info[field as keyof CustomerInfo]).trim()) {
          throw new Error(`Le champ ${field} est requis`);
        }
      }

      if (!checkoutData.amount || checkoutData.amount <= 0) {
        throw new Error('Le montant doit être supérieur à 0');
      }

      // --- Add frontend_url to request payload for redirect after payment
      const payload = {
        ...checkoutData,
        frontend_url: typeof window !== "undefined" ? window.location.origin : undefined
      };

      // Create checkout session via backend API
      const response = await axios.post(`${API_BASE_URL}/create_stripe_session.php`, payload, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      console.log('Stripe session creation response:', response.data);

      if (!response.data.success || !response.data.session_id || !response.data.url) {
        throw new Error(response.data.message || 'Erreur lors de la création de la session de paiement');
      }

      return {
        sessionId: response.data.session_id,
        url: response.data.url
      };
    } catch (error) {
      console.error('Error creating Stripe checkout:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response data:', error.response.data);
          const errorMessage = error.response.data?.message ||
                             `Erreur serveur (${error.response.status})`;
          throw new Error(errorMessage);
        } else if (error.request) {
          console.error('No response received:', error.request);
          throw new Error('Aucune réponse du serveur. Veuillez vérifier votre connexion.');
        } else {
          console.error('Request setup error:', error.message);
          throw new Error('Erreur de configuration de la requête');
        }
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Erreur inconnue lors de la création de la session de paiement');
    }
  },

  async createOrderAfterPayment(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      console.log('Creating order after payment with data:', orderData);

      const response = await axios.post(`${API_BASE_URL}/create_order_after_payment.php`, orderData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      console.log('Order creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);

        // Add more explicit error surface from backend (message + trace if available)
        let errMessage = 'Erreur lors de la création de la commande';
        if (error.response.data?.message) {
          errMessage = error.response.data.message;
          // If a stack trace is present, add in dev mode for deep debug
          if (error.response.data.trace) {
            errMessage += `\n[trace]\n${error.response.data.trace}`;
          }
        }

        return {
          success: false,
          message: errMessage
        };
      }
      return {
        success: false,
        message: 'Erreur lors de la création de la commande (exception inconnue côté client)'
      };
    }
  },

  getStripePublishableKey(): string {
    return STRIPE_PUBLISHABLE_KEY;
  }
};
