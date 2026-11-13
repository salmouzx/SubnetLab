"use client"

import * as React from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Binary,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock,
  HelpCircle,
  Lightbulb,
  ListChecks,
  Lock,
  Unlock,
  RotateCcw,
  Send,
  XCircle,
} from "lucide-react"

import {
  MATERIALS_DATA,
  getAdjacentMaterials,
  type MaterialTopic,
} from "@/data/materials-data"
import { calculateIPv4 } from "@/features/ipv4"
import {
  getPrerequisiteTopic,
  isTopicUnlocked,
  useMaterialProgress,
} from "@/lib/progress-storage"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MaterialReaderProps {
  topic: MaterialTopic
}

const OPTION_LETTERS = ["A", "B", "C", "D"] as const

export function MaterialReader({ topic }: MaterialReaderProps) {
  const { progress, isLoaded, submitQuiz, setLastAccessed } = useMaterialProgress()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Ambil riwayat pengerjaan sebelumnya jika topik ini sudah pernah disubmit
  const existingRecord = progress.quizRecords[topic.slug]

  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, number>>(
    existingRecord?.answers ?? {}
  )
  const [isQuizSubmitted, setIsQuizSubmitted] = React.useState<boolean>(
    Boolean(existingRecord)
  )
  const [quizValidationError, setQuizValidationError] = React.useState<string | null>(null)

  // Tandai topik ini sebagai terakhir diakses saat slug berubah
  React.useEffect(() => {
    setLastAccessed(topic.slug)
  }, [topic.slug, setLastAccessed])

  // Sinkronisasi state kuis saat berpindah slug topik atau saat data storage dimuat
  React.useEffect(() => {
    const record = progress.quizRecords[topic.slug]
    if (record) {
      setSelectedAnswers(record.answers)
      setIsQuizSubmitted(true)
    } else {
      setSelectedAnswers({})
      setIsQuizSubmitted(false)
    }
    setQuizValidationError(null)
  }, [topic.slug, isLoaded])

  const isCompleted = progress.completedSlugs.includes(topic.slug)
  const isUnlocked = isTopicUnlocked(topic.slug, progress.completedSlugs)
  const prerequisite = getPrerequisiteTopic(topic.slug)

  const completedCount = progress.completedSlugs.length
  const totalCount = MATERIALS_DATA.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  const { prev, next } = React.useMemo(
    () => getAdjacentMaterials(topic.slug),
    [topic.slug]
  )

  const simPreview = React.useMemo(
    () => calculateIPv4(topic.simulatorPreset.ip, topic.simulatorPreset.prefix),
    [topic.simulatorPreset.ip, topic.simulatorPreset.prefix]
  )

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isQuizSubmitted) return
    setSelectedAnswers((prevAns) => ({
      ...prevAns,
      [questionId]: optionIdx,
    }))
    setQuizValidationError(null)
  }

  const handleSubmitCheckQuiz = () => {
    const allAnswered = topic.checkQuestions.every(
      (q) => typeof selectedAnswers[q.id] === "number"
    )
    if (!allAnswered) {
      setQuizValidationError(
        "Silakan pilih jawaban untuk kedua soal pilihan ganda di bawah ini terlebih dahulu sebelum menekan Kirim Jawaban."
      )
      return
    }

    const calculatedScore = topic.checkQuestions.filter(
      (q) => selectedAnswers[q.id] === q.correctIndex
    ).length

    setQuizValidationError(null)
    setIsQuizSubmitted(true)
    submitQuiz(topic.slug, calculatedScore, selectedAnswers)
  }

  const handleResetCheckQuiz = () => {
    setSelectedAnswers({})
    setIsQuizSubmitted(false)
    setQuizValidationError(null)
  }

  const scrollToQuiz = () => {
    const el = document.getElementById("quiz-checkpoint")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      setQuizValidationError("Silakan pilih jawaban pada 2 soal ini lalu klik Kirim Jawaban untuk membuka materi berikutnya.")
    }
  }

  const correctCount = React.useMemo(() => {
    if (!isQuizSubmitted) return 0
    if (existingRecord) return existingRecord.score
    return topic.checkQuestions.filter(
      (q) => selectedAnswers[q.id] === q.correctIndex
    ).length
  }, [isQuizSubmitted, existingRecord, selectedAnswers, topic.checkQuestions])

  // ==========================================
  // LAYAR PROTEKSI JIKA TOPIK MASIH TERKUNCI
  // ==========================================
  if (!isUnlocked && prerequisite) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto py-10">
        <Link
          href="/materi"
          className="hover:text-emerald-600 font-medium text-xs inline-flex items-center gap-1.5 transition-colors text-muted-foreground w-fit"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Indeks Materi
        </Link>

        <Card className="border-amber-500/40 bg-card shadow-sm p-6 sm:p-8 text-center flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Lock className="h-7 w-7" />
          </div>

          <div className="flex flex-col gap-1.5 max-w-lg">
            <Badge variant="outline" className="w-fit mx-auto border-amber-300 text-amber-800 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 font-mono text-xs">
              Topik {topic.order} Masih Terkunci
            </Badge>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
              {topic.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Topik ini terkunci. Anda harus mempelajari materi dan mengirim jawaban soal pada topik sebelumnya terlebih dahulu untuk membuka materi ini.
            </p>
          </div>

          <div className="w-full max-w-md rounded-xl border bg-muted/40 p-4 text-left flex items-start gap-3 mt-1">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white text-xs font-mono font-bold mt-0.5">
              {prerequisite.order}
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Topik Prasyarat yang Wajib Diselesaikan:
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                {prerequisite.title}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={`/materi/${prerequisite.slug}`}
              className={cn(
                buttonVariants({ size: "default" }),
                "gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
              )}
            >
              <BookOpen className="h-4 w-4" />
              Buka Topik {prerequisite.order}: {prerequisite.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/materi"
              className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}
            >
              Lihat Semua Topik
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  // ==========================================
  // LAYAR PEMBACA MATERI (JIKA TERBUKA)
  // ==========================================
  return (
    <div className="flex flex-col gap-6">
      {/* Top Breadcrumb & Mobile Topic Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3.5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link
            href="/materi"
            className="hover:text-emerald-600 font-medium inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Daftar Materi Kelas C
          </Link>
          <span>/</span>
          <span className="font-semibold text-foreground">
            Topik {topic.order}: {topic.title}
          </span>
        </div>

        {/* Mobile Dropdown Pemilih Topik */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="w-full sm:w-auto rounded-lg border bg-card px-3 py-2 text-xs font-semibold text-foreground flex items-center justify-between gap-2 shadow-xs"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
              Pilih Topik ({completedCount}/{totalCount} Selesai)
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                mobileMenuOpen && "rotate-180"
              )}
            />
          </button>

          {mobileMenuOpen && (
            <div className="mt-2 rounded-xl border bg-card p-2 shadow-md grid grid-cols-1 gap-1 max-h-72 overflow-y-auto">
              {MATERIALS_DATA.map((item) => {
                const active = item.slug === topic.slug
                const done = progress.completedSlugs.includes(item.slug)
                const unlocked = isTopicUnlocked(item.slug, progress.completedSlugs)

                if (!unlocked) {
                  return (
                    <Link
                      key={item.id}
                      href={`/materi/${item.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs text-foreground/80 hover:bg-muted transition-colors"
                      title={`Topik ini terkunci. Selesaikan kuis Topik ${item.order - 1} untuk membuka.`}
                    >
                      <span className="truncate">
                        {String(item.order).padStart(2, "0")}. {item.title}
                      </span>
                      <Lock className="h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
                    </Link>
                  )
                }

                return (
                  <Link
                    key={item.id}
                    href={`/materi/${item.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors",
                      active
                        ? "bg-emerald-600 text-white font-semibold"
                        : "hover:bg-muted text-foreground"
                    )}
                  >
                    <span className="truncate">
                      {String(item.order).padStart(2, "0")}. {item.title}
                    </span>
                    {done && (
                      <CheckCircle2
                        className={cn(
                          "h-3.5 w-3.5 shrink-0",
                          active ? "text-white" : "text-emerald-600"
                        )}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Layout: Desktop Left Sidebar + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SIDEBAR DAFTAR 12 MATERI (Desktop) */}
        <aside className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col gap-3 sticky top-20">
          <Card className="shadow-xs">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Alur Berurutan Kelas C
                </CardTitle>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {completedCount}/{totalCount} ({progressPercent}%)
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-1.5">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </CardHeader>

            <CardContent className="p-2 flex flex-col gap-1">
              {MATERIALS_DATA.map((item) => {
                const isActive = item.slug === topic.slug
                const isDone = progress.completedSlugs.includes(item.slug)
                const unlocked = isTopicUnlocked(item.slug, progress.completedSlugs)

                if (!unlocked) {
                  return (
                    <Link
                      key={item.id}
                      href={`/materi/${item.slug}`}
                      className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs text-foreground/80 hover:bg-muted transition-colors"
                      title={`Topik ini terkunci. Selesaikan kuis Topik ${item.order - 1} untuk membuka materi ini.`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded shrink-0 bg-muted text-foreground border">
                          {String(item.order).padStart(2, "0")}
                        </span>
                        <span className="truncate">{item.title}</span>
                      </div>
                      <Lock className="h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
                    </Link>
                  )
                }

                return (
                  <Link
                    key={item.id}
                    href={`/materi/${item.slug}`}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs transition-all",
                      isActive
                        ? "bg-emerald-600 text-white font-semibold shadow-xs"
                        : "text-foreground/85 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={cn(
                          "font-mono text-[11px] px-1.5 py-0.5 rounded shrink-0",
                          isActive
                            ? "bg-emerald-700 text-white"
                            : isDone
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-muted text-muted-foreground"
                        )}
                      >
                        {String(item.order).padStart(2, "0")}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </div>

                    {isDone && (
                      <CheckCircle2
                        className={cn(
                          "h-3.5 w-3.5 shrink-0",
                          isActive ? "text-white" : "text-emerald-600"
                        )}
                      />
                    )}
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        </aside>

        {/* KONTEN UTAMA MATERI */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-5">
          {/* 1. Header Topik Materi */}
          <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 font-mono">
                  Topik {String(topic.order).padStart(2, "0")} / 12
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {topic.category}
                </Badge>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Estimasi {topic.estimatedMinutes} menit
                </span>
              </div>

              {/* Status Kelulusan Materi Berbasis Kuis */}
              {isCompleted ? (
                <div className="inline-flex items-center gap-2 rounded-md border border-[#86EFAC] bg-[#DCFCE7] px-3 py-1 text-xs font-mono font-bold text-[#166534]">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>SELESAI</span>
                  <span className="opacity-40">|</span>
                  <span className="font-extrabold">SKOR KUIS: {correctCount}/2</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={scrollToQuiz}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg px-2.5 py-1 font-medium hover:bg-amber-100 transition-colors"
                >
                  <ClipboardCheck className="h-3.5 w-3.5 text-amber-600" />
                  Kirim Jawaban Kuis di Bawah untuk Menyelesaikan
                </button>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {topic.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {topic.shortDescription}
              </p>
            </div>

            {/* Tujuan Pembelajaran (Learning Objectives) */}
            <div className="rounded-xl border bg-emerald-50/40 dark:bg-emerald-950/20 p-4 flex flex-col gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <ListChecks className="h-4 w-4 text-emerald-600" />
                Tujuan Pembelajaran (Learning Objectives)
              </h2>
              <ul className="grid grid-cols-1 gap-1.5 text-xs text-foreground/90">
                {topic.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 2. Seksi Penjelasan Konsep, Callout Rumus & Tabel Teknis */}
          {topic.conceptSections.map((sec, idx) => (
            <Card key={idx} className="shadow-xs">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold">
                    {idx + 1}
                  </span>
                  {sec.heading}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4 flex flex-col gap-4">
                {sec.paragraphs.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-sm text-foreground/90 leading-relaxed"
                  >
                    {p}
                  </p>
                ))}

                {sec.formulaCallout && (
                  <div className="rounded-xl border border-l-4 border-l-emerald-600 bg-muted/30 p-4 flex flex-col gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {sec.formulaCallout.label}
                    </span>
                    <p className="text-sm sm:text-base font-bold font-mono text-foreground">
                      {sec.formulaCallout.formula}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sec.formulaCallout.note}
                    </p>
                  </div>
                )}

                {sec.table && (
                  <div className="overflow-x-auto rounded-xl border">
                    {sec.table.caption && (
                      <div className="bg-muted/50 px-3.5 py-2 text-xs font-semibold text-foreground border-b">
                        {sec.table.caption}
                      </div>
                    )}
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b bg-muted/20 text-muted-foreground">
                          {sec.table.headers.map((h, hIdx) => (
                            <th key={hIdx} className="px-3.5 py-2.5 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {sec.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-muted/30">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={cn(
                                  "px-3.5 py-2",
                                  cIdx === 0
                                    ? "font-semibold text-foreground"
                                    : "font-mono text-foreground/90"
                                )}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* 3. Diagram & Visualisasi Biner 32-Bit Terintegrasi Simulator */}
          <Card className="shadow-xs border-emerald-500/30">
            <CardHeader className="pb-3 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-emerald-50/30 dark:bg-emerald-950/15">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Binary className="h-4 w-4 text-emerald-600" />
                  Ilustrasi Biner 32-Bit & Identitas Subnet ({simPreview.ipAddress}/{simPreview.prefix})
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {topic.simulatorPreset.caption}
                </p>
              </div>

              <Link
                href={`/simulator?ip=${encodeURIComponent(topic.simulatorPreset.ip)}&prefix=${topic.simulatorPreset.prefix}`}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 text-xs shrink-0 self-start sm:self-auto"
                )}
              >
                <Calculator className="h-3.5 w-3.5" />
                Coba Kasus Ini di Simulator
              </Link>
            </CardHeader>

            <CardContent className="pt-4 flex flex-col gap-4">
              {/* 4 Kartu Oktet */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {simPreview.octetBreakdowns.map((oct) => (
                  <div
                    key={oct.octetIndex}
                    className="rounded-lg border bg-card p-2.5 text-center shadow-2xs"
                  >
                    <div className="text-[10px] font-semibold text-muted-foreground">
                      {oct.roleLabel}
                    </div>
                    <div className="text-sm font-bold font-mono tracking-wider text-foreground mt-1">
                      {oct.ipBinary}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground mt-1">
                      Desimal: <strong className="text-foreground">{oct.ipDecimal}</strong> | Mask:{" "}
                      <strong className="text-foreground">{oct.maskDecimal}</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bar 32-Bit Linear */}
              <div className="overflow-x-auto pb-1">
                <div className="flex items-center gap-1 min-w-[660px] justify-between">
                  {simPreview.linearBits.map((bit) => {
                    let cls =
                      "border-emerald-700 bg-emerald-600 text-white font-bold"
                    if (bit.role === "network") {
                      cls =
                        "border-slate-300 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                    } else if (bit.role === "subnet") {
                      cls = "border-blue-700 bg-blue-600 text-white font-bold"
                    }
                    return (
                      <div
                        key={bit.bitNumber}
                        className={cn(
                          "flex-1 aspect-square max-w-[24px] flex items-center justify-center rounded border text-[11px] font-mono",
                          cls
                        )}
                        title={`Bit ke-${bit.bitNumber}: ${bit.role}`}
                      >
                        {bit.value}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 3 Kartu Hasil Identitas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-l-4 border-l-blue-600 bg-blue-50/30 dark:bg-blue-950/20 p-3">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                    NETWORK ID
                  </span>
                  <p className="text-base font-bold font-mono text-foreground mt-0.5">
                    {simPreview.networkAddress}
                  </p>
                </div>
                <div className="rounded-lg border border-l-4 border-l-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20 p-3">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    RENTANG HOST VALID ({simPreview.usableHosts} HOST)
                  </span>
                  <p className="text-sm font-bold font-mono text-foreground mt-0.5">
                    {simPreview.usableHostRangeLabel}
                  </p>
                </div>
                <div className="rounded-lg border border-l-4 border-l-amber-600 bg-amber-50/30 dark:bg-amber-950/20 p-3">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                    BROADCAST ID
                  </span>
                  <p className="text-base font-bold font-mono text-foreground mt-0.5">
                    {simPreview.broadcastAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Contoh Kasus pada Materi & Langkah Penyelesaian */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-emerald-600" />
                Contoh Kasus pada Materi & Langkah Penyelesaian
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 flex flex-col gap-4">
              <div className="rounded-xl border bg-muted/30 p-3.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Contoh Studi Kasus:
                </span>
                <p className="text-sm font-semibold text-foreground mt-1 leading-relaxed">
                  {topic.workedExample.question}
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {topic.workedExample.steps.map((st, sIdx) => (
                  <div
                    key={sIdx}
                    className="rounded-xl border bg-card p-3.5 flex items-start gap-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white text-xs font-mono font-bold mt-0.5">
                      {sIdx + 1}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-bold text-foreground">{st.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                        {st.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[#86EFAC] bg-[#DCFCE7] p-3.5 text-[#166534] flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold">Kesimpulan Contoh: </span>
                  <span className="font-mono font-semibold">
                    {topic.workedExample.finalAnswer}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Ringkasan Poin Kunci (Key Takeaways) */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Ringkasan Poin Kunci (Key Takeaways)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="flex flex-col gap-2 text-xs sm:text-sm text-foreground/90">
                {topic.keyTakeaways.map((point, kIdx) => (
                  <li key={kIdx} className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold mt-0.5">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 6. UJI PEMAHAMAN MATERI (2 SOAL PILIHAN GANDA - SYARAT KELULUSAN TOPIK) */}
          <Card id="quiz-checkpoint" className="shadow-xs border-emerald-500/40 scroll-mt-20">
            <CardHeader className="pb-3 border-b bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-emerald-600" />
                  Uji Pemahaman Materi: {topic.title} (Syarat Buka Materi Berikutnya)
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pilih jawaban pada kedua soal di bawah ini lalu klik <strong>Kirim Jawaban</strong> untuk membuka topik berikutnya serta melihat pembahasan.
                </p>
              </div>

              {isQuizSubmitted && (
                <div
                  className={cn(
                    "rounded-md border px-3 py-1.5 font-mono text-xs font-extrabold shrink-0 self-start sm:self-auto flex items-center gap-2",
                    correctCount === 2
                      ? "border-[#166534] bg-[#DCFCE7] text-[#166534]"
                      : correctCount === 1
                        ? "border-amber-400 bg-amber-50 text-amber-900"
                        : "border-red-400 bg-red-50 text-red-900"
                  )}
                >
                  <span className="uppercase tracking-wider text-[10px] opacity-80">
                    Skor Materi:
                  </span>
                  <span className="text-sm">{correctCount} / 2 Benar</span>
                </div>
              )}
            </CardHeader>

            <CardContent className="pt-5 flex flex-col gap-5">
              {topic.checkQuestions.map((q, qIdx) => {
                const chosenIdx = selectedAnswers[q.id]
                const isCorrect = chosenIdx === q.correctIndex

                return (
                  <div
                    key={q.id}
                    className={cn(
                      "rounded-xl border p-4 flex flex-col gap-3.5 transition-all",
                      !isQuizSubmitted
                        ? "bg-card"
                        : isCorrect
                          ? "border-[#86EFAC] bg-[#DCFCE7]/25 dark:bg-emerald-950/20"
                          : "border-[#FCA5A5] bg-[#FEE2E2]/25 dark:bg-red-950/20"
                    )}
                  >
                    {/* Pertanyaan */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white text-xs font-mono font-bold mt-0.5">
                          {qIdx + 1}
                        </span>
                        <p className="text-sm font-bold text-foreground leading-relaxed">
                          {q.question}
                        </p>
                      </div>
                    </div>

                    {/* Pilihan A, B, C, D */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-0 sm:pl-8">
                      {q.options.map((optText, optIdx) => {
                        const isSelected = chosenIdx === optIdx
                        const isOptionCorrect = optIdx === q.correctIndex

                        let optionStyle =
                          "border-border bg-background hover:bg-muted/50 text-foreground"

                        if (!isQuizSubmitted) {
                          if (isSelected) {
                            optionStyle =
                              "border-emerald-600 bg-emerald-50/80 text-emerald-900 font-semibold ring-1 ring-emerald-600/30 dark:bg-emerald-950/50 dark:text-emerald-200"
                          }
                        } else {
                          // Setelah klik Kirim Jawaban, tampilkan yang benar & salah
                          if (isOptionCorrect) {
                            optionStyle =
                              "border-[#86EFAC] bg-[#DCFCE7] text-[#166534] font-bold"
                          } else if (isSelected && !isOptionCorrect) {
                            optionStyle =
                              "border-[#FCA5A5] bg-[#FEE2E2] text-[#991B1B] font-semibold"
                          } else {
                            optionStyle =
                              "border-border bg-muted/20 text-muted-foreground opacity-75"
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isQuizSubmitted}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={cn(
                              "text-left rounded-lg border p-3 text-xs transition-all flex items-center justify-between gap-2",
                              optionStyle,
                              !isQuizSubmitted && "cursor-pointer"
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={cn(
                                  "flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-xs font-bold border",
                                  !isQuizSubmitted && isSelected
                                    ? "bg-emerald-600 text-white border-emerald-600"
                                    : isQuizSubmitted && isOptionCorrect
                                      ? "bg-[#166534] text-white border-[#166534]"
                                      : isQuizSubmitted && isSelected && !isOptionCorrect
                                        ? "bg-[#991B1B] text-white border-[#991B1B]"
                                        : "bg-muted/50 text-foreground border-border"
                                )}
                              >
                                {OPTION_LETTERS[optIdx]}
                              </span>
                              <span className="font-mono leading-snug break-words">
                                {optText}
                              </span>
                            </div>

                            {isQuizSubmitted && isOptionCorrect && (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#166534]" />
                            )}
                            {isQuizSubmitted && isSelected && !isOptionCorrect && (
                              <XCircle className="h-4 w-4 shrink-0 text-[#991B1B]" />
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Status Benar/Salah & Pembahasan (HANYA TAMPIL SETELAH KLIK KIRIM JAWABAN) */}
                    {isQuizSubmitted && (
                      <div className="pl-0 sm:pl-8 pt-1 flex flex-col gap-2.5">
                        {isCorrect ? (
                          <div
                            role="status"
                            className="rounded-lg border border-[#86EFAC] bg-[#DCFCE7] px-3 py-2 text-[#166534] text-xs flex items-center gap-2 font-semibold"
                          >
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <span>
                              Jawaban Anda Benar! ({OPTION_LETTERS[q.correctIndex]}.{" "}
                              {q.options[q.correctIndex]})
                            </span>
                          </div>
                        ) : (
                          <div
                            role="alert"
                            className="rounded-lg border border-[#FCA5A5] bg-[#FEE2E2] px-3 py-2 text-[#991B1B] text-xs flex items-center gap-2 font-semibold"
                          >
                            <XCircle className="h-4 w-4 shrink-0" />
                            <span>
                              Jawaban Anda Kurang Tepat. Jawaban yang benar adalah{" "}
                              <strong>
                                {OPTION_LETTERS[q.correctIndex]}. {q.options[q.correctIndex]}
                              </strong>
                              .
                            </span>
                          </div>
                        )}

                        {/* Kotak Pembahasan */}
                        <div className="rounded-xl border bg-background p-3.5 text-xs flex flex-col gap-2">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                            Pembahasan Soal {qIdx + 1}:
                          </span>
                          <p className="text-foreground/90 leading-relaxed">
                            {q.explanation}
                          </p>
                          <div className="flex flex-col gap-1 pt-1">
                            {q.steps.map((st, stIdx) => (
                              <div
                                key={stIdx}
                                className="font-mono text-[11px] text-muted-foreground bg-muted/40 rounded px-2.5 py-1 border"
                              >
                                • {st}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Pesan Peringatan Jika Belum Semua Soal Dijawab */}
              {quizValidationError && (
                <div
                  role="alert"
                  className="rounded-xl border border-[#FCD34D] bg-[#FEF3C7] p-3 text-[#92400E] text-xs flex items-center gap-2 font-medium"
                >
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{quizValidationError}</span>
                </div>
              )}

              {/* Tombol Aksi Kirim Jawaban / Ulangi Soal */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  {!isQuizSubmitted
                    ? `Terjawab: ${Object.keys(selectedAnswers).length} dari 2 soal (Wajib dikirim untuk membuka topik berikutnya)`
                    : "Topik ini telah selesai dipelajari dan materi berikutnya telah terbuka!"}
                </span>

                <div className="flex items-center gap-2">
                  {!isQuizSubmitted ? (
                    <Button
                      type="button"
                      onClick={handleSubmitCheckQuiz}
                      className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Kirim Jawaban & Buka Materi Berikutnya
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetCheckQuiz}
                      className="gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Ulangi Soal Materi Ini
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7. Navigasi Materi Sebelumnya / Berikutnya dengan Status Gating */}
          <div className="rounded-2xl border bg-card p-5 shadow-xs flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prev ? (
                <Link
                  href={`/materi/${prev.slug}`}
                  className="rounded-xl border p-3.5 hover:border-emerald-500/50 hover:bg-muted/40 transition-all flex items-center gap-3"
                >
                  <ArrowLeft className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                      Materi Sebelumnya (Topik {prev.order})
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-foreground truncate block">
                      {prev.title}
                    </span>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/materi"
                  className="rounded-xl border p-3.5 hover:bg-muted/40 transition-all flex items-center gap-3"
                >
                  <ArrowLeft className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                      Kembali ke Indeks
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-foreground block">
                      Daftar 12 Materi Kelas C
                    </span>
                  </div>
                </Link>
              )}

              {next ? (
                isQuizSubmitted ? (
                  <Link
                    href={`/materi/${next.slug}`}
                    className="rounded-xl border border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 hover:bg-emerald-100/50 transition-all flex items-center justify-between gap-3 text-right"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center justify-end gap-1">
                        <Unlock className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        Materi Berikutnya (Topik {next.order}) - Terbuka
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-foreground truncate block">
                        {next.title}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-emerald-600 shrink-0" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={scrollToQuiz}
                    className="rounded-xl border border-border bg-muted/70 hover:bg-muted text-muted-foreground p-3.5 transition-all flex items-center justify-between gap-3 text-right cursor-pointer"
                    title="Kirim jawaban 2 soal di atas untuk membuka materi berikutnya"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-end gap-1">
                        <Lock className="h-3 w-3" />
                        Topik {next.order} Terkunci
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-foreground truncate block">
                        Selesaikan Kuis di Atas untuk Membuka
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                )
              ) : (
                <Link
                  href="/latihan"
                  className="rounded-xl border border-emerald-600 bg-emerald-600 text-white p-3.5 hover:bg-emerald-700 transition-all flex items-center justify-between gap-3 text-right"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-100 block">
                      Seluruh Materi Selesai!
                    </span>
                    <span className="text-xs sm:text-sm font-bold truncate block">
                      Lanjut ke Modul Latihan Soal
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
