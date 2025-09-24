-- أولاً، نتأكد من وجود المحكمة العليا
INSERT INTO public.courts (name, level)
SELECT 'المحكمة العليا', 'cassation'
WHERE NOT EXISTS (SELECT 1 FROM public.courts WHERE name = 'المحكمة العليا');

-- ثانياً، نستخدم كتلة برمجية لإضافة المحاكم الجديدة بأسماء فريدة تحت كل مجلس قضائي
DO $$
DECLARE
    council RECORD;
    new_court_name TEXT;
BEGIN
    -- نستعرض كل مجلس قضائي (للحصول على المعرف والاسم)
    FOR council IN
        SELECT id, name FROM public.courts WHERE parent_id IS NULL AND name != 'المحكمة العليا'
    LOOP
        -- إنشاء وإضافة المحكمة الإدارية باسم فريد
        new_court_name := 'المحكمة الإدارية' || ' - ' || council.name;
        IF NOT EXISTS (SELECT 1 FROM public.courts WHERE name = new_court_name) THEN
            INSERT INTO public.courts (name, level, parent_id) VALUES (new_court_name, 'first_instance', council.id);
        END IF;

        -- إنشاء وإضافة المحكمة الإدارية للاستئناف باسم فريد
        new_court_name := 'المحكمة الإدارية للاستئناف' || ' - ' || council.name;
        IF NOT EXISTS (SELECT 1 FROM public.courts WHERE name = new_court_name) THEN
            INSERT INTO public.courts (name, level, parent_id) VALUES (new_court_name, 'appeal', council.id);
        END IF;

        -- إنشاء وإضافة مجلس الدولة باسم فريد
        new_court_name := 'مجلس الدولة' || ' - ' || council.name;
        IF NOT EXISTS (SELECT 1 FROM public.courts WHERE name = new_court_name) THEN
            INSERT INTO public.courts (name, level, parent_id) VALUES (new_court_name, 'cassation', council.id);
        END IF;

        -- إنشاء وإضافة المحكمة التجارية باسم فريد
        new_court_name := 'المحكمة التجارية' || ' - ' || council.name;
        IF NOT EXISTS (SELECT 1 FROM public.courts WHERE name = new_court_name) THEN
            INSERT INTO public.courts (name, level, parent_id) VALUES (new_court_name, 'first_instance', council.id);
        END IF;

        -- إنشاء وإضافة المحكمة التجارية للاستئناف باسم فريد
        new_court_name := 'المحكمة التجارية للاستئناف' || ' - ' || council.name;
        IF NOT EXISTS (SELECT 1 FROM public.courts WHERE name = new_court_name) THEN
            INSERT INTO public.courts (name, level, parent_id) VALUES (new_court_name, 'appeal', council.id);
        END IF;
    END LOOP;
END $$;