
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-40 animate-fade-in">
      <div className="px-4 md:px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('common.search')}
              className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-lg"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Recherchez parmi nos collections de mode premium
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
