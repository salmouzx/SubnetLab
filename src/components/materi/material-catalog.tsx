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
      {/* Header & Progress Overview */}
      <section className="rounded-2xl border bg-gradient-to-r from-emerald-50/70 via-background to-background p-5 sm:p-7 dark:from-emerald-950/20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Materi Pengalamatan IPv4 & Subnetting Kelas C
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Kurikulum berjenjang terstruktur dari pengenalan IPv4 hingga studi kasus subnetting Kelas C. Selesaikan 2 soal pemahaman materi dan klik <strong>Kirim Jawaban</strong> untuk membuka topik berikutnya.
          </p>
        </div>

        {/* Kartu Ringkasan Progres Belajar */}
        <div className="rounded-xl border bg-card p-4 shadow-xs min-w-[280px] sm:min-w-[320px] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Progres Kelulusan Materi
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              {completedCount}/{totalCount} Topik ({progressPercent}%)
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <Link
              href={`/materi/${nextRecommendedTopic.slug}`}
              className={cn(
                buttonVariants({ size: "sm" }),
                "w-full gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
              )}
            >
              <PlayCircle className="h-3.5 w-3.5" />
              {completedCount === 0
                ? "Mulai Topik 1"
                : completedCount === totalCount
                  ? "Ulangi Pembelajaran"
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
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Layers className="h-3.5 w-3.5" />
                {cat} ({count})
              </button>
            )
          })}
        </div>

        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          Topik baru terbuka setelah mengirim jawaban kuis pada topik sebelumnya.
        </span>
      </div>

      {/* Grid 12 Kartu Materi (Warna Kartu Tetap Terang & Normal, Hanya Tombol Aksi yang Abu & Terkunci) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((topic) => {
          const isCompleted = progress.completedSlugs.includes(topic.slug)
          const isUnlocked = isTopicUnlocked(topic.slug, progress.completedSlugs)
          const quizRecord = progress.quizRecords[topic.slug]

          return (
            <Card
              key={topic.id}
              className={cn(
                "shadow-xs flex flex-col justify-between transition-all relative overflow-hidden bg-card border",
                isCompleted
                  ? "border-emerald-500/40 bg-emerald-50/15 dark:bg-emerald-950/10"
                  : isUnlocked
                    ? "hover:border-emerald-500/60 ring-1 ring-emerald-500/10"
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
                          ? "bg-emerald-600 text-white border-emerald-600"
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
                    <div className="inline-flex items-center gap-1.5 rounded-md border border-[#86EFAC] bg-[#DCFCE7] px-2.5 py-0.5 text-[11px] font-mono font-bold text-[#166534]">
                      <CheckCircle2 className="h-3 w-3 shrink-0" />
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
                      className="text-[11px] border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 gap-1"
                    >
                      <Unlock className="h-3 w-3 text-emerald-600" />
                      Terbuka
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[11px] border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300 gap-1"
                    >
                      <Lock className="h-3 w-3 text-amber-600" />
                      Terkunci
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-base font-bold leading-snug">
                  <Link
                    href={`/materi/${topic.slug}`}
                    className="text-foreground hover:text-emerald-600 transition-colors"
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

                {/* Tombol Aksi: Terbuka (Hijau/Outline) vs Belum Terbuka (Abu & Disabled) */}
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
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        )}
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        {isCompleted ? "Ulas Materi & Soal" : "Mulai Belajar"}
                      </Link>

                      <Link
                        href={`/simulator?ip=${encodeURIComponent(topic.simulatorPreset.ip)}&prefix=${topic.simulatorPreset.prefix}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "gap-1 text-xs px-2.5"
                        )}
                        title="Buka contoh di Simulator"
                      >
                        <Calculator className="h-3.5 w-3.5 text-emerald-600" />
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
      <div className="rounded-2xl border bg-card p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Ingin langsung mencoba simulasi atau latihan mandiri?
          </h3>
          <p className="text-xs text-muted-foreground">
            Simulator Kelas A–E dan Bank Latihan dapat diakses kapan saja untuk menguji pemahaman subnetting Anda.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/simulator"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
          >
            <Calculator className="h-3.5 w-3.5" />
            Buka Simulator
          </Link>
          <Link
            href="/latihan"
            className={cn(
              buttonVariants({ size: "sm" }),
              "gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
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
