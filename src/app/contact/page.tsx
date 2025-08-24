'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    alert("تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.")
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      value: "info@maaeen.com",
      description: "نرد على جميع الاستفسارات خلال 24 ساعة"
    },
    {
      icon: Phone,
      title: "رقم الهاتف",
      value: "+966 50 123 4567",
      description: "متاح من السبت إلى الخميس"
    },
    {
      icon: MapPin,
      title: "العنوان",
      value: "الرياض، المملكة العربية السعودية",
      description: "المقر الرئيسي لمنصة مَعِين"
    },
    {
      icon: Clock,
      title: "ساعات العمل",
      value: "الأحد - الخميس: 9 ص - 6 م",
      description: "الجمعة والسبت: مغلق"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">تواصل معنا</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          نحن هنا لمساعدتك! تواصل معنا عبر أي من الوسائل التالية وسنكون سعداء بالرد على استفساراتكم
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>أرسل لنا رسالة</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subject">الموضوع</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">الرسالة</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="mt-1"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  إرسال الرسالة
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-6">معلومات التواصل</h2>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <info.icon className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-sm font-medium mb-1">{info.value}</p>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>الأسئلة الشائعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">كيف يمكنني التسجيل في المنصة؟</h4>
                <p className="text-sm text-muted-foreground">
                  يمكنك التسجيل بسهولة من خلال النقر على زر "تسجيل الدخول" في أعلى الصفحة واختيار إنشاء حساب جديد.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">هل الدورات مجانية؟</h4>
                <p className="text-sm text-muted-foreground">
                  نقدم بعض الدورات المجانية وأخرى مدفوعة. يمكنك تصفح جميع الدورات والاطلاع على أسعارها.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">كيف يمكنني أن أصبح مدربًا؟</h4>
                <p className="text-sm text-muted-foreground">
                  إذا كنت خبيرًا في مجال ما وتريد مشاركة معرفتك، تواصل معنا عبر البريد الإلكتروني لمعرفة شروط الانضمام.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}