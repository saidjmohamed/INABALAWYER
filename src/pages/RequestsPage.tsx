import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RequestList } from '@/components/requests/RequestList';
import { CreateRequestForm } from '@/components/requests/CreateRequestForm';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const RequestsPage = () => {
  const [key, setKey] = useState(0); // Used to force re-render of RequestList

  const handleRequestCreation = () => {
    setKey(prevKey => prevKey + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl mx-auto py-4 border-b mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">طلبات الإنابة</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <CreateRequestForm onSuccess={handleRequestCreation} />
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/"><ArrowRight className="ml-2 h-4 w-4" /> العودة للرئيسية</Link>
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        <RequestList key={key} />
      </main>
    </div>
  );
};

export default RequestsPage;