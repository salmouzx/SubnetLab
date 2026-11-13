"use client"

import * as React from "react"
import { BookOpenCheck, CheckCircle2, ListOrdered, Table2 } from "lucide-react"

import type { IPv4CalculationResult } from "@/features/ipv4"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CalculationStepsProps {
  result: IPv4CalculationResult
}

export function CalculationSteps({ result }: CalculationStepsProps) {
  const [showAllBlocks, setShowAllBlocks] = React.useState(false)

  const displayedBlocks = React.useMemo(() => {
    const blocks = result.subnetBlocks
    if (showAllBlocks || blocks.length <= 8) {
      return blocks
    }
    const activeIdx = blocks.findIndex((b) => b.isCurrentSubnet)
    if (activeIdx === -1) return blocks.slice(0, 8)
    const start = Math.max(0, Math.min(activeIdx - 2, blocks.length - 8))
    return blocks.slice(start, start + 8)
  }, [result.subnetBlocks, showAllBlocks])

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Tabel Daftar Blok Subnet (Jika Unicast Calculable) */}
      {result.classification.isUnicastCalculable && result.subnetBlocks.length > 0 && (
        <Card className="shadow-xs">
          <CardHeader className="pb-3 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Table2 className="h-4 w-4 text-emerald-600" />
                Daftar Blok Subnet (Menampilkan {displayedBlocks.length} dari{" "}
                {result.totalSubnetBlocksInScope.toLocaleString("id-ID")} Blok Subnet)
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pembagian jaringan dengan Subnet Mask {result.subnetMask} (/{result.prefix}) dan kelipatan blok{" "}
                <strong className="font-mono text-foreground">{result.blockSize}</strong> pada Oktet ke-
                {result.interestingOctet}.
              </p>
            </div>

            {result.subnetBlocks.length > 8 && (
              <button
                type="button"
                onClick={() => setShowAllBlocks((prev) => !prev)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 self-start sm:self-auto"
              >
                {showAllBlocks
                  ? "Tampilkan 8 Blok Sekitar IP Aktif"
                  : `Tampilkan Semua (${result.subnetBlocks.length} Blok)`}
              </button>
            )}
          </CardHeader>

          <CardContent className="pt-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground text-[11px]">
                    <th className="pb-2.5 font-medium">Subnet #</th>
                    <th className="pb-2.5 font-medium">Network ID</th>
                    <th className="pb-2.5 font-medium">Host Pertama</th>
                    <th className="pb-2.5 font-medium">Host Terakhir</th>
                    <th className="pb-2.5 font-medium">Broadcast ID</th>
                    <th className="pb-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {displayedBlocks.map((block) => (
                    <tr
                      key={block.index}
                      className={cn(
                        "transition-colors",
                        block.isCurrentSubnet
                          ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-l-4 border-l-emerald-600"
                          : "hover:bg-muted/40"
                      )}
                    >
                      <td
                        className={cn(
                          "py-2.5 font-bold font-sans",
                          block.isCurrentSubnet && "text-emerald-700 dark:text-emerald-300 pl-2"
                        )}
                      >
                        Subnet {block.index}
                      </td>
                      <td
                        className={cn(
                          "py-2.5",
                          block.isCurrentSubnet && "font-bold text-blue-700 dark:text-blue-300"
                        )}
                      >
                        {block.networkAddress}
                      </td>
                      <td className="py-2.5">{block.firstHost}</td>
                      <td className="py-2.5">{block.lastHost}</td>
                      <td
                        className={cn(
                          "py-2.5",
                          block.isCurrentSubnet && "font-bold text-amber-700 dark:text-amber-300"
                        )}
                      >
                        {block.broadcastAddress}
                      </td>
                      <td className="py-2.5 font-sans">
                        {block.isCurrentSubnet ? (
                          <Badge className="bg-emerald-600 text-white text-[10px] hover:bg-emerald-700 gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            IP Berada Disini
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. Penjelasan Langkah Perhitungan (Step-by-Step) */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ListOrdered className="h-4 w-4 text-emerald-600" />
            Penjelasan Langkah Perhitungan (Step-by-Step)
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Uraian matematis dan logika bitwise untuk memahami proses mendapatkan hasil subnetting di atas.
          </p>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="grid grid-cols-1 gap-3.5">
            {result.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="rounded-xl border bg-muted/20 p-4 flex flex-col gap-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-sm font-bold text-foreground">{step.title}</h4>
                  </div>

                  {step.formula && (
                    <Badge
                      variant="outline"
                      className="font-mono text-[11px] border-emerald-200 bg-emerald-50/80 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    >
                      <BookOpenCheck className="h-3 w-3 mr-1 text-emerald-600" />
                      {step.formula}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-foreground/90 font-medium pl-8">
                  {step.summary}
                </p>

                <div className="pl-8 pt-1 flex flex-col gap-1">
                  {step.details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-mono text-muted-foreground bg-background/80 border rounded px-2.5 py-1"
                    >
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

