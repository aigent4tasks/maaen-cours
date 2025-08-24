"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, BookOpen, Users, Star } from "lucide-react"
import Link from "next/link"
import { CourseLevel, CourseStatus } from "@prisma/client"

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  price: number
  level: CourseLevel
  status: CourseStatus
  instructor: {
    id: string
    name: string
  }
  category?: {
    id: string
    name: string
  }
  _count: {
    enrollments: number
    reviews: number
  }
  createdAt: string
}

interface User {
  id: string
  name: string
  email: string
}

interface Category {
  id: string
  name: string
}

export default function AdminCoursesPage() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<Course[]>([])
  const [instructors, setInstructors] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    level: CourseLevel.BEGINNER,
    status: CourseStatus.DRAFT,
    instructorId: "",
    categoryId: "",
  })

  useEffect(() => {
    if (session) {
      fetchCourses()
      fetchInstructors()
      fetchCategories()
    }
  }, [session])

  const fetchCourses = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (statusFilter) params.append("status", statusFilter)

      const response = await fetch(`/api/admin/courses?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setCourses(data.courses)
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInstructors = async () => {
    try {
      const response = await fetch("/api/admin/instructors")
      const data = await response.json()
      
      if (response.ok) {
        setInstructors(data.instructors)
      }
    } catch (error) {
      console.error("Error fetching instructors:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      
      if (response.ok) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsCreateDialogOpen(false)
        setFormData({
          title: "",
          description: "",
          price: 0,
          level: CourseLevel.BEGINNER,
          status: CourseStatus.DRAFT,
          instructorId: "",
          categoryId: "",
        })
        fetchCourses()
      }
    } catch (error) {
      console.error("Error creating course:", error)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الدورة؟")) return

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchCourses()
      }
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }

  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER:
        return "bg-green-100 text-green-800"
      case CourseLevel.INTERMEDIATE:
        return "bg-yellow-100 text-yellow-800"
      case CourseLevel.ADVANCED:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case CourseStatus.DRAFT:
        return "bg-gray-100 text-gray-800"
      case CourseStatus.PUBLISHED:
        return "bg-green-100 text-green-800"
      case CourseStatus.ARCHIVED:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelText = (level: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER:
        return "مبتدئ"
      case CourseLevel.INTERMEDIATE:
        return "متوسط"
      case CourseLevel.ADVANCED:
        return "متقدم"
      default:
        return level
    }
  }

  const getStatusText = (status: CourseStatus) => {
    switch (status) {
      case CourseStatus.DRAFT:
        return "مسودة"
      case CourseStatus.PUBLISHED:
        return "منشورة"
      case CourseStatus.ARCHIVED:
        return "مؤرشفة"
      default:
        return status
    }
  }

  if (!session || session.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-2xl font-bold text-blue-600">
                مَعِين
              </Link>
              <nav className="mr-8 flex space-x-8">
                <Link href="/admin" className="text-gray-700 hover:text-blue-600">
                  لوحة المشرف
                </Link>
                <Link href="/admin/courses" className="text-blue-600 font-medium">
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              إدارة الدورات
            </h1>
            <p className="text-gray-600">
              إضافة وتعديل وحذف الدورات التعليمية
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                إضافة دورة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة دورة جديدة</DialogTitle>
                <DialogDescription>
                  أدخل بيانات الدورة الجديدة
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <Label htmlFor="title">عنوان الدورة</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">وصف الدورة</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">السعر</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <Label htmlFor="level">المستوى</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value as CourseLevel })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CourseLevel.BEGINNER}>مبتدئ</SelectItem>
                      <SelectItem value={CourseLevel.INTERMEDIATE}>متوسط</SelectItem>
                      <SelectItem value={CourseLevel.ADVANCED}>متقدم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">الحالة</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as CourseStatus })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CourseStatus.DRAFT}>مسودة</SelectItem>
                      <SelectItem value={CourseStatus.PUBLISHED}>منشورة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="instructor">المدرب</Label>
                  <Select value={formData.instructorId} onValueChange={(value) => setFormData({ ...formData, instructorId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدرب" />
                    </SelectTrigger>
                    <SelectContent>
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="category">التصنيف</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">بدون تصنيف</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit">
                    إضافة الدورة
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="ابحث عن دورات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الحالات</SelectItem>
              <SelectItem value={CourseStatus.DRAFT}>مسودة</SelectItem>
              <SelectItem value={CourseStatus.PUBLISHED}>منشورة</SelectItem>
              <SelectItem value={CourseStatus.ARCHIVED}>مؤرشفة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>جاري تحميل الدورات...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge className={getLevelColor(course.level)}>
                      {getLevelText(course.level)}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusColor(course.status)}>
                      {getStatusText(course.status)}
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
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course._count.enrollments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{course._count.reviews}</span>
                    </div>
                    <div className="font-semibold">
                      {course.price > 0 ? `${course.price} ريال` : "مجاني"}
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">المدرب:</span> {course.instructor.name}
                  </div>

                  {/* Category */}
                  {course.category && (
                    <Badge variant="outline" className="w-fit">
                      {course.category.name}
                    </Badge>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between">
                    <Link href={`/admin/courses/${course.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 ml-2" />
                        تعديل
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {courses.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد دورات
            </h3>
            <p className="text-gray-600 mb-4">
              ابدأ بإضافة دورات جديدة إلى المنصة
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة دورة
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}