
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface LanguageSelectorProps {
  variant?: 'default' | 'white';
}

const LanguageSelector = ({ variant = 'default' }: LanguageSelectorProps) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const buttonClasses = variant === 'white' 
    ? "text-white hover:text-white hover:bg-white/20 border-white/30" 
    : "text-gray-600 hover:text-gray-900";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={buttonClasses}>
          <Globe className="w-4 h-4 mr-1" />
          {i18n.language === 'fr' ? 'FR' : 'EN'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border shadow-lg">
        <DropdownMenuItem 
          onClick={() => changeLanguage('fr')}
          className="cursor-pointer hover:bg-gray-50"
        >
          Français
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className="cursor-pointer hover:bg-gray-50"
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
