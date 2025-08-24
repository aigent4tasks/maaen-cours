# دليل التطوير للمطورين - منصة "مَعِين"

## مقدمة

هذا الدليل موجه للمطورين الذين سيعملون على منصة "مَعِين" التعليمية. يغطي جميع جوانب التطوير من إعداد البيئة إلى نشر المشروع.

## جدول المحتويات

1. [إعداد بيئة التطوير](#إعداد-بيئة-التطوير)
2. [هيكل المشروع](#هيكل-المشروع)
3. [قواعد التطوير](#قواعد-التطوير)
4. [العمل مع قاعدة البيانات](#العمل-مع-قاعدة-البيانات)
5. [تطوير الواجهات البرمجية](#تطوير-الواجهات-البرمجية)
6. [تطوير الواجهة الأمامية](#تطوير-الواجهة-الأمامية)
7. [الاختبار والجودة](#الاختبار-والجودة)
8. [النشر](#النشر)
9. [حل المشاكل الشائعة](#حل-المشاكل-الشائعة)

## إعداد بيئة التطوير

### المتطلبات الأساسية
- Node.js 18 أو أحدث
- npm أو yarn
- Git
- محرر أكواد (VS Code موصى به)

### الإعدادات الموصى بها لـ VS Code
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### خطوات الإعداد

1. **استنساخ المشروع**
```bash
git clone https://github.com/aigent4tasks/maaen-cours.git
cd maaen-cours
```

2. **تثبيت الاعتماديات**
```bash
npm install
```

3. **إعداد المتغيرات البيئية**
```bash
cp .env.example .env.local
```

4. **تحرير ملف المتغيرات البيئية**
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

5. **إعداد قاعدة البيانات**
```bash
npx prisma generate
npm run db:push
```

6. **تشغيل المشروع**
```bash
npm run dev
```

## هيكل المشروع

```
maaen-cours/
├── docs/                    # الوثائق
├── prisma/                  # مخطط قاعدة البيانات
│   ├── schema.prisma      # مخطط قاعدة البيانات
│   └── migrations/        # ترحيلات قاعدة البيانات
├── public/                 # الملفات العامة
│   ├── favicon.ico        # أيقونة الموقع
│   ├── logo.svg          # شعار الموقع
│   └── robots.txt        # ملف محركات البحث
├── src/
│   ├── app/              # صفحات Next.js (App Router)
│   │   ├── api/         # الواجهات البرمجية
│   │   │   ├── auth/    # مصادقة المستخدمين
│   │   │   ├── courses/ # إدارة الدورات
│   │   │   ├── admin/   # واجهات المشرف
│   │   │   └── ...      # واجهات أخرى
│   │   ├── auth/        # صفحات المصادقة
│   │   ├── courses/     # صفحات الدورات
│   │   ├── dashboard/   # لوحة تحكم المستخدم
│   │   ├── admin/       # لوحة تحكم المشرف
│   │   ├── globals.css   # أنماط CSS عامة
│   │   ├── layout.tsx   # التخطيط الرئيسي
│   │   └── page.tsx     # الصفحة الرئيسية
│   ├── components/      # مكونات React
│   │   ├── ui/         # مكونات shadcn/ui
│   │   └── ...         # مكونات مخصصة
│   ├── hooks/           # خطافات React مخصصة
│   └── lib/             # مكتبات وإعدادات
│       ├── auth.ts     # إعدادات NextAuth
│       ├── db.ts       # إعدادات Prisma
│       └── utils.ts    # وظائف مساعدة
├── components.json      # إعدادات shadcn/ui
├── tailwind.config.ts  # إعدادات Tailwind CSS
├── tsconfig.json      # إعدادات TypeScript
└── package.json       # اعتماديات المشروع
```

## قواعد التطوير

### 1. قواعد TypeScript
- استخدم TypeScript دائماً
- عرف الأنواع بوضوح
- تجنب استخدام `any` قدر الإمكان
- استخدم الواجهات (Interfaces) للكائنات

```typescript
// جيد
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// سيء
const user: any = {
  id: '123',
  name: 'John',
  email: 'john@example.com'
};
```

### 2. قواعد تسمية الملفات
- استخدم PascalCase للمكونات: `UserProfile.tsx`
- استخدم camelCase للدوال والمتغيرات: `getUserData`
- استخدم kebab-case للملفات غير المكونات: `user-service.ts`
- استخدم SCREAMING_SNAKE_CASE للمتغيرات البيئية: `DATABASE_URL`

### 3. قواعد التنسيق
- استخدم Prettier للتنسيق التلقائي
- استخدم ESLint لفحص الجودة
- حافظ على طول السطر أقل من 80 حرفاً
- استخدم مسافتين للفراغ

### 4. قواعد الالتزام (Git)
- استخدم رسائل التزام واضحة
- ابدأ بالفعل: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- كن محدداً في الوصف

```bash
feat: add user profile page
fix: resolve login authentication issue
docs: update API documentation
style: improve button styling
refactor: optimize database queries
test: add user authentication tests
chore: update dependencies
```

## العمل مع قاعدة البيانات

### 1. تعديل مخطط قاعدة البيانات
1. حرر ملف `prisma/schema.prisma`
2. أضف أو عدل النماذج (Models)
3. شغّل `npm run db:push` لتحديث قاعدة البيانات
4. شغّل `npm run db:generate` لتحديث عميل Prisma

### 2. الاستعلامات الأساسية
```typescript
// جلب بيانات واحدة
const user = await db.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    name: true,
    email: true,
  }
});

// جلب قائمة بيانات
const courses = await db.course.findMany({
  where: { published: true },
  include: {
    instructor: {
      select: { name: true }
    }
  },
  orderBy: { createdAt: 'desc' }
});

// إنشاء بيانات جديدة
const newCourse = await db.course.create({
  data: {
    title: 'Course Title',
    description: 'Course Description',
    instructorId: instructorId,
  }
});

// تحديث بيانات
const updatedCourse = await db.course.update({
  where: { id: courseId },
  data: {
    title: 'New Title',
  }
});

// حذف بيانات
await db.course.delete({
  where: { id: courseId }
});
```

### 3. العلاقات المعقدة
```typescript
// جلب بيانات مع علاقات متعددة
const courseWithDetails = await db.course.findUnique({
  where: { id: courseId },
  include: {
    instructor: true,
    category: true,
    lessons: {
      where: { published: true },
      orderBy: { order: 'asc' }
    },
    enrollments: {
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    },
    reviews: {
      include: {
        user: {
          select: { name: true }
        }
      }
    }
  }
});
```

## تطوير الواجهات البرمجية

### 1. بنية الواجهة البرمجية
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const data = await db.model.findMany({
      skip,
      take: limit,
      // ... other options
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### 2. التحقق من الصلاحيات
```typescript
// التحقق من دور المشرف
if (session.user.role !== 'ADMIN') {
  return NextResponse.json(
    { error: 'Forbidden' },
    { status: 403 }
  );
}

// التحقق من ملكية المحتوى
const enrollment = await db.enrollment.findUnique({
  where: {
    userId_courseId: {
      userId: session.user.id,
      courseId
    }
  }
});

if (!enrollment) {
  return NextResponse.json(
    { error: 'Not enrolled in this course' },
    { status: 403 }
  );
}
```

### 3. التعامل مع الأخطاء
```typescript
export class APIError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// استخدام الخطأ المخصص
try {
  const result = await someOperation();
  return NextResponse.json(result);
} catch (error) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  
  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  );
}
```

## تطوير الواجهة الأمامية

### 1. المكونات القياسية
```typescript
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MyComponentProps {
  title: string;
  onData: (data: string) => void;
}

export function MyComponent({ title, onData }: MyComponentProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onData(value);
    setValue('');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="input">Input</Label>
            <Input
              id="input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value..."
            />
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### 2. استخدام الخطافات المخصصة
```typescript
import { useState, useEffect } from 'react';

interface UseFetchDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetchData<T>(
  url: string,
  options?: RequestInit
): UseFetchDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}
```

### 3. التعامل مع النماذج
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
});

type FormData = z.infer<typeof schema>;

export function CourseForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register('title')}
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>
      
      {/* Other fields */}
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Course'}
      </Button>
    </form>
  );
}
```

## الاختبار والجودة

### 1. فحص الكود
```bash
# فحص جودة الكود
npm run lint

# بناء المشروع للتحقق من الأخطاء
npm run build

# فحص Typescript
npx tsc --noEmit
```

### 2. اختبار الواجهات البرمجية
```typescript
// اختبار الواجهات البرمجية
import { test, expect } from '@playwright/test';

test('should create a new course', async ({ request }) => {
  const response = await request.post('/api/courses', {
    data: {
      title: 'Test Course',
      description: 'Test Description',
      instructorId: 'test-instructor-id'
    }
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.course.title).toBe('Test Course');
});
```

### 3. اختبار المكونات
```typescript
// اختبار المكونات
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

test('should call onData with input value', () => {
  const mockOnData = vi.fn();
  render(<MyComponent title="Test" onData={mockOnData} />);
  
  const input = screen.getByPlaceholderText('Enter value...');
  fireEvent.change(input, { target: { value: 'test value' } });
  
  const button = screen.getByRole('button', { name: /submit/i });
  fireEvent.click(button);
  
  expect(mockOnData).toHaveBeenCalledWith('test value');
});
```

## النشر

### 1. بناء المشروع
```bash
# بناء المشروع للإنتاج
npm run build

# فحص البناء
npm run start
```

### 2. المتغيرات البيئية للإنتاج
```env
DATABASE_URL="production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="production-secret-key"
GOOGLE_CLIENT_ID="production-google-client-id"
GOOGLE_CLIENT_SECRET="production-google-client-secret"
```

### 3. النشر على Vercel (موصى به)
1. قم بربط المشروع مع Vercel
2. أضف المتغيرات البيئية
3. قم بالنشر تلقائياً عند الدفع إلى main

### 4. النشر على Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## حل المشاكل الشائعة

### 1. مشاكل قاعدة البيانات
```bash
# إعادة تعيين قاعدة البيانات
npm run db:reset

# إعادة إنشاء عميل Prisma
npx prisma generate

# فتح Prisma Studio للتصفح
npm run db:studio
```

### 2. مشاكل المصادقة
```typescript
// تأكد من إعدادات NextAuth صحيحة
export const authOptions: NextAuthOptions = {
  providers: [
    // ... providers
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }
      return session;
    }
  }
};
```

### 3. مشاكل الأداء
```typescript
// استخدم التحميل البطيء للصور
import Image from 'next/image';

// استخدم التخزين المؤقت
import { cache } from 'react';

// استخدم الاستعلامات الفعالة
const data = await db.model.findMany({
  select: {
    id: true,
    title: true,
    // فقط الحقول المطلوبة
  }
});
```

### 4. مشاكل CSS
```typescript
// تأكد من استيراد أنماط Tailwind
import '@/app/globals.css';

// استخدم الفئات الصحيحة
<div className="flex flex-col items-center justify-center">
```

### 5. مشاكل TypeScript
```typescript
// عرف الأنواع بوضوح
interface Course {
  id: string;
  title: string;
  description?: string;
}

// استخدم الأنواع العامة
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}
```

---

## ختاماً

هذا الدليل يغطي جميع جوانب التطوير لمنصة "مَعِين". إذا واجهت أي مشاكل أو كان لديك أسئلة، لا تتردد في مراجعة الوثائق الأخرى أو طلب المساعدة من الفريق.

**تذكر دائماً:**
- اكتب كوداً نظيفاً وصيانياً
- اتبع أفضل الممارسات
- اختبر الكود بشكل كامل
- وثق الميزات الجديدة

**بالتوفيق في تطوير منصة "مَعِين"!** 🎓