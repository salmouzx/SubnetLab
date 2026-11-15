"use client"

import * as React from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Flag,
  Lock,
  PencilLine,
  PlayCircle,
  RotateCcw,
  Send,
  ShieldCheck,
  XCircle,
} from "lucide-react"

import {
  QUIZ_DURATION_MINUTES,
  QUIZ_DURATION_SECONDS,
  QUIZ_PASSING_SCORE,
  QUIZ_POINTS_PER_QUESTION,
  QUIZ_TOTAL_QUESTIONS,
  evaluateQuizSubmission,
  selectQuizQuestions,
} from "@/data/quiz-questions-data"
import { usePracticeProgress } from "@/lib/practice-storage"
import {
  useQuizProgress,
  type QuizAttemptRecord,
  type QuizAttemptType,
} from "@/lib/quiz-storage"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const OPTION_LETTERS = ["A", "B", "C", "D"] as const

type QuizViewMode = "portal" | "running" | "results"

function formatTimer(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

function formatDurationReadable(totalSeconds: number): string {
  const clamped = Math.max(1, Math.floor(totalSeconds))
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  if (minutes === 0) return `${seconds} detik`
  return `${minutes} menit ${seconds} detik`
}

export function QuizWorkbench() {
  const { progress: practiceProgress, isLoaded: isPracticeLoaded } =
    usePracticeProgress()
  const {
    progress: quizProgress,
    isLoaded: isQuizLoaded,
    beginQuiz,
    saveDraft,
    submitQuiz,
    resetQuiz,
  } = useQuizProgress()

  const [view, setView] = React.useState<QuizViewMode>("portal")
  const [confirmStartType, setConfirmStartType] =
    React.useState<QuizAttemptType | null>(null)
  const [confirmFinishOpen, setConfirmFinishOpen] =
    React.useState<boolean>(false)
  const [remainingSeconds, setRemainingSeconds] = React.useState<number>(
    QUIZ_DURATION_SECONDS
  )
  const [selectedResultTab, setSelectedResultTab] =
    React.useState<QuizAttemptType>("utama")

  // Cek apakah user sudah pernah menyelesaikan minimal 1x percobaan di modul Latihan
  const hasCompletedPractice = React.useMemo(() => {
    return Object.values(practiceProgress.records).some(
      (rec) => rec.attemptsUsed >= 1 || (rec.history && rec.history.length >= 1)
    )
  }, [practiceProgress.records])

  // Ambil skor latihan terbaik untuk ditampilkan di kartu prasyarat
  const bestPracticeScore = React.useMemo(() => {
    const scores = Object.values(practiceProgress.records).map(
      (r) => r.bestScore
    )
    return scores.length > 0 ? Math.max(...scores) : 0
  }, [practiceProgress.records])

  // Sinkronisasi mode tampilan saat halaman dimuat:
  // - Jika sedang ada activeDraft -> tampilkan ujian berjalan ("running")
  // - Jika sudah pernah menyelesaikan kuis -> langsung tampilkan hasil & pembahasan ("results") sesuai percobaan terakhir
  const hasInitializedView = React.useRef(false)
  React.useEffect(() => {
    if (!isQuizLoaded) return
    if (quizProgress.activeDraft) {
      setView("running")
      hasInitializedView.current = true
      return
    }
    if (!hasInitializedView.current) {
      hasInitializedView.current = true
      if (quizProgress.remedialAttempt) {
        setSelectedResultTab("remedial")
        setView("results")
      } else if (quizProgress.mainAttempt) {
        setSelectedResultTab("utama")
        setView("results")
      }
    }
  }, [
    isQuizLoaded,
    quizProgress.activeDraft,
    quizProgress.mainAttempt,
    quizProgress.remedialAttempt,
  ])

  const activeDraft = quizProgress.activeDraft

  // Daftar 20 soal untuk sesi yang sedang berjalan (berdasarkan seed di activeDraft)
  const activeQuestions = React.useMemo(() => {
    if (!activeDraft) return []
    return selectQuizQuestions(activeDraft.seed)
  }, [activeDraft])

  // Fungsi penyelesaian kuis (baik manual maupun auto-submit saat waktu habis)
  const handleFinalizeQuiz = React.useCallback(() => {
    if (!activeDraft) return
    const questions = selectQuizQuestions(activeDraft.seed)
    const evalResult = evaluateQuizSubmission(questions, activeDraft.answers)

    const startedMs = new Date(activeDraft.startedAt).getTime()
    const elapsedSeconds = Math.min(
      QUIZ_DURATION_SECONDS,
      Math.max(1, Math.round((Date.now() - startedMs) / 1000))
    )

    const record: QuizAttemptRecord = {
      attemptType: activeDraft.attemptType,
      seed: activeDraft.seed,
      score: evalResult.score,
      correctCount: evalResult.correctCount,
      totalQuestions: evalResult.totalQuestions,
      passed: evalResult.passed,
      durationSpentSeconds: elapsedSeconds,
      answers: activeDraft.answers,
      submittedAt: new Date().toISOString(),
    }

    submitQuiz(record)
    setSelectedResultTab(record.attemptType)
    setConfirmFinishOpen(false)
    setView("results")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [activeDraft, submitQuiz])

  // Timer Countdown 60 Menit & Auto-Submit di 00:00
  React.useEffect(() => {
    if (view !== "running" || !activeDraft) return

    const startedMs = new Date(activeDraft.startedAt).getTime()

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedMs) / 1000)
      const left = QUIZ_DURATION_SECONDS - elapsed
      if (left <= 0) {
        setRemainingSeconds(0)
        handleFinalizeQuiz()
      } else {
        setRemainingSeconds(left)
      }
    }

    tick()
    const intervalId = window.setInterval(tick, 1000)
    return () => window.clearInterval(intervalId)
  }, [view, activeDraft, handleFinalizeQuiz])

  // Memulai sesi kuis baru (Utama = seed 101, Remedial = seed 202)
  const handleStartQuizConfirmed = (attemptType: QuizAttemptType) => {
    const seed = attemptType === "utama" ? 101 : 202
    beginQuiz(attemptType, seed)
    setConfirmStartType(null)
    setConfirmFinishOpen(false)
    setRemainingSeconds(QUIZ_DURATION_SECONDS)
    setView("running")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (!activeDraft) return
    saveDraft((draft) => ({
      ...draft,
      answers: {
        ...draft.answers,
        [questionId]: optionIdx,
      },
    }))
  }

  const handleToggleFlag = (questionId: string) => {
    if (!activeDraft) return
    saveDraft((draft) => {
      const exists = draft.flaggedIds.includes(questionId)
      const flaggedIds = exists
        ? draft.flaggedIds.filter((id) => id !== questionId)
        : [...draft.flaggedIds, questionId]
      return {
        ...draft,
        flaggedIds,
      }
    })
  }

  const handleGoToQuestion = (index: number) => {
    if (!activeDraft) return
    const clamped = Math.max(0, Math.min(QUIZ_TOTAL_QUESTIONS - 1, index))
    saveDraft((draft) => ({
      ...draft,
      currentQuestionIndex: clamped,
    }))
    setConfirmFinishOpen(false)
  }

  if (!isPracticeLoaded || !isQuizLoaded) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
        Memuat Portal Kuis Evaluasi...
      </div>
    )
  }

  // ==========================================================================
  // LAYAR 2: PENGERJAAN KUIS BERLANGSUNG (IN-QUIZ)
  // ==========================================================================
  if (view === "running" && activeDraft && activeQuestions.length > 0) {
    const currentIdx = activeDraft.currentQuestionIndex
    const currentQuestion =
      activeQuestions[currentIdx] ?? activeQuestions[0]
    const chosenOption = activeDraft.answers[currentQuestion.id]
    const isFlagged = activeDraft.flaggedIds.includes(currentQuestion.id)

    const answeredCount = activeQuestions.filter(
      (q) => activeDraft.answers[q.id] !== undefined
    ).length
    const unansweredCount = QUIZ_TOTAL_QUESTIONS - answeredCount

    const timerStyle =
      remainingSeconds <= 300
        ? "border-[#FCA5A5] bg-[#FEE2E2] text-[#991B1B] animate-pulse"
        : remainingSeconds <= 900
          ? "border-[#FCD34D] bg-[#FEF3C7] text-[#92400E]"
          : "border-[#113057]/30 bg-[#113057]/10 text-[#113057] dark:bg-[#113057]/20 dark:border-[#113057]/40 dark:text-[#60A5FA]"

    return (
      <div className="flex flex-col gap-5">
        {/* Sticky Top Exam Bar */}
        <div className="sticky top-16 z-30 rounded-2xl border bg-card/95 backdrop-blur p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge className="bg-[#113057] text-white hover:bg-[#113057]">
              {activeDraft.attemptType === "utama"
                ? "Kuis Utama (Kesempatan 1)"
                : "Kuis Remedial (Kesempatan Terakhir)"}
            </Badge>
            <span className="text-xs sm:text-sm font-bold text-foreground">
              Soal {currentIdx + 1} dari {QUIZ_TOTAL_QUESTIONS}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              • Terjawab: <strong>{answeredCount}</strong>/{QUIZ_TOTAL_QUESTIONS}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={cn(
                "px-3 py-1.5 rounded-xl border font-mono text-xs sm:text-sm font-extrabold flex items-center gap-2",
                timerStyle
              )}
              title="Sisa waktu pengerjaan kuis (Auto-submit saat 00:00)"
            >
              <Clock className="h-4 w-4 shrink-0" />
              <span>Sisa Waktu: {formatTimer(remainingSeconds)}</span>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => setConfirmFinishOpen(true)}
              className="gap-1.5 bg-[#FFB61E] text-[#0A2342] font-semibold hover:bg-[#F59E0B]"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Selesaikan Kuis</span>
              <span className="sm:hidden">Selesai</span>
            </Button>
          </div>
        </div>

        {/* Modal / Banner Konfirmasi Penyelesaian Kuis (Highlight Kuning / Amber Sesuai Kartu Peringatan) */}
        {confirmFinishOpen && (
          <div
            role="dialog"
            aria-label="Konfirmasi Selesaikan Kuis"
            className="rounded-2xl border-2 border-[#FCD34D] bg-[#FEF3C7]/50 dark:bg-amber-950/30 p-5 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCD34D] bg-[#FEF3C7] text-[#92400E] dark:bg-amber-900/40 dark:text-amber-300">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-extrabold text-foreground">
                  Konfirmasi Pengiriman Jawaban Kuis
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Kamu sudah menjawab{" "}
                  <strong className="text-foreground">
                    {answeredCount} dari {QUIZ_TOTAL_QUESTIONS} soal
                  </strong>
                  .{" "}
                  {unansweredCount > 0 ? (
                    <span className="text-amber-800 dark:text-amber-300 font-semibold">
                      Masih ada {unansweredCount} soal yang kosong!{" "}
                    </span>
                  ) : (
                    <span>Semua soal sudah terisi. </span>
                  )}
                  Setelah dikirim, jawaban dikunci dan skor akhir serta pembahasan langsung muncul.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-[#FCD34D]/60 dark:border-amber-900/50">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConfirmFinishOpen(false)}
                className="bg-background hover:bg-muted"
              >
                Kembali Periksa Soal
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleFinalizeQuiz}
                className="gap-1.5 bg-[#113057] text-white hover:bg-[#0A2342] shadow-xs"
              >
                <CheckCircle2 className="h-4 w-4" />
                Ya, Kirim Jawaban Sekarang
              </Button>
            </div>
          </div>
        )}

        {/* Layout 2 Kolom: Soal Aktif (Kiri) & Navigasi Nomor 1-20 (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Kolom Kiri: Kartu Soal Aktif */}
          <Card className="lg:col-span-8 min-w-0 shadow-xs">
            <CardHeader className="pb-3 border-b">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#113057] text-white text-xs font-mono font-bold">
                    {currentIdx + 1}
                  </span>
                  <Badge variant="secondary" className="text-[11px]">
                    Pilihan Ganda
                  </Badge>
                  <Badge variant="outline" className="text-[11px] font-mono">
                    {QUIZ_POINTS_PER_QUESTION} Poin
                  </Badge>
                </div>

                {currentQuestion.contextIp && (
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border bg-muted/50 text-foreground">
                    {currentQuestion.contextIp}
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base font-bold text-foreground leading-relaxed pt-3">
                {currentQuestion.question}
              </p>
            </CardHeader>

            <CardContent className="pt-5 flex flex-col gap-5">
              {/* Pilihan Jawaban A, B, C, D (Kunci Dirahasiakan Selama Ujian) */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQuestion.options.map((optText, optIdx) => {
                  const isSelected = chosenOption === optIdx
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() =>
                        handleSelectOption(currentQuestion.id, optIdx)
                      }
                      className={cn(
                        "text-left rounded-xl border p-3.5 text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer",
                        isSelected
                          ? "border-[#113057] bg-[#113057]/10 text-[#0A2342] font-semibold ring-1 ring-[#113057]/30 dark:bg-[#113057]/25 dark:text-white"
                          : "border-border bg-background hover:bg-muted/50 text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold border",
                            isSelected
                              ? "bg-[#113057] text-white border-[#113057]"
                              : "bg-muted/50 text-foreground border-border"
                          )}
                        >
                          {OPTION_LETTERS[optIdx]}
                        </span>
                        <span className="font-mono leading-snug break-words">
                          {optText}
                        </span>
                      </div>

                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-[#113057] dark:text-[#60A5FA]" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Navigasi Bawah Soal: Sebelumnya, Ragu-ragu, Berikutnya */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentIdx === 0}
                  onClick={() => handleGoToQuestion(currentIdx - 1)}
                  className="gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Sebelumnya
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleFlag(currentQuestion.id)}
                  className={cn(
                    "gap-1.5",
                    isFlagged &&
                      "border-amber-400 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300"
                  )}
                >
                  <Flag className="h-3.5 w-3.5" />
                  {isFlagged ? "Ditandai Ragu-ragu" : "Tandai Ragu-ragu"}
                </Button>

                {currentIdx < QUIZ_TOTAL_QUESTIONS - 1 ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleGoToQuestion(currentIdx + 1)}
                    className="gap-1.5 bg-[#113057] text-white hover:bg-[#0A2342]"
                  >
                    Soal Berikutnya
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setConfirmFinishOpen(true)}
                    className="gap-1.5 bg-[#FFB61E] text-[#0A2342] font-semibold hover:bg-[#F59E0B]"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Selesaikan Kuis
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Kolom Kanan: Panel Navigasi Nomor Soal (1 - 20) */}
          <Card className="lg:col-span-4 min-w-0 shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>Navigasi Nomor Soal</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {answeredCount}/{QUIZ_TOTAL_QUESTIONS} Terisi
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 flex flex-col gap-4">
              <div className="grid grid-cols-5 gap-2">
                {activeQuestions.map((q, idx) => {
                  const isCurrent = idx === currentIdx
                  const isAnswered = activeDraft.answers[q.id] !== undefined
                  const isQFlagged = activeDraft.flaggedIds.includes(q.id)

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleGoToQuestion(idx)}
                      className={cn(
                        "h-9 rounded-lg font-mono text-xs font-bold border transition-all flex items-center justify-center cursor-pointer",
                        isQFlagged
                          ? "border-amber-400 bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200"
                          : isAnswered
                            ? "border-[#113057] bg-[#113057] text-white"
                            : "border-border bg-muted/40 text-muted-foreground hover:text-foreground",
                        isCurrent && "ring-2 ring-[#FFB61E] ring-offset-2"
                      )}
                      title={`Soal ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  )
                })}
              </div>

              {/* Keterangan Warna Status Soal */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs bg-[#113057] inline-block shrink-0" />
                  <span>Terjawab</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs bg-amber-200 border border-amber-400 inline-block shrink-0" />
                  <span>Ragu-ragu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs bg-muted border inline-block shrink-0" />
                  <span>Kosong</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setConfirmFinishOpen(true)}
                className="w-full gap-1.5 bg-[#113057] text-white hover:bg-[#0A2342] mt-1"
              >
                <Send className="h-3.5 w-3.5" />
                Selesaikan & Kirim Kuis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // LAYAR 3: HASIL EVALUASI & PEMBAHASAN 20 SOAL (POST-QUIZ)
  // ==========================================================================
  if (view === "results") {
    const viewingRecord =
      selectedResultTab === "remedial" && quizProgress.remedialAttempt
        ? quizProgress.remedialAttempt
        : (quizProgress.mainAttempt ?? quizProgress.remedialAttempt)

    if (viewingRecord) {
      const reviewQuestions = selectQuizQuestions(viewingRecord.seed)
      const canTakeRemedial =
        !quizProgress.passed && quizProgress.remedialAttempt === null

      return (
        <div className="flex flex-col gap-6">
          {/* Kartu Ringkasan Skor Evaluasi (Highlight Hijau) */}
          <section
            className={cn(
              "rounded-2xl border p-6 shadow-xs flex flex-col gap-5",
              viewingRecord.passed
                ? "border-[#86EFAC] bg-[#DCFCE7]/40 dark:border-emerald-800 dark:bg-emerald-950/30"
                : "border-[#FCD34D] bg-[#FEF3C7]/45 dark:border-amber-800 dark:bg-amber-950/25"
            )}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="flex flex-col gap-1.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  Hasil Evaluasi Kuis IPv4 & Subnetting Kelas C
                </h1>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {viewingRecord.passed
                    ? "Selamat! Kamu lolos batas minimum (KKM 75). Cek rincian nilai dan pembahasan ke-20 soal di bawah ini."
                    : canTakeRemedial
                      ? "Skor kesempatan pertama masih di bawah KKM 75 (minimal 15 soal benar). Baca pembahasannya dulu, lalu ambil 1x Kesempatan Remedial."
                      : "Semua kesempatan kuis sudah dipakai. Tinjau lagi pembahasan di bawah ini untuk mengulas jawabanmu."}
                </p>
              </div>

              {/* Tombol Aksi */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setView("portal")}
                  className="gap-1.5 text-xs"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Lihat Ketentuan & Portal Kuis
                </Button>

                {canTakeRemedial && (
                  <Button
                    type="button"
                    onClick={() => handleStartQuizConfirmed("remedial")}
                    className="gap-1.5 bg-[#113057] text-white hover:bg-[#0A2342]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Ambil Kuis Remedial (Kesempatan Terakhir: 1x)
                  </Button>
                )}
              </div>
            </div>

            {/* 4 Statistik Metrik Ujian */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/60">
              <div className="rounded-xl border bg-background/90 p-3 flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground">
                  Skor Tercapai (KKM 75)
                </span>
                <span
                  className={cn(
                    "text-base font-mono font-extrabold",
                    viewingRecord.passed
                      ? "text-[#166534] dark:text-emerald-400"
                      : "text-amber-700 dark:text-amber-400"
                  )}
                >
                  {viewingRecord.score} / 100 Poin
                </span>
              </div>
              <div className="rounded-xl border bg-background/90 p-3 flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground">
                  Jawaban Benar (@5 Poin)
                </span>
                <span className="text-base font-mono font-extrabold text-[#166534] dark:text-emerald-400">
                  {viewingRecord.correctCount} dari {QUIZ_TOTAL_QUESTIONS} Soal
                </span>
              </div>
              <div className="rounded-xl border bg-background/90 p-3 flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground">
                  Jawaban Salah / Kosong
                </span>
                <span className="text-base font-mono font-extrabold text-red-700 dark:text-red-400">
                  {QUIZ_TOTAL_QUESTIONS - viewingRecord.correctCount} Soal
                </span>
              </div>
              <div className="rounded-xl border bg-background/90 p-3 flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground">
                  Durasi Pengerjaan
                </span>
                <span className="text-base font-mono font-extrabold text-foreground">
                  {formatDurationReadable(viewingRecord.durationSpentSeconds)}
                </span>
              </div>
            </div>
          </section>

          {/* Daftar Pembahasan Lengkap 20 Butir Soal */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-[#113057]" />
              Ulasan & Pembahasan Lengkap 20 Butir Soal
            </h2>

            {reviewQuestions.map((q, qIdx) => {
              const userChoice = viewingRecord.answers[q.id]
              const isCorrect =
                userChoice !== undefined && Number(userChoice) === q.correctIndex

              return (
                <Card
                  key={q.id}
                  className="shadow-xs bg-card border-border transition-all"
                >
                  <CardHeader className="pb-3 border-b">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#113057] text-white text-xs font-mono font-bold">
                          {qIdx + 1}
                        </span>
                        <Badge variant="secondary" className="text-[11px]">
                          Pilihan Ganda
                        </Badge>
                        {isCorrect ? (
                          <Badge className="bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] text-[11px] hover:bg-[#DCFCE7]">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Benar (+5 Poin)
                          </Badge>
                        ) : (
                          <Badge className="bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5] text-[11px] hover:bg-[#FEE2E2]">
                            <XCircle className="h-3 w-3 mr-1" />
                            Salah (0 Poin)
                          </Badge>
                        )}
                      </div>

                      {q.contextIp && (
                        <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border bg-muted/50 text-foreground">
                          {q.contextIp}
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-base font-bold text-foreground leading-relaxed pt-2">
                      {q.question}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-4 flex flex-col gap-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((optText, optIdx) => {
                        const isSelected = userChoice === optIdx
                        const isOptionCorrect = optIdx === q.correctIndex

                        let optStyle =
                          "border-border bg-muted/20 text-muted-foreground opacity-80"
                        if (isOptionCorrect) {
                          optStyle =
                            "border-[#86EFAC] bg-[#DCFCE7] text-[#166534] font-bold"
                        } else if (isSelected && !isOptionCorrect) {
                          optStyle =
                            "border-[#FCA5A5] bg-[#FEE2E2] text-[#991B1B] font-semibold"
                        }

                        return (
                          <div
                            key={optIdx}
                            className={cn(
                              "rounded-lg border p-3 text-xs flex items-center justify-between gap-2",
                              optStyle
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={cn(
                                  "flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-xs font-bold border",
                                  isOptionCorrect
                                    ? "bg-[#166534] text-white border-[#166534]"
                                    : isSelected && !isOptionCorrect
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

                            {isOptionCorrect && (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#166534]" />
                            )}
                            {isSelected && !isOptionCorrect && (
                              <XCircle className="h-4 w-4 shrink-0 text-[#991B1B]" />
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Kotak Pembahasan */}
                    <div className="rounded-xl border bg-background p-3.5 text-xs flex flex-col gap-2">
                      <span className="font-bold text-[#113057] dark:text-[#60A5FA] uppercase tracking-wider text-[11px]">
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
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Panel Aksi Bawah Setelah Membaca Pembahasan Kuis */}
          <Card className="shadow-xs border-[#113057]/30">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  {viewingRecord.passed
                    ? `Kuis Evaluasi Tuntas (Skor: ${viewingRecord.score}/100 - Lulus KKM 75)`
                    : canTakeRemedial
                      ? `Percobaan 1 Selesai (Skor: ${viewingRecord.score}/100 - Di Bawah KKM 75)`
                      : `Kuis Evaluasi Selesai (Skor Terbaik: ${quizProgress.bestScore}/100)`}
                </span>
                <span className="text-xs text-muted-foreground">
                  {viewingRecord.passed
                    ? "Kamu lulus evaluasi akhir. Jawaban dan pembahasan tetap tersimpan untuk ditinjau kapan saja."
                    : canTakeRemedial
                      ? "Setelah baca pembahasannya, kamu bisa ambil 1x kesempatan Remedial untuk menembus KKM 75."
                      : "Semua 2 kesempatan kuis (Utama & Remedial) sudah terpakai."}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setView("portal")}
                  className="gap-1.5"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Lihat Portal Kuis
                </Button>

                {canTakeRemedial && (
                  <Button
                    type="button"
                    onClick={() => handleStartQuizConfirmed("remedial")}
                    className="gap-1.5 bg-[#113057] text-white hover:bg-[#0A2342]"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Lanjut ke Percobaan 2 (Kuis Remedial - 60 Menit)
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  // ==========================================================================
  // LAYAR 1: PORTAL KETENTUAN PRA-KUIS (DEFAULT VIEW)
  // ==========================================================================
  const hasMainAttempt = quizProgress.mainAttempt !== null
  const hasRemedialAttempt = quizProgress.remedialAttempt !== null
  const canStartRemedial =
    hasMainAttempt && !quizProgress.passed && !hasRemedialAttempt

  return (
    <div className="flex flex-col gap-6">
      {/* Header Portal Kuis */}
      <section className="rounded-2xl border border-[#113057] bg-[#113057] p-5 sm:p-7 text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Portal Kuis Evaluasi Subnetting Kelas C
          </h1>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            Ukur pemahamanmu lewat 20 soal pilihan ganda berdurasi 60 menit. Baca aturannya di bawah dan pastikan latihanmu sudah terbuka sebelum timer dimulai.
          </p>
        </div>

        {/* Kartu Ringkas Status & Highlight Skor Kelulusan Kuis */}
        <div
          className={cn(
            "rounded-xl border p-4 w-full lg:w-auto lg:min-w-[350px] flex items-center justify-between gap-4 text-foreground",
            quizProgress.passed
              ? "border-[#86EFAC] bg-[#DCFCE7] dark:bg-emerald-950/90"
              : "bg-white border-white/15 dark:bg-card dark:border-border"
          )}
        >
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Status Evaluasi (KKM {QUIZ_PASSING_SCORE})
            </span>

            <div>
              {quizProgress.passed ? (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#166534] dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#166534] dark:text-emerald-400" />
                  LULUS EVALUASI
                </span>
              ) : hasMainAttempt ? (
                <span className="text-xs font-bold text-[#92400E] dark:text-[#FFB61E]">
                  Belum Mencapai KKM {QUIZ_PASSING_SCORE}
                </span>
              ) : (
                <span className="text-xs font-semibold text-muted-foreground">
                  Belum Mengikuti Ujian
                </span>
              )}
            </div>

            <div className="h-1.5 w-full rounded-sm bg-muted overflow-hidden">
              <div
                className="h-full bg-[linear-gradient(90deg,#113057_0%,#FFB61E_100%)] transition-all duration-300"
                style={{ width: `${Math.min(quizProgress.bestScore, 100)}%` }}
              />
            </div>

            <span className="text-[11px] font-mono text-muted-foreground">
              {hasMainAttempt
                ? `Utama: ${quizProgress.mainAttempt?.score}/100${hasRemedialAttempt ? ` | Remedial: ${quizProgress.remedialAttempt?.score}/100` : ""}`
                : "1x Utama + 1x Remedial (< 75)"}
            </span>
          </div>

          {/* Highlighted Score Box */}
          <div
            className={cn(
              "rounded-lg border px-3.5 py-2.5 flex flex-col items-center justify-center shrink-0 min-w-[90px]",
              quizProgress.passed
                ? "border-[#166534]/30 bg-white/80 text-[#166534] dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-700"
                : hasMainAttempt
                  ? "border-[#FFB61E] bg-[#FFB61E]/20 text-[#92400E] dark:bg-[#FFB61E]/20 dark:text-[#FFB61E]"
                  : "border-border bg-muted/40 text-muted-foreground"
            )}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
              Skor Kuis
            </span>
            <div className="flex items-baseline gap-0.5 font-mono">
              <span className="text-2xl font-extrabold leading-none">
                {hasMainAttempt ? quizProgress.bestScore : "-"}
              </span>
              <span className="text-[11px] font-semibold opacity-75">/100</span>
            </div>
          </div>
        </div>
      </section>

      {/* Kartu Peringatan Prasyarat Kuis (Hanya Tampil Jika Kuis Masih Terkunci / Belum Mengerjakan Latihan) */}
      {!hasCompletedPractice && (
        <Card className="shadow-xs border-[#FCD34D] bg-[#FEF3C7]/40 dark:bg-amber-950/20">
          <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#FCD34D] bg-[#FEF3C7] text-[#92400E]">
                <Lock className="h-5 w-5" />
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-sm sm:text-base font-extrabold text-foreground">
                  Kuis Evaluasi Masih Terkunci - Prasyarat Latihan Belum Terpenuhi
                </h2>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Untuk membuka tombol Mulai Kuis Evaluasi, selesaikan minimal 1 percobaan (10 soal) di modul Latihan dulu.
                </p>
              </div>
            </div>

            <Link
              href="/latihan"
              className={cn(
                buttonVariants({ size: "default" }),
                "gap-1.5 bg-[#113057] text-white hover:bg-[#0A2342] shrink-0"
              )}
            >
              <PencilLine className="h-4 w-4" />
              Buka Modul Latihan Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* 4 Kartu Informasi Spesifikasi Kuis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#113057]/10 text-[#113057] border border-[#113057]/25 dark:bg-[#113057]/20 dark:border-[#113057]/40 dark:text-[#60A5FA]">
              <ClipboardCheck className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Jumlah & Bobot Soal</span>
              <span className="text-sm font-extrabold text-foreground">
                {QUIZ_TOTAL_QUESTIONS} Soal Pilihan Ganda
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                @{QUIZ_POINTS_PER_QUESTION} Poin / Soal (Total 100)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#113057]/10 text-[#113057] border border-[#113057]/25 dark:bg-[#113057]/30 dark:border-[#113057]/50 dark:text-[#93C5FD]">
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Alokasi Waktu Ujian</span>
              <span className="text-sm font-extrabold text-foreground">
                {QUIZ_DURATION_MINUTES} Menit (1 Jam)
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Countdown Timer & Auto-Submit
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300">
              <Award className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Batas Kelulusan (KKM)</span>
              <span className="text-sm font-extrabold text-foreground">
                Minimal Skor {QUIZ_PASSING_SCORE} / 100
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Minimal 15 Soal Dijawab Benar
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/50 dark:border-indigo-800 dark:text-indigo-300">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Kebijakan Percobaan</span>
              <span className="text-sm font-extrabold text-foreground">
                1x Utama + 1x Remedial
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Remedial jika skor awal &lt; {QUIZ_PASSING_SCORE}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kartu Ketentuan Resmi & Tombol Mulai Kuis */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#113057]" />
            Ketentuan & Tata Tertib Pengerjaan Kuis
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4 flex flex-col gap-5">
          <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-foreground/90">
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#113057]/10 text-[#113057] dark:bg-[#113057]/25 dark:text-[#60A5FA] text-xs font-bold mt-0.5">
                1
              </span>
              <span className="leading-relaxed">
                <strong>Syarat Pembuka Kuis:</strong> Selesaikan minimal <strong>1 kali percobaan</strong> di halaman Latihan agar tombol mulai kuis aktif.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#113057]/10 text-[#113057] dark:bg-[#113057]/25 dark:text-[#60A5FA] text-xs font-bold mt-0.5">
                2
              </span>
              <span className="leading-relaxed">
                <strong>Waktu Pengerjaan 60 Menit:</strong> Timer langsung berjalan begitu kamu konfirmasi mulai. Jika waktu habis, jawaban otomatis terkirim (<em>Auto-Submit</em>).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#113057]/10 text-[#113057] dark:bg-[#113057]/25 dark:text-[#60A5FA] text-xs font-bold mt-0.5">
                3
              </span>
              <span className="leading-relaxed">
                <strong>Kerahasiaan Kunci & Pembahasan:</strong> Selama ujian berlangsung, kunci jawaban dan pembahasan disembunyikan. Semua pembahasan terbuka setelah kuis dikirim.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#113057]/10 text-[#113057] dark:bg-[#113057]/25 dark:text-[#60A5FA] text-xs font-bold mt-0.5">
                4
              </span>
              <span className="leading-relaxed">
                <strong>Ketentuan Lulus (KKM {QUIZ_PASSING_SCORE}) & Remedial:</strong> Kamu lulus jika skor minimal <strong>{QUIZ_PASSING_SCORE}/100</strong> (15 soal benar). Jika nilai pertama masih di bawah {QUIZ_PASSING_SCORE}, tersedia <strong>1x Remedial</strong> dengan paket soal acak baru.
              </span>
            </li>
          </ul>

          {/* Riwayat Nilai Jika Sudah Pernah Mengerjakan */}
          {hasMainAttempt && (
            <div className="rounded-xl border bg-muted/30 p-4 flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Riwayat Hasil Kuis Anda
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quizProgress.mainAttempt && (
                  <div className="rounded-lg border bg-card p-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "rounded-md border px-2.5 py-1.5 font-mono text-center min-w-[64px]",
                          quizProgress.mainAttempt.passed
                            ? "border-[#86EFAC] bg-[#DCFCE7] text-[#166534]"
                            : "border-amber-300 bg-amber-50 text-amber-900"
                        )}
                      >
                        <div className="text-[9px] font-bold uppercase opacity-75">
                          Skor
                        </div>
                        <div className="text-base font-extrabold leading-none">
                          {quizProgress.mainAttempt.score}
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-foreground">
                          Kesempatan Utama
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {quizProgress.mainAttempt.correctCount}/20 Soal Benar
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedResultTab("utama")
                        setView("results")
                      }}
                    >
                      Lihat Pembahasan
                    </Button>
                  </div>
                )}

                {quizProgress.remedialAttempt && (
                  <div className="rounded-lg border bg-card p-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "rounded-md border px-2.5 py-1.5 font-mono text-center min-w-[64px]",
                          quizProgress.remedialAttempt.passed
                            ? "border-[#86EFAC] bg-[#DCFCE7] text-[#166534]"
                            : "border-amber-300 bg-amber-50 text-amber-900"
                        )}
                      >
                        <div className="text-[9px] font-bold uppercase opacity-75">
                          Skor
                        </div>
                        <div className="text-base font-extrabold leading-none">
                          {quizProgress.remedialAttempt.score}
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-foreground">
                          Kesempatan Remedial
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {quizProgress.remedialAttempt.correctCount}/20 Soal Benar
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedResultTab("remedial")
                        setView("results")
                      }}
                    >
                      Lihat Pembahasan
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Kotak Konfirmasi Sebelum Timer 60 Menit Dimulai */}
          {confirmStartType && (
            <div
              role="dialog"
              aria-label="Konfirmasi Mulai Kuis"
              className="rounded-xl border-2 border-[#FCD34D] bg-[#FEF3C7]/50 dark:bg-amber-950/30 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-extrabold text-foreground">
                  Siap Memulai{" "}
                  {confirmStartType === "utama"
                    ? "Kuis Utama (20 Soal)"
                    : "Kuis Remedial (20 Soal)"}
                  ?
                </span>
                <span className="text-xs text-muted-foreground">
                  Begitu Anda menekan tombol konfirmasi di samping, timer hitung mundur <strong>60 menit</strong> akan langsung berjalan.
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmStartType(null)}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleStartQuizConfirmed(confirmStartType)}
                  className="gap-1.5 bg-[#113057] text-white hover:bg-[#0A2342]"
                >
                  <PlayCircle className="h-4 w-4" />
                  Ya, Mulai Timer 60 Menit Sekarang
                </Button>
              </div>
            </div>
          )}

          {/* Baris Tombol Utama Portal Kuis */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              {hasMainAttempt && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetQuiz}
                  className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset Riwayat Kuis
                </Button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {!hasCompletedPractice ? (
                <Button
                  type="button"
                  disabled
                  className="gap-2 bg-muted text-muted-foreground border border-border cursor-not-allowed"
                >
                  <Lock className="h-4 w-4" />
                  Terkunci - Selesaikan 1x Latihan Terlebih Dahulu
                </Button>
              ) : !hasMainAttempt ? (
                <Button
                  type="button"
                  onClick={() => setConfirmStartType("utama")}
                  className="gap-2 bg-[#FFB61E] text-[#0A2342] font-semibold hover:bg-[#F59E0B]"
                >
                  <PlayCircle className="h-4 w-4" />
                  Mulai Mengerjakan Kuis (60 Menit)
                </Button>
              ) : canStartRemedial ? (
                <Button
                  type="button"
                  onClick={() => setConfirmStartType("remedial")}
                  className="gap-2 bg-[#113057] text-white hover:bg-[#0A2342]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Ambil Kuis Remedial (Kesempatan Terakhir: 1x)
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedResultTab(
                      quizProgress.remedialAttempt ? "remedial" : "utama"
                    )
                    setView("results")
                  }}
                  className="gap-2 bg-[#113057] text-white hover:bg-[#0A2342]"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Lihat Hasil & Pembahasan Lengkap
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

