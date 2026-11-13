"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookOpen, Calculator, PencilLine, Award, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function SectionCards({ className }: { className?: string }) {
  const cards = [
    {
      title: "Materi Terstruktur",
      value: "12 Topik",
      badge: "Kelas C",
      badgeVariant: "default" as const,
      description: "Pengenalan, biner, CIDR, hingga subnetting",
      icon: BookOpen,
      href: "/materi",
      color: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900",
    },
    {
      title: "Simulator IPv4",
      value: "Kelas A–E",
      badge: "Engine 32-bit",
      badgeVariant: "outline" as const,
      description: "Bitwise AND, visual biner, & deteksi multicast",
      icon: Calculator,
      href: "/simulator",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
    },
    {
      title: "Bank Latihan",
      value: "9 Kategori",
      badge: "3 Level",
      badgeVariant: "secondary" as const,
      description: "Mudah, menengah, sulit dengan pembahasan",
      icon: PencilLine,
      href: "/latihan",
      color: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
    },
    {
      title: "Evaluasi & Kuis",
      value: "Skor Otomatis",
      badge: "Penilaian Mandiri",
      badgeVariant: "outline" as const,
      description: "Ukur pemahaman subnetting dengan skor & pembahasan",
      icon: Award,
      href: "/kuis",
      color: "text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900",
    },
  ]

  return (
    <div className={cn("grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6", className)}>
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Link key={card.title} href={card.href} className="group block">
            <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="font-medium text-muted-foreground">{card.title}</CardDescription>
                <div className={`p-2 rounded-lg border ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <div className="px-6 py-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-foreground font-mono">
                  {card.value}
                </CardTitle>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={card.badgeVariant} className="text-[11px] font-medium">
                    {card.badge}
                  </Badge>
                </div>
              </div>
              <CardFooter className="pt-3 pb-4 text-xs text-muted-foreground flex items-center justify-between border-t mt-4">
                <span>{card.description}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              </CardFooter>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
