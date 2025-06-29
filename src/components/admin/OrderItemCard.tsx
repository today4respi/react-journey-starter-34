
import { Button } from '@/components/ui/button';
import { Download, User } from 'lucide-react';
import { OrderItem } from '@/services/adminOrderService';
import { toast } from 'sonner';

interface OrderItemCardProps {
  item: OrderItem;
  index: number;
}

const OrderItemCard = ({ item, index }: OrderItemCardProps) => {
  const handleDownloadPhoto = async () => {
    if (!item.child_photo) {
      toast.error('Aucune photo disponible');
      return;
    }

    try {
      console.log('Starting download for:', item.child_name, 'URL:', item.child_photo);
      
      // Create a temporary link element for direct download
      const link = document.createElement('a');
      
      // Set the href directly to the image URL
      link.href = item.child_photo;
      
      // Set download attribute with a proper filename
      const fileName = `${item.child_name.replace(/\s+/g, '_')}_photo_${item.order_id}.jpg`;
      link.download = fileName;
      
      // Set target to _blank to open in new tab if download fails
      link.target = '_blank';
      
      // Add to DOM temporarily
      document.body.appendChild(link);
      
      // Try to trigger download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      
      toast.success('Téléchargement initié ! Si le téléchargement ne démarre pas, la photo s\'ouvrira dans un nouvel onglet.');
      
    } catch (error) {
      console.error('Error downloading photo:', error);
      
      // Fallback: open image in new tab
      try {
        window.open(item.child_photo, '_blank');
        toast.info('Photo ouverte dans un nouvel onglet. Vous pouvez faire clic droit pour l\'enregistrer.');
      } catch (fallbackError) {
        console.error('Fallback failed:', fallbackError);
        toast.error('Impossible de télécharger ou d\'afficher la photo');
      }
    }
  };

  // Check if we have a valid photo URL
  const hasValidPhoto = item.child_photo && 
    (item.child_photo.startsWith('http') || item.child_photo.startsWith('/'));

  return (
    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <p className="font-medium text-orange-900">{item.book_title}</p>
        </div>
        <p className="font-bold text-orange-900">€{Number(item.price || 0).toFixed(2)}</p>
      </div>
      
      <div className="flex gap-4">
        {/* Child Photo */}
        <div className="flex-shrink-0">
          {hasValidPhoto ? (
            <div className="relative group">
              <img 
                src={item.child_photo} 
                alt={`Photo de ${item.child_name}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-300"
                onError={(e) => {
                  console.error('Error loading image for:', item.child_name);
                  console.error('Failed image URL:', item.child_photo);
                  // Hide the broken image and show fallback
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.classList.remove('hidden');
                  }
                }}
                onLoad={() => {
                  console.log('Image loaded successfully for:', item.child_name);
                }}
              />
              <div className="w-16 h-16 rounded-full bg-orange-200 border-2 border-orange-300 flex items-center justify-center hidden">
                <User className="h-8 w-8 text-orange-500" />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPhoto}
                className="absolute -bottom-2 -right-2 w-8 h-8 p-0 bg-white border-orange-300 hover:bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Télécharger la photo"
              >
                <Download className="h-3 w-3 text-orange-600" />
              </Button>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-orange-200 border-2 border-orange-300 flex items-center justify-center">
              <User className="h-8 w-8 text-orange-500" />
              <span className="sr-only">Aucune photo disponible</span>
            </div>
          )}
        </div>
        
        {/* Child Details */}
        <div className="flex-1 text-orange-700 text-sm">
          <p><strong>Enfant:</strong> {item.child_name} ({item.child_age} ans)</p>
          {item.child_objective && (
            <p><strong>Objectif:</strong> {item.child_objective}</p>
          )}
          {item.child_message && (
            <p><strong>Message:</strong> {item.child_message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
