
import { Trash2, Plus, Minus, Heart, User, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useIncompleteOrder } from '@/hooks/useIncompleteOrder';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface CartDropdownProps {
  children: React.ReactNode;
}

const CartDropdown = ({ children }: CartDropdownProps) => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const { incompleteOrder, clearIncompleteOrder } = useIncompleteOrder();
  const navigate = useNavigate();

  const handleViewCart = () => {
    navigate('/cart');
  };

  const handleCreateStory = () => {
    navigate('/child-count');
  };

  const handleContinueCheckout = () => {
    navigate('/checkout');
  };

  const handleRemoveIncompleteOrder = () => {
    clearIncompleteOrder();
  };

  const hasItems = items.length > 0 || incompleteOrder !== null;

  if (!hasItems) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-4 bg-white border shadow-lg" align="end">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Heart className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Votre panier est vide</h3>
            <p className="text-gray-500 text-sm mb-4">Découvrez nos histoires personnalisées magiques pour vos enfants !</p>
            <Button
              onClick={handleCreateStory}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-sm"
            >
              Créé vos histoire
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-4 bg-white border shadow-lg max-h-96 overflow-y-auto" align="end">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Votre panier</h3>
          
          <div className="space-y-3">
            {/* Incomplete Order */}
            {incompleteOrder && (
              <>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-orange-600 mr-2" />
                      <h4 className="font-medium text-sm text-orange-800">Commande en cours</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-orange-600 hover:text-orange-800"
                      onClick={handleRemoveIncompleteOrder}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Children details */}
                  <div className="space-y-2 mb-3">
                    {incompleteOrder.children.map((child, index) => (
                      <div key={index} className="bg-white rounded p-2 border border-orange-100">
                        <div className="flex items-center space-x-2">
                          {(child.photoUrl || child.photoData) && (
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <img 
                                src={child.photoData || child.photoUrl} 
                                alt={child.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs text-orange-800 truncate">
                              {child.name || `Enfant ${index + 1}`}
                            </p>
                            <p className="text-xs text-orange-600">
                              {child.age} ans {child.objective && `• ${child.objective}`}
                            </p>
                          </div>
                        </div>
                        {child.message && (
                          <p className="text-xs text-orange-700 mt-1 truncate">
                            "{child.message.length > 30 ? child.message.substring(0, 30) + '...' : child.message}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-orange-700 mb-2">
                    {incompleteOrder.selectedPlan?.name ? 
                      `Plan: ${incompleteOrder.selectedPlan.name} - ${incompleteOrder.selectedPlan.price}€` : 
                      'Plan non sélectionné'
                    }
                  </p>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleContinueCheckout}
                      size="sm"
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs"
                    >
                      Continuer
                    </Button>
                    <Button
                      onClick={handleViewCart}
                      variant="outline"
                      size="sm"
                      className="px-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {items.length > 0 && <DropdownMenuSeparator />}
              </>
            )}

            {/* Regular Cart Items */}
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-gray-600 text-xs">{item.price}€</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <span className="text-sm font-medium w-6 text-center">
                    {item.quantity}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-3 space-y-3">
            {items.length > 0 && (
              <div className="flex justify-between items-center font-semibold">
                <span>Total:</span>
                <span>{getTotalPrice().toFixed(2)}€</span>
              </div>
            )}

            {/* Enhanced call-to-action for non-connected users */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
              <div className="flex items-center text-orange-700 text-xs mb-1">
                <User className="w-3 h-3 mr-1" />
                <span className="font-medium">Conseil :</span>
              </div>
              <p className="text-orange-600 text-xs">
                Créez un compte pour sauvegarder votre panier et suivre vos commandes !
              </p>
            </div>
            
            <Button 
              onClick={handleViewCart}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Voir le panier
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartDropdown;
