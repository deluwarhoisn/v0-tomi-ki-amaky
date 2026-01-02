"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"

const slides = [
  {
    title: "Earn Money Completing Simple Tasks",
    subtitle: "Join thousands of workers completing micro-tasks and earning real money from anywhere in the world.",
    cta: "Start Earning",
    ctaLink: "/register",
    bgClass: "from-primary/20 via-background to-secondary/20",
  },
  {
    title: "Get Work Done by Skilled Workers",
    subtitle: "Post tasks, set your budget, and get quality results from our verified community of task workers.",
    cta: "Post a Task",
    ctaLink: "/register",
    bgClass: "from-secondary/30 via-background to-primary/20",
  },
  {
    title: "Secure Payments, Instant Withdrawals",
    subtitle: "Your earnings are safe with us. Withdraw anytime with multiple payment options including Stripe.",
    cta: "Learn More",
    ctaLink: "/register",
    bgClass: "from-accent/20 via-background to-secondary/30",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => setCurrentSlide(index)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)

  return (
    <section className="relative overflow-hidden">
      <div className={`min-h-[600px] bg-gradient-to-br ${slides[currentSlide].bgClass} transition-all duration-700`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[600px] flex-col items-center justify-center py-20 text-center">
            <div key={currentSlide} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                {slides[currentSlide].title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
                {slides[currentSlide].subtitle}
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href={slides[currentSlide].ctaLink}>
                  <Button size="lg" className="min-w-[180px]">
                    {slides[currentSlide].cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-lg backdrop-blur transition-colors hover:bg-background"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-lg backdrop-blur transition-colors hover:bg-background"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-foreground" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted-foreground/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
