"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, Star, BookOpen, Play, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  price: number
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
    content?: string
    videoUrl?: string
    duration?: number
    order: number
    type: string
    isFree: boolean
  }>
  reviews: Array<{
    id: string
    rating: number
    comment?: string
    user: {
      id: string
      name: string
      image?: string
    }
    createdAt: string
  }>
  averageRating: number
  totalDuration: number
  reviewCount: number
  _count: {
    enrollments: number
    reviews: number
  }
}

export default function CourseDetailsPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [params.id])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${params.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setCourse(data.course)
        
        // Check if user is enrolled
        if (session) {
          const enrollmentResponse = await fetch(`/api/enrollments/check?courseId=${params.id}`)
          const enrollmentData = await enrollmentResponse.json()
          setEnrolled(enrollmentData.enrolled)
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!session) {
      window.location.href = "/auth/signin"
      return
    }

    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: params.id,
        }),
      })

      if (response.ok) {
        setEnrolled(true)
        // Show success message
      }
    } catch (error) {
      console.error("Error enrolling in course:", error)
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours} س ${mins} د` : `${mins} د`
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>جاري تحميل الدورة...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            الدورة غير موجودة
          </h1>
          <p className="text-gray-600 mb-4">
            قد تكون الدورة قد تم حذفها أو الرابط غير صحيح
          </p>
          <Link href="/courses">
            <Button>العودة إلى الدورات</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-video bg-gray-200 rounded-lg mb-6">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center rounded-lg">
                    <BookOpen className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <Badge className={getLevelColor(course.level)}>
                  {getLevelText(course.level)}
                </Badge>
                {course.category && (
                  <Badge variant="outline">
                    {course.category.name}
                  </Badge>
                )}
                {course.price > 0 ? (
                  <Badge variant="secondary">
                    {course.price} ريال
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    مجاني
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                {course.description}
              </p>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={course.instructor.image} />
                  <AvatarFallback>
                    {course.instructor.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{course.instructor.name}</p>
                  <p className="text-sm text-gray-600">مدرب الدورة</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(course.totalDuration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course._count.enrollments} طالب</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.averageRating} ({course.reviewCount} تقييم)</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.lessons.length} درس</span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>الانضمام إلى الدورة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {enrolled ? (
                    <div className="text-center">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <p className="text-green-600 font-semibold mb-4">
                        أنت مسجل في هذه الدورة
                      </p>
                      <Link href={`/dashboard/courses/${course.id}`}>
                        <Button className="w-full">
                          متابعة التعلم
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      {course.price > 0 ? (
                        <div className="text-center">
                          <p className="text-3xl font-bold text-gray-900 mb-2">
                            {course.price} ريال
                          </p>
                          <p className="text-gray-600 mb-4">
                            سعر الدورة
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600 mb-2">
                            مجاني
                          </p>
                          <p className="text-gray-600 mb-4">
                            انضم الآن مجاناً
                          </p>
                        </div>
                      )}
                      
                      <Button 
                        onClick={handleEnroll}
                        className="w-full"
                        size="lg"
                      >
                        {session ? "الانضمام إلى الدورة" : "تسجيل الدخول للانضمام"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lessons">الدروس</TabsTrigger>
            <TabsTrigger value="reviews">التقييمات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lessons" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>محتوى الدورة</CardTitle>
                <CardDescription>
                  {course.lessons.length} درس • {formatDuration(course.totalDuration)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{lesson.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {lesson.duration && (
                              <span>{formatDuration(lesson.duration)}</span>
                            )}
                            {lesson.isFree && (
                              <Badge variant="outline">مجاني</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>تقييمات الطلاب</CardTitle>
                <CardDescription>
                  {course.reviewCount} تقييم • متوسط التقييم: {course.averageRating}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.user.image} />
                          <AvatarFallback>
                            {review.user.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{review.user.name}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString("ar-SA")}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                    </div>
                  ))}
                  
                  {course.reviews.length === 0 && (
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">لا توجد تقييمات بعد</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}