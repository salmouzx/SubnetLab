import * as React from "react"
import type { Metadata } from "next"
import { Network } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { SimulatorWorkbench } from "@/components/simulator/simulator-workbench"

export const metadata: Metadata = {
  title: "Simulator IPv4 & Subnetting (Kelas A–E) | SubnetLab IPv4",
  description:
    "Simulator interaktif perhitungan pengalamatan IPv4 Kelas A–E, visualisasi biner 32-bit, operasi bitwise AND/OR, dan pembagian blok subnet.",
}

export default function SimulatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <React.Suspense
          fallback={
            <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
              Memuat Simulator IPv4...
            </div>
          }
        >
          <SimulatorWorkbench />
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

