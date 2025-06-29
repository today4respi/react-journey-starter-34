
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useIncompleteOrder } from '@/hooks/useIncompleteOrder';
import { useIsMobile } from '@/hooks/use-mobile';
import CartDropdown from './CartDropdown';

const CartIcon = () => {
  const { getTotalItems } = useCart();
  const { hasIncompleteOrder } = useIncompleteOrder();
  const isMobile = useIsMobile();
  const cartItemCount = getTotalItems();
  const incompleteOrderCount = hasIncompleteOrder() ? 1 : 0;
  const totalCount = cartItemCount + incompleteOrderCount;

  return (
    <CartDropdown>
      <Button
        variant="ghost"
        size="sm"
        className="relative p-3 hover:bg-slate-100 transition-colors rounded-lg"
      >
        <ShoppingCart className="w-9 h-9 sm:w-10 sm:h-10 text-slate-700" />
        {totalCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-gradient-to-r from-orange-500 to-pink-500 border-0"
          >
            {totalCount > 99 ? '99+' : totalCount}
          </Badge>
        )}
      </Button>
    </CartDropdown>
  );
};

export default CartIcon;
