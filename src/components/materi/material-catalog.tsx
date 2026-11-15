"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock,
  GraduationCap,
  Layers,
  Lock,
  Unlock,
  PlayCircle,
} from "lucide-react"

import {
  MATERIALS_DATA,
  type MaterialCategory,
} from "@/data/materials-data"
import {
  isTopicUnlocked,
  useMaterialProgress,
} from "@/lib/progress-storage"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const CATEGORIES: ("Semua" | MaterialCategory)[] = [
  "Semua",
  "Fondasi & Biner",
  "Struktur & Masking",
  "Identitas & Subnetting",
]

export function MaterialCatalog() {
  const { progress } = useMaterialProgress()
  const [selectedCategory, setSelectedCategory] = React.useState<"Semua" | MaterialCategory>("Semua")

  const completedCount = progress.completedSlugs.length
  const totalCount = MATERIALS_DATA.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  // Cari materi aktif berikutnya yang sudah terbuka namun belum selesai
  const nextRecommendedTopic = React.useMemo(() => {
    const firstIncomplete = MATERIALS_DATA.find(
      (m) => !progress.completedSlugs.includes(m.slug) && isTopicUnlocked(m.slug, progress.completedSlugs)
    )
    return firstIncomplete ?? MATERIALS_DATA[0]
  }, [progress.completedSlugs])

  const filteredMaterials = React.useMemo(() => {
    if (selectedCategory === "Semua") return MATERIALS_DATA
    return MATERIALS_DATA.filter((m) => m.category === selectedCategory)
  }, [selectedCategory])

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Progress Overview (Solid Navy #113057 + Yellow #FFB61E - Clean) */}
      <section className="rounded-2xl border border-[#113057] bg-[#113057] p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Materi Pengalamatan{" "}
            <span className="text-[#FFB61E]">IPv4 & Subnetting</span> Kelas C
          </h1>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            Belajar urut dari nol sampai mahir subnetting Kelas C. Jawab 2 soal singkat di tiap bab dan klik{" "}
            <strong className="text-white">Kirim Jawaban</strong> buat buka topik berikutnya.
          </p>
        </div>

        {/* Kartu Ringkasan Progres Belajar */}
        <div className="rounded-xl border border-white/15 bg-white p-4 shadow-xs w-full lg:w-auto lg:min-w-[320px] flex flex-col gap-3 dark:bg-card dark:border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Progres Belajarmu
            </span>
            <span className="text-xs font-mono font-bold text-[#113057] dark:text-blue-400">
              {completedCount}/{totalCount} Topik ({progressPercent}%)
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-muted overflow-hidden">
            <div
              className="h-full bg-[linear-gradient(90deg,#113057_0%,#FFB61E_100%)] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <Link
              href={`/materi/${nextRecommendedTopic.slug}`}
              className={cn(
                buttonVariants({ size: "sm" }),
                "w-full gap-1.5 bg-[#113057] text-white hover:bg-[#0A2342]"
              )}
            >
              <PlayCircle className="h-3.5 w-3.5" />
              {completedCount === 0
                ? "Mulai Topik 1"
                : completedCount === totalCount
                  ? "Ulas Materi Lagi"
                  : `Lanjut: Topik ${nextRecommendedTopic.order}`}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Filter Kategori & Info Status Gating */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat
            const count =
              cat === "Semua"
                ? MATERIALS_DATA.length
                : MATERIALS_DATA.filter((m) => m.category === cat).length
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all inline-flex items-center gap-1.5",
                  isSelected
                    ? "border-[#113057] bg-[#113057] text-white shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-[#4A90D9]/50 hover:bg-blue-50/40"
                )}
              >
                <Layers className="h-3.5 w-3.5" />
                {cat} ({count})
              </button>
            )
          })}
        </div>

        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-[#FFB61E]" />
          Topik baru terbuka setelah kamu kirim jawaban di topik sebelumnya.
        </span>
      </div>

      {/* Grid 12 Kartu Materi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((topic) => {
          const isCompleted = progress.completedSlugs.includes(topic.slug)
          const isUnlocked = isTopicUnlocked(topic.slug, progress.completedSlugs)
          const quizRecord = progress.quizRecords[topic.slug]

          return (
            <Card
              key={topic.id}
              className={cn(
                "shadow-[0_2px_10px_rgba(10,35,66,0.04)] flex flex-col justify-between transition-all relative overflow-hidden bg-card border",
                isCompleted
                  ? "border-[#113057]/40 border-t-4 border-t-[#113057] bg-blue-50/10 dark:bg-blue-950/10"
                  : isUnlocked
                    ? "border-[#E0E0E0] hover:border-[#113057]/60 hover:shadow-[0_12px_28px_rgba(10,35,66,0.08)]"
                    : "hover:border-border"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-mono font-bold border",
                        isCompleted
                          ? "bg-[#113057] text-white border-[#113057]"
                          : isUnlocked
                            ? "bg-[#113057]/10 text-[#113057] border-[#113057]/25"
                            : "bg-muted text-foreground border-border"
                      )}
                    >
                      {String(topic.order).padStart(2, "0")}
                    </span>
                    <Badge variant="outline" className="text-[11px]">
                      {topic.category}
                    </Badge>
                  </div>

                  {/* Status & Highlight Skor */}
                  {isCompleted ? (
                    <div className="inline-flex items-center gap-1.5 rounded-md border border-[#FFB61E] bg-[#FFB61E]/15 px-2.5 py-0.5 text-[11px] font-mono font-bold text-[#92400E] dark:text-amber-300">
                      <CheckCircle2 className="h-3 w-3 shrink-0 text-[#D97706]" />
                      <span>Selesai</span>
                      {quizRecord && (
                        <>
                          <span className="opacity-40">|</span>
                          <span className="font-extrabold">Skor {quizRecord.score}/2</span>
                        </>
                      )}
                    </div>
                  ) : isUnlocked ? (
                    <Badge
                      variant="outline"
                      className="text-[11px] border-[#113057]/30 bg-[#113057]/10 text-[#113057] dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 gap-1"
                    >
                      <Unlock className="h-3 w-3 text-[#113057]" />
                      Terbuka
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[11px] border-[#FFB61E]/60 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300 gap-1"
                    >
                      <Lock className="h-3 w-3 text-[#D97706]" />
                      Terkunci
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-base font-bold leading-snug">
                  <Link
                    href={`/materi/${topic.slug}`}
                    className="text-foreground hover:text-[#113057] transition-colors"
                  >
                    {topic.title}
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-4 pt-0">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {topic.shortDescription}
                </p>

                <div className="rounded-lg border bg-muted/30 px-3 py-2 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    ~{topic.estimatedMinutes} menit baca
                  </span>
                  <span className="font-mono font-semibold text-foreground">
                    Contoh: {topic.simulatorPreset.ip}/{topic.simulatorPreset.prefix}
                  </span>
                </div>

                {/* Tombol Aksi */}
                <div className="flex items-center gap-2 pt-1">
                  {isUnlocked ? (
                    <>
                      <Link
                        href={`/materi/${topic.slug}`}
                        className={cn(
                          buttonVariants({ size: "sm" }),
                          "flex-1 gap-1.5 text-xs",
                          isCompleted
                            ? "bg-muted text-foreground hover:bg-muted/80 border"
                            : "bg-[#113057] text-white hover:bg-[#0A2342]"
                        )}
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        {isCompleted ? "Ulas Materi & Soal" : "Mulai Belajar"}
                      </Link>

                      <Link
                        href={`/simulator?ip=${encodeURIComponent(topic.simulatorPreset.ip)}&prefix=${topic.simulatorPreset.prefix}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "gap-1 text-xs px-2.5 border-[#113057]/25 hover:bg-blue-50/50 hover:text-[#113057]"
                        )}
                        title="Buka contoh di Simulator"
                      >
                        <Calculator className="h-3.5 w-3.5 text-[#113057]" />
                        Simulasi
                      </Link>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full h-8 rounded-lg bg-muted text-muted-foreground border border-border text-xs font-medium cursor-not-allowed flex items-center justify-center gap-1.5 select-none"
                      title={`Selesaikan kuis pada Topik ${topic.order - 1} untuk membuka materi ini.`}
                    >
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      Terkunci - Selesaikan Kuis Topik {topic.order - 1}
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Bottom CTA Banner ke Simulator & Latihan */}
      <div className="rounded-2xl border border-[#E0E0E0] border-l-4 border-l-[#FFB61E] bg-card p-5 shadow-[0_2px_10px_rgba(10,35,66,0.04)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Mau langsung uji hitungan di Simulator atau Latihan?
          </h3>
          <p className="text-xs text-muted-foreground">
            Simulator Kelas A-E dan Bank Latihan terbuka kapan saja kamu mau pakai.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/simulator"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5 border-[#113057]/30 text-[#113057] hover:bg-blue-50/60")}
          >
            <Calculator className="h-3.5 w-3.5" />
            Buka Simulator
          </Link>
          <Link
            href="/latihan"
            className={cn(
              buttonVariants({ size: "sm" }),
              "gap-1.5 bg-[#113057] text-white hover:bg-[#0A2342]"
            )}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Mulai Latihan Soal
          </Link>
        </div>
      </div>
    </div>
  )
}
