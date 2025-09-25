"use client";

import { SignUpForm } from '../components/auth/SignUpForm';
import { useSession } from '../contexts/SessionContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const Signup = () => {
  const { session, loading: sessionLoading } = useSession();
  const [error, setError] = useState<string | null>(null);

  // حالة تحميل أثناء جلب الجلسة
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">جاري التحقق من حالة الحساب...</p>
        </div>
      </div>
    );
  }

  // إذا كان المستخدم مسجلاً بالفعل، حوّل إلى الصفحة الرئيسية
  if (session) {
    return <Navigate to="/" replace />;
  }

  // معالجة أي أخطاء عامة
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center p-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Button variant="outline" asChild>
            <Link to="/login">
              <ArrowRight className="mr-2 h-4 w-4" />
              العودة إلى تسجيل الدخول
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-gray-900">إنشاء حساب محام جديد</CardTitle>
            <p className="text-gray-600">انضم إلى مجتمع المحامين المهنيين</p>
          </CardHeader>
          <CardContent className="p-6">
            <SignUpForm onError={setError} />
          </CardContent>
          <div className="p-6 pt-0 text-center">
            <p className="text-sm text-gray-600">
              هل لديك حساب بالفعل؟{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                سجل الدخول من هنا
              </Link>
            </p>
          </div>
        </Card>
        <Button variant="outline" className="mt-6 w-full" asChild>
          <Link to="/">
            <ArrowRight className="mr-2 h-4 w-4" />
            العودة للصفحة الرئيسية
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Signup;