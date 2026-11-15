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
      badge: "Fokus Kelas C",
      badgeVariant: "default" as const,
      description: "Belajar dari nol pakai 1 IP yang sama di tiap bab",
      icon: BookOpen,
      href: "/materi",
      color: "text-[#113057] bg-[#113057]/10 border-[#113057]/20 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900",
    },
    {
      title: "Simulator Biner",
      value: "Kelas A–E",
      badge: "Engine 32-bit",
      badgeVariant: "outline" as const,
      description: "Lihat cara kerja bitwise AND & letak bit pinjam",
      icon: Calculator,
      href: "/simulator",
      color: "text-[#0A2342] bg-[#0A2342]/10 border-[#0A2342]/20 dark:bg-slate-800 dark:text-sky-300 dark:border-slate-700",
    },
    {
      title: "Latihan Mandiri",
      value: "10 Soal/Sesi",
      badge: "KKM 70",
      badgeVariant: "secondary" as const,
      description: "Asah hitunganmu sampai lancar sebelum masuk kuis",
      icon: PencilLine,
      href: "/latihan",
      color: "text-[#0A9D68] bg-[#0DB87A]/10 border-[#0DB87A]/25 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
    },
    {
      title: "Kuis Evaluasi",
      value: "20 Soal",
      badge: "Timer 60 Menit",
      badgeVariant: "outline" as const,
      description: "Cek hasil kerjamu lengkap dengan kunci & pembahasan",
      icon: Award,
      href: "/kuis",
      color: "text-[#113057] bg-sky-50 border-sky-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900",
    },
  ]

  return (
    <div className={cn("grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6", className)}>
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Link key={card.title} href={card.href} className="group block">
            <Card className="h-full rounded-2xl border border-[#E0E0E0] border-t-4 border-t-[#113057] bg-white shadow-[0_2px_10px_rgba(10,35,66,0.05)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(10,35,66,0.1)] dark:bg-card dark:border-border dark:border-t-[#3B6FE0]">
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
