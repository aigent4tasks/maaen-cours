"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, BookOpen, Star, TrendingUp, LogOut, Settings } from "lucide-react"
import Link from "next/link"

interface AdminStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  totalReviews: number
  recentUsers: number
  recentCourses: number
}

interface RecentActivity {
  id: string
  type: 'user' | 'course' | 'enrollment' | 'review'
  title: string
  description: string
  createdAt: string
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchAdminData()
    }
  }, [session])

  const fetchAdminData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch("/api/admin/stats")
      const statsData = await statsResponse.json()
      
      // Fetch recent activity
      const activityResponse = await fetch("/api/admin/activity")
      const activityData = await activityResponse.json()
      
      if (statsResponse.ok) {
        setStats(statsData)
      }
      
      if (activityResponse.ok) {
        setRecentActivity(activityData.activity)
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            يجب تسجيل الدخول أولاً
          </h1>
          <p className="text-gray-600 mb-4">
            يرجى تسجيل الدخول للوصول إلى لوحة تحكم المشرف
          </p>
          <Link href="/auth/signin">
            <Button>تسجيل الدخول</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Check if user is admin (in a real app, this would be a proper role check)
  if (session.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            غير مصرح لك بالوصول
          </h1>
          <p className="text-gray-600 mb-4">
            هذه الصفحة متاحة فقط للمشرفين
          </p>
          <Link href="/dashboard">
            <Button>العودة إلى لوحة التحكم</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>جاري تحميل لوحة التحكم...</p>
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
                <Link href="/admin" className="text-blue-600 font-medium">
                  لوحة المشرف
                </Link>
                <Link href="/admin/courses" className="text-gray-700 hover:text-blue-600">
                  إدارة الدورات
                </Link>
                <Link href="/admin/users" className="text-gray-700 hover:text-blue-600">
                  إدارة المستخدمين
                </Link>
                <Link href="/admin/categories" className="text-gray-700 hover:text-blue-600">
                  إدارة التصنيفات
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  لوحة التحكم
                </Button>
              </Link>
              <span className="text-sm text-gray-600">
                مرحباً {session.user?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مرحباً بك في لوحة تحكم المشرف
          </h1>
          <p className="text-gray-600">
            إدارة المحتوى والمستخدمين والمنصة بشكل عام
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي المستخدمين
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.recentUsers} هذا الشهر
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي الدورات
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.recentCourses} هذا الشهر
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي التسجيلات
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
                <p className="text-xs text-muted-foreground">
                  نشطة حالياً
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي التقييمات
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalReviews}</div>
                <p className="text-xs text-muted-foreground">
                  تقييمات المستخدمين
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>إدارة الدورات</CardTitle>
              <CardDescription>
                إضافة وتعديل وحذف الدورات التعليمية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/courses">
                <Button className="w-full">
                  إدارة الدورات
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إدارة المستخدمين</CardTitle>
              <CardDescription>
                عرض وإدارة حسابات المستخدمين
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/users">
                <Button className="w-full">
                  إدارة المستخدمين
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إدارة التصنيفات</CardTitle>
              <CardDescription>
                تنظيم الدورات في تصنيفات مختلفة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/categories">
                <Button className="w-full">
                  إدارة التصنيفات
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>النشاط الحديث</CardTitle>
            <CardDescription>
              آخر الأنشطة على المنصة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">لا يوجد نشاط حديث</p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'course' ? 'bg-green-100 text-green-600' :
                        activity.type === 'enrollment' ? 'bg-purple-100 text-purple-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {activity.type === 'user' && <Users className="h-4 w-4" />}
                        {activity.type === 'course' && <BookOpen className="h-4 w-4" />}
                        {activity.type === 'enrollment' && <TrendingUp className="h-4 w-4" />}
                        {activity.type === 'review' && <Star className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="font-semibold">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}