
import { useState, useEffect } from 'react';

export interface IncompleteOrderChild {
  name: string;
  age: string;
  message: string;
  photoUrl: string;
  photoData?: string; // Base64 encoded photo data - kept for localStorage storage
  photo?: File;
  objective: string;
}

export interface IncompleteOrder {
  id: string;
  children: IncompleteOrderChild[];
  selectedPlan?: {
    name: string;
    price: number;
    features: string[];
  };
  createdAt: number;
  lastUpdated: number;
}

const INCOMPLETE_ORDER_KEY = 'magical_stories_incomplete_order';
const ORDER_EXPIRY_DAYS = 7; // 1 week

// Helper function to convert File to base64 - kept for localStorage storage
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const useIncompleteOrder = () => {
  const [incompleteOrder, setIncompleteOrder] = useState<IncompleteOrder | null>(null);

  // Load incomplete order from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem(INCOMPLETE_ORDER_KEY);
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        const now = Date.now();
        const oneWeekAgo = now - (ORDER_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        
        // Check if order is still valid (not expired)
        if (parsedOrder.lastUpdated > oneWeekAgo) {
          setIncompleteOrder(parsedOrder);
        } else {
          // Remove expired order
          localStorage.removeItem(INCOMPLETE_ORDER_KEY);
        }
      } catch (error) {
        console.error('Error loading incomplete order from localStorage:', error);
        localStorage.removeItem(INCOMPLETE_ORDER_KEY);
      }
    }
  }, []);

  const saveIncompleteOrder = async (orderData: Omit<IncompleteOrder, 'id' | 'createdAt' | 'lastUpdated'>) => {
    const now = Date.now();
    
    // Convert photos to base64 for storage
    const childrenWithPhotos = await Promise.all(
      orderData.children.map(async (child) => {
        if (child.photo && !child.photoData) {
          try {
            const photoData = await fileToBase64(child.photo);
            return { ...child, photoData, photoUrl: photoData };
          } catch (error) {
            console.error('Error converting photo to base64 for localStorage:', error);
            return child;
          }
        }
        return child;
      })
    );
    
    const order: IncompleteOrder = {
      ...orderData,
      children: childrenWithPhotos,
      id: `incomplete_${now}`,
      createdAt: incompleteOrder?.createdAt || now,
      lastUpdated: now,
    };
    
    setIncompleteOrder(order);
    localStorage.setItem(INCOMPLETE_ORDER_KEY, JSON.stringify(order));
  };

  const updateIncompleteOrder = async (updates: Partial<Omit<IncompleteOrder, 'id' | 'createdAt'>>) => {
    if (incompleteOrder) {
      let updatedChildren = updates.children || incompleteOrder.children;
      
      // If children are being updated, handle photo conversion for localStorage
      if (updates.children) {
        updatedChildren = await Promise.all(
          updates.children.map(async (child) => {
            if (child.photo && !child.photoData) {
              try {
                const photoData = await fileToBase64(child.photo);
                return { ...child, photoData, photoUrl: photoData };
              } catch (error) {
                console.error('Error converting photo to base64 for localStorage:', error);
                return child;
              }
            }
            return child;
          })
        );
      }
      
      const updatedOrder = {
        ...incompleteOrder,
        ...updates,
        children: updatedChildren,
        lastUpdated: Date.now(),
      };
      
      setIncompleteOrder(updatedOrder);
      localStorage.setItem(INCOMPLETE_ORDER_KEY, JSON.stringify(updatedOrder));
    }
  };

  const clearIncompleteOrder = () => {
    setIncompleteOrder(null);
    localStorage.removeItem(INCOMPLETE_ORDER_KEY);
  };

  const hasIncompleteOrder = () => {
    return incompleteOrder !== null;
  };

  return {
    incompleteOrder,
    saveIncompleteOrder,
    updateIncompleteOrder,
    clearIncompleteOrder,
    hasIncompleteOrder,
  };
};
