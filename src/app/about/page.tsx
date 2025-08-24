'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Award, Globe } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: BookOpen,
      title: "التعليم الجيد",
      description: "نحن نؤمن بأن التعليم الجيد هو حق للجميع، ونعمل على توفير محتوى تعليمي عالي الجودة"
    },
    {
      icon: Users,
      title: "المجتمع التعليمي",
      description: "نبني مجتمعًا تعليميًا داعمًا يربط بين الطلاب والمعلمين والخبراء"
    },
    {
      icon: Award,
      title: "التميز",
      description: "نسعى دائمًا للتميز في كل ما نقدمه من خدمات ومنتجات تعليمية"
    },
    {
      icon: Globe,
      title: "الوصول العالمي",
      description: "نهدف إلى الوصول إلى كل طالب في العالم بغض النظر عن مكانه أو ظروفه"
    }
  ]

  const team = [
    {
      name: "د. أحمد محمد",
      role: "المؤسس والرئيس التنفيذي",
      bio: "خبير في التعليم الإلكتروني مع أكثر من 15 عامًا من الخبرة"
    },
    {
      name: "فاطمة علي",
      role: "مديرة المحتوى التعليمي",
      bio: "متخصصة في تصميم المناهج التعليمية الحديثة والتفاعلية"
    },
    {
      name: "محمد خالد",
      role: "مدير التقنية",
      bio: "مهندس برمجيات متخصص في تطوير منصات التعليم الإلكتروني"
    },
    {
      name: "سارة أحمد",
      role: "مديرة تجربة المستخدم",
      bio: "مصممة واجهات مستخدم تركز على تسهيل تجربة التعلم"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">من نحن</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          منصة "مَعِين" هي منصة تعليمية عربية رائدة تهدف إلى توفير تعليم عالي الجودة للجميع
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">رؤيتنا</h2>
          <p className="text-muted-foreground mb-6">
            نسعى إلى أن نكون المنصة التعليمية الرائدة في العالم العربي، حيث نقدم محتوى تعليميًا متميزًا 
            يلبي احتياجات جميع الطلاب ويساعدهم على تحقيق أهدافهم التعليمية والمهنية.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">رسالتنا</h2>
          <p className="text-muted-foreground">
            تمكين الطلاب من جميع الخلفيات بالحصول على تعليم عالي الجودة من خلال توفير منصة تعليمية 
            شاملة تجمع بين المحتوى المتميز والتجربة المستخدم السهلة والتقنية المتطورة.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">قيمنا</h2>
          <div className="space-y-4">
            {values.map((value, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <value.icon className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">فريق العمل</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <Badge variant="secondary">{member.role}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">انضم إلى مجتمعنا التعليمي</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          سجل الآن في منصة "مَعِين" وابدأ رحلتك التعليمية مع آلاف الطلاب والمعلمين
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">ابدأ التعلم الآن</Button>
          <Button variant="outline" size="lg">تصفح الدورات</Button>
        </div>
      </div>
    </div>
  )
}