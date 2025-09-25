"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label'; // إضافة الاستيراد المفقود
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2 } from 'lucide-react';

interface SuggestionModalProps {
  trigger: React.ReactNode;
}

export const SuggestionModal = ({ trigger }: SuggestionModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('suggestions')
        .insert({ suggestion_text: suggestion.trim(), email: email.trim() || null });

      if (error) throw error;

      showSuccess('شكرًا لاقتراحك! سنراجعه قريبًا.');
      setSuggestion('');
      setEmail('');
      setIsOpen(false);
    } catch (error: any) {
      showError('فشل في إرسال الاقتراح: ' + error.message);
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
          <DialogTitle>اقترح إضافة جديدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>اقتراحك</Label>
            <Textarea
              placeholder="ما الإضافة التي تريدها في التطبيق؟ (مثال: ميزة بحث متقدمة)"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>بريدك الإلكتروني (اختياري، للرد عليك)</Label>
            <Input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={!suggestion.trim() || isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lightbulb className="h-4 w-4 mr-2" />}
              إرسال الاقتراح
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};