# وثائق مكونات الواجهة - منصة "مَعِين"

## نظرة عامة

تستخدم منصة "مَعِين" مكتبة مكونات shadcn/ui مع تخصيصات خاصة بالمنصة. توفر هذه المكونات واجهة مستخدم متسقة، جميلة، وسهلة الاستخدام مع دعم كامل للغة العربية (RTL).

## التقنيات المستخدمة

- **shadcn/ui**: مكتبة المكونات الأساسية
- **Tailwind CSS**: إطار العمل الأني
- **Radix UI**: الأساس لمكونات shadcn/ui
- **Lucide React**: مكتبة الأيقونات
- **Framer Motion**: الرسوم المتحركة
- **TypeScript**: أمان الأنواع

## تثبيت المكونات

### 1. إضافة مكون جديد

```bash
# إضافة مكون جديد
npx shadcn-ui@latest add button

# إضافة مكونات متعددة
npx shadcn-ui@latest add button card input label
```

### 2. تخصيص المكونات

يتم تخصيص المكونات في `src/components/ui/` مع الحفاظ على التوافق مع التصميم العام للمنصة.

## المكونات المتاحة

### 1. المكونات الأساسية

#### Button (`src/components/ui/button.tsx`)

```typescript
import { Button } from '@/components/ui/button'

// الاستخدام الأساسي
<Button>نص الزر</Button>

// مع أنماط مختلفة
<Button variant="default">افتراضي</Button>
<Button variant="secondary">ثانوي</Button>
<Button variant="destructive">مدمر</Button>
<Button variant="outline">مخطط</Button>
<Button variant="ghost">شبح</Button>
<Button variant="link">رابط</Button>

// مع أحجام مختلفة
<Button size="sm">صغير</Button>
<Button size="default">افتراضي</Button>
<Button size="lg">كبير</Button>
<Button size="icon">أيقونة</Button>

// مع حالة التحميل
<Button disabled>معطل</Button>
<Button loading>جاري التحميل...</Button>

// مع أيقونة
<Button>
  <Plus className="mr-2 h-4 w-4" />
  إضافة
</Button>
```

#### Card (`src/components/ui/card.tsx`)

```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// بطاقة أساسية
<Card>
  <CardHeader>
    <CardTitle>عنوان البطاقة</CardTitle>
    <CardDescription>وصف البطاقة</CardDescription>
  </CardHeader>
  <CardContent>
    محتوى البطاقة
  </CardContent>
</Card>

// بطاقة مع تأثير hover
<Card className="hover:shadow-lg transition-shadow">
  {/* محتوى البطاقة */}
</Card>
```

#### Input (`src/components/ui/input.tsx`)

```typescript
import { Input } from '@/components/ui/input'

// إدخال أساسي
<Input placeholder="أدخل النص هنا" />

// مع أنماط مختلفة
<Input variant="default" />
<Input variant="secondary" />
<Input variant="destructive" />

// مع تعطيل
<Input disabled placeholder="معطل" />

// مع أيقونة
<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
  <Input className="pl-10" placeholder="بحث..." />
</div>
```

#### Label (`src/components/ui/label.tsx`)

```typescript
import { Label } from '@/components/ui/label'

// تسمية أساسية
<Label htmlFor="email">البريد الإلكتروني</Label>
<Input id="email" />

// مع نص مساعد
<Label>
  البريد الإلكتروني
  <span className="text-sm text-gray-500">(مطلوب)</span>
</Label>
```

### 2. مكونات النماذج

#### Textarea (`src/components/ui/textarea.tsx`)

```typescript
import { Textarea } from '@/components/ui/textarea'

// منطقة نص أساسية
<Textarea placeholder="أدخل النص الطويل هنا..." />

// مع تحديد الحد الأقصى
<Textarea maxLength={500} />
```

#### Select (`src/components/ui/select.tsx`)

```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// اختيار أساسي
<Select>
  <SelectTrigger>
    <SelectValue placeholder="اختر خياراً" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">الخيار الأول</SelectItem>
    <SelectItem value="option2">الخيار الثاني</SelectItem>
    <SelectItem value="option3">الخيار الثالث</SelectItem>
  </SelectContent>
</Select>
```

#### Checkbox (`src/components/ui/checkbox.tsx`)

```typescript
import { Checkbox } from '@/components/ui/checkbox'

// مربع اختيار أساسي
<Checkbox id="terms" />
<Label htmlFor="أوافق على الشروط والأحكام" />

// مع حالة افتراضية
<Checkbox defaultChecked />
```

#### Radio Group (`src/components/ui/radio-group.tsx`)

```typescript
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

<RadioGroup defaultValue="option1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">الخيار الأول</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="option2" />
    <Label htmlFor="option2">الخيار الثاني</Label>
  </div>
</RadioGroup>
```

### 3. مكونات التغذية الراجعة

#### Alert (`src/components/ui/alert.tsx`)

```typescript
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// تنبيه أساسي
<Alert>
  <AlertTitle>عنوان التنبيه</AlertTitle>
  <AlertDescription>
    وصف التنبيه
  </AlertDescription>
</Alert>

// مع أنماط مختلفة
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>خطأ</AlertTitle>
  <AlertDescription>
    حدث خطأ ما
  </AlertDescription>
</Alert>
```

#### Toast (`src/components/ui/toast.tsx`)

```typescript
import { toast } from 'sonner'

// عرض toast بسيط
toast('تمت العملية بنجاح')

// مع أنماط مختلفة
toast.success('تمت العملية بنجاح')
toast.error('حدث خطأ')
toast.info('معلومة')
toast.warning('تحذير')

// مع وصف
toast('تمت العملية بنجاح', {
  description: 'تم حفظ التغييرات بنجاح'
})

// مع إجراء
toast('تم الحذف', {
  action: {
    label: 'تراجع',
    onClick: () => console.log('تراجع')
  }
})
```

#### Progress (`src/components/ui/progress.tsx`)

```typescript
import { Progress } from '@/components/ui/progress'

// شريط تقدم أساسي
<Progress value={33} />

// مع تسمية
<div className="space-y-2">
  <div className="flex justify-between text-sm text-gray-600">
    <span>التقدم</span>
    <span>33%</span>
  </div>
  <Progress value={33} />
</div>
```

### 4. مكونات التنقل

#### Tabs (`src/components/ui/tabs.tsx`)

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

<Tabs defaultValue="tab1" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="tab1">التبويب 1</TabsTrigger>
    <TabsTrigger value="tab2">التبويب 2</TabsTrigger>
    <TabsTrigger value="tab3">التبويب 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    محتوى التبويب الأول
  </TabsContent>
  <TabsContent value="tab2">
    محتوى التبويب الثاني
  </TabsContent>
  <TabsContent value="tab3">
    محتوى التبويب الثالث
  </TabsContent>
</Tabs>
```

#### Navigation Menu (`src/components/ui/navigation-menu.tsx`)

```typescript
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>القائمة</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/link1">الرابط 1</NavigationMenuLink>
        <NavigationMenuLink href="/link2">الرابط 2</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

#### Breadcrumb (`src/components/ui/breadcrumb.tsx`)

```typescript
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">الرئيسية</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/courses">الدورات</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>تفاصيل الدورة</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### 5. مكونات العرض

#### Badge (`src/components/ui/badge.tsx`)

```typescript
import { Badge } from '@/components/ui/badge'

// شارة أساسية
<Badge>شارة</Badge>

// مع أنماط مختلفة
<Badge variant="secondary">ثانوي</Badge>
<Badge variant="destructive">مدمر</Badge>
<Badge variant="outline">مخطط</Badge>

// مع لون مخصص
<Badge className="bg-blue-100 text-blue-800">أزرق</Badge>
```

#### Avatar (`src/components/ui/avatar.tsx`)

```typescript
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// صورة شخصية أساسية
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>اسم</AvatarFallback>
</Avatar>

// مع أحجام مختلفة
<Avatar className="h-8 w-8">
  <AvatarImage src="/avatar.png" />
  <AvatarFallback>اس</AvatarFallback>
</Avatar>
```

#### Separator (`src/components/ui/separator.tsx`)

```typescript
import { Separator } from '@/components/ui/separator'

// فاصل أفقي
<Separator />

// فاصل عمودي
<Separator orientation="vertical" />
```

### 6. مكونات التفاعل

#### Dialog (`src/components/ui/dialog.tsx`)

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger>فتح الحوار</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>عنوان الحوار</DialogTitle>
      <DialogDescription>
        وصف الحوار
      </DialogDescription>
    </DialogHeader>
    <div>
      محتوى الحوار
    </div>
  </DialogContent>
</Dialog>
```

#### Sheet (`src/components/ui/sheet.tsx`)

```typescript
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

<Sheet>
  <SheetTrigger>فتح اللوح</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>عنوان اللوح</SheetTitle>
      <SheetDescription>
        وصف اللوح
      </SheetDescription>
    </SheetHeader>
    <div>
      محتوى اللوح
    </div>
  </SheetContent>
</Sheet>
```

#### Popover (`src/components/ui/popover.tsx`)

```typescript
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

<Popover>
  <PopoverTrigger>فتح النافذة المنبثقة</PopoverTrigger>
  <PopoverContent>
    محتوى النافذة المنبثقة
  </PopoverContent>
</Popover>
```

### 7. مكونات البيانات

#### Table (`src/components/ui/table.tsx`)

```typescript
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

<Table>
  <TableCaption>قائمة المستخدمين</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>الاسم</TableHead>
      <TableHead>البريد الإلكتروني</TableHead>
      <TableHead>الدور</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>أحمد محمد</TableCell>
      <TableCell>ahmed@example.com</TableCell>
      <TableCell>طالب</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Pagination (`src/components/ui/pagination.tsx`)

```typescript
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>
        2
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

## المكونات المخصصة

### 1. CourseCard (`src/components/course-card.tsx`)

```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, Star } from 'lucide-react'
import Link from 'next/link'

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    thumbnail?: string
    price: number
    level: string
    instructor: {
      name: string
      image?: string
    }
    category?: {
      name: string
    }
    averageRating: number
    totalDuration: number
    _count: {
      enrollments: number
      reviews: number
    }
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours} س ${mins} د` : `${mins} د`
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 relative">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400">لا توجد صورة</div>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge className={getLevelColor(course.level)}>
            {course.level === 'BEGINNER' ? 'مبتدئ' : 
             course.level === 'INTERMEDIATE' ? 'متوسط' : 'متقدم'}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">
          {course.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(course.totalDuration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course._count.enrollments}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{course.averageRating}</span>
          </div>
        </div>

        {course.category && (
          <Badge variant="outline" className="w-fit">
            {course.category.name}
          </Badge>
        )}

        <Link href={`/courses/${course.id}`} className="block">
          <Button className="w-full">
            عرض التفاصيل
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
```

### 2. StatsCard (`src/components/stats-card.tsx`)

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
}

export function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
```

### 3. LoadingSpinner (`src/components/loading-spinner.tsx`)

```typescript
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  )
}
```

## أنماط التصميم

### 1. الألوان

```typescript
// الألوان الرئيسية
primary: 'blue-600'
primary-foreground: 'white'

secondary: 'gray-100'
secondary-foreground: 'gray-900'

accent: 'blue-500'
accent-foreground: 'white'

destructive: 'red-600'
destructive-foreground: 'white'

// الألوان الإضافية
muted: 'gray-500'
muted-foreground: 'gray-100'

card: 'white'
card-foreground: 'gray-900'

popover: 'white'
popover-foreground: 'gray-900'

border: 'gray-200'
input: 'white'
ring: 'blue-500'
```

### 2. التباعد (Spacing)

```typescript
// استخدام Tailwind classes للتباعد
p-4   // padding: 1rem
p-6   // padding: 1.5rem
px-4  // padding-left/right: 1rem
py-2  // padding-top/bottom: 0.5rem

m-4   // margin: 1rem
space-y-4  // spacing between children (vertical)
space-x-4  // spacing between children (horizontal)
gap-4  // gap between grid/flex items
```

### 3. الخطوط (Typography)

```typescript
// العناوين
text-4xl  // 2.25rem
text-3xl  // 1.875rem
text-2xl  // 1.5rem
text-xl   // 1.25rem
text-lg   // 1.125rem

// النص
text-base  // 1rem
text-sm   // 0.875rem
text-xs   // 0.75rem

// أوزان الخطوط
font-normal
font-medium
font-semibold
font-bold
```

### 4. الظلال (Shadows)

```typescript
shadow-sm   // small shadow
shadow      // medium shadow
shadow-md   // medium shadow
shadow-lg   // large shadow
shadow-xl   // extra large shadow
```

## دعم RTL (Right-to-Left)

### 1. إعدادات Tailwind

```typescript
// tailwind.config.ts
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      direction: 'rtl', // Add RTL support
    },
  },
  plugins: [require('tailwindcss-direction')],
}
```

### 2. استخدام المكونات مع RTL

```typescript
// المكونات تدعم RTL تلقائياً
<div className="flex flex-row-reverse">  // عكس اتجاه flex
  <div>العنصر الأول</div>
  <div>العنصر الثاني</div>
</div>

// استخدام margin و padding مع RTL
<div className="mr-4">  // margin-right (becomes margin-left in RTL)
  محتوى
</div>

<div className="pl-4">  // padding-left (becomes padding-right in RTL)
  محتوى
</div>
```

### 3. الأيقونات مع RTL

```typescript
// عكس اتجاه الأيقونات
import { ChevronLeft, ChevronRight } from 'lucide-react'

// في RTL، ChevronLeft يصبح لليمين و ChevronRight يصبح لليسار
<button className="rtl">
  <ChevronLeft className="h-4 w-4" />  // سيظهر كالسهم الأيمن في RTL
</button>
```

## أفضل المميزات

### 1. إعادة استخدام المكونات

```typescript
// إنشاء مكونات قابلة لإعادة الاستخدام
interface BaseCardProps {
  children: React.ReactNode
  className?: string
}

export function BaseCard({ children, className = '' }: BaseCardProps) {
  return (
    <Card className={`${className} hover:shadow-lg transition-shadow`}>
      {children}
    </Card>
  )
}

// استخدام المكون
<BaseCard className="p-6">
  <h3>عنوان البطاقة</h3>
  <p>محتوى البطاقة</p>
</BaseCard>
```

### 2. التكيف مع مختلف الأحجام

```typescript
// استخدام تصميم متجاوب
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <CourseCard course={course} />
  <CourseCard course={course} />
  <CourseCard course={course} />
</div>

// استخدام فئات شرطية
<div className={`${isMobile ? 'p-4' : 'p-6'}`}>
  محتوى
</div>
```

### 3. التعامل مع حالات التحميل

```typescript
// إضافة حالة تحميل
function CourseList({ courses, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
```

### 4. التعامل مع الأخطاء

```typescript
// إضافة حالة خطأ
function DataComponent({ data, error, loading }) {
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!data) return <EmptyState />

  return <div>{data}</div>
}
```

## استكشاف الأخطاء الشائعة

### 1. مشاكل RTL

**المشكلة:** المكونات لا تظهر بشكل صحيح في RTL
**الحل:**
- تأكد من إضافة `dir="rtl"` في HTML
- تحقق من إعدادات Tailwind لدعم RTL
- استخدم `flex-row-reverse` عند الحاجة

**المشكلة:** الأيقونات في الاتجاه الخطأ
**الحل:**
- استخدم الأيقونات المناسبة لـ RTL
- استخدم `transform rotate-180` عند الحاجة

### 2. مشاكل التصميم

**المشكلة:** المكونات غير متسقة
**الحل:**
- استخدم الألوان والتباعد المعرفة
- اتبع نظام التصميم المعمول به
- استخدم المكونات القياسية

### 3. مشاكل الأداء

**المشكلة:** المكونات بطيئة في التحميل
**الحل:**
- استخدم التحميل البطيء للصور
- قلل من إعادة التصيير غير الضرورية
- استخدم `React.memo` للمكونات البطيئة

### 4. مشاكل TypeScript

**المشكلة:** أخطاء في الأنواع
**الحل:**
- عرف الأنواع بوضوح للمكونات
- استخدم `React.FC` للمكونات الوظيفية
- استخدم `interface` للـ props

## التطوير المستقبلي

### 1. مكونات مقترحة
- **ChartCard**: بطاقة عرض الرسوم البيانية
- **UserAvatar**: مكون الصورة الشخصية المخصص
- **StatusBadge**: شارة الحالة المخصصة
- **ProgressCircle**: دائرة التقدم الدائرية
- **FileUploader**: مكون رفع الملفات

### 2. تحسينات مقترحة
- **إضافة حركات:** المزيد من الرسوم المتحركة
- **تحسين الأداء:** تحسين أداء المكونات
- **إضافة ثيمات:** دعم الثيمات المظلمة/الفاتحة
- **تحسين RTL:** تحسين دعم RTL

### 3. تكاملات مقترحة
- **Framer Motion:** المزيد من الرسوم المتحركة
- **React Hook Form:** تكامل أفضل مع النماذج
- **Zustand:** إدارة الحالة العالمية
- **React Query:** تحسين إدارة البيانات

---

## الخاتمة

مكونات الواجهة في منصة "مَعِين" توفر أساساً قوياً لبناء واجهة مستخدم جميلة وسهلة الاستخدام. تم تصميم المكونات لتكون متسقة، قابلة لإعادة الاستخدام، وسهلة الصيانة مع دعم كامل للغة العربية.

**ملاحظة:** عند إضافة مكونات جديدة، تأكد من اتباع أنماط التصميم الحالية والحفاظ على تناسق الواجهة.