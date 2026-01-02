import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, CreditCard, Headphones, BarChart3, Lock } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Verified Workers",
    description: "All workers go through verification to ensure quality and reliability.",
  },
  {
    icon: Zap,
    title: "Instant Task Matching",
    description: "Our smart system matches tasks with the most suitable workers.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Industry-standard encryption protects all financial transactions.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our support team is always ready to help with any issues.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track your earnings and task progress with detailed analytics.",
  },
  {
    icon: Lock,
    title: "Data Protection",
    description: "Your personal information is protected with enterprise security.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Choose TaskFlow</h2>
          <p className="mt-4 text-lg text-muted-foreground">Built with trust, security, and efficiency in mind</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
