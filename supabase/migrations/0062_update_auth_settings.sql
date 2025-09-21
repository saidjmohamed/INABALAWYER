-- تحديث إعدادات المصادقة لتحسين الأمان
-- 1. تقليل مدة صلاحية OTP إلى 1 ساعة (3600 ثانية)
UPDATE auth.configuration 
SET value = '3600' 
WHERE key = 'MFA_MAX_ENROLLMENT_PERIOD';

-- 2. تمكين حماية كلمات المرور المسربة
UPDATE auth.configuration 
SET value = 'true' 
WHERE key = 'PASSWORD_STRENGTH_CHECK_ENABLED';

-- 3. تحديث سياسات كلمات المرور
UPDATE auth.configuration 
SET value = '{
  "min_length": 8,
  "require_uppercase": true,
  "require_lowercase": true,
  "require_numbers": true,
  "require_special_characters": true
}' 
WHERE key = 'PASSWORD_POLICY';

-- 4. تمكين التحقق من كلمات المرور المسربة
UPDATE auth.configuration 
SET value = 'true' 
WHERE key = 'PASSWORD_LEAK_CHECK_ENABLED';