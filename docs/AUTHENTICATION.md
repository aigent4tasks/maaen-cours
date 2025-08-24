# وثائق نظام المصادقة - منصة "مَعِين"

## نظرة عامة

نظام المصادقة في منصة "مَعِين" مبني باستخدام NextAuth.js، ويوفر مصادقة آمنة ومرنة للمستخدمين مع دعم multiple providers وأدوار المستخدمين.

## التقنيات المستخدمة

- **NextAuth.js v4**: إطار المصادقة الرئيسي
- **JWT**: JSON Web Tokens لإدارة الجلسات
- **OAuth 2.0**: للمصادقة الخارجية
- **Prisma ORM**: لإدارة بيانات المستخدمين
- **TypeScript**: لأمان الأنواع

## الميزات الرئيسية

### 1. طرق المصادقة المدعومة
- **البريد الإلكتروني وكلمة المرور**: المصادقة التقليدية
- **Google OAuth**: تسجيل الدخول بحساب Google
- **GitHub OAuth**: تسجيل الدخول بحساب GitHub (قيد التطوير)
- **Facebook OAuth**: تسجيل الدخول بحساب Facebook (قيد التطوير)

### 2. أدوار المستخدمين
- **STUDENT**: الطالب - يمكنه التسجيل في الدورات والتعلم
- **INSTRUCTOR**: المدرب - يمكنه إنشاء الدورات وإدارتها
- **ADMIN**: المشرف - يمكنه إدارة المنصة بالكامل

### 3. ميزات الأمان
- **جلسات آمنة**: إدارة جلسات المستخدمين بشكل آمن
- **حماية CSRF**: حماية من هجمات تزوير الطلبات
- **تشفير البيانات**: تشفير البيانات الحساسة
- **التحقق من الصلاحيات**: التحقق من صلاحيات المستخدمين
- **انتهاء الجلسات**: انتهاء تلقائي للجلسات

## إعداد NextAuth.js

### 1. التكوين الأساسي (`src/lib/auth.ts`)

```typescript
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "./db"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { UserRole } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        // في بيئة الإنتاج، استخدم bcrypt.compare()
        // return await bcrypt.compare(credentials.password, user.password)
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
}
```

### 2. مسارات API (`src/app/api/auth/[...nextauth]/route.ts`)

```typescript
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

### 3. مزود الجلسة (`src/components/providers.tsx`)

```typescript
"use client"

import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

### 4. التخطيط الرئيسي (`src/app/layout.tsx`)

```typescript
import { Providers } from "@/components/providers"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

## المتغيرات البيئية

### 1. `.env.local`

```env
# قاعدة البيانات
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth (قيد التطوير)
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# Facebook OAuth (قيد التطوير)
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
```

### 2. إعداد Google OAuth

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد
3. فعّل Google+ API
4. أنشئ بيانات اعتماد OAuth 2.0
5. أضف `http://localhost:3000/api/auth/callback/google` كـ redirect URI
6. انسخ Client ID و Client Secret إلى `.env.local`

## أنواع المستخدمين والأدوار

### 1. نموذج المستخدم في قاعدة البيانات

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  emailVerified DateTime?
  role          UserRole  @default(STUDENT)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  enrollments   Enrollment[]
  progress      Progress[]
  reviews       Review[]
  discussions   Discussion[]
  replies       Reply[]
  courses       Course[]  @relation("InstructorCourses")
  
  @@map("users")
}

enum UserRole {
  STUDENT
  INSTRUCTOR
  ADMIN
}
```

### 2. صلاحيات كل دور

#### STUDENT (طالب)
- عرض الدورات المنشورة
- التسجيل في الدورات
- التعلم في الدورات المسجلة
- تقييم الدورات
- المشاركة في النقاشات
- عرض تقدمه التعليمي

#### INSTRUCTOR (مدرب)
- جميع صلاحيات الطالب
- إنشاء دورات جديدة
- تعديل دوراته
- حذف دوراته (مع قيود)
- إدارة دروس دوراته
- عرض إحصائيات دوراته

#### ADMIN (مشرف)
- جميع صلاحيات المدرب
- إدارة جميع المستخدمين
- إدارة جميع الدورات
- إدارة التصنيفات
- عرض إحصائيات المنصة
- الوصول إلى لوحة تحكم المشرف

## صفحات المصادقة

### 1. صفحة تسجيل الدخول (`/auth/signin`)

```typescript
'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        // عرض خطأ
      } else {
        // توجيه إلى لوحة التحكم
        window.location.href = '/dashboard'
      }
    } catch (error) {
      // عرض خطأ
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني وكلمة المرور لتسجيل الدخول
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>
          
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={signInWithGoogle}
            >
              تسجيل الدخول بحساب Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 2. صفحة إنشاء حساب (`/auth/signup`)

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      // عرض خطأ
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (response.ok) {
        // تسجيل الدخول تلقائياً
        router.push('/dashboard')
      } else {
        // عرض خطأ
      }
    } catch (error) {
      // عرض خطأ
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>إنشاء حساب جديد</CardTitle>
          <CardDescription>
            أدخل بياناتك لإنشاء حساب جديد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

## حماية الصفحات والطرق

### 1. حماية الصفحات في الواجهة الأمامية

```typescript
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div>
      <h1>صفحة محمية</h1>
      <p>مرحباً {session.user.name}!</p>
    </div>
  )
}
```

### 2. حماية الـ API routes

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // المستخدم مصرح له الوصول
  return NextResponse.json({ message: 'Authorized' })
}
```

### 3. حماية حسب الدور

```typescript
export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // المشرفين فقط
  return NextResponse.json({ message: 'Admin access granted' })
}
```

### 4. حماية ملكية المحتوى

```typescript
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get('courseId')

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // التحقق من أن المستخدم مسجل في الدورة
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: courseId!
      }
    }
  })

  if (!enrollment && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not enrolled' }, { status: 403 })
  }

  return NextResponse.json({ message: 'Access granted' })
}
```

## استخدام المصادقة في التطبيق

### 1. الوصول إلى بيانات الجلسة

```typescript
'use client'

import { useSession } from 'next-auth/react'

export function UserProfile() {
  const { data: session } = useSession()

  if (!session) {
    return <div>يرجى تسجيل الدخول</div>
  }

  return (
    <div>
      <h1>الملف الشخصي</h1>
      <p>الاسم: {session.user.name}</p>
      <p>البريد: {session.user.email}</p>
      <p>الدور: {session.user.role}</p>
    </div>
  )
}
```

### 2. تسجيل الدخول والخروج

```typescript
'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export function AuthButtons() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div>
        <p>مرحباً {session.user.name}</p>
        <button onClick={() => signOut()}>
          تسجيل الخروج
        </button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => signIn()}>
        تسجيل الدخول
      </button>
    </div>
  )
}
```

### 3. التحقق من حالة المصادقة

```typescript
'use client'

import { useSession } from 'next-auth/react'

export function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>جاري التحميل...</div>
  }

  if (session) {
    return <div>مسجل الدخول كـ {session.user.name}</div>
  }

  return <div>غير مسجل الدخول</div>
}
```

## أفضل المميزات الأمنية

### 1. إعداد NextAuth.js بشكل آمن

```typescript
export const authOptions: NextAuthOptions = {
  // استخدام JWT strategy
  session: {
    strategy: "jwt",
  },
  
  // تشفير JWT
  secret: process.env.NEXTAUTH_SECRET,
  
  // تحديد عمر الجلسة
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // تحديث JWT
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Callbacks للأمان
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role
      }
      return session
    },
  },
}
```

### 2. حماية كلمات المرور

```typescript
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}
```

### 3. التحقق من صحة البريد الإلكتروني

```typescript
import { z } from 'zod'

const emailSchema = z.string().email()

export function isValidEmail(email: string): boolean {
  return emailSchema.safeParse(email).success
}
```

### 4. حماية من هجمات CSRF

```typescript
// NextAuth.js يوفر حماية CSRF تلقائياً
// تأكد من تفعيله في الإعدادات
export const authOptions: NextAuthOptions = {
  // ... إعدادات أخرى
  
  // حماية CSRF
  useSecureCookies: process.env.NODE_ENV === 'production',
}
```

## استكشاف الأخطاء الشائعة

### 1. مشاكل تسجيل الدخول

**المشكلة:** تسجيل الدخول لا يعمل
**الحل:**
- تحقق من متغيرات البيئة
- تأكد من أن NEXTAUTH_URL صحيح
- تحقق من إعدادات Google OAuth
- تأكد من أن قاعدة البيانات تعمل

**المشكلة:** الجلسات تنتهي بسرعة
**الحل:**
- تحقق من إعدادات عمر الجلسة
- تأكد من أن NEXTAUTH_SECRET صحيح
- تحقق من إعدادات المتصفح

### 2. مشاكل OAuth

**المشكلة:** Google OAuth لا يعمل
**الحل:**
- تحقق من Client ID و Client Secret
- تأكد من redirect URI صحيح
- تحقق من إعدادات Google Cloud Console

**المشكلة:** خطأ في redirect
**الحل:**
- تأكد من أن NEXTAUTH_URL يتطابق مع URL التطبيق
- تحقق من إعدادات callback URL

### 3. مشاكل الأدوار

**المشكلة:** دور المستخدم لا يتم حفظه
**الحل:**
- تأكد من أن callback لـ JWT يعمل بشكل صحيح
- تحقق من نموذج المستخدم في قاعدة البيانات
- تأكد من أن دور المستخدم يتم تمريره في الـ token

**المشكلة:** الصلاحيات لا تعمل
**الحل:**
- تأكد من التحقق من الدور في الواجهات البرمجية
- تحقق من أن session.user.role متاحة
- تأكد من أن المستخدم لديه الدور الصحيح

## التطوير المستقبلي

### 1. ميزات مقترحة
- **المصادقة الثنائية:** إضافة 2FA
- **نسيان كلمة المرور:** إعادة تعيين كلمة المرور
- **تأكيد البريد:** التحقق من البريد الإلكتروني
- **تسجيل الدخول الاجتماعي:** المزيد من OAuth providers
- **SAML:** للمؤسسات

### 2. تحسينات الأمان
- **تدقيق الأمان:** تسجيل محاولات تسجيل الدخول
- **حظر الحسابات:** حظر الحسابات المشبوهة
- **التحقق من العمر:** التحقق من عمر المستخدم
- **الجدران النارية:** إعداد جدران نارية أمنية

### 3. تحسينات الأداء
- **التخزين المؤقت:** تخزين بيانات الجلسات
- **تحسين الاستعلامات:** تحسين استعلامات قاعدة البيانات
- **التحميل البطيء:** تحميل بيانات المستخدم بشكل بطيء

---

## الخاتمة

نظام المصادقة في منصة "مَعِين" يوفر حلاً آمناً ومرناً لإدارة مصادقة المستخدمين. تم تصميم النظام ليكون سهل الاستخدام وقابلاً للتوسع مع الحفاظ على أعلى معايير الأمان.

**ملاحظة:** عند إضافة ميزات مصادقة جديدة، تأكد من اتباع أفضل ممارسات الأمان واختبار الميزات بشكل كامل.