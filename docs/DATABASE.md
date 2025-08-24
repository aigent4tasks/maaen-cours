# وثائق قاعدة البيانات - منصة "مَعِين"

## نظرة عامة

تستخدم منصة "مَعِين" قاعدة بيانات SQLite مع Prisma ORM لإدارة البيانات. تم تصميم قاعدة البيانات لدعم جميع ميزات المنصة التعليمية بشكل فعال وآمن.

## التقنيات المستخدمة

- **قاعدة البيانات:** SQLite
- **ORM:** Prisma
- **العميل:** Prisma Client
- **واجهة الإدارة:** Prisma Studio

## النماذج (Models)

### 1. User (المستخدمون)

**الوصف:** يمثل المستخدمين في المنصة مع أدوار مختلفة

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
```

**الحقول:**
- `id`: معرف فريد للمستخدم
- `email`: البريد الإلكتروني (فريد)
- `name`: اسم المستخدم
- `image`: صورة الملف الشخصي
- `emailVerified`: تاريخ تأكيد البريد الإلكتروني
- `role`: دور المستخدم (STUDENT, INSTRUCTOR, ADMIN)
- `createdAt`: تاريخ الإنشاء
- `updatedAt`: تاريخ التحديث

### 2. Account (حسابات OAuth)

**الوصف:** يحفظ معلومات حسابات OAuth الخارجية

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}
```

### 3. Session (جلسات المستخدمين)

**الوصف:** يحفظ معلومات جلسات المستخدمين

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}
```

### 4. VerificationToken (رموز التحقق)

**الوصف:** رموز التحقق لإعادة تعيين كلمة المرور وتأكيد البريد

```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verificationtokens")
}
```

### 5. Category (التصنيفات)

**الوصف:** تصنيفات الدورات التعليمية

```prisma
model Category {
  id          String   @id @default(cuid())
  name        String
  description String?
  icon        String?
  color       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  courses Course[]

  @@map("categories")
}
```

**الحقول:**
- `id`: معرف فريد للتصنيف
- `name`: اسم التصنيف
- `description`: وصف التصنيف
- `icon`: أيقونة التصنيف
- `color`: لون التصنيف
- `createdAt`: تاريخ الإنشاء
- `updatedAt`: تاريخ التحديث

### 6. Course (الدورات)

**الوصف:** الدورات التعليمية في المنصة

```prisma
model Course {
  id          String      @id @default(cuid())
  title       String
  description String?
  thumbnail   String?
  price       Float       @default(0)
  level       CourseLevel @default(BEGINNER)
  status      CourseStatus @default(DRAFT)
  language    String      @default("ar")
  duration    Int?        // in minutes
  instructorId String
  categoryId  String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relations
  instructor   User        @relation("InstructorCourses", fields: [instructorId], references: [id])
  category     Category?   @relation(fields: [categoryId], references: [id])
  lessons      Lesson[]
  enrollments  Enrollment[]
  reviews      Review[]
  discussions  Discussion[]

  @@map("courses")
}
```

**الحقول:**
- `id`: معرف فريد للدورة
- `title`: عنوان الدورة
- `description`: وصف الدورة
- `thumbnail`: صورة مصغرة للدورة
- `price`: سعر الدورة
- `level`: مستوى الدورة (BEGINNER, INTERMEDIATE, ADVANCED)
- `status`: حالة الدورة (DRAFT, PUBLISHED, ARCHIVED)
- `language`: لغة الدورة
- `duration`: مدة الدورة بالدقائق
- `instructorId`: معرف المدرب
- `categoryId`: معرف التصنيف
- `createdAt`: تاريخ الإنشاء
- `updatedAt`: تاريخ التحديث

### 7. Lesson (الدروس)

**الوصف:** الدروس داخل كل دورة

```prisma
model Lesson {
  id          String      @id @default(cuid())
  title       String
  content     String?
  videoUrl    String?
  duration    Int?        // in minutes
  order       Int
  type        LessonType  @default(VIDEO)
  isPublished Boolean     @default(false)
  isFree      Boolean     @default(false)
  courseId    String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relations
  course      Course      @relation(fields: [courseId], references: [id], onDelete: Cascade)
  progress    Progress[]
  discussions Discussion[]

  @@map("lessons")
}
```

**الحقول:**
- `id`: معرف فريد للدرس
- `title`: عنوان الدرس
- `content`: محتوى الدرس النصي
- `videoUrl`: رابط الفيديو
- `duration`: مدة الدرس بالدقائق
- `order`: ترتيب الدرس في الدورة
- `type`: نوع الدرس (VIDEO, TEXT, QUIZ, ASSIGNMENT)
- `isPublished`: هل الدرس منشور
- `isFree`: هل الدرس مجاني
- `courseId`: معرف الدورة
- `createdAt`: تاريخ الإنشاء
- `updatedAt`: تاريخ التحديث

### 8. Enrollment (التسجيلات)

**الوصف:** تسجيلات المستخدمين في الدورات

```prisma
model Enrollment {
  id             String           @id @default(cuid())
  userId         String
  courseId       String
  status         EnrollmentStatus @default(ACTIVE)
  progress       Float            @default(0)
  enrolledAt     DateTime         @default(now())
  completedAt    DateTime?

  // Relations
  user           User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  course         Course           @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessonProgress Progress[]

  @@unique([userId, courseId])
  @@map("enrollments")
}
```

**الحقول:**
- `id`: معرف فريد للتسجيل
- `userId`: معرف المستخدم
- `courseId`: معرف الدورة
- `status`: حالة التسجيل (ACTIVE, COMPLETED, CANCELLED)
- `progress`: نسبة التقدم في الدورة
- `enrolledAt`: تاريخ التسجيل
- `completedAt`: تاريخ الإكمال

### 9. Progress (التقدم)

**الوصف:** تقدم المستخدمين في الدروس

```prisma
model Progress {
  id           String   @id @default(cuid())
  userId       String
  lessonId     String
  enrollmentId String
  completed    Boolean  @default(false)
  completedAt  DateTime?
  watchTime    Int      @default(0) // in seconds
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson       Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  enrollment   Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId])
  @@map("progress")
}
```

**الحقول:**
- `id`: معرف فريد للتقدم
- `userId`: معرف المستخدم
- `lessonId`: معرف الدرس
- `enrollmentId`: معرف التسجيل
- `completed`: هل الدرس مكتمل
- `completedAt`: تاريخ الإكمال
- `watchTime`: وقت المشاهدة بالثواني
- `createdAt`: تاريخ الإنشاء
- `updatedAt`: تاريخ التحديث

### 10. Review (التقييمات)

**الوصف:** تقييمات المستخدمين للدورات

```prisma
model Review {
  id        String   @id @default(cuid())
  userId    String
  courseId  String
  rating    Int      // 1-5
  comment   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId])
  @@map("reviews")
}
```

**الحقول:**
- `id`: معرف فريد للتقييم
- `userId`: معرف المستخدم
- `courseId`: معرف الدورة
- `rating`: التقييم (1-5)
- `comment`: تعليق التقييم
- `createdAt`: تاريخ الإنشاء
- `updatedAt`: تاريخ التحديث

### 11. Discussion (النقاشات)

**الوصف:** النقاشات في الدورات والدروس

```prisma
model Discussion {
  id        String   @id @default(cuid())
  title     String
  content   String
  userId    String
  courseId  String?
  lessonId  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course    Course?  @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lesson    Lesson?  @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  replies   Reply[]

  @@map("discussions")
}
```

**الحقول:**
- `id`: معرف فريد للنقاش
- `title`: عنوان النقاش
- `content`: محتوى النقاش
- `userId`: معرف المستخدم
- `courseId`: معرف الدورة (اختياري)
- `lessonId`: معرف الدرس (اختياري)
- `createdAt`: تاريخ الإنشاء
- `updatedAt`: تاريخ التحديث

### 12. Reply (الردود)

**الوصف:** الردود على النقاشات

```prisma
model Reply {
  id           String   @id @default(cuid())
  content      String
  userId       String
  discussionId String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  discussion   Discussion @relation(fields: [discussionId], references: [id], onDelete: Cascade)

  @@map("replies")
}
```

**الحقول:**
- `id`: معرف فريد للرد
- `content`: محتوى الرد
- `userId`: معرف المستخدم
- `discussionId`: معرف النقاش
- `createdAt`: تاريخ الإنشاء
- `updatedAt`: تاريخ التحديث

## أنواع البيانات (Enums)

### UserRole (أدوار المستخدمين)
```prisma
enum UserRole {
  STUDENT
  INSTRUCTOR
  ADMIN
}
```

### CourseLevel (مستويات الدورات)
```prisma
enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}
```

### CourseStatus (حالات الدورات)
```prisma
enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

### LessonType (أنواع الدروس)
```prisma
enum LessonType {
  VIDEO
  TEXT
  QUIZ
  ASSIGNMENT
}
```

### EnrollmentStatus (حالات التسجيل)
```prisma
enum EnrollmentStatus {
  ACTIVE
  COMPLETED
  CANCELLED
}
```

## العلاقات بين النماذج

### العلاقات الرئيسية:
1. **User → Course**: علاقة One-to-Many (مدرب يمكنه إنشاء عدة دورات)
2. **User → Enrollment**: علاقة One-to-Many (مستخدم يمكنه التسجيل في عدة دورات)
3. **Course → Lesson**: علاقة One-to-Many (دورة تحتوي على عدة دروس)
4. **Course → Enrollment**: علاقة One-to-Many (دورة يمكن لها عدة تسجيلات)
5. **User → Review**: علاقة One-to-Many (مستخدم يمكنه تقييم عدة دورات)
6. **Lesson → Progress**: علاقة One-to-Many (درس يمكن له عدة سجلات تقدم)
7. **Discussion → Reply**: علاقة One-to-Many (نقاش يمكن له عدة ردود)

### العلاقات المعقدة:
- **Users ↔ Courses**: علاقة Many-to-Many عبر نموذج Enrollment
- **User Progress**: كل مستخدم يمكنه تتبع تقدمه في كل درس
- **Course Discussions**: النقاشات يمكن أن تكون على مستوى الدورة أو الدرس

## الاستعلامات الشائعة

### 1. جلب دورات المستخدم المسجل فيها
```typescript
const userEnrollments = await db.enrollment.findMany({
  where: { userId: session.user.id },
  include: {
    course: {
      include: {
        instructor: {
          select: { name: true, image: true }
        },
        category: {
          select: { name: true, icon: true }
        }
      }
    }
  }
});
```

### 2. جلب تفاصيل دورة مع جميع العلاقات
```typescript
const courseDetails = await db.course.findUnique({
  where: { id: courseId },
  include: {
    instructor: {
      select: { id: true, name: true, image: true }
    },
    category: {
      select: { id: true, name: true, icon: true, color: true }
    },
    lessons: {
      where: { isPublished: true },
      orderBy: { order: 'asc' }
    },
    reviews: {
      include: {
        user: {
          select: { id: true, name: true, image: true }
        }
      }
    },
    _count: {
      select: {
        enrollments: true,
        reviews: true
      }
    }
  }
});
```

### 3. حساب تقدم المستخدم في دورة
```typescript
const userProgress = await db.enrollment.findUnique({
  where: {
    userId_courseId: {
      userId: session.user.id,
      courseId
    }
  },
  include: {
    lessonProgress: {
      include: {
        lesson: {
          select: { id: true, title: true, duration: true }
        }
      }
    }
  }
});
```

### 4. جلب نقاشات دورة مع الردود
```typescript
const courseDiscussions = await db.discussion.findMany({
  where: { courseId },
  include: {
    user: {
      select: { id: true, name: true, image: true }
    },
    replies: {
      include: {
        user: {
          select: { id: true, name: true, image: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    }
  },
  orderBy: { createdAt: 'desc' }
});
```

### 5. إحصائيات المشرف
```typescript
const stats = await Promise.all([
  db.user.count(),
  db.course.count(),
  db.enrollment.count({ where: { status: 'ACTIVE' } }),
  db.review.count()
]);

const [totalUsers, totalCourses, totalEnrollments, totalReviews] = stats;
```

## إدارة قاعدة البيانات

### 1. إنشاء الترحيلات (Migrations)
```bash
# بعد تعديل schema.prisma
npm run db:push

# أو استخدام الترحيلات التقليدية
npx prisma migrate dev --name migration-name
```

### 2. عرض قاعدة البيانات
```bash
# فتح Prisma Studio
npm run db:studio
```

### 3. إنشاء عميل Prisma
```bash
# إنشاء عميل Prisma بعد تعديل المخطط
npm run db:generate
```

### 4. إعادة تعيين قاعدة البيانات
```bash
# حذف جميع البيانات وإعادة البدء
npm run db:reset
```

## أفضل الممارسات

### 1. تصميم قاعدة البيانات
- استخدم الأسماء الوصفية للنماذج والحقول
- استخدم الأنواع المناسبة للبيانات
- أضف فهارس (indexes) للحقول المستخدمة في البحث
- استخدم القيود (constraints) لضمان سلامة البيانات

### 2. الاستعلامات الفعالة
- اختر فقط الحقول المطلوبة (`select`)
- استخدم التضمين (`include`) بحكمة
- استخدم الترحيم (`skip`, `take`) للبيانات الكبيرة
- استخدم الفهارس في شروط البحث

### 3. الأمان
- لا تعرض بيانات حساسة في الواجهة الأمامية
- استخدم التحقق من الصلاحيات في الواجهات البرمجية
- استخدم الـ Prepared Statements عبر Prisma
- قم بتشفير البيانات الحساسة

### 4. الصيانة
- قم بعمل نسخ احتياطية بانتظام
- راقب أداء الاستعلامات
- قم بتحديث Prisma بانتظام
- قم بمراجعة وتحسين المخطط بشكل دوري

## استكشاف الأخطاء الشائعة

### 1. مشاكل الاتصال بقاعدة البيانات
```bash
# تحقق من وجود ملف قاعدة البيانات
ls -la prisma/

# أعد إنشاء عميل Prisma
npm run db:generate

# تحقق من متغيرات البيئة
echo $DATABASE_URL
```

### 2. مشاكل المخطط (Schema)
```bash
# تحقق من صحة المخطط
npx prisma validate

# أعد دفع المخطط
npm run db:push
```

### 3. مشاكل الأداء
```bash
# استخدم Prisma Studio لفحص الاستعلامات
npm run db:studio

# تحقق من وجود فهارس
npx prisma db execute --stdin
```

### 4. مشاكل التزامن
- استخدم المعاملات (Transactions) للعمليات الحرجة
- تعامل مع الأخطاء بشكل مناسب
- استخدم القفل المتفائل (Optimistic Locking) عند الحاجة

---

## الخاتمة

قاعدة بيانات منصة "مَعِين" مصممة لتكون قابلة للتوسع وفعالة وآمنة. تدعم جميع ميزات المنصة التعليمية وتوفر أساساً قوياً للتطوير المستقبلي.

**ملاحظة:** عند إضافة ميزات جديدة، تأكد من تحديث مخطط قاعدة البيانات والوثائق بشكل مناسب.