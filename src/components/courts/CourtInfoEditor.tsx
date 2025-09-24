import { useState } from 'react';
import { Court } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, X } from 'lucide-react';

interface CourtInfoEditorProps {
  court: Court;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CourtInfoEditor = ({ court, onSuccess, onCancel }: CourtInfoEditorProps) => {
  const [formData, setFormData] = useState({
    lawyer_room_phone: court.lawyer_room_phone || '',
    address: court.address || '',
    working_hours: court.working_hours || '',
    municipalities: court.municipalities ? court.municipalities.join('، ') : ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const municipalitiesArray = formData.municipalities
        .split('،')
        .map(m => m.trim())
        .filter(m => m);

      const { error } = await supabase
        .from('courts')
        .update({
          lawyer_room_phone: formData.lawyer_room_phone || null,
          address: formData.address || null,
          working_hours: formData.working_hours || null,
          municipalities: municipalitiesArray.length > 0 ? municipalitiesArray : null
        })
        .eq('id', court.id);

      if (error) throw error;

      showSuccess('تم تحديث معلومات المحكمة بنجاح');
      onSuccess();
    } catch (error: any) {
      showError('فشل في تحديث المعلومات: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">هاتف قاعة المحامين</label>
        <Input
          name="lawyer_room_phone"
          value={formData.lawyer_room_phone}
          onChange={handleChange}
          placeholder="أدخل رقم الهاتف"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">العنوان</label>
        <Textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="أدخل عنوان المحكمة"
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">أوقات العمل</label>
        <Input
          name="working_hours"
          value={formData.working_hours}
          onChange={handleChange}
          placeholder="مثال: 8:00 - 16:00 من الإثنين إلى الخميس"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          البلديات التابعة (افصل بينها بفاصلة عربية "،")
        </label>
        <Textarea
          name="municipalities"
          value={formData.municipalities}
          onChange={handleChange}
          placeholder="أدخل البلديات مفصولة بفاصلة عربية ،"
          rows={3}
        />
        <p className="text-sm text-gray-500 mt-1">مثال: الجزائر الوسطى، باب الوادي، القصبة</p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'حفظ التغييرات'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          <X className="ml-2 h-4 w-4" />
          إلغاء
        </Button>
      </div>
    </form>
  );
};