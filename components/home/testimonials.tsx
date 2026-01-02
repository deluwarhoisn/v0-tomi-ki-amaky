"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Jessica Williams",
    role: "Worker",
    image: "/happy-woman-testimonial.png",
    quote:
      "TaskFlow has been a game-changer for me. I earn extra income during my free time, and the withdrawal process is super smooth!",
    rating: 5,
  },
  {
    id: 2,
    name: "Robert Taylor",
    role: "Buyer",
    image: "/businessman-testimonial.jpg",
    quote:
      "As a business owner, I can quickly get micro-tasks done without hiring full-time employees. The quality of work is consistently excellent.",
    rating: 5,
  },
  {
    id: 3,
    name: "Maria Garcia",
    role: "Worker",
    image: "/young-professional-woman.png",
    quote:
      "I started as a side hustle, now it's my primary income source. The platform is easy to use and payments are always on time.",
    rating: 5,
  },
  {
    id: 4,
    name: "Thomas Anderson",
    role: "Buyer",
    image: "/tech-entrepreneur.png",
    quote:
      "The worker community here is amazing. Tasks get completed quickly and the review system ensures quality every time.",
    rating: 5,
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const prev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const next = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What Our Users Say</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of satisfied workers and buyers on TaskFlow
          </p>
        </div>

        <div className="relative mt-12">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="mx-auto max-w-2xl">
                    <CardContent className="p-8">
                      <Quote className="h-10 w-10 text-primary/20" />
                      <p className="mt-4 text-lg text-foreground leading-relaxed">{`"${testimonial.quote}"`}</p>
                      <div className="mt-6 flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                          <AvatarFallback>
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-card p-2 shadow-lg transition-colors hover:bg-secondary"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-card p-2 shadow-lg transition-colors hover:bg-secondary"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>

          {/* Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false)
                  setCurrentIndex(index)
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/40"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
