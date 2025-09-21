import React, { useState } from 'react';
import { Button } from './ui/button';
import { X, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { usePWA } from '../hooks/usePWA';

export const PWAInstallPrompt = () => {
  const { isInstallable, installApp } = usePWA();
  const [isVisible, setIsVisible] = useState(true);

  if (!isInstallable || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 z-50 md:bottom-6 md:right-6 md:left-auto md:max-w-sm">
      <Card className="gold-border shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gold text-lg">تثبيت التطبيق</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            ثبّت تطبيق إنابة ومعلومة على جهازك للوصول السريع والمباشر!
          </p>
          <div className="flex gap-2">
            <Button
              variant="gold"
              onClick={installApp}
              className="flex-1"
            >
              <Download className="ml-2 h-4 w-4" />
              تثبيت التطبيق
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsVisible(false)}
            >
              لاحقاً
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};