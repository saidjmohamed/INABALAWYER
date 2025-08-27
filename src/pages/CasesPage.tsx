import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CaseWithDetails } from "@/types";
import { CaseCard } from "@/components/CaseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function CasesPage() {
  const [cases, setCases] = useState<CaseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("cases")
          .select(`
            *,
            court:courts(*),
            council:councils(*),
            creator:profiles!cases_creator_id_fkey(*)
          `)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setCases(data as any as CaseWithDetails[]);
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">القضايا</h1>
        <Button asChild>
          <Link to="/cases/new">
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة قضية جديدة
          </Link>
        </Button>
      </div>

      {cases.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((caseItem) => (
            <CaseCard key={caseItem.id} case={caseItem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد قضايا حالياً.</p>
        </div>
      )}
    </div>
  );
}