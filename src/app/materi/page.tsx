import type { Metadata } from "next"
import { Network } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { MaterialCatalog } from "@/components/materi/material-catalog"

export const metadata: Metadata = {
  title: "Materi IPv4 & Subnetting Kelas C (12 Topik) | SubnetLab IPv4",
  description:
    "Kurikulum terstruktur 12 topik pembelajaran pengalamatan IPv4 Kelas C, representasi biner 8-bit, Subnet Mask, CIDR, hingga perhitungan subnetting.",
}

export default function MateriIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <MaterialCatalog />
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

