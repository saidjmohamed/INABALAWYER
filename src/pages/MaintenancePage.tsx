import { HardHat } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      <HardHat className="h-24 w-24 text-yellow-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-3">الموقع تحت الصيانة</h1>
      <p className="text-lg text-gray-600">
        نحن نقوم ببعض التحديثات لتحسين تجربتك. سنعود قريبًا!
      </p>
    </div>
  );
};

export default MaintenancePage;