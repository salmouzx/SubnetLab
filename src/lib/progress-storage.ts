"use client"

import * as React from "react"
import { MATERIALS_DATA } from "@/data/materials-data"

export const MATERIAL_PROGRESS_KEY = "subnetlab_material_progress_v2"
const PROGRESS_EVENT_NAME = "subnetlab-material-progress-updated"

export interface MaterialQuizRecord {
  score: number // 0, 1, atau 2
  answers: Record<string, number>
  submittedAt: string
}

export interface MaterialProgressState {
  completedSlugs: string[]
  lastAccessedSlug: string | null
  quizRecords: Record<string, MaterialQuizRecord>
  updatedAt: string | null
}

const DEFAULT_PROGRESS: MaterialProgressState = {
  completedSlugs: [],
  lastAccessedSlug: null,
  quizRecords: {},
  updatedAt: null,
}

export function getMaterialProgress(): MaterialProgressState {
  if (typeof window === "undefined") return DEFAULT_PROGRESS
  try {
    const raw = window.localStorage.getItem(MATERIAL_PROGRESS_KEY)
    if (!raw) return DEFAULT_PROGRESS
    const parsed = JSON.parse(raw) as Partial<MaterialProgressState>
    return {
      completedSlugs: Array.isArray(parsed.completedSlugs) ? parsed.completedSlugs : [],
      lastAccessedSlug: typeof parsed.lastAccessedSlug === "string" ? parsed.lastAccessedSlug : null,
      quizRecords:
        parsed.quizRecords && typeof parsed.quizRecords === "object"
          ? (parsed.quizRecords as Record<string, MaterialQuizRecord>)
          : {},
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
    }
  } catch {
    return DEFAULT_PROGRESS
  }
}

export function saveMaterialProgress(nextState: MaterialProgressState): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(MATERIAL_PROGRESS_KEY, JSON.stringify(nextState))
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT_NAME))
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Mencatat hasil pengerjaan kuis pada suatu materi.
 * Materi otomatis berstatus selesai (completed) setelah menekan kirim jawaban.
 */
export function recordMaterialQuizSubmission(
  slug: string,
  score: number,
  answers: Record<string, number>
): MaterialProgressState {
  const current = getMaterialProgress()
  const exists = current.completedSlugs.includes(slug)
  const completedSlugs = exists ? current.completedSlugs : [...current.completedSlugs, slug]

  const updated: MaterialProgressState = {
    completedSlugs,
    lastAccessedSlug: slug,
    quizRecords: {
      ...current.quizRecords,
      [slug]: {
        score,
        answers,
        submittedAt: new Date().toISOString(),
      },
    },
    updatedAt: new Date().toISOString(),
  }
  saveMaterialProgress(updated)
  return updated
}

export function markMaterialAccessed(slug: string): void {
  const current = getMaterialProgress()
  if (current.lastAccessedSlug === slug) return
  saveMaterialProgress({
    ...current,
    lastAccessedSlug: slug,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Menentukan apakah suatu topik terbuka atau masih terkunci.
 * Aturan Alur Berurutan (Sequential Learning Path):
 * - Topik ke-1 (index 0) SELALU terbuka.
 * - Topik ke-N (index > 0) terbuka HANYA jika Topik ke-(N-1) telah selesai (ada di completedSlugs).
 */
export function isTopicUnlocked(slug: string, completedSlugs: string[]): boolean {
  const targetIndex = MATERIALS_DATA.findIndex((m) => m.slug === slug)
  if (targetIndex <= 0) {
    return true // Topik pertama selalu terbuka
  }
  const prerequisiteTopic = MATERIALS_DATA[targetIndex - 1]
  return completedSlugs.includes(prerequisiteTopic.slug)
}

/**
 * Mendapatkan topik prasyarat yang wajib diselesaikan sebelum topik saat ini dapat dibuka.
 */
export function getPrerequisiteTopic(slug: string) {
  const targetIndex = MATERIALS_DATA.findIndex((m) => m.slug === slug)
  if (targetIndex <= 0) return null
  return MATERIALS_DATA[targetIndex - 1]
}

export function useMaterialProgress() {
  const [progress, setProgress] = React.useState<MaterialProgressState>(DEFAULT_PROGRESS)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    let lastRaw = ""

    const syncFromStorage = () => {
      if (typeof window === "undefined") return
      const raw = window.localStorage.getItem(MATERIAL_PROGRESS_KEY) || ""
      if (raw !== lastRaw) {
        lastRaw = raw
        setProgress(getMaterialProgress())
      }
    }

    syncFromStorage()
    setIsLoaded(true)

    window.addEventListener(PROGRESS_EVENT_NAME, syncFromStorage)
    window.addEventListener("storage", syncFromStorage)
    return () => {
      window.removeEventListener(PROGRESS_EVENT_NAME, syncFromStorage)
      window.removeEventListener("storage", syncFromStorage)
    }
  }, [])

  const submitQuiz = React.useCallback(
    (slug: string, score: number, answers: Record<string, number>) => {
      const next = recordMaterialQuizSubmission(slug, score, answers)
      setProgress(next)
      return next
    },
    []
  )

  const setLastAccessed = React.useCallback((slug: string) => {
    setProgress((prev) => {
      if (prev.lastAccessedSlug === slug) return prev
      markMaterialAccessed(slug)
      return {
        ...prev,
        lastAccessedSlug: slug,
      }
    })
  }, [])

  return {
    progress,
    isLoaded,
    submitQuiz,
    setLastAccessed,
  }
}
