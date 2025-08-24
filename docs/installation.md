# دليل التثبيت والإعداد - منصة "مَعِين"

## 📋 المتطلبات الأساسية

### المتطلبات البرمجية
- **Node.js** - الإصدار 18.0 أو أحدث
- **npm** - الإصدار 8.0 أو أحدث (يأتي مع Node.js)
- **Git** - لإدارة النسخ والتحكم في الإصدارات

### المتطلبات النظامية
- **نظام التشغيل**: Windows 10+, macOS 10.14+, أو Linux (Ubuntu 18.04+)
- **الذاكرة العشوائية**: 4GB كحد أدنى، 8GB موصى بها
- **المساحة التخزينية**: 2GB مساحة حرة
- **الاتصال بالإنترنت**: لتحميل الحزم والتبعيات

## 🚀 خطوات التثبيت

### الخطوة 1: استنساخ المشروع
```bash
# استنساخ المستودع من GitHub
git clone https://github.com/your-username/maaeen-platform.git

# الدخول إلى مجلد المشروع
cd maaeen-platform
```

### الخطوة 2: تثبيت التبعيات
```bash
# تثبيت جميع الحزم المطلوبة
npm install
```

### الخطوة 3: إعداد متغيرات البيئة
```bash
# نسخ ملف المتغيرات النموذجي
cp .env.example .env

# تعديل ملف المتغيرات حسب البيئة
nano .env
```

**محتويات ملف `.env`**:
```env
# قاعدة البيانات
DATABASE_URL="file:./dev.db"

# إعدادات NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# إعدادات Google OAuth (اختياري)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### الخطوة 4: إعداد قاعدة البيانات
```bash
# إنشاء قاعدة البيانات
npx prisma generate

# دفع المخطط إلى قاعدة البيانات
npx prisma db push

# (اختياري) فتح Prisma Studio لإدارة قاعدة البيانات
npx prisma studio
```

### الخطوة 5: تشغيل المشروع
```bash
# تشغيل خادم التطوير
npm run dev
```

## 🌐 التشغيل الأولي

### الوصول إلى التطبيق
بعد تشغيل الخادم، يمكنك الوصول إلى التطبيق عبر:
- **الرئيسية**: http://localhost:3000
- **لوحة التحكم**: http://localhost:3000/dashboard
- **الدورات**: http://localhost:3000/courses
- **تسجيل الدخول**: http://localhost:3000/auth/signin

### التحقق من التثبيت
1. افتح المتصفح على العنوان http://localhost:3000
2. تأكد من ظهور صفحة المنصة الرئيسية
3. جرب التسجيل بحساب جديد عبر صفحة تسجيل الدخول
4. تحقق من الوصول إلى لوحة التحكم بعد تسجيل الدخول

## 🔧 الأوامر الشائعة

### أوامر التطوير
```bash
# تشغيل خادم التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# تشغيل خادم الإنتاج
npm start

# تشغيل خادم التطوير مع Socket.IO
npm run dev:socket
```

### أوامر قاعدة البيانات
```bash
# إنشاء عميل Prisma
npx prisma generate

# دفع التغييرات إلى قاعدة البيانات
npx prisma db push

# إنشاء نسخة احتياطية من قاعدة البيانات
npx prisma db seed

# فتح واجهة إدارة قاعدة البيانات
npx prisma studio

# التحقق من صحة المخطط
npx prisma validate
```

### أوامر جودة الكود
```bash
# تشغيل ESLint للتحقق من جودة الكود
npm run lint

# إصلاح مشاكل ESLint تلقائياً
npm run lint:fix

# تنسيق الكود باستخدام Prettier
npm run format
```

## 🐛 حل المشاكل الشائعة

### مشكلة: أخطاء في تثبيت الحزم
```bash
# حل: مسح ذاكرة التخزين المؤقت وإعادة التثبيت
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### مشكلة: أخطاء في قاعدة البيانات
```bash
# حل: إعادة تعيين قاعدة البيانات
rm -f dev.db
npx prisma db push
```

### مشكلة: أخطاء في NextAuth
```bash
# حل: التأكد من متغيرات البيئة
echo "NEXTAUTH_URL=http://localhost:3000" >> .env
echo "NEXTAUTH_SECRET=your-secret-key" >> .env
```

### مشكلة: منفذ 3000 مستخدم
```bash
# حل: تغيير المنفذ في package.json
# أو استخدام منفذ مختلف
PORT=3001 npm run dev
```

## 📝 ملاحظات هامة

### الأمان
- **لا تكشف** عن متغيرات البيئة الحساسة في الكود المصدري
- **استخدم** مفاتيح قوية وأسرار عشوائية للإنتاج
- **غير** القيم الافتراضية لمتغيرات البيئة قبل النشر

### الأداء
- **استخدم** وضع الإنتاج للبناء النهائي
- **فعل** ضغط Gzip للملفات الثابتة
- **استخدم** CDN للملفات الثابتة في الإنتاج

### التطوير
- **استخدم** Git branches للميزات المختلفة
- **اكتب** رسائل commit واضحة ومفصلة
- **اختبر** التغييرات قبل دمجها في الفرع الرئيسي

## 🔄 البيئات المختلفة

### بيئة التطوير (Development)
```bash
# متغيرات البيئة للتطوير
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
```

### بيئة الإنتاج (Production)
```bash
# متغيرات البيئة للإنتاج
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL="postgresql://user:password@host:port/database"
```

### بيئة الاختبار (Testing)
```bash
# متغيرات البيئة للاختبار
NODE_ENV=test
DATABASE_URL="file:./test.db"
```

---

**آخر تحديث**: 24 أغسطس 2024  
**مسؤول الدعم**: فريق تطوير منصة "مَعِين"