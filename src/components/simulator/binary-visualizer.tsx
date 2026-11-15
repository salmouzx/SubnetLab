"use client"

import * as React from "react"
import { Binary, Layers } from "lucide-react"

import type { IPv4CalculationResult } from "@/features/ipv4"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface BinaryVisualizerProps {
  result: IPv4CalculationResult
}

export function BinaryVisualizer({ result }: BinaryVisualizerProps) {
  const [showBitwiseMatrix, setShowBitwiseMatrix] = React.useState(true)

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Empat Kartu Rincian Oktet & Masking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {result.octetBreakdowns.map((oct) => {
          const isInteresting = oct.octetIndex === result.interestingOctet
          return (
            <div
              key={oct.octetIndex}
              className={cn(
                "rounded-xl border bg-card p-3.5 shadow-xs transition-all",
                isInteresting &&
                  result.classification.isUnicastCalculable &&
                  "ring-1 ring-[#FFB61E]/70 border-[#FFB61E]"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  {oct.roleLabel}
                </span>
                {isInteresting && result.classification.isUnicastCalculable && (
                  <Badge
                    variant="outline"
                    className="text-[10px] h-4 px-1.5 border-[#FFB61E] bg-[#FFB61E]/20 text-[#92400E] dark:bg-[#FFB61E]/20 dark:border-[#FFB61E] dark:text-[#FFB61E]"
                  >
                    Oktet Aktif
                  </Badge>
                )}
              </div>

              <div className="text-lg font-bold font-mono tracking-wider text-center text-foreground py-1 rounded bg-muted/40">
                {oct.ipBinary}
              </div>

              <div className="mt-2 pt-2 border-t flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>
                  IP: <strong className="text-foreground">{oct.ipDecimal}</strong>
                </span>
                <span>
                  Mask: <strong className="text-foreground">{oct.maskDecimal}</strong>
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>Mask Bin:</span>
                <span className="tracking-widest text-foreground">{oct.maskBinary}</span>
              </div>

              {result.classification.isUnicastCalculable && (
                <div className="mt-1.5 pt-1.5 border-t flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#113057] dark:text-[#93C5FD]">
                    Net: <strong>{oct.networkDecimal}</strong>
                  </span>
                  <span className="text-amber-600 dark:text-amber-400">
                    Bcast: <strong>{oct.broadcastDecimal}</strong>
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 2. Struktur 32-Bit Linear & Bitwise Operation Matrix */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Binary className="h-4 w-4 text-[#113057]" />
              Struktur 32-Bit Linear & Pemisahan Bit (Network / Subnet / Host)
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Setiap kotak merepresentasikan 1 bit dari total 32-bit alamat IPv4 disertai penanda batas prefix /{result.prefix}.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBitwiseMatrix((prev) => !prev)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-md border font-medium transition-colors inline-flex items-center gap-1.5",
                showBitwiseMatrix
                  ? "border-[#113057] bg-[#113057]/10 text-[#113057] dark:bg-[#113057]/20 dark:text-[#60A5FA]"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              {showBitwiseMatrix ? "Sembunyikan Tabel Bitwise AND/OR" : "Tampilkan Tabel Bitwise AND/OR"}
            </button>
            <Badge
              variant="outline"
              className="font-mono text-xs border-[#113057]/30 bg-[#113057]/10 text-[#113057] dark:bg-[#113057]/20 dark:border-[#113057]/40 dark:text-[#60A5FA]"
            >
              Mask: {result.subnetMask} (/{result.prefix})
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-4 flex flex-col gap-4">
          {/* 32-Bit Linear Bar dengan pemisah per oktet dan batas prefix */}
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-1 min-w-[760px] justify-between">
              {result.linearBits.map((bit, idx) => {
                const isOctetBoundary = bit.bitNumber % 8 === 0 && bit.bitNumber < 32
                const isPrefixBoundary = bit.bitNumber === result.prefix && result.prefix > 0 && result.prefix < 32

                let boxClass =
                  "border-[#D97706] bg-[#FFB61E] text-[#113057] font-bold shadow-xs"
                let roleTitle = "Host Bit (Kuning)"

                if (bit.role === "network") {
                  boxClass =
                    "border-slate-300 bg-slate-100 text-slate-800 font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  roleTitle = "Default Network Bit"
                } else if (bit.role === "subnet") {
                  boxClass =
                    "border-[#15803D] bg-[#16A34A] text-white font-bold shadow-xs"
                  roleTitle = "Bit Pinjam Subnet (Hijau)"
                }

                return (
                  <React.Fragment key={bit.bitNumber}>
                    <div className="flex flex-col items-center flex-1 max-w-[28px]">
                      <span className="text-[9px] font-mono text-muted-foreground mb-0.5 select-none">
                        {bit.bitNumber}
                      </span>
                      <div
                        className={cn(
                          "w-full aspect-square flex items-center justify-center rounded border text-xs font-mono",
                          boxClass
                        )}
                        title={`Bit ke-${bit.bitNumber} (Oktet ${bit.octetIndex}): ${roleTitle} | Nilai IP=${bit.value}, Mask=${bit.maskBit}`}
                      >
                        {bit.value}
                      </div>
                      <span className="text-[8px] font-mono uppercase text-muted-foreground mt-0.5 select-none">
                        {bit.role === "network" ? "N" : bit.role === "subnet" ? "S" : "H"}
                      </span>
                    </div>

                    {/* Garis Batas Prefix (/n) */}
                    {isPrefixBoundary && (
                      <div
                        className="flex flex-col items-center justify-center px-0.5 self-stretch"
                        title={`Batas Prefix CIDR /${result.prefix}`}
                      >
                        <span className="text-[9px] font-mono font-bold text-[#113057] dark:text-[#93C5FD]">
                          /{result.prefix}
                        </span>
                        <div className="w-0.5 flex-1 bg-[#113057] dark:bg-[#93C5FD] rounded-full my-0.5" />
                      </div>
                    )}

                    {/* Pemisah Titik Antar Oktet */}
                    {isOctetBoundary && !isPrefixBoundary && (
                      <div
                        key={`sep-${idx}`}
                        className="flex items-center justify-center px-0.5 text-muted-foreground font-mono font-bold select-none"
                      >
                        .
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          {/* Legend dengan Teks & Simbol (Tanpa Bergantung pada Warna Saja - WCAG 2.2 AA) */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs border border-slate-300 bg-slate-100 dark:bg-slate-800 inline-flex items-center justify-center text-[9px] font-mono font-bold text-slate-700 dark:text-slate-200">
                  N
                </span>
                Default Network ({Math.min(result.defaultNetworkBits, result.prefix)} bit)
              </span>
              <span className="flex items-center gap-1.5 text-[#15803D] dark:text-green-400 font-medium">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#16A34A] text-white inline-flex items-center justify-center text-[9px] font-mono font-bold">
                  S
                </span>
                Bit Pinjam Subnet ({result.borrowedSubnetBits} bit)
              </span>
              <span className="flex items-center gap-1.5 text-[#92400E] dark:text-[#FFB61E] font-medium">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#FFB61E] text-[#113057] inline-flex items-center justify-center text-[9px] font-mono font-bold">
                  H
                </span>
                Bit Host ({result.hostBits} bit)
              </span>
            </div>
            <span className="font-mono text-[11px]">
              Total: {result.networkBits} bit Network Aktif + {result.hostBits} bit Host = 32 bit
            </span>
          </div>

          {/* Tabel Operasi Logika Bitwise AND & OR */}
          {showBitwiseMatrix && (
            <div className="rounded-xl border bg-muted/30 p-3.5 overflow-x-auto">
              <div className="text-xs font-semibold text-foreground mb-2">
                Penyelarasan Biner 32-Bit (Operasi Bitwise AND untuk Network ID & Bitwise OR untuk Broadcast ID):
              </div>
              <table className="w-full text-left font-mono text-xs min-w-[600px]">
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-1.5 font-sans font-medium text-muted-foreground w-44">
                      IP Address
                    </td>
                    <td className="py-1.5 font-semibold text-foreground w-36">
                      {result.ipAddress}
                    </td>
                    <td className="py-1.5 tracking-wider text-foreground">
                      {result.ipBinaryDotted}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-sans font-medium text-muted-foreground">
                      Subnet Mask (/{result.prefix})
                    </td>
                    <td className="py-1.5 font-semibold text-foreground">
                      {result.subnetMask}
                    </td>
                    <td className="py-1.5 tracking-wider text-muted-foreground">
                      {result.maskBinaryDotted}
                    </td>
                  </tr>
                  {result.classification.isUnicastCalculable && (
                    <>
                      <tr className="bg-[#113057]/6 dark:bg-[#113057]/30">
                        <td className="py-1.5 font-sans font-bold text-[#113057] dark:text-[#93C5FD] pl-2">
                          Network ID (IP AND Mask)
                        </td>
                        <td className="py-1.5 font-bold text-[#113057] dark:text-[#93C5FD]">
                          {result.networkAddress}
                        </td>
                        <td className="py-1.5 tracking-wider font-bold text-[#113057] dark:text-[#93C5FD]">
                          {result.networkBinaryDotted}
                        </td>
                      </tr>
                      <tr className="bg-amber-50/50 dark:bg-amber-950/20">
                        <td className="py-1.5 font-sans font-bold text-amber-700 dark:text-amber-400 pl-2">
                          Broadcast (Net OR Wildcard)
                        </td>
                        <td className="py-1.5 font-bold text-amber-700 dark:text-amber-400">
                          {result.broadcastAddress}
                        </td>
                        <td className="py-1.5 tracking-wider font-bold text-amber-700 dark:text-amber-400">
                          {result.broadcastBinaryDotted}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

