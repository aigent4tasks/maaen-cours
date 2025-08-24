import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Users, Award, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">مَعِين</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/courses" className="text-gray-700 hover:text-blue-600">
                الدورات
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">
                من نحن
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">
                تواصل معنا
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost">تسجيل الدخول</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>إنشاء حساب</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            مرحباً بك في منصة مَعِين التعليمية
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            اكتشف عالماً من المعرفة مع دورات تفاعلية ومحتوى تعليمي عالي الجودة
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/courses">
              <Button size="lg" className="text-lg px-8 py-3">
                استكشف الدورات
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                اعرف المزيد
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            لماذا تختار منصة مَعِين؟
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>محتوى تعليمي غني</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  دورات شاملة في مختلف المجالات مع محتوى تفاعلي وجذاب
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>مدرسون محترفون</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  تعلم من أفضل الخبراء والمتخصصين في كل مجال
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>شهادات معتمدة</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  احصل على شهادات إتمام معتمدة بعد إنهاء الدورات
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>تعلم مرن</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  تعلم في وقتك المناسب ومن أي مكان تريده
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            ابدأ رحلتك التعليمية اليوم
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            انضم إلى آلاف الطلاب الذين يطورون مهاراتهم مع منصة مَعِين
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              ابدأ الآن
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-2xl font-bold mb-4">مَعِين</h4>
              <p className="text-gray-400">
                منصة تعليمية متكاملة تقدم دورات ودروس في مختلف المجالات
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">روابط سريعة</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/courses" className="hover:text-white">الدورات</Link></li>
                <li><Link href="/about" className="hover:text-white">من نحن</Link></li>
                <li><Link href="/contact" className="hover:text-white">تواصل معنا</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">الدعم</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">مركز المساعدة</Link></li>
                <li><Link href="/faq" className="hover:text-white">الأسئلة الشائعة</Link></li>
                <li><Link href="/terms" className="hover:text-white">الشروط والأحكام</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">تواصل معنا</h5>
              <p className="text-gray-400">
                البريد الإلكتروني: info@maaen.com<br />
                الهاتف: +966 12 345 6789
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 منصة مَعِين. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}