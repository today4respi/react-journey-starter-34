
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Truck, Loader2 } from 'lucide-react';
import { deliveryLinkService } from '@/services/deliveryLinkService';
import { deliveryNotificationService } from '@/services/deliveryNotificationService';
import { useToast } from '@/hooks/use-toast';

interface DeliveryLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  onSuccess: () => void;
}

interface DeliveryLinkForm {
  tracking_url: string;
  carrier_name: string;
  tracking_number: string;
}

const DeliveryLinkModal = ({ 
  isOpen, 
  onClose, 
  orderId, 
  orderNumber, 
  customerEmail, 
  customerName, 
  onSuccess 
}: DeliveryLinkModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<DeliveryLinkForm>({
    defaultValues: {
      tracking_url: '',
      carrier_name: '',
      tracking_number: ''
    }
  });

  const onSubmit = async (data: DeliveryLinkForm) => {
    setLoading(true);
    
    try {
      // First, add the delivery link
      const deliveryResponse = await deliveryLinkService.addDeliveryLink(
        orderId,
        data.tracking_url,
        data.carrier_name || undefined,
        data.tracking_number || undefined
      );
      
      if (deliveryResponse.success) {
        // Then send the delivery notification email
        const emailResponse = await deliveryNotificationService.sendDeliveryNotification({
          customer_email: customerEmail,
          customer_name: customerName,
          order_number: orderNumber,
          tracking_url: data.tracking_url,
          carrier_name: data.carrier_name || undefined,
          tracking_number: data.tracking_number || undefined
        });
        
        if (emailResponse.success) {
          toast({
            title: "Succès",
            description: "Lien de suivi ajouté et email de notification envoyé avec succès"
          });
        } else {
          toast({
            title: "Succès partiel",
            description: "Lien de suivi ajouté, mais erreur lors de l'envoi de l'email de notification"
          });
        }
        
        form.reset();
        onSuccess();
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: deliveryResponse.message || "Erreur lors de l'ajout du lien de suivi"
        });
      }
    } catch (error) {
      console.error('Error adding delivery link:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de l'ajout du lien de suivi"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5 text-orange-500" />
            Ajouter un Lien de Suivi
          </DialogTitle>
          <p className="text-sm text-gray-600">Commande: {orderNumber}</p>
          <p className="text-sm text-gray-500">Client: {customerName}</p>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tracking_url"
              rules={{
                required: "L'URL de suivi est requise",
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "L'URL doit commencer par http:// ou https://"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de Suivi *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://www.dhl.com/tracking/..."
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="carrier_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transporteur</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="DHL, Colissimo, Chronopost..."
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tracking_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de Suivi</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Numéro de colis"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                📧 Un email de notification sera automatiquement envoyé au client avec les détails de suivi.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ajout...
                  </>
                ) : (
                  'Ajouter le Lien'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryLinkModal;
