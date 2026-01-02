import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
          Ready to Start Earning or Get Work Done?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          Join thousands of users who are already benefiting from TaskFlow. Sign up today and get started in minutes.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <Button size="lg" className="min-w-[200px]">
              Create Free Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="min-w-[200px] bg-transparent">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
