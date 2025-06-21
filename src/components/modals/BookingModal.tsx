
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { CalendarIcon, Clock, User, Mail, Phone, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
];

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t('booking.nameRequired');
    }
    if (!email.trim()) {
      newErrors.email = t('booking.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('booking.emailInvalid');
    }
    if (!phone.trim()) {
      newErrors.phone = t('booking.phoneRequired');
    }
    if (!selectedDate) {
      newErrors.date = t('booking.dateRequired');
    }
    if (!selectedTime) {
      newErrors.time = t('booking.timeRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      toast({
        title: t('booking.success'),
        description: `${format(selectedDate!, 'PPP')} at ${selectedTime}`,
      });
      // Reset form
      setSelectedDate(undefined);
      setSelectedTime('');
      setName('');
      setEmail('');
      setPhone('');
      setErrors({});
      onClose();
    } else {
      toast({
        title: t('booking.error'),
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700">
        <DialogHeader className="relative pb-6">
          <button
            onClick={handleClose}
            className="absolute right-0 top-0 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <DialogTitle className="text-2xl font-serif text-center">
            {t('booking.title')}
          </DialogTitle>
          <p className="text-slate-300 text-center mt-2">
            {t('booking.subtitle')}
          </p>
        </DialogHeader>

        <div className="space-y-8">
          {/* Date Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {t('booking.selectDate')}
            </h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-slate-800 border-slate-600 text-white hover:bg-slate-700",
                    !selectedDate && "text-slate-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-red-400 text-sm">{errors.date}</p>}
          </div>

          {/* Time Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t('booking.selectTime')}
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={cn(
                    "h-12",
                    selectedTime === time
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                  )}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
            {errors.time && <p className="text-red-400 text-sm">{errors.time}</p>}
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('booking.personalInfo')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('booking.name')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:border-white focus:outline-none"
                  placeholder={t('booking.name')}
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('booking.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:border-white focus:outline-none"
                  placeholder={t('booking.email')}
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('booking.phone')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:border-white focus:outline-none"
                  placeholder={t('booking.phone')}
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full h-12 bg-white text-black hover:bg-gray-200 font-medium text-lg"
          >
            {t('booking.submit')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
