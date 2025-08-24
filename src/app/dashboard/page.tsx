"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Clock, Star, Users, LogOut, Settings } from "lucide-react"
import Link from "next/link"

interface Enrollment {
  id: string
  status: string
  progress: number
  enrolledAt: string
  progressPercentage: number
  completedLessons: number
  totalLessons: number
  course: {
    id: string
    title: string
    description: string
    thumbnail?: string
    level: string
    instructor: {
      id: string
      name: string
      image?: string
    }
    category?: {
      id: string
      name: string
      icon?: string
      color?: string
    }
    lessons: Array<{
      id: string
      title: string
      duration?: number
      order: number
    }>
    _count: {
      lessons: number
    }
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      fetchEnrollments()
    }
  }, [status])

  const fetchEnrollments = async () => {
    try {
      const response = await fetch("/api/enrollments")
      const data = await response.json()
      
      if (response.ok) {
        setEnrollments(data.enrollments)
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 text-green-800"
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800"
      case "ADVANCED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "مبتدئ"
      case "INTERMEDIATE":
        return "متوسط"
      case "ADVANCED":
        return "متقدم"
      default:
        return level
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "نشط"
      case "COMPLETED":
        return "مكتمل"
      case "CANCELLED":
        return "ملغي"
      default:
        return status
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours} س ${mins} د` : `${mins} د`
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            يجب تسجيل الدخول أولاً
          </h1>
          <p className="text-gray-600 mb-4">
            يرجى تسجيل الدخول للوصول إلى لوحة التحكم
          </p>
          <Link href="/auth/signin">
            <Button>تسجيل الدخول</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                مَعِين
              </Link>
              <nav className="mr-8 flex space-x-8">
                <Link href="/courses" className="text-gray-700 hover:text-blue-600">
                  الدورات
                </Link>
                <Link href="/dashboard" className="text-blue-600 font-medium">
                  لوحة التحكم
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 ml-2" />
                  الإعدادات
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4 ml-2" />
                تسجيل الخروج
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback>
                  {session.user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مرحباً بك، {session.user?.name}
          </h1>
          <p className="text-gray-600">
            تابع تقدمك التعليمي واستكشف دوراتك المسجلة
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الدورات المسجلة
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الدورات المكتملة
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enrollments.filter(e => e.status === "COMPLETED").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الدروس
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enrollments.reduce((sum, e) => sum + e.totalLessons, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الدروس المكتملة
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enrollments.reduce((sum, e) => sum + e.completedLessons, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Courses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            دوراتي
          </h2>
          
          {enrollments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  لم تسجل في أي دورة بعد
                </h3>
                <p className="text-gray-600 mb-4 text-center">
                  استكشف دوراتنا وابدأ رحلتك التعليمية اليوم
                </p>
                <Link href="/courses">
                  <Button>استكشف الدورات</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 relative">
                    {enrollment.course.thumbnail ? (
                      <img
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge className={getLevelColor(enrollment.course.level)}>
                        {getLevelText(enrollment.course.level)}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={getStatusColor(enrollment.status)}>
                        {getStatusText(enrollment.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {enrollment.course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {enrollment.course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>التقدم</span>
                        <span>{enrollment.progressPercentage}%</span>
                      </div>
                      <Progress value={enrollment.progressPercentage} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{enrollment.completedLessons} من {enrollment.totalLessons} درس</span>
                      </div>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={enrollment.course.instructor.image} />
                        <AvatarFallback>
                          {enrollment.course.instructor.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">
                        {enrollment.course.instructor.name}
                      </span>
                    </div>

                    {/* Category */}
                    {enrollment.course.category && (
                      <Badge variant="outline" className="w-fit">
                        {enrollment.course.category.name}
                      </Badge>
                    )}

                    {/* Action */}
                    <Link href={`/dashboard/courses/${enrollment.course.id}`} className="block">
                      <Button className="w-full">
                        {enrollment.status === "COMPLETED" ? "مراجعة الدورة" : "متابعة التعلم"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}