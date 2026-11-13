import * as React from "react"
import type { Metadata } from "next"
import { Network } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { PracticeWorkbench } from "@/components/practice/practice-workbench"

export const metadata: Metadata = {
  title: "Bank Latihan Interaktif IPv4 Kelas C | SubnetLab IPv4",
  description:
    "Latihan interaktif pengalamatan IPv4 dan Subnetting Kelas C (10 soal per sesi, KKM 70, 3x kesempatan, dan pembahasan langkah demi langkah).",
}

export default function LatihanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <React.Suspense
          fallback={
            <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
              Memuat Bank Latihan Interaktif...
            </div>
          }
        >
          <PracticeWorkbench />
        </React.Suspense>
      </main>

      <footer className="mt-auto border-t bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold text-foreground">SubnetLab IPv4</span>
          </div>
          <p>Interactive IPv4 Learning & Simulation Platform</p>
        </div>
      </footer>
    </div>
  )
}

