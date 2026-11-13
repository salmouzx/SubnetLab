"use client"

import * as React from "react"
import {
  PRACTICE_PASSING_SCORE,
  type PracticeCategoryId,
} from "@/data/practice-questions-data"

export const PRACTICE_STORAGE_KEY = "subnetlab_practice_progress_v1"
const PRACTICE_EVENT_NAME = "subnetlab-practice-progress-updated"

export type PracticeScopeKey = PracticeCategoryId | "semua"

export interface PracticeAttemptEntry {
  attemptNumber: number // 1, 2, atau 3
  score: number // 0 - 100
  correctCount: number // 0 - 10
  totalQuestions: number // 10
  passed: boolean // score >= 70
  submittedAt: string
  seed?: number
  answers?: Record<string, number | string>
}

export interface PracticeCategoryRecord {
  scopeKey: PracticeScopeKey
  attemptsUsed: number // 0..3 dalam siklus saat ini
  bestScore: number // 0..100
  lastScore: number | null
  passed: boolean // true jika pernah mencapai >= 70
  history: PracticeAttemptEntry[]
  updatedAt: string
}

export interface PracticeProgressState {
  records: Record<string, PracticeCategoryRecord>
  updatedAt: string | null
}

const DEFAULT_PRACTICE_STATE: PracticeProgressState = {
  records: {},
  updatedAt: null,
}

export function getPracticeProgress(): PracticeProgressState {
  if (typeof window === "undefined") return DEFAULT_PRACTICE_STATE
  try {
    const raw = window.localStorage.getItem(PRACTICE_STORAGE_KEY)
    if (!raw) return DEFAULT_PRACTICE_STATE
    const parsed = JSON.parse(raw) as Partial<PracticeProgressState>
    return {
      records:
        parsed.records && typeof parsed.records === "object"
          ? (parsed.records as Record<string, PracticeCategoryRecord>)
          : {},
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
    }
  } catch {
    return DEFAULT_PRACTICE_STATE
  }
}

export function savePracticeProgress(nextState: PracticeProgressState): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(nextState))
    window.dispatchEvent(new CustomEvent(PRACTICE_EVENT_NAME))
  } catch {
    // Ignore storage quota errors
  }
}

export function recordPracticeAttempt(
  scopeKey: PracticeScopeKey,
  correctCount: number,
  totalQuestions: number = 10,
  seed?: number,
  answers?: Record<string, number | string>
): PracticeProgressState {
  const current = getPracticeProgress()
  const existing = current.records[scopeKey]

  const score = Math.round((correctCount / totalQuestions) * 100)
  const passedNow = score >= PRACTICE_PASSING_SCORE
  const nextAttemptNumber = existing ? Math.min(existing.attemptsUsed + 1, 3) : 1

  const entry: PracticeAttemptEntry = {
    attemptNumber: nextAttemptNumber,
    score,
    correctCount,
    totalQuestions,
    passed: passedNow,
    submittedAt: new Date().toISOString(),
    seed: seed ?? nextAttemptNumber,
    answers: answers ?? {},
  }

  // Filter out any old entry with the same attemptNumber in the current cycle so attemptNumber 1..3 is unique
  const existingHistory = existing?.history ?? []
  const filteredHistory = existingHistory.filter(
    (h) => h.attemptNumber !== nextAttemptNumber
  )

  const updatedRecord: PracticeCategoryRecord = {
    scopeKey,
    attemptsUsed: nextAttemptNumber,
    bestScore: existing ? Math.max(existing.bestScore, score) : score,
    lastScore: score,
    passed: existing ? existing.passed || passedNow : passedNow,
    history: [...filteredHistory, entry],
    updatedAt: new Date().toISOString(),
  }

  const nextState: PracticeProgressState = {
    records: {
      ...current.records,
      [scopeKey]: updatedRecord,
    },
    updatedAt: new Date().toISOString(),
  }

  savePracticeProgress(nextState)
  return nextState
}

/**
 * Mereset jatah 3x kesempatan pada suatu kategori jika siswa ingin mengulang siklus latihan dari percobaan 1/3,
 * dengan tetap mempertahankan status `passed` dan `bestScore` historis jika sudah pernah lulus.
 */
export function resetPracticeCycle(scopeKey: PracticeScopeKey): PracticeProgressState {
  const current = getPracticeProgress()
  const existing = current.records[scopeKey]
  if (!existing) return current

  const nextState: PracticeProgressState = {
    records: {
      ...current.records,
      [scopeKey]: {
        ...existing,
        attemptsUsed: 0,
        lastScore: null,
        history: [],
        updatedAt: new Date().toISOString(),
      },
    },
    updatedAt: new Date().toISOString(),
  }

  savePracticeProgress(nextState)
  return nextState
}

export function usePracticeProgress() {
  const [progress, setProgress] = React.useState<PracticeProgressState>(DEFAULT_PRACTICE_STATE)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    let lastRaw = ""

    const syncFromStorage = () => {
      if (typeof window === "undefined") return
      const raw = window.localStorage.getItem(PRACTICE_STORAGE_KEY) || ""
      if (raw !== lastRaw) {
        lastRaw = raw
        setProgress(getPracticeProgress())
      }
    }

    syncFromStorage()
    setIsLoaded(true)

    window.addEventListener(PRACTICE_EVENT_NAME, syncFromStorage)
    window.addEventListener("storage", syncFromStorage)
    return () => {
      window.removeEventListener(PRACTICE_EVENT_NAME, syncFromStorage)
      window.removeEventListener("storage", syncFromStorage)
    }
  }, [])

  const submitPracticeSession = React.useCallback(
    (
      scopeKey: PracticeScopeKey,
      correctCount: number,
      totalQuestions: number = 10,
      seed?: number,
      answers?: Record<string, number | string>
    ) => {
      const next = recordPracticeAttempt(
        scopeKey,
        correctCount,
        totalQuestions,
        seed,
        answers
      )
      setProgress(next)
      return next
    },
    []
  )

  const resetCycle = React.useCallback((scopeKey: PracticeScopeKey) => {
    const next = resetPracticeCycle(scopeKey)
    setProgress(next)
    return next
  }, [])

  return {
    progress,
    isLoaded,
    submitPracticeSession,
    resetCycle,
  }
}

