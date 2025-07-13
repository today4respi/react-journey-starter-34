import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
}

interface ContactFormProps {
  formData: ContactFormData;
  onFormChange: (field: keyof ContactFormData, value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
  isSubmitting = false
}) => {
  const isValid = formData.name && formData.email && formData.phone;

  return (
    <div className="p-4 border-t border-border bg-muted/50">
      <div className="space-y-3">
        <div>
          <Label htmlFor="contact-name" className="text-xs font-medium">Nom complet</Label>
          <Input
            id="contact-name"
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            placeholder="Votre nom complet"
            className="mt-1 h-8 text-xs"
            autoComplete="off"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="contact-email" className="text-xs font-medium">Email</Label>
          <Input
            id="contact-email"
            type="email"
            value={formData.email}
            onChange={(e) => onFormChange('email', e.target.value)}
            placeholder="votre@email.com"
            className="mt-1 h-8 text-xs"
            autoComplete="off"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="contact-phone" className="text-xs font-medium">Téléphone</Label>
          <Input
            id="contact-phone"
            value={formData.phone}
            onChange={(e) => onFormChange('phone', e.target.value)}
            placeholder="Votre numéro de téléphone"
            className="mt-1 h-8 text-xs"
            autoComplete="off"
            disabled={isSubmitting}
          />
        </div>
        <Button 
          onClick={onSubmit} 
          className="w-full h-8 text-xs bg-gradient-to-r from-primary to-accent"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Envoi...' : 'Envoyer'}
        </Button>
      </div>
    </div>
  );
};