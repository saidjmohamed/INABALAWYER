import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="container mx-auto p-4 text-center mt-20">
      <h1 className="text-4xl font-bold mb-4">مرحباً بك في منصة المساعدة القانونية</h1>
      <p className="text-lg text-gray-600 mb-8">
        تواصل مع المحامين واحصل على المساعدة التي تحتاجها بسهولة.
      </p>
      <div className="space-x-4" dir="rtl">
        <Button asChild>
          <Link to="/requests">عرض الطلبات</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/login">تسجيل الدخول</Link>
        </Button>
      </div>
    </div>
  );
}