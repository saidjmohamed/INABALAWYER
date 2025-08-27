import { useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ProfileEditForm } from '../components/profiles/ProfileEditForm';
import { Loader2, Edit } from 'lucide-react';
import { Separator } from '../components/ui/separator';

const ProfilePage = () => {
  const { session, profile, loading: sessionLoading } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  // 1. Handle Loading State
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2. Handle Not Authenticated State
  if (!session || !profile) {
    return <Navigate to="/login" replace />;
  }

  // 3. Handle successful edit
  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  // Component for displaying profile details
  const ProfileDetails = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar_url || undefined} alt={`${profile.first_name} ${profile.last_name}`} />
          <AvatarFallback className="text-2xl">
            {profile.first_name?.[0]}{profile.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-right">
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
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">ملفي الشخصي</h1>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="w-full sm:w-auto">
          <span className="flex items-center justify-center">
            <Edit className="mr-2 h-4 w-4" />
            {isEditing ? 'إلغاء التعديل' : 'تعديل الملف الشخصي'}
          </span>
        </Button>
      </div>

      <main>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {isEditing ? 'تعديل معلومات الملف الشخصي' : 'معلومات الملف الشخصي'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <ProfileEditForm onSuccess={handleEditSuccess} />
            ) : (
              <ProfileDetails />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage;