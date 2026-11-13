"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  HelpCircle,
  History,
  Layers,
  PencilLine,
  PlayCircle,
  RotateCcw,
  Send,
  XCircle,
} from "lucide-react"

import {
  PRACTICE_CATEGORIES,
  PRACTICE_MAX_ATTEMPTS,
  PRACTICE_PASSING_SCORE,
  PRACTICE_SESSION_SIZE,
  checkPracticeAnswer,
  selectPracticeSessionQuestions,
  type PracticeCategoryId,
} from "@/data/practice-questions-data"
import {
  usePracticeProgress,
  type PracticeScopeKey,
} from "@/lib/practice-storage"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const OPTION_LETTERS = ["A", "B", "C", "D"] as const

export function PracticeWorkbench() {
  const searchParams = useSearchParams()
  const initialCategoryParam = searchParams.get("kategori") as PracticeCategoryId | null

  const validInitialCategory: PracticeScopeKey =
    initialCategoryParam &&
    PRACTICE_CATEGORIES.some((c) => c.id === initialCategoryParam)
      ? initialCategoryParam
      : "semua"

  const [selectedCategory, setSelectedCategory] =
    React.useState<PracticeScopeKey>(validInitialCategory)

  // Panel kategori spesifik disembunyikan secara default agar tidak membingungkan user
  const [showOptionalCategories, setShowOptionalCategories] = React.useState<boolean>(
    validInitialCategory !== "semua"
  )

  // Nomor tab percobaan yang sedang dilihat/dikerjakan (1, 2, atau 3)
  const [selectedAttemptTab, setSelectedAttemptTab] = React.useState<number>(1)

  // Apakah user sudah menekan tombol "Lanjut ke Percobaan Ke-2 / Ke-3" untuk membuka lembar kerja baru
  const [activeWorkingAttempt, setActiveWorkingAttempt] = React.useState<number | null>(
    null
  )

  // Jawaban sementara user saat mengerjakan percobaan yang belum dikirim
  const [draftAnswers, setDraftAnswers] = React.useState<
    Record<string, string | number>
  >({})

  const [validationError, setValidationError] = React.useState<string | null>(
    null
  )

  // Seed tambahan jika user mereset seluruh siklus 3x percobaan
  const [cycleOffset, setCycleOffset] = React.useState<number>(0)

  const { progress, isLoaded, submitPracticeSession, resetCycle } =
    usePracticeProgress()

  // Ambil metadata kategori jika user memilih fokus topik opsional
  const activeCategoryMeta = React.useMemo(() => {
    if (selectedCategory === "semua") return null
    return (
      PRACTICE_CATEGORIES.find((c) => c.id === selectedCategory) ?? null
    )
  }, [selectedCategory])

  // Record progres untuk mode yang sedang aktif (Utama = "semua")
  const activeRecord = progress.records[selectedCategory]
  const mainRecord = progress.records["semua"]
  const completedHistory = React.useMemo(
    () =>
      [...(activeRecord?.history ?? [])].sort(
        (a, b) => a.attemptNumber - b.attemptNumber
      ),
    [activeRecord?.history]
  )
  const attemptsUsedInStorage = completedHistory.length

  // Saat pertama kali data localStorage dimuat atau saat berpindah kategori:
  // Jika sudah ada percobaan yang selesai, tampilkan percobaan terakhir yang pernah dikerjakan agar pembahasan tidak hilang!
  React.useEffect(() => {
    if (!isLoaded) return
    const rec = progress.records[selectedCategory]
    const hist = rec?.history ?? []
    if (hist.length > 0) {
      const latestAttemptNum = hist[hist.length - 1].attemptNumber
      setSelectedAttemptTab(latestAttemptNum)
      setActiveWorkingAttempt(null)
    } else {
      setSelectedAttemptTab(1)
      setActiveWorkingAttempt(1)
    }
    setDraftAnswers({})
    setValidationError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, selectedCategory])

  // Cek apakah tab percobaan yang sedang dibuka adalah percobaan yang SUDAH selesai dikerjakan
  const reviewedAttempt = React.useMemo(() => {
    return (
      completedHistory.find((item) => item.attemptNumber === selectedAttemptTab) ??
      null
    )
  }, [completedHistory, selectedAttemptTab])

  const isReviewMode = Boolean(reviewedAttempt)

  // Apakah kategori ini sudah mencapai skor >= 70 (Tuntas) pada salah satu percobaan di siklus ini?
  const hasPassedInCurrentCycle = React.useMemo(() => {
    return completedHistory.some((item) => item.passed)
  }, [completedHistory])

  // Apakah masih boleh lanjut ke percobaan berikutnya (2 atau 3)?
  // Hanya boleh jika sudah mengerjakan minimal 1x, BELUM mencapai 70, dan jumlah percobaan < 3
  const canStartNextAttempt =
    !hasPassedInCurrentCycle &&
    attemptsUsedInStorage > 0 &&
    attemptsUsedInStorage < PRACTICE_MAX_ATTEMPTS

  const nextAvailableAttemptNumber = attemptsUsedInStorage + 1

  // Hitung seed soal untuk tab percobaan yang sedang aktif
  const currentCompositeSeed = React.useMemo(() => {
    if (reviewedAttempt?.seed) {
      return reviewedAttempt.seed
    }
    const categoryCode =
      selectedCategory === "semua"
        ? 99
        : PRACTICE_CATEGORIES.findIndex((c) => c.id === selectedCategory) + 1
    return (
      categoryCode * 1000 +
      selectedAttemptTab * 31 +
      cycleOffset * 97
    )
  }, [reviewedAttempt?.seed, selectedCategory, selectedAttemptTab, cycleOffset])

  // Daftar 10 butir soal untuk percobaan yang sedang dilihat/dikerjakan
  const sessionQuestions = React.useMemo(() => {
    return selectPracticeSessionQuestions(
      selectedCategory,
      "Semua",
      currentCompositeSeed
    )
  }, [selectedCategory, currentCompositeSeed])

  // Jawaban yang ditampilkan: jika mode review, ambil dari reviewedAttempt.answers; jika sedang mengerjakan, ambil dari draftAnswers
  const displayedAnswers = React.useMemo(() => {
    if (isReviewMode && reviewedAttempt?.answers) {
      return reviewedAttempt.answers
    }
    return draftAnswers
  }, [isReviewMode, reviewedAttempt, draftAnswers])

  const hasSavedAnswersInReview =
    isReviewMode &&
    reviewedAttempt?.answers &&
    Object.keys(reviewedAttempt.answers).length > 0

  // Jumlah soal yang sudah diisi pada sesi aktif (saat sedang mengerjakan)
  const answeredCount = React.useMemo(() => {
    return sessionQuestions.filter((q) => {
      const val = displayedAnswers[q.id]
      if (val === undefined || val === null) return false
      if (typeof val === "string") return val.trim().length > 0
      return true
    }).length
  }, [sessionQuestions, displayedAnswers])

  const handleCategoryChange = (nextCategory: PracticeScopeKey) => {
    setSelectedCategory(nextCategory)
    setValidationError(null)
  }

  const handleSelectMcOption = (questionId: string, optionIdx: number) => {
    if (isReviewMode) return
    setDraftAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }))
    if (validationError) setValidationError(null)
  }

  const handleShortAnswerChange = (questionId: string, textValue: string) => {
    if (isReviewMode) return
    setDraftAnswers((prev) => ({
      ...prev,
      [questionId]: textValue,
    }))
    if (validationError) setValidationError(null)
  }

  const handleSubmitSession = () => {
    if (isReviewMode) return

    const unansweredIndices: number[] = []
    sessionQuestions.forEach((q, idx) => {
      const val = draftAnswers[q.id]
      if (
        val === undefined ||
        val === null ||
        (typeof val === "string" && val.trim() === "")
      ) {
        unansweredIndices.push(idx + 1)
      }
    })

    if (unansweredIndices.length > 0) {
      setValidationError(
        `Mohon lengkapi seluruh jawaban terlebih dahulu. Soal yang belum dijawab: Nomor ${unansweredIndices.join(", ")}.`
      )
      const firstUnansweredQ = sessionQuestions[unansweredIndices[0] - 1]
      if (firstUnansweredQ) {
        const el = document.getElementById(`practice-q-${firstUnansweredQ.id}`)
        el?.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    let correct = 0
    sessionQuestions.forEach((q) => {
      if (checkPracticeAnswer(q, draftAnswers[q.id])) {
        correct += 1
      }
    })

    const attemptNumToSave = Math.min(
      attemptsUsedInStorage + 1,
      PRACTICE_MAX_ATTEMPTS
    )

    submitPracticeSession(
      selectedCategory,
      correct,
      PRACTICE_SESSION_SIZE,
      currentCompositeSeed,
      draftAnswers
    )

    setSelectedAttemptTab(attemptNumToSave)
    setActiveWorkingAttempt(null)
    setValidationError(null)

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 50)
  }

  // Memulai Percobaan ke-2 atau ke-3 (Hanya ketika skor percobaan sebelumnya < 70)
  const handleStartNextAttempt = () => {
    if (!canStartNextAttempt) return
    const nextNum = nextAvailableAttemptNumber
    setDraftAnswers({})
    setValidationError(null)
    setActiveWorkingAttempt(nextNum)
    setSelectedAttemptTab(nextNum)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Mereset siklus 3x percobaan jika seluruh 3 percobaan habis dan belum mencapai 70
  const handleResetCycleAndRetry = () => {
    resetCycle(selectedCategory)
    setCycleOffset((prev) => prev + 1)
    setDraftAnswers({})
    setValidationError(null)
    setActiveWorkingAttempt(1)
    setSelectedAttemptTab(1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Ringkasan Status Latihan Utama */}
      <section className="rounded-2xl border bg-gradient-to-r from-emerald-50/70 via-background to-background p-5 sm:p-7 dark:from-emerald-950/20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Latihan Mandiri IPv4 & Subnetting Kelas C
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Kerjakan <strong>10 butir soal</strong> latihan (Pilihan Ganda & Isian Singkat) dengan batas ketuntasan minimal <strong>KKM 70</strong> dalam maksimal <strong>3 kali percobaan</strong>. Apabila skor percobaan pertama di bawah 70, Anda dapat lanjut ke percobaan ke-2 hingga ke-3; apabila sudah mencapai <strong>70 ke atas</strong>, Anda langsung dinyatakan tuntas dan dapat lanjut ke <strong>Kuis Evaluasi</strong>.
          </p>
        </div>

        {/* Kartu Status & Highlight Skor Latihan Utama */}
        <div
          className={cn(
            "rounded-xl border p-4 shadow-xs min-w-[290px] sm:min-w-[340px] flex items-center justify-between gap-4",
            mainRecord?.passed
              ? "border-[#86EFAC] bg-[#DCFCE7]/35 dark:bg-emerald-950/25"
              : "bg-card"
          )}
        >
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Status Latihan (KKM {PRACTICE_PASSING_SCORE})
            </span>

            <div className="flex items-center gap-1.5">
              {mainRecord?.passed ? (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#166534] dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  TUNTAS / LULUS
                </span>
              ) : mainRecord?.attemptsUsed ? (
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  {mainRecord.attemptsUsed} dari {PRACTICE_MAX_ATTEMPTS} Percobaan Terpakai
                </span>
              ) : (
                <span className="text-xs font-semibold text-muted-foreground">
                  Belum Dikerjakan
                </span>
              )}
            </div>

            <div className="h-1.5 w-full rounded-sm bg-muted overflow-hidden mt-0.5">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${Math.min(mainRecord?.bestScore ?? 0, 100)}%` }}
              />
            </div>
          </div>

          {/* Highlighted Score Display */}
          <div
            className={cn(
              "rounded-lg border px-3.5 py-2 flex flex-col items-center justify-center shrink-0 min-w-[88px]",
              mainRecord?.passed
                ? "border-[#166534]/30 bg-[#DCFCE7] text-[#166534] dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-700"
                : mainRecord?.attemptsUsed
                  ? "border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200"
                  : "border-border bg-muted/40 text-muted-foreground"
            )}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
              Skor Terbaik
            </span>
            <div className="flex items-baseline gap-0.5 font-mono">
              <span className="text-2xl font-extrabold leading-none">
                {mainRecord?.attemptsUsed ? mainRecord.bestScore : "-"}
              </span>
              <span className="text-[11px] font-semibold opacity-75">/100</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bar Info Sesi Aktif + Tab Riwayat Percobaan (1 / 2 / 3 Sesuai yang Pernah Dikerjakan) */}
      <div className="rounded-xl border bg-card p-4 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-sm sm:text-base font-extrabold text-foreground">
                {activeCategoryMeta
                  ? `Mode Fokus Opsional: ${activeCategoryMeta.title}`
                  : "Latihan Utama: Seluruh Materi Kelas C"}
              </h2>
            </div>

            {/* Structured Technical Specs Row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-mono">
              <span>
                Jumlah: <strong className="text-foreground">10 Soal</strong>
              </span>
              <span className="text-border">|</span>
              <span>
                Batas Lulus:{" "}
                <strong className="text-emerald-700 dark:text-emerald-400">
                  KKM {PRACTICE_PASSING_SCORE}/100
                </strong>
              </span>
              <span className="text-border">|</span>
              <span>
                Riwayat Percobaan:{" "}
                <strong className="text-foreground">
                  {attemptsUsedInStorage} dari {PRACTICE_MAX_ATTEMPTS} Kesempatan
                </strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowOptionalCategories((prev) => !prev)}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer",
                showOptionalCategories || selectedCategory !== "semua"
                  ? "border-emerald-600/40 bg-emerald-50/70 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Filter Topik Spesifik (Opsional)</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  showOptionalCategories && "rotate-180"
                )}
              />
            </button>

            <Link
              href="/simulator"
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "h-8 text-xs gap-1.5"
              )}
            >
              <Calculator className="h-3.5 w-3.5" />
              Buka Simulator
            </Link>
          </div>
        </div>

        {/* BAR PILIH PERCOBAAN (Hanya Menampilkan Percobaan 1 / 2 / 3 yang Pernah Dikerjakan atau Sedang Aktif) */}
        {(completedHistory.length > 0 || activeWorkingAttempt !== null) && (
          <div className="pt-3 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground inline-flex items-center gap-1.5 mr-1">
                <History className="h-3.5 w-3.5 text-emerald-600" />
                Pilih Percobaan:
              </span>

              {/* Render tab untuk setiap percobaan yang SUDAH selesai dikerjakan */}
              {completedHistory.map((item) => {
                const isSelected = selectedAttemptTab === item.attemptNumber
                return (
                  <button
                    key={item.attemptNumber}
                    type="button"
                    onClick={() => setSelectedAttemptTab(item.attemptNumber)}
                    className={cn(
                      "px-3 py-1.5 rounded-md border text-xs font-mono font-medium transition-all inline-flex items-center gap-2 cursor-pointer",
                      isSelected
                        ? "border-blue-400 bg-blue-50/70 text-blue-950 font-bold shadow-2xs ring-1 ring-blue-300 dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-100"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <span>Percobaan {item.attemptNumber}</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[11px] font-bold border transition-colors",
                        item.passed
                          ? isSelected
                            ? "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : isSelected
                            ? "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-950/70 dark:text-amber-300"
                            : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                      )}
                    >
                      Skor: {item.score}
                    </span>
                  </button>
                )
              })}

              {/* Jika user sedang mengerjakan percobaan baru yang belum disubmit */}
              {activeWorkingAttempt !== null &&
                !completedHistory.some(
                  (h) => h.attemptNumber === activeWorkingAttempt
                ) && (
                  <button
                    type="button"
                    onClick={() => setSelectedAttemptTab(activeWorkingAttempt)}
                    className={cn(
                      "px-3 py-1.5 rounded-md border text-xs font-mono font-medium transition-all inline-flex items-center gap-2 cursor-pointer",
                      selectedAttemptTab === activeWorkingAttempt
                        ? "border-blue-400 bg-blue-50/70 text-blue-950 font-bold shadow-2xs ring-1 ring-blue-300 dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-100"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <span>Percobaan {activeWorkingAttempt}</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border",
                        selectedAttemptTab === activeWorkingAttempt
                          ? "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-700 dark:bg-blue-900/60 dark:text-blue-200"
                          : "border-border bg-muted text-muted-foreground"
                      )}
                    >
                      Sedang Dikerjakan
                    </span>
                  </button>
                )}
            </div>

            {/* Tombol Cepat di Samping Tab Percobaan */}
            <div className="flex flex-wrap items-center gap-2">
              {canStartNextAttempt &&
                activeWorkingAttempt !== nextAvailableAttemptNumber && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleStartNextAttempt}
                    className="h-8 text-xs gap-1.5 bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                  >
                    <PlayCircle className="h-3.5 w-3.5" />
                    Lanjut Latihan ke Percobaan {nextAvailableAttemptNumber}
                  </Button>
                )}

              {hasPassedInCurrentCycle && (
                <Link
                  href="/kuis"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "h-8 text-xs gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs focus-visible:ring-emerald-500"
                  )}
                >
                  <Award className="h-3.5 w-3.5" />
                  Lanjut ke Kuis Evaluasi
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Panel Filter Topik Spesifik (Opsional - Hanya Tampil Jika Dibuka) */}
        {showOptionalCategories && (
          <div className="pt-3 border-t flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted-foreground">
                <strong>Opsional:</strong> Gunakan pilihan di bawah ini hanya jika Anda ingin berlatih fokus pada satu sub-topik tertentu saja.
              </span>
              {selectedCategory !== "semua" && (
                <button
                  type="button"
                  onClick={() => handleCategoryChange("semua")}
                  className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold underline cursor-pointer shrink-0"
                >
                  Kembali ke Latihan Utama (Semua Materi)
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleCategoryChange("semua")}
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer",
                  selectedCategory === "semua"
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                    : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <span>Semua Materi (Utama)</span>
                {progress.records["semua"]?.passed && (
                  <Check className="h-3 w-3" />
                )}
              </button>

              {PRACTICE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id
                const rec = progress.records[cat.id]
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer",
                      isSelected
                        ? "border-emerald-600 bg-emerald-600 text-white font-semibold shadow-xs"
                        : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span>{cat.shortTitle}</span>
                    {rec?.passed && (
                      <Check
                        className={cn(
                          "h-3 w-3",
                          isSelected ? "text-white" : "text-emerald-600"
                        )}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigasi Cepat Nomor Soal (1 - 10) */}
      <div className="rounded-xl border bg-card p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-foreground">
            {isReviewMode
              ? `Ulasan Jawaban Percobaan ${selectedAttemptTab} (${reviewedAttempt?.correctCount ?? 0}/${PRACTICE_SESSION_SIZE} Benar):`
              : `Navigasi 10 Butir Soal - Percobaan ${selectedAttemptTab} (${answeredCount}/${PRACTICE_SESSION_SIZE} Terjawab):`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {sessionQuestions.map((q, idx) => {
            const val = displayedAnswers[q.id]
            const isAnswered =
              val !== undefined &&
              val !== null &&
              (typeof val !== "string" || val.trim().length > 0)
            const isCorrect =
              isReviewMode &&
              (!hasSavedAnswersInReview || checkPracticeAnswer(q, val))

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  const el = document.getElementById(`practice-q-${q.id}`)
                  el?.scrollIntoView({ behavior: "smooth", block: "center" })
                }}
                className={cn(
                  "h-7 w-7 rounded-md font-mono text-xs font-bold border transition-all flex items-center justify-center cursor-pointer",
                  !isReviewMode
                    ? isAnswered
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                    : !hasSavedAnswersInReview
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : isCorrect
                        ? "border-[#166534] bg-[#DCFCE7] text-[#166534]"
                        : "border-[#991B1B] bg-[#FEE2E2] text-[#991B1B]"
                )}
                title={`Lompat ke Soal ${idx + 1}`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Daftar 10 Butir Soal Latihan (Hanya Menampilkan Nomor & Jenis Soal) */}
      <div className="flex flex-col gap-4">
        {sessionQuestions.map((q, qIdx) => {
          const userVal = displayedAnswers[q.id]
          const isCorrect =
            isReviewMode &&
            (!hasSavedAnswersInReview || checkPracticeAnswer(q, userVal))

          return (
            <Card
              key={q.id}
              id={`practice-q-${q.id}`}
              className="shadow-xs transition-all scroll-mt-24 bg-card border-border"
            >
              <CardHeader className="pb-3 border-b">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white text-xs font-mono font-bold">
                      {qIdx + 1}
                    </span>
                    <Badge variant="secondary" className="text-[11px]">
                      {q.type === "multiple_choice"
                        ? "Pilihan Ganda"
                        : "Isian Singkat"}
                    </Badge>
                    {isReviewMode && hasSavedAnswersInReview && (
                      <span
                        className={cn(
                          "text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border",
                          isCorrect
                            ? "border-[#86EFAC] bg-[#DCFCE7] text-[#166534]"
                            : "border-[#FCA5A5] bg-[#FEE2E2] text-[#991B1B]"
                        )}
                      >
                        {isCorrect ? "Benar (+10)" : "Salah (0)"}
                      </span>
                    )}
                  </div>

                  {q.contextIp && (
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border bg-muted/50 text-foreground">
                      {q.contextIp}
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base font-bold text-foreground leading-relaxed pt-2">
                  {q.prompt}
                </p>
              </CardHeader>

              <CardContent className="pt-4 flex flex-col gap-4">
                {q.type === "multiple_choice" && q.options ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((optText, optIdx) => {
                      const isSelected =
                        userVal !== undefined && Number(userVal) === optIdx
                      const isOptionCorrect = optIdx === q.correctIndex

                      let optionStyle =
                        "border-border bg-background hover:bg-muted/50 text-foreground"

                      if (!isReviewMode) {
                        if (isSelected) {
                          optionStyle =
                            "border-emerald-600 bg-emerald-50/80 text-emerald-900 font-semibold ring-1 ring-emerald-600/30 dark:bg-emerald-950/50 dark:text-emerald-200"
                        }
                      } else {
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
                          disabled={isReviewMode}
                          onClick={() => handleSelectMcOption(q.id, optIdx)}
                          className={cn(
                            "text-left rounded-lg border p-3 text-xs transition-all flex items-center justify-between gap-2",
                            optionStyle,
                            !isReviewMode && "cursor-pointer"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-xs font-bold border",
                                !isReviewMode && isSelected
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : isReviewMode && isOptionCorrect
                                    ? "bg-[#166534] text-white border-[#166534]"
                                    : isReviewMode && isSelected && !isOptionCorrect
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

                          {isReviewMode && isOptionCorrect && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#166534]" />
                          )}
                          {isReviewMode && isSelected && !isOptionCorrect && (
                            <XCircle className="h-4 w-4 shrink-0 text-[#991B1B]" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-w-md">
                    <div className="flex items-center gap-2">
                      <PencilLine className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Input
                        value={
                          userVal !== undefined
                            ? String(userVal)
                            : isReviewMode
                              ? (q.acceptedAnswers?.[0] ?? "")
                              : ""
                        }
                        disabled={isReviewMode}
                        onChange={(e) =>
                          handleShortAnswerChange(q.id, e.target.value)
                        }
                        placeholder={q.placeholder ?? "Ketik jawaban Anda..."}
                        className="font-mono text-sm h-9"
                        aria-label={`Jawaban soal nomor ${qIdx + 1}`}
                      />
                    </div>
                    {q.answerHint && !isReviewMode && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <HelpCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Petunjuk: {q.answerHint}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Status Benar/Salah & Pembahasan (TAMPIL SAAT PERCOBAAN SUDAH DIKIRIM / MODE REVIEW) */}
                {isReviewMode && (
                  <div className="pt-2 border-t flex flex-col gap-2.5">
                    {!hasSavedAnswersInReview ? (
                      <div className="rounded-lg border border-[#86EFAC] bg-[#DCFCE7] px-3 py-2 text-[#166534] text-xs flex items-center gap-2 font-semibold">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>
                          Kunci Jawaban yang Benar:{" "}
                          <strong>
                            {q.type === "multiple_choice" &&
                            q.options &&
                            q.correctIndex !== undefined
                              ? `${OPTION_LETTERS[q.correctIndex]}. ${q.options[q.correctIndex]}`
                              : (q.acceptedAnswers?.[0] ?? "")}
                          </strong>
                        </span>
                      </div>
                    ) : isCorrect ? (
                      <div
                        role="status"
                        className="rounded-lg border border-[#86EFAC] bg-[#DCFCE7] px-3 py-2 text-[#166534] text-xs flex items-center gap-2 font-semibold"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>
                          Jawaban Anda Benar! (+10 Poin) -{" "}
                          {q.type === "multiple_choice" &&
                          q.options &&
                          q.correctIndex !== undefined
                            ? `${OPTION_LETTERS[q.correctIndex]}. ${q.options[q.correctIndex]}`
                            : (q.acceptedAnswers?.[0] ?? "")}
                        </span>
                      </div>
                    ) : (
                      <div
                        role="alert"
                        className="rounded-lg border border-[#FCA5A5] bg-[#FEE2E2] px-3 py-2 text-[#991B1B] text-xs flex items-center gap-2 font-semibold"
                      >
                        <XCircle className="h-4 w-4 shrink-0" />
                        <span>
                          Jawaban Anda Kurang Tepat (Jawaban Anda:{" "}
                          <code className="font-mono underline">
                            {q.type === "multiple_choice" &&
                            q.options &&
                            userVal !== undefined
                              ? `${OPTION_LETTERS[Number(userVal)]}. ${q.options[Number(userVal)]}`
                              : String(userVal ?? "-")}
                          </code>
                          ). Kunci Jawaban yang benar adalah{" "}
                          <strong>
                            {q.type === "multiple_choice" &&
                            q.options &&
                            q.correctIndex !== undefined
                              ? `${OPTION_LETTERS[q.correctIndex]}. ${q.options[q.correctIndex]}`
                              : (q.acceptedAnswers?.[0] ?? "")}
                          </strong>
                          .
                        </span>
                      </div>
                    )}

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
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pesan Peringatan Jika Belum Semua 10 Soal Dijawab */}
      {validationError && (
        <div
          role="alert"
          className="rounded-xl border border-[#FCD34D] bg-[#FEF3C7] p-3.5 text-[#92400E] text-xs flex items-center gap-2 font-medium"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Panel Tombol Aksi Bawah */}
      <Card className="shadow-xs border-emerald-500/40">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs sm:text-sm font-bold text-foreground">
              {!isReviewMode
                ? `Progres Pengerjaan Percobaan ${selectedAttemptTab}: ${answeredCount} dari ${PRACTICE_SESSION_SIZE} Soal Terjawab`
                : reviewedAttempt?.passed
                  ? `Percobaan ${selectedAttemptTab} Tuntas (Skor: ${reviewedAttempt.score}/100 - Lulus KKM 70)`
                  : `Percobaan ${selectedAttemptTab} Selesai (Skor: ${reviewedAttempt?.score ?? 0}/100 - Di Bawah KKM 70)`}
            </span>
            <span className="text-xs text-muted-foreground">
              {!isReviewMode
                ? "Pastikan seluruh 10 butir soal telah diisi sebelum menekan tombol Kirim Jawaban Latihan."
                : hasPassedInCurrentCycle
                  ? "Anda telah lulus latihan (Skor >= 70). Silakan lanjut ke Kuis Evaluasi tanpa perlu mengerjakan soal baru di latihan."
                  : canStartNextAttempt
                    ? `Karena skor percobaan ini masih di bawah 70, silakan lanjut mengerjakan Percobaan ${nextAvailableAttemptNumber}.`
                    : "Seluruh 3 kali kesempatan telah digunakan. Anda dapat melihat kembali Percobaan 1, 2, 3 di atas atau lanjut ke Kuis Evaluasi."}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {!isReviewMode ? (
              <Button
                type="button"
                onClick={handleSubmitSession}
                className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Send className="h-3.5 w-3.5" />
                Kirim Jawaban Latihan (Percobaan {selectedAttemptTab}/{PRACTICE_MAX_ATTEMPTS})
              </Button>
            ) : hasPassedInCurrentCycle ? (
              <Link
                href="/kuis"
                className={cn(
                  buttonVariants({ size: "default" }),
                  "gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                )}
              >
                <Award className="h-4 w-4" />
                Lanjut ke Kuis Evaluasi (20 Soal)
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : canStartNextAttempt ? (
              <Button
                type="button"
                onClick={handleStartNextAttempt}
                className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <PlayCircle className="h-4 w-4" />
                Lanjut Latihan ke Percobaan {nextAvailableAttemptNumber} (Sisa{" "}
                {PRACTICE_MAX_ATTEMPTS - attemptsUsedInStorage}x)
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetCycleAndRetry}
                  className="gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset & Ulangi dari Percobaan 1
                </Button>
                <Link
                  href="/kuis"
                  className={cn(
                    buttonVariants({ size: "default" }),
                    "gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                  )}
                >
                  <Award className="h-4 w-4" />
                  Lanjut ke Kuis Evaluasi (20 Soal)
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
