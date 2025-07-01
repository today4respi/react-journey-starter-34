// Utility function to get product images from server only
export const getProductImage = (originalImage: string, productId?: string) => {
  // If original image is null, empty, or placeholder, return a default server image
  if (!originalImage || originalImage === 'null' || originalImage === '/placeholder.svg' || originalImage.includes('placeholder')) {
    return `https://draminesaid.com/lucci/uploads/1.jpg`; // Default server image
  }
  
  // If it's already a full URL (starts with http or https), return as is
  if (originalImage.startsWith('http')) {
    return originalImage;
  }
  
  // For all API images, construct the full URL with the server path
  // Remove any leading slash to avoid double slashes
  const cleanPath = originalImage.startsWith('/') ? originalImage.substring(1) : originalImage;
  
  // If it already starts with 'uploads/', use it directly
  if (cleanPath.startsWith('uploads/')) {
    return `https://draminesaid.com/lucci/${cleanPath}`;
  }
  
  // Otherwise, assume it needs the uploads/ prefix
  return `https://draminesaid.com/lucci/uploads/${cleanPath}`;
};

// Remove the random product image function and uploaded images array since we only want server images
export const getRandomProductImage = (productId?: string) => {
  // Always return a default server image instead of random lovable uploads
  return `https://draminesaid.com/lucci/uploads/1.jpg`;
};
