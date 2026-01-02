import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Coins, Trophy } from "lucide-react"

const topWorkers = [
  { id: 1, name: "Sarah Johnson", coins: 15420, image: "/professional-woman-avatar.png" },
  { id: 2, name: "Michael Chen", coins: 12890, image: "/professional-man-avatar.png" },
  { id: 3, name: "Emily Davis", coins: 11560, image: "/young-woman-avatar.png" },
  { id: 4, name: "James Wilson", coins: 10230, image: "/business-man-avatar.png" },
  { id: 5, name: "Anna Martinez", coins: 9870, image: "/latina-woman-avatar.png" },
  { id: 6, name: "David Brown", coins: 8540, image: "/casual-man-avatar.png" },
]

export function BestWorkers() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Top Performing Workers</h2>
          <p className="mt-4 text-lg text-muted-foreground">Meet our highest earning workers this month</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topWorkers.map((worker, index) => (
            <Card
              key={worker.id}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                index === 0 ? "ring-2 ring-primary" : ""
              }`}
            >
              {index === 0 && (
                <div className="absolute right-0 top-0 rounded-bl-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  #1 Top Earner
                </div>
              )}
              <CardContent className="flex items-center gap-4 p-6">
                <div className="relative">
                  <Avatar className="h-16 w-16 ring-2 ring-border">
                    <AvatarImage src={worker.image || "/placeholder.svg"} alt={worker.name} />
                    <AvatarFallback>
                      {worker.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{worker.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-primary">
                    <Coins className="h-4 w-4" />
                    <span className="font-bold">{worker.coins.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">coins</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
