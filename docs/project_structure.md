# هيكل المشروع - منصة "مَعِين"

## 📁 نظرة عامة على الهيكل

```
maaeen-platform/
├── 📁 docs/                    # ملفات التوثيق
├── 📁 prisma/                  # مخطط قاعدة البيانات
├── 📁 public/                  # الملفات العامة الثابتة
├── 📁 src/                     # الملفات المصدرية
│   ├── 📁 app/                 # تطبيق Next.js (App Router)
│   ├── 📁 components/          # مكونات React
│   ├── 📁 hooks/               # Hooks مخصصة
│   └── 📁 lib/                 # مكتبات وأدوات مساعدة
├── 📁 db/                      # ملفات قاعدة البيانات
├── 📄 .env                     # متغيرات البيئة
├── 📄 .env.example             # نموذج متغيرات البيئة
├── 📄 components.json          # إعدادات shadcn/ui
├── 📄 package.json             # تبعيات المشروع وأوامره
├── 📄 tailwind.config.ts       # إعدادات Tailwind CSS
├── 📄 tsconfig.json            # إعدادات TypeScript
└── 📄 README.md                # وصف المشروع
```

## 📁 شرح تفصيلي للمجلدات والملفات

### 📁 `docs/` - ملفات التوثيق
```
docs/
├── 📄 README.md              # وصف شامل للمشروع
├── 📄 installation.md       # دليل التثبيت والإعداد
├── 📄 project_structure.md  # هذا الملف - هيكل المشروع
├── 📄 work_plan.md          # خطة العمل والمراحل
├── 📄 progress_log.md       # سجل التقدم والتعديلات
├── 📄 open_issues.md        # القضايا المفتوحة والعوائق
└── 📄 handover_prompt.md    # تعليمات تسليم المهام
```

**الوظيفة**: يحتوي على جميع الوثائق المتعلقة بالمشروع، بما في ذلك الأدلة الفنية، خطط العمل، وسجلات التقدم.

### 📁 `prisma/` - مخطط قاعدة البيانات
```
prisma/
├── 📄 schema.prisma         # مخطط قاعدة البيانات الرئيسي
└── 📁 migrations/           # ترحيلات قاعدة البيانات (إن وجدت)
```

**الوظيفة**: يحتوي على مخطط قاعدة البيانات المكتوب بلغة Prisma، والذي يحدد جميع النماذج والعلاقات بينها.

**الملفات الرئيسية**:
- `schema.prisma`: يحتوي على تعريف نماذج قاعدة البيانات (User, Course, Lesson, Enrollment, إلخ)

### 📁 `public/` - الملفات العامة الثابتة
```
public/
├── 📄 favicon.ico           # أيقونة الموقع
├── 📄 logo.svg              # شعار المنصة
├── 📄 robots.txt            # تعليمات محركات البحث
└── 📁 images/               # مجلد الصور العامة
```

**الوظيفة**: يحتوي على الملفات الثابتة التي يمكن الوصول إليها مباشرة من المتصفح.

### 📁 `src/` - الملفات المصدرية
هذا هو المجلد الرئيسي الذي يحتوي على كود التطبيق.

#### 📁 `src/app/` - تطبيق Next.js (App Router)
```
src/app/
├── 📄 layout.tsx            # التخطيط الرئيسي للتطبيق
├── 📄 page.tsx              # الصفحة الرئيسية
├── 📄 globals.css           # أنماط CSS العامة
│
├── 📁 api/                  # واجهات API
│   ├── 📁 auth/             # واجهات المصادقة
│   │   └── 📁 [...nextauth]/
│   │       └── 📄 route.ts  # إعدادات NextAuth
│   ├── 📁 courses/          # واجهات إدارة الدورات
│   │   ├── 📄 route.ts      # قائمة الدورات
│   │   └── 📁 [id]/
│   │       └── 📄 route.ts  # تفاصيل الدورة
│   ├── 📁 enrollments/      # واجهات التسجيل في الدورات
│   │   ├── 📄 route.ts      # إدارة التسجيلات
│   │   └── 📁 check/
│   │       └── 📄 route.ts  # التحقق من التسجيل
│   └── 📄 health/           # فحص صحة الخادم
│       └── 📄 route.ts
│
├── 📁 auth/                 # صفحات المصادقة
│   ├── 📄 signin/           # صفحة تسجيل الدخول
│   │   └── 📄 page.tsx
│   └── 📄 signup/           # صفحة إنشاء حساب
│       └── 📄 page.tsx
│
├── 📁 courses/              # صفحات الدورات
│   ├── 📄 page.tsx          # قائمة الدورات
│   └── 📁 [id]/             # تفاصيل الدورة
│       └── 📄 page.tsx
│
├── 📁 dashboard/            # لوحة تحكم المستخدم
│   ├── 📄 page.tsx          # الصفحة الرئيسية للوحة التحكم
│   └── 📁 courses/          # دورات المستخدم
│       └── 📁 [id]/
│           └── 📄 page.tsx
│
├── 📁 about/                # صفحة من نحن
│   └── 📄 page.tsx
│
└── 📁 contact/              # صفحة تواصل معنا
    └── 📄 page.tsx
```

**الوظيفة**: يحتوي على جميع صفحات التطبيق وواجهات API باستخدام App Router في Next.js 15.

#### 📁 `src/components/` - مكونات React
```
src/components/
├── 📁 ui/                   # مكونات واجهة المستخدم (shadcn/ui)
│   ├── 📄 button.tsx
│   ├── 📄 card.tsx
│   ├── 📄 input.tsx
│   ├── 📄 dialog.tsx
│   ├── 📄 form.tsx
│   ├── 📄 table.tsx
│   ├── 📄 badge.tsx
│   ├── 📄 avatar.tsx
│   ├── 📄 progress.tsx
│   ├── 📄 toast.tsx
│   ├── 📄 tabs.tsx
│   └── ...                  # باقي المكونات
│
├── 📄 providers.tsx         # مقدمي الخدمات (SessionProvider, إلخ)
└── 📄 icons.tsx             # تعريف الأيقونات المستخدمة
```

**الوظيفة**: يحتوي على جميع مكونات React القابلة لإعادة الاستخدام، بما في ذلك مكونات shadcn/ui.

#### 📁 `src/hooks/` - Hooks مخصصة
```
src/hooks/
├── 📄 use-toast.ts          # Hook لإدارة الإشعارات
└── 📄 use-mobile.ts         # Hook للكشف عن الأجهزة المحمولة
```

**الوظيفة**: يحتوي على Hooks مخصصة لاستخدامها في مكونات React.

#### 📁 `src/lib/` - مكتبات وأدوات مساعدة
```
src/lib/
├── 📄 auth.ts               # إعدادات NextAuth والمصادقة
├── 📄 db.ts                 # إعدادات Prisma وقاعدة البيانات
├── 📄 utils.ts              # دوال مساعدة عامة
└── 📄 socket.ts             # إعدادات Socket.IO (للتواصل الفوري)
```

**الوظيفة**: يحتوي على المكتبات والأدوات المساعدة التي تستخدم في جميع أنحاء التطبيق.

### 📁 `db/` - ملفات قاعدة البيانات
```
db/
└── 📄 custom.db             # ملف قاعدة بيانات SQLite
```

**الوظيفة**: يحتوي على ملف قاعدة بيانات SQLite المستخدم في بيئة التطوير.

## 📄 الملفات الرئيسية في الجذر

### 📄 `.env` - متغيرات البيئة
```env
DATABASE_URL=file:./db/custom.db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**الوظيفة**: يحتوي على متغيرات البيئة الحساسة التي لا يجب نشرها.

### 📄 `package.json` - تبعيات المشروع وأوامره
```json
{
  "name": "nextjs_tailwind_shadcn_ts",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "nodemon server.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push"
  },
  "dependencies": {
    // التبعيات الرئيسية
  },
  "devDependencies": {
    // تبعيات التطوير
  }
}
```

**الوظيفة**: يحدد تبعيات المشروع والأوامر المتاحة.

### 📄 `tailwind.config.ts` - إعدادات Tailwind CSS
```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
```

**الوظيفة**: يحتوي على إعدادات Tailwind CSS لتخصيص التصميم.

### 📄 `tsconfig.json` - إعدادات TypeScript
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**الوظيفة**: يحتوي على إعدادات TypeScript للتحقق من الأنواع وتجميع الكود.

## 🔄 تدفق البيانات والعمارة

### تدفق البيانات
1. **المستخدم** ← → **واجهة المستخدم** (React Components)
2. **واجهة المستخدم** ← → **API Routes** (Next.js API)
3. **API Routes** ← → **Prisma ORM** ← → **قاعدة البيانات**
4. **المصادقة** ← → **NextAuth.js** ← → **قاعدة البيانات**

### العمارة العامة
- **Frontend**: React + Next.js + TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite + Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + shadcn/ui

## 📊 إحصائيات الهيكل

| المجلد | عدد الملفات | حجم التقريبي |
|--------|-------------|--------------|
| `docs/` | 6 ملفات | 50 KB |
| `src/app/` | 15+ ملف | 200 KB |
| `src/components/` | 30+ ملف | 150 KB |
| `src/lib/` | 4 ملفات | 20 KB |
| `prisma/` | 1 ملف | 10 KB |
| **المجموع** | **60+ ملف** | **430+ KB** |

---

**آخر تحديث**: 24 أغسطس 2024  
**مسؤول التوثيق**: فريق تطوير منصة "مَعِين"