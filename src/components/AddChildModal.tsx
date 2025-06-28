
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, X } from 'lucide-react';
import { childService } from '@/services/childService';
import { toast } from '@/hooks/use-toast';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onChildAdded: () => void;
}

const AddChildModal = ({ isOpen, onClose, userId, onChildAdded }: AddChildModalProps) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Age options from 1 to 18
  const ageOptions = Array.from({ length: 18 }, (_, i) => i + 1);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale autorisée est de 5MB",
          variant: "destructive",
        });
        return;
      }

      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !age.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir le nom et l'âge de l'enfant",
        variant: "destructive",
      });
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 18) {
      toast({
        title: "Âge invalide",
        description: "L'âge doit être entre 1 et 18 ans",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      let photoUrl = '';

      // Upload photo if provided
      if (photo) {
        setIsUploading(true);
        const uploadResult = await childService.uploadImage(photo);
        if (uploadResult.success && uploadResult.data) {
          photoUrl = uploadResult.data.image_url;
        } else {
          toast({
            title: "Erreur",
            description: "Erreur lors du téléchargement de la photo",
            variant: "destructive",
          });
          return;
        }
        setIsUploading(false);
      }

      // Save child data - ensure all required fields are present
      const childData = {
        user_id: userId,
        name: name.trim(),
        age: ageNum,
        objective: '', // Required by API but empty for quick add
        message: '', // Required by API but empty for quick add
        photo_url: photoUrl
      };

      console.log('Sending child data:', childData);
      const result = await childService.addChild(childData);
      
      if (result.success) {
        toast({
          title: "Enfant ajouté",
          description: `${name} a été ajouté avec succès`,
        });
        
        // Reset form
        setName('');
        setAge('');
        setPhoto(null);
        setPhotoPreview(null);
        
        onChildAdded();
        onClose();
      } else {
        toast({
          title: "Erreur",
          description: result.message || "Erreur lors de l'ajout de l'enfant",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding child:', error);
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[95vw] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-slate-800">
            Ajouter un nouvel enfant
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Aperçu"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-pink-200"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-dashed border-pink-300 flex items-center justify-center bg-pink-50">
                  <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400" />
                </div>
              )}
            </div>
            
            <div className="text-center">
              <Label
                htmlFor="photo-upload"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg cursor-pointer hover:from-pink-600 hover:to-purple-600 transition-all duration-300 text-sm sm:text-base"
              >
                <Upload className="w-4 h-4" />
                <span>{photoPreview ? 'Changer la photo' : 'Ajouter une photo'}</span>
              </Label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={isUploading || isSaving}
              />
              <p className="text-xs text-slate-500 mt-1">Optionnel • Max 5MB</p>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="child-name" className="text-sm font-medium text-slate-700">
              Prénom de l'enfant *
            </Label>
            <Input
              id="child-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrez le prénom"
              className="w-full"
              disabled={isSaving}
              required
            />
          </div>

          {/* Age Select */}
          <div className="space-y-2">
            <Label htmlFor="child-age" className="text-sm font-medium text-slate-700">
              Âge *
            </Label>
            <Select value={age} onValueChange={setAge} disabled={isSaving}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez l'âge" />
              </SelectTrigger>
              <SelectContent>
                {ageOptions.map((ageOption) => (
                  <SelectItem key={ageOption} value={ageOption.toString()}>
                    {ageOption} an{ageOption > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-50"
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSaving || isUploading || !name.trim() || !age.trim()}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            >
              {isSaving ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Ajout en cours...</span>
                </div>
              ) : (
                'Ajouter l\'enfant'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChildModal;
