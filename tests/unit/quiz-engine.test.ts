import { describe, expect, it } from "vitest"
import {
  QUIZ_DURATION_MINUTES,
  QUIZ_DURATION_SECONDS,
  QUIZ_PASSING_SCORE,
  QUIZ_POINTS_PER_QUESTION,
  QUIZ_QUESTIONS_BANK,
  QUIZ_TOTAL_QUESTIONS,
  evaluateQuizSubmission,
  selectQuizQuestions,
} from "@/data/quiz-questions-data"

describe("Quiz Questions Bank & Evaluation Engine (Part 6)", () => {
  it("memiliki parameter spesifikasi kuis sesuai kesepakatan (20 soal, 60 menit, KKM 75, @5 poin)", () => {
    expect(QUIZ_TOTAL_QUESTIONS).toBe(20)
    expect(QUIZ_POINTS_PER_QUESTION).toBe(5)
    expect(QUIZ_PASSING_SCORE).toBe(75)
    expect(QUIZ_DURATION_MINUTES).toBe(60)
    expect(QUIZ_DURATION_SECONDS).toBe(3600)
    expect(QUIZ_QUESTIONS_BANK.length).toBeGreaterThanOrEqual(30)
  })

  it("mencakup seluruh 12 topik pembelajaran Kelas C di dalam bank soal kuis", () => {
    const topicsCovered = new Set(QUIZ_QUESTIONS_BANK.map((q) => q.topicOrder))
    for (let t = 1; t <= 12; t++) {
      expect(topicsCovered.has(t)).toBe(true)
    }
  })

  it("mengambil tepat 20 soal unik dan memberikan set soal berbeda antara Utama (seed 101) dan Remedial (seed 202)", () => {
    const mainQuestions = selectQuizQuestions(101)
    const remedialQuestions = selectQuizQuestions(202)

    expect(mainQuestions).toHaveLength(20)
    expect(remedialQuestions).toHaveLength(20)

    const mainIds = mainQuestions.map((q) => q.id).join(",")
    const remedialIds = remedialQuestions.map((q) => q.id).join(",")
    expect(mainIds).not.toBe(remedialIds)
  })

  it("menilai kelulusan dengan tepat pada batas KKM 75 (15 benar = 75 lulus, 14 benar = 70 belum lulus)", () => {
    const questions = selectQuizQuestions(101)

    // 15 benar -> skor 75 -> passed = true
    const answers15: Record<string, number> = {}
    questions.forEach((q, idx) => {
      answers15[q.id] = idx < 15 ? q.correctIndex : (q.correctIndex + 1) % 4
    })
    const res15 = evaluateQuizSubmission(questions, answers15)
    expect(res15.correctCount).toBe(15)
    expect(res15.score).toBe(75)
    expect(res15.passed).toBe(true)

    // 14 benar -> skor 70 -> passed = false
    const answers14: Record<string, number> = {}
    questions.forEach((q, idx) => {
      answers14[q.id] = idx < 14 ? q.correctIndex : (q.correctIndex + 1) % 4
    })
    const res14 = evaluateQuizSubmission(questions, answers14)
    expect(res14.correctCount).toBe(14)
    expect(res14.score).toBe(70)
    expect(res14.passed).toBe(false)
  })
})

