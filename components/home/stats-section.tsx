import { Users, CheckCircle, DollarSign, Globe } from "lucide-react"

const stats = [
  { label: "Active Workers", value: "50K+", icon: Users },
  { label: "Tasks Completed", value: "1.2M+", icon: CheckCircle },
  { label: "Total Payouts", value: "$2.5M+", icon: DollarSign },
  { label: "Countries", value: "120+", icon: Globe },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20">
                <stat.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="mt-4 text-3xl font-bold text-primary-foreground">{stat.value}</div>
              <div className="mt-1 text-sm text-primary-foreground/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
