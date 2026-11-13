"use client"

import * as React from "react"
import { QUIZ_PASSING_SCORE } from "@/data/quiz-questions-data"

export const QUIZ_STORAGE_KEY = "subnetlab_quiz_progress_v1"
const QUIZ_EVENT_NAME = "subnetlab-quiz-progress-updated"

export type QuizAttemptType = "utama" | "remedial"

export interface QuizAttemptRecord {
  attemptType: QuizAttemptType
  seed: number
  score: number // 0 - 100
  correctCount: number // 0 - 20
  totalQuestions: number // 20
  passed: boolean // score >= 75
  durationSpentSeconds: number
  answers: Record<string, number>
  submittedAt: string
}

export interface QuizActiveDraft {
  attemptType: QuizAttemptType
  seed: number
  startedAt: string
  currentQuestionIndex: number
  answers: Record<string, number>
  flaggedIds: string[]
}

export interface QuizProgressState {
  mainAttempt: QuizAttemptRecord | null
  remedialAttempt: QuizAttemptRecord | null
  bestScore: number
  passed: boolean
  activeDraft: QuizActiveDraft | null
  updatedAt: string | null
}

const DEFAULT_QUIZ_STATE: QuizProgressState = {
  mainAttempt: null,
  remedialAttempt: null,
  bestScore: 0,
  passed: false,
  activeDraft: null,
  updatedAt: null,
}

export function getQuizProgress(): QuizProgressState {
  if (typeof window === "undefined") return DEFAULT_QUIZ_STATE
  try {
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY)
    if (!raw) return DEFAULT_QUIZ_STATE
    const parsed = JSON.parse(raw) as Partial<QuizProgressState>
    return {
      mainAttempt: parsed.mainAttempt ?? null,
      remedialAttempt: parsed.remedialAttempt ?? null,
      bestScore: typeof parsed.bestScore === "number" ? parsed.bestScore : 0,
      passed: Boolean(parsed.passed),
      activeDraft: parsed.activeDraft ?? null,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
    }
  } catch {
    return DEFAULT_QUIZ_STATE
  }
}

export function saveQuizProgress(nextState: QuizProgressState): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(nextState))
    window.dispatchEvent(new CustomEvent(QUIZ_EVENT_NAME))
  } catch {
    // Ignore storage quota errors
  }
}

export function startQuizDraft(
  attemptType: QuizAttemptType,
  seed: number
): QuizProgressState {
  const current = getQuizProgress()
  const draft: QuizActiveDraft = {
    attemptType,
    seed,
    startedAt: new Date().toISOString(),
    currentQuestionIndex: 0,
    answers: {},
    flaggedIds: [],
  }
  const nextState: QuizProgressState = {
    ...current,
    activeDraft: draft,
    updatedAt: new Date().toISOString(),
  }
  saveQuizProgress(nextState)
  return nextState
}

export function updateQuizDraft(
  updater: (draft: QuizActiveDraft) => QuizActiveDraft
): QuizProgressState {
  const current = getQuizProgress()
  if (!current.activeDraft) return current
  const updatedDraft = updater(current.activeDraft)
  const nextState: QuizProgressState = {
    ...current,
    activeDraft: updatedDraft,
    updatedAt: new Date().toISOString(),
  }
  saveQuizProgress(nextState)
  return nextState
}

export function finalizeQuizSubmission(record: QuizAttemptRecord): QuizProgressState {
  const current = getQuizProgress()
  const mainAttempt =
    record.attemptType === "utama" ? record : current.mainAttempt
  const remedialAttempt =
    record.attemptType === "remedial" ? record : current.remedialAttempt

  const mainScore = mainAttempt?.score ?? 0
  const remScore = remedialAttempt?.score ?? 0
  const bestScore = Math.max(mainScore, remScore)
  const passed = bestScore >= QUIZ_PASSING_SCORE

  const nextState: QuizProgressState = {
    mainAttempt,
    remedialAttempt,
    bestScore,
    passed,
    activeDraft: null,
    updatedAt: new Date().toISOString(),
  }
  saveQuizProgress(nextState)
  return nextState
}

export function resetAllQuizProgress(): QuizProgressState {
  saveQuizProgress(DEFAULT_QUIZ_STATE)
  return DEFAULT_QUIZ_STATE
}

export function useQuizProgress() {
  const [progress, setProgress] =
    React.useState<QuizProgressState>(DEFAULT_QUIZ_STATE)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    let lastRaw = ""

    const syncFromStorage = () => {
      if (typeof window === "undefined") return
      const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY) || ""
      if (raw !== lastRaw) {
        lastRaw = raw
        setProgress(getQuizProgress())
      }
    }

    syncFromStorage()
    setIsLoaded(true)

    window.addEventListener(QUIZ_EVENT_NAME, syncFromStorage)
    window.addEventListener("storage", syncFromStorage)
    return () => {
      window.removeEventListener(QUIZ_EVENT_NAME, syncFromStorage)
      window.removeEventListener("storage", syncFromStorage)
    }
  }, [])

  const beginQuiz = React.useCallback(
    (attemptType: QuizAttemptType, seed: number) => {
      const next = startQuizDraft(attemptType, seed)
      setProgress(next)
      return next
    },
    []
  )

  const saveDraft = React.useCallback(
    (updater: (draft: QuizActiveDraft) => QuizActiveDraft) => {
      const next = updateQuizDraft(updater)
      setProgress(next)
      return next
    },
    []
  )

  const submitQuiz = React.useCallback((record: QuizAttemptRecord) => {
    const next = finalizeQuizSubmission(record)
    setProgress(next)
    return next
  }, [])

  const resetQuiz = React.useCallback(() => {
    const next = resetAllQuizProgress()
    setProgress(next)
    return next
  }, [])

  return {
    progress,
    isLoaded,
    beginQuiz,
    saveDraft,
    submitQuiz,
    resetQuiz,
  }
}

