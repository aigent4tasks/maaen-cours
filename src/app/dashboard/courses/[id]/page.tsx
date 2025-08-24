"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  MessageCircle, 
  BookOpen, 
  Users, 
  ArrowLeft,
  Award,
  Plus
} from "lucide-react"
import Link from "next/link"

interface Lesson {
  id: string
  title: string
  content?: string
  videoUrl?: string
  duration?: number
  order: number
  type: string
  isFree: boolean
  completed: boolean
  watchTime: number
}

interface Discussion {
  id: string
  title: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
    image?: string
  }
  replies: Array<{
    id: string
    content: string
    createdAt: string
    user: {
      id: string
      name: string
      image?: string
    }
  }>
  _count: {
    replies: number
  }
}

interface Course {
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
  }
  lessons: Lesson[]
  averageRating: number
  totalDuration: number
  reviewCount: number
  progress: number
  completedLessons: number
  totalLessons: number
}

export default function CourseLearningPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDiscussionDialogOpen, setIsDiscussionDialogOpen] = useState(false)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [userReview, setUserReview] = useState<{ rating: number; comment?: string } | null>(null)

  // Discussion form state
  const [discussionForm, setDiscussionForm] = useState({
    title: "",
    content: "",
  })

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  })

  useEffect(() => {
    if (session && params.id) {
      fetchCourseData()
      fetchDiscussions()
      fetchUserReview()
    }
  }, [session, params.id])

  const fetchCourseData = async () => {
    try {
      // Get course details
      const courseResponse = await fetch(`/api/courses/${params.id}`)
      const courseData = await courseResponse.json()
      
      if (courseResponse.ok) {
        setCourse(courseData.course)
      }

      // Get enrollment data
      const enrollmentResponse = await fetch(`/api/enrollments/check?courseId=${params.id}`)
      const enrollmentData = await enrollmentResponse.json()
      
      if (enrollmentResponse.ok && enrollmentData.enrolled) {
        setEnrollment(enrollmentData.enrollment)
        
        // Get progress data
        const progressResponse = await fetch(`/api/progress?enrollmentId=${enrollmentData.enrollment.id}`)
        const progressData = await progressResponse.json()
        
        if (progressResponse.ok) {
          setLessons(progressData.progress.map((p: any) => ({
            ...p.lesson,
            completed: p.completed,
            watchTime: p.watchTime,
          })))
        }
      }
    } catch (error) {
      console.error("Error fetching course data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`/api/discussions?courseId=${params.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setDiscussions(data.discussions)
      }
    } catch (error) {
      console.error("Error fetching discussions:", error)
    }
  }

  const fetchUserReview = async () => {
    try {
      const response = await fetch(`/api/reviews?courseId=${params.id}&userId=${session?.user?.id}`)
      const data = await response.json()
      
      if (response.ok && data.reviews.length > 0) {
        setUserReview(data.reviews[0])
        setReviewForm({
          rating: data.reviews[0].rating,
          comment: data.reviews[0].comment || "",
        })
      }
    } catch (error) {
      console.error("Error fetching user review:", error)
    }
  }

  const handleLessonComplete = async (lessonId: string, completed: boolean) => {
    if (!enrollment) return

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId,
          enrollmentId: enrollment.id,
          completed,
          watchTime: 0,
        }),
      })

      if (response.ok) {
        // Update local state
        setLessons(prev => prev.map(lesson => 
          lesson.id === lessonId 
            ? { ...lesson, completed }
            : lesson
        ))
        
        // Refresh course data to update progress
        fetchCourseData()
      }
    } catch (error) {
      console.error("Error updating lesson progress:", error)
    }
  }

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...discussionForm,
          courseId: params.id,
        }),
      })

      if (response.ok) {
        setIsDiscussionDialogOpen(false)
        setDiscussionForm({ title: "", content: "" })
        fetchDiscussions()
      }
    } catch (error) {
      console.error("Error creating discussion:", error)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: params.id,
          ...reviewForm,
        }),
      })

      if (response.ok) {
        setIsReviewDialogOpen(false)
        fetchUserReview()
        fetchCourseData()
      }
    } catch (error) {
      console.error("Error submitting review:", error)
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

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            غير مسجل في الدورة
          </h1>
          <p className="text-gray-600 mb-4">
            يجب أن تكون مسجلاً في الدورة للوصول إلى المحتوى
          </p>
          <Link href={`/courses/${params.id}`}>
            <Button>العودة إلى صفحة الدورة</Button>
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
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-5 w-5 ml-2" />
                العودة
              </Link>
              <h1 className="text-xl font-bold text-gray-900 mr-4">
                {course.title}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getLevelColor(course.level)}>
                {getLevelText(course.level)}
              </Badge>
              <div className="text-sm text-gray-600">
                التقدم: {course.progress}%
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Course Progress */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>تقدمك في الدورة</CardTitle>
                <CardDescription>
                  {course.completedLessons} من {course.totalLessons} درس مكتمل
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={course.progress} className="h-3 mb-4" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>إكمال {course.progress}%</span>
                  {course.progress === 100 && (
                    <div className="flex items-center text-green-600">
                      <Award className="h-4 w-4 ml-1" />
                      مكتمل
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Tabs defaultValue="lessons" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lessons">الدروس</TabsTrigger>
                <TabsTrigger value="discussions">النقاشات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lessons" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>محتوى الدورة</CardTitle>
                    <CardDescription>
                      {lessons.length} درس • {formatDuration(course.totalDuration)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${
                            currentLesson?.id === lesson.id ? 'border-blue-500 bg-blue-50' : ''
                          }`}
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
                          <div className="flex items-center gap-2">
                            {lesson.completed && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCurrentLesson(lesson)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLessonComplete(lesson.id, !lesson.completed)}
                            >
                              {lesson.completed ? "إلغاء الإكمال" : "إكمال"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="discussions" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>نقاشات الدورة</CardTitle>
                        <CardDescription>
                          شارك في النقاشات مع زملائك في الدورة
                        </CardDescription>
                      </div>
                      <Dialog open={isDiscussionDialogOpen} onOpenChange={setIsDiscussionDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 ml-2" />
                            نقاش جديد
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>إنشاء نقاش جديد</DialogTitle>
                            <DialogDescription>
                              ابدأ نقاشاً جديداً مع زملائك في الدورة
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleCreateDiscussion} className="space-y-4">
                            <div>
                              <Label htmlFor="title">عنوان النقاش</Label>
                              <Input
                                id="title"
                                value={discussionForm.title}
                                onChange={(e) => setDiscussionForm({ ...discussionForm, title: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="content">محتوى النقاش</Label>
                              <Textarea
                                id="content"
                                value={discussionForm.content}
                                onChange={(e) => setDiscussionForm({ ...discussionForm, content: e.target.value })}
                                required
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button type="button" variant="outline" onClick={() => setIsDiscussionDialogOpen(false)}>
                                إلغاء
                              </Button>
                              <Button type="submit">
                                إنشاء النقاش
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {discussions.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">لا توجد نقاشات بعد</p>
                          <p className="text-sm text-gray-500">كن أول من يبدأ نقاشاً!</p>
                        </div>
                      ) : (
                        discussions.map((discussion) => (
                          <div key={discussion.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={discussion.user.image} />
                                  <AvatarFallback>
                                    {discussion.user.name?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold">{discussion.title}</h4>
                                  <p className="text-sm text-gray-600">
                                    {discussion.user.name} • {new Date(discussion.createdAt).toLocaleDateString("ar-SA")}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline">
                                {discussion._count.replies} ردود
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-3">{discussion.content}</p>
                            <Button variant="outline" size="sm">
                              عرض التفاصيل
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Course Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>معلومات الدورة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
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
                
                {course.category && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">التصنيف</p>
                    <Badge variant="outline">{course.category.name}</Badge>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">المدة</p>
                  <p className="text-sm text-gray-600">{formatDuration(course.totalDuration)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">التقييم</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{course.averageRating}</span>
                    <span className="text-sm text-gray-600">({course.reviewCount} تقييم)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rate Course */}
            {!userReview && course.progress > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>قيم الدورة</CardTitle>
                  <CardDescription>
                    شارك برأيك في الدورة وساعد الآخرين
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Star className="h-4 w-4 ml-2" />
                        قيم الدورة
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>تقييم الدورة</DialogTitle>
                        <DialogDescription>
                          قيم هذه الدورة وساعد الآخرين في اختيار الدورات المناسبة
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <Label htmlFor="rating">التقييم</Label>
                          <Select value={reviewForm.rating.toString()} onValueChange={(value) => setReviewForm({ ...reviewForm, rating: parseInt(value) })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 نجوم - ممتاز</SelectItem>
                              <SelectItem value="4">4 نجوم - جيد جداً</SelectItem>
                              <SelectItem value="3">3 نجوم - جيد</SelectItem>
                              <SelectItem value="2">نجمتان - مقبول</SelectItem>
                              <SelectItem value="1">نجمة - ضعيف</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="comment">تعليق (اختياري)</Label>
                          <Textarea
                            id="comment"
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            placeholder="شارك تجربتك مع هذه الدورة..."
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                            إلغاء
                          </Button>
                          <Button type="submit">
                            إرسال التقييم
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}

            {/* Current Lesson */}
            {currentLesson && (
              <Card>
                <CardHeader>
                  <CardTitle>الدرس الحالي</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">{currentLesson.title}</h4>
                      {currentLesson.duration && (
                        <p className="text-sm text-gray-600">
                          {formatDuration(currentLesson.duration)}
                        </p>
                      )}
                    </div>
                    
                    {currentLesson.videoUrl && (
                      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <Play className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {currentLesson.content && (
                      <div className="text-sm text-gray-700">
                        {currentLesson.content}
                      </div>
                    )}
                    
                    <Button
                      className="w-full"
                      onClick={() => handleLessonComplete(currentLesson.id, !currentLesson.completed)}
                    >
                      {currentLesson.completed ? (
                        <>
                          <CheckCircle className="h-4 w-4 ml-2" />
                          مكتمل
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 ml-2" />
                          تحديد كمكتمل
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}