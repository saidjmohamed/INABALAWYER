import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase';
import { Profile } from '@/types';
import { LawyerCard } from '@/components/LawyerCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Search } from 'lucide-react';

const LawyersDirectory = () => {
  const [lawyers, setLawyers] = useState<Profile[]>([]);
  const [totalLawyersCount, setTotalLawyersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [organization, setOrganization] = useState('');
  const [organizations, setOrganizations] = useState<string[]>([]);

  useEffect(() => {
    const fetchTotalCount = async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'lawyer')
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching total lawyers count:', error);
      } else if (count !== null) {
        setTotalLawyersCount(count);
      }
    };
    
    const fetchOrganizations = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('organization')
        .eq('role', 'lawyer')
        .eq('status', 'active')
        .not('organization', 'is', null);

      if (error) {
        console.error('Error fetching organizations:', error);
      } else if (data) {
        const uniqueOrgs = [...new Set(data.map(p => p.organization).filter(Boolean))];
        setOrganizations(uniqueOrgs as string[]);
      }
    };

    fetchTotalCount();
    fetchOrganizations();
  }, []);

  useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'lawyer')
        .eq('status', 'active');

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }
      if (organization) {
        query = query.eq('organization', organization);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching lawyers:', error);
        toast.error('فشل في جلب قائمة المحامين');
      } else {
        setLawyers(data as Profile[]);
      }
      setLoading(false);
    };

    const handler = setTimeout(() => {
      fetchLawyers();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, organization]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center w-full max-w-7xl mx-auto py-4 border-b mb-8">
        <h1 className="text-3xl font-bold text-gray-900">جدول المحامين</h1>
        <Button variant="outline" asChild>
          <Link to="/profile">العودة للملف الشخصي</Link>
        </Button>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center shadow-sm">
          <h2 className="text-lg font-semibold text-blue-800">
            إجمالي المحامين المسجلين: <span className="text-2xl font-bold">{totalLawyersCount}</span>
          </h2>
        </div>

        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="البحث بالاسم أو رقم الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={organization} onValueChange={(value) => setOrganization(value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="المجلس التابع له" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {organizations.map(org => <SelectItem key={org} value={org}>{org}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lawyers.length > 0 ? (
              lawyers.map(lawyer => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">لا يوجد محامون يطابقون معايير البحث.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default LawyersDirectory;