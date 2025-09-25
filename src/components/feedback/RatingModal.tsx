"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label'; // إضافة الاستيراد المفقود
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2 } from 'lucide-react';

interface RatingModalProps {
  trigger: React.ReactNode;
}

export const RatingModal = ({ trigger }: RatingModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('ratings')
        .insert({ rating: parseInt(rating), comment: comment || null });

      if (error) throw error;

      showSuccess('شكرًا لتقييمك! رأيك مهم لنا.');
      setRating('');
      setComment('');
      setIsOpen(false);
    } catch (error: any) {
      showError('فشل في إرسال التقييم: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>قيم التطبيق</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>تقييمك (1-5 نجوم)</Label>
            <RadioGroup value={rating} onValueChange={setRating} className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value={value.toString()} id={`star-${value}`} />
                  <Label htmlFor={`star-${value}`} className="font-normal">
                    <Star className={`h-4 w-4 ${value <= parseInt(rating || '0') ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>تعليق (اختياري)</Label>
            <Textarea
              placeholder="ما رأيك في التطبيق؟"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={!rating || isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Star className="h-4 w-4 mr-2" />}
              إرسال التقييم
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};