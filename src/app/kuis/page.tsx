import * as React from "react"
import type { Metadata } from "next"
import { Network } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { QuizWorkbench } from "@/components/quiz/quiz-workbench"

export const metadata: Metadata = {
  title: "Portal Kuis Evaluasi IPv4 & Subnetting Kelas C | SubnetLab IPv4",
  description:
    "Kuis evaluasi akhir komprehensif pengalamatan IPv4 dan Subnetting Kelas C (20 soal pilihan ganda, waktu 60 menit, KKM 75, dan 1x remedial).",
}

export default function KuisPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <React.Suspense
          fallback={
            <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
              Memuat Portal Kuis Evaluasi...
            </div>
          }
        >
          <QuizWorkbench />
        </React.Suspense>
      </main>

      <footer className="mt-auto border-t bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-[#113057]" />
            <span className="font-semibold text-foreground">SubnetLab IPv4</span>
          </div>
          <p>Platform Belajar & Simulasi Subnetting IPv4 - Paham Logika, Bukan Hafalan Rumus.</p>
        </div>
      </footer>
    </div>
  )
}

