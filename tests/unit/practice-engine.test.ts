import { describe, expect, it } from "vitest"
import {
  PRACTICE_CATEGORIES,
  PRACTICE_MAX_ATTEMPTS,
  PRACTICE_PASSING_SCORE,
  PRACTICE_QUESTIONS_BANK,
  PRACTICE_SESSION_SIZE,
  checkPracticeAnswer,
  selectPracticeSessionQuestions,
} from "@/data/practice-questions-data"

describe("Practice Questions Bank & Grading Engine (Part 5)", () => {
  it("memiliki 9 kategori latihan inti Kelas C sesuai spesifikasi PRD", () => {
    expect(PRACTICE_CATEGORIES).toHaveLength(9)
    expect(PRACTICE_SESSION_SIZE).toBe(10)
    expect(PRACTICE_PASSING_SCORE).toBe(70)
    expect(PRACTICE_MAX_ATTEMPTS).toBe(3)
  })

  it("memiliki minimal 12 soal per kategori sehingga setiap sesi 10 soal selalu bervariasi", () => {
    for (const cat of PRACTICE_CATEGORIES) {
      const catQuestions = PRACTICE_QUESTIONS_BANK.filter(
        (q) => q.categoryId === cat.id
      )
      expect(catQuestions.length).toBeGreaterThanOrEqual(12)
    }
  })

  it("selalu mengembalikan tepat 10 soal unik untuk setiap kombinasi kategori dan tingkat kesulitan", () => {
    const scopes = ["semua" as const, ...PRACTICE_CATEGORIES.map((c) => c.id)]
    const diffs = ["Semua" as const, "Mudah" as const, "Menengah" as const, "Sulit" as const]

    for (const scope of scopes) {
      for (const diff of diffs) {
        const session = selectPracticeSessionQuestions(scope, diff, 1)
        expect(session).toHaveLength(10)
        const uniqueIds = new Set(session.map((q) => q.id))
        expect(uniqueIds.size).toBe(10)
      }
    }
  })

  it("mengacak urutan/kombinasi soal ketika berpindah dari percobaan 1 ke percobaan 2 dan 3", () => {
    const attempt1 = selectPracticeSessionQuestions("subnetting", "Semua", 101)
    const attempt2 = selectPracticeSessionQuestions("subnetting", "Semua", 202)
    const ids1 = attempt1.map((q) => q.id).join(",")
    const ids2 = attempt2.map((q) => q.id).join(",")
    expect(ids1).not.toBe(ids2)
  })

  it("memvalidasi jawaban pilihan ganda dan isian singkat secara akurat", () => {
    const mcQuestion = PRACTICE_QUESTIONS_BANK.find(
      (q) => q.type === "multiple_choice"
    )!
    expect(checkPracticeAnswer(mcQuestion, mcQuestion.correctIndex)).toBe(true)
    expect(
      checkPracticeAnswer(mcQuestion, ((mcQuestion.correctIndex ?? 0) + 1) % 4)
    ).toBe(false)

    const saQuestion = PRACTICE_QUESTIONS_BANK.find(
      (q) => q.type === "short_answer"
    )!
    const validText = saQuestion.acceptedAnswers![0]
    expect(checkPracticeAnswer(saQuestion, `  ${validText.toUpperCase()}  `)).toBe(
      true
    )
    expect(checkPracticeAnswer(saQuestion, "jawaban-salah-999")).toBe(false)
    expect(checkPracticeAnswer(saQuestion, "")).toBe(false)
  })
})

