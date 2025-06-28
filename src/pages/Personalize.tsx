
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useIncompleteOrder } from '@/hooks/useIncompleteOrder';
import ChildForm from '@/components/ChildForm';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

const Personalize = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { saveIncompleteOrder, updateIncompleteOrder, incompleteOrder } = useIncompleteOrder();
  const childCount = location.state?.childCount || 1;
  
  const [currentChildIndex, setCurrentChildIndex] = useState(0);
  const [children, setChildren] = useState(() => 
    Array.from({ length: childCount }, () => ({
      name: '',
      age: '6',
      objective: '',
      message: '',
      photoUrl: '',
      photo: null as File | null
    }))
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Load data from incomplete order if it exists
  useEffect(() => {
    if (incompleteOrder?.children) {
      const loadedChildren = incompleteOrder.children.map(child => ({
        name: child.name,
        age: child.age,
        objective: child.objective,
        message: child.message,
        photoUrl: child.photoUrl,
        photo: child.photo || null
      }));
      setChildren(loadedChildren);
    }
  }, [incompleteOrder]);

  // Convert File to base64 for storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handlePhotoUpload = async (file: File | null) => {
    if (!file) {
      console.log('No file provided for upload');
      return;
    }

    console.log('Processing high-quality photo for file:', file.name);
    setIsProcessing(true);
    
    try {
      // Create a higher quality version of the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = async () => {
        // Increased maximum size for better quality (from 300 to 800px)
        const MAX_SIZE = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height = (height * MAX_SIZE) / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = (width * MAX_SIZE) / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Improved quality settings for better image quality
        canvas.toBlob(async (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            try {
              // Convert to base64 for preview
              const base64Url = await fileToBase64(compressedFile);
              
              // Update child with photo data
              updateChild('photoUrl', base64Url);
              updateChild('photo', compressedFile);
              
              toast.success('Photo haute qualité ajoutée avec succès !');
              console.log('High-quality photo processed and stored locally');
            } catch (error) {
              console.error('Error converting photo to base64:', error);
              toast.error('Erreur lors du traitement de la photo');
            }
          }
          setIsProcessing(false);
        }, 'image/jpeg', 0.95); // Increased quality from 0.8 to 0.95 for better image quality
      };
      
      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('Error processing photo:', error);
      toast.error('Erreur lors du traitement de la photo');
      setIsProcessing(false);
    }
  };

  const updateChild = (field: string, value: string | File) => {
    console.log('Updating child field:', field, 'with value:', typeof value === 'object' ? 'File object' : value);
    setChildren(prev => prev.map((child, index) => 
      index === currentChildIndex 
        ? { ...child, [field]: value }
        : child
    ));
  };

  const handleNext = async () => {
    const currentChild = children[currentChildIndex];
    
    if (!currentChild.name.trim()) {
      toast.error('Veuillez saisir le prénom de l\'enfant');
      return;
    }

    if (!currentChild.age) {
      toast.error('Veuillez sélectionner l\'âge de l\'enfant');
      return;
    }

    if (!currentChild.objective) {
      toast.error('Veuillez choisir un objectif');
      return;
    }

    if (!currentChild.photoUrl) {
      toast.error('Veuillez ajouter une photo de l\'enfant');
      return;
    }

    if (!currentChild.message.trim()) {
      toast.error('Veuillez saisir un message personnalisé');
      return;
    }

    // Save to localStorage
    try {
      await saveIncompleteOrder({
        children: children.map(child => ({
          name: child.name,
          age: child.age,
          message: child.message,
          photoUrl: child.photoUrl,
          photo: child.photo,
          objective: child.objective
        }))
      });
      console.log('Data saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    if (currentChildIndex < children.length - 1) {
      setCurrentChildIndex(currentChildIndex + 1);
    } else {
      // All children completed, navigate to plan selection
      navigate('/plan-selection', { state: { children } });
    }
  };

  const handlePrevious = () => {
    if (currentChildIndex > 0) {
      setCurrentChildIndex(currentChildIndex - 1);
    } else {
      navigate('/child-count');
    }
  };

  const currentChild = children[currentChildIndex];

  const handleChildUpdate = (field: keyof typeof currentChild, value: string | File) => {
    updateChild(field, value);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden font-baloo"
      style={{
        background: 'linear-gradient(135deg, #87CEEB 0%, #FFB6C1 25%, #DDA0DD 50%, #98FB98 75%, #F0E68C 100%)'
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-20 h-20 bg-gradient-to-br from-green-200 to-teal-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-700 mb-4">
            Personnalisez votre livre
          </h1>
          <p className="text-slate-600">
            Ajoutez les détails de chaque enfant pour une histoire unique
          </p>
        </div>

        {/* Progress steps */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div className="w-6 md:w-8 h-1 bg-green-400"></div>
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">2</span>
            </div>
            <div className="w-6 md:w-8 h-1 bg-gray-300"></div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-bold">3</span>
            </div>
            <div className="w-6 md:w-8 h-1 bg-gray-300"></div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-bold">4</span>
            </div>
          </div>
        </div>

        {/* Progress indicator with numbers for children - only show if more than one child */}
        {children.length > 1 && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              {children.map((_, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
                      index === currentChildIndex 
                        ? 'bg-orange-400 text-white' 
                        : index < currentChildIndex 
                          ? 'bg-green-400 text-white' 
                          : 'bg-white/60 text-slate-700'
                    }`}
                  >
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  {index < children.length - 1 && (
                    <div className={`w-8 h-1 ${index < currentChildIndex ? 'bg-green-400' : 'bg-white/40'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main content */}
        <ChildForm
          child={currentChild}
          childNumber={currentChildIndex + 1}
          totalChildren={children.length}
          onUpdate={handleChildUpdate}
          onPhotoUpload={handlePhotoUpload}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-2xl mx-auto mt-8">
          <Button
            onClick={handlePrevious}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-300 hover:border-orange-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Précédent
          </Button>

          <Button
            onClick={handleNext}
            disabled={!currentChild.name.trim() || isProcessing}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-all duration-300
              ${currentChild.name.trim() && !isProcessing
                ? 'bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 shadow-lg hover:shadow-xl transform hover:scale-105' 
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            {isProcessing ? (
              'Traitement...'
            ) : currentChildIndex === children.length - 1 ? (
              <>
                Continuer
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                Suivant
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      <TestimonialsCarousel />
    </div>
  );
};

export default Personalize;
