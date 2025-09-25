"use client";

import { SignUpForm } from '../components/auth/SignUpForm';
import { useSession } from '../contexts/SessionContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

const Signup = () => {
  const { session } = useSession();

  if (session) {
    return <Navigate to="/" replace />;
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
            <SignUpForm />
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