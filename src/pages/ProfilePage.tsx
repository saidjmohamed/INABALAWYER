import { useState } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileEditForm } from '@/components/profiles/ProfileEditForm';
import { Loader2, ArrowRight, Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ProfilePage = () => {
  const { session, profile, loading: sessionLoading } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || !profile) {
    return <Navigate to="/login" replace />;
  }

  const handleEditSuccess = () => {
    setIsEditing(false);
    // The SessionContext will automatically re-fetch the profile after update
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center w-full max-w-4xl mx-auto py-4 border-b mb-8 gap-4"> {/* Added flex-col sm:flex-row and gap-4 */}
        <h1 className="text-3xl font-bold text-gray-900">ملفي الشخصي</h1>
        <div className="flex flex-col sm:flex-row gap-2"> {/* Added flex-col sm:flex-row and gap-2 */}
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="w-full sm:w-auto">
            <span className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              {isEditing ? 'إلغاء التعديل' : 'تعديل الملف الشخصي'}
            </span>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto"> {/* Added w-full sm:w-auto */}
            <Link to="/">
              <span className="flex items-center">
                <ArrowRight className="ml-2 h-4 w-4" /> العودة للرئيسية
              </span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2"> {/* Adjusted for responsiveness */}
            <CardTitle className="text-2xl font-bold">معلومات الملف الشخصي</CardTitle>
            {/* Edit button moved to header for better mobile layout */}
          </CardHeader>
          <CardContent className="pt-4">
            {isEditing ? (
              <ProfileEditForm onSuccess={handleEditSuccess} />
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 space-x-reverse gap-4"> {/* Adjusted for responsiveness */}
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar_url || undefined} alt={`${profile.first_name} ${profile.last_name}`} />
                    <AvatarFallback className="text-2xl">
                      {profile.first_name?.[0]}{profile.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-right"> {/* Centered text on mobile */}
                    <p className="text-xl font-semibold">{profile.first_name} {profile.last_name}</p>
                    <p className="text-gray-600">{profile.email}</p>
                    {profile.username && <p className="text-gray-600">@{profile.username}</p>}
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">الهاتف</p>
                    <p className="text-gray-800">{profile.phone || 'غير محدد'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">العنوان</p>
                    <p className="text-gray-800">{profile.address || 'غير محدد'}</p>
                  </div>
                  {profile.organization && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">المنظمة التابع لها</p>
                      <p className="text-gray-800">{profile.organization}</p>
                    </div>
                  )}
                  {profile.role === 'lawyer' && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-500">التخصصات</p>
                        <p className="text-gray-800">{profile.specialties?.join(', ') || 'غير محددة'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">سنوات الخبرة</p>
                        <p className="text-gray-800">{profile.experience_years ?? 'غير محدد'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">اللغات</p>
                        <p className="text-gray-800">{profile.languages?.join(', ') || 'غير محددة'}</p>
                      </div>
                    </>
                  )}
                </div>
                {profile.bio && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-gray-500">نبذة شخصية</p>
                      <p className="text-gray-800 whitespace-pre-wrap">{profile.bio}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage;