import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, ListTodo, CheckCircle, Wallet } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up as a Worker to earn or as a Buyer to get tasks done. Quick and free registration.",
  },
  {
    icon: ListTodo,
    title: "Browse or Post Tasks",
    description: "Workers find tasks matching their skills. Buyers create detailed task listings with rewards.",
  },
  {
    icon: CheckCircle,
    title: "Complete & Review",
    description: "Workers submit proof of completion. Buyers review and approve quality submissions.",
  },
  {
    icon: Wallet,
    title: "Get Paid",
    description: "Earnings are credited instantly. Withdraw anytime via multiple payment methods.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg text-muted-foreground">Get started in four simple steps</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={step.title} className="relative">
              <CardContent className="p-6 text-center">
                <div className="absolute -top-3 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <div className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
