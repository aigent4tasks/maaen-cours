"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, Star, BookOpen } from "lucide-react"
import Link from "next/link"
import { CourseLevel } from "@prisma/client"

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  price: number
  level: CourseLevel
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
  averageRating: number
  totalDuration: number
  reviewCount: number
  _count: {
    enrollments: number
    reviews: number
  }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [level, setLevel] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      })

      if (search) params.append("search", search)
      if (level) params.append("level", level)

      const response = await fetch(`/api/courses?${params}`)
      const data = await response.json()

      if (page === 1) {
        setCourses(data.courses)
      } else {
        setCourses(prev => [...prev, ...data.courses])
      }

      setHasMore(data.pagination.page < data.pagination.pages)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [page, search, level])

  useEffect(() => {
    setPage(1)
  }, [search, level])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours} س ${mins} د` : `${mins} د`
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              استكشف دوراتنا
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اكتشف مجموعة واسعة من الدورات في مختلف المجالات وطور مهاراتك
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1">
              <Input
                placeholder="ابحث عن دورات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="المستوى" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع المستويات</SelectItem>
                <SelectItem value={CourseLevel.BEGINNER}>مبتدئ</SelectItem>
                <SelectItem value={CourseLevel.INTERMEDIATE}>متوسط</SelectItem>
                <SelectItem value={CourseLevel.ADVANCED}>متقدم</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                {course.price > 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">
                      {course.price} ريال
                    </Badge>
                  </div>
                )}
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
                {/* Instructor */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={course.instructor.image} />
                    <AvatarFallback>
                      {course.instructor.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">
                    {course.instructor.name}
                  </span>
                </div>

                {/* Stats */}
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

                {/* Category */}
                {course.category && (
                  <Badge variant="outline" className="w-fit">
                    {course.category.name}
                  </Badge>
                )}

                {/* Action */}
                <Link href={`/courses/${course.id}`} className="block">
                  <Button className="w-full">
                    عرض التفاصيل
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-12">
            <Button
              onClick={() => setPage(page + 1)}
              disabled={loading}
              variant="outline"
            >
              {loading ? "جاري التحميل..." : "تحميل المزيد"}
            </Button>
          </div>
        )}

        {courses.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد دورات متاحة
            </h3>
            <p className="text-gray-600">
              حاول تغيير معايير البحث أو تحقق لاحقاً
            </p>
          </div>
        )}
      </div>
    </div>
  )
}