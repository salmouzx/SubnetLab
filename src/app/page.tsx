"use client"

import * as React from "react"
import Link from "next/link"
import {
  Network,
  BookOpen,
  Calculator,
  Binary,
  FileText,
  Sliders,
  ArrowRight,
  Lock,
} from "lucide-react"

import { calculateIPv4 } from "@/features/ipv4"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const MINI_CLASS_C_PREFIXES = [24, 25, 26, 27, 28, 29, 30] as const

const MINI_IP_PRESETS = [
  { label: "192.168.10.130", ip: "192.168.10.130", prefix: 26 },
  { label: "192.168.1.50", ip: "192.168.1.50", prefix: 25 },
  { label: "192.168.20.200", ip: "192.168.20.200", prefix: 27 },
  { label: "200.10.5.90", ip: "200.10.5.90", prefix: 28 },
]

export default function Home() {
  const [ipInput, setIpInput] = React.useState("192.168.10.130")
  const [selectedPrefix, setSelectedPrefix] = React.useState<number>(26)

  const calc = React.useMemo(() => {
    const res = calculateIPv4(ipInput, selectedPrefix)
    if (!res.isValid) {
      return {
        result: calculateIPv4("192.168.10.130", selectedPrefix),
        inputError: res.error,
        isNonClassC: false,
      }
    }
    if (res.classification.ipClass !== "C") {
      return {
        result: res,
        inputError: undefined,
        isNonClassC: true,
      }
    }
    return {
      result: res,
      inputError: undefined,
      isNonClassC: false,
    }
  }, [ipInput, selectedPrefix])

  const { result, inputError, isNonClassC } = calc

  // Ambil maksimal 8 blok di sekitar blok tempat IP berada untuk tabel pratinjau
  const previewBlocks = React.useMemo(() => {
    const blocks = result.subnetBlocks
    if (blocks.length <= 8) return blocks
    const activeIdx = blocks.findIndex((b) => b.isCurrentSubnet)
    if (activeIdx === -1) return blocks.slice(0, 8)
    const start = Math.max(0, Math.min(activeIdx - 2, blocks.length - 8))
    return blocks.slice(start, start + 8)
  }, [result.subnetBlocks])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-8 py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-emerald-50/60 via-background to-background p-6 md:p-12 dark:from-emerald-950/20">
          <div className="flex flex-col gap-4 max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground">
              Pahami IPv4, <br className="hidden sm:inline" />
              <span className="text-emerald-600 dark:text-emerald-400">Kuasai Subnetting.</span>
            </h1>

            <p className="text-base text-muted-foreground sm:text-lg leading-relaxed">
              Pelajari pengalamatan IPv4 melalui materi terstruktur, simulasi perhitungan interaktif, serta latihan yang membantu memahami setiap proses subnetting secara bertahap dan transparan.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/materi"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                )}
              >
                <BookOpen className="h-4 w-4" />
                Mulai Belajar Materi
              </Link>
              <Link
                href="/simulator"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "gap-2 border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                )}
              >
                <Calculator className="h-4 w-4" />
                Coba Simulator
              </Link>
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none hidden md:block select-none">
            <Binary className="w-80 h-80" />
          </div>
        </section>

        {/* Cakupan Pembelajaran (4 Cards dengan Warna Primer Berbeda) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Cakupan Pembelajaran</h2>
              <p className="text-xs text-muted-foreground">Empat pilar utama media pembelajaran SubnetLab IPv4</p>
            </div>
          </div>
          <SectionCards className="px-0 lg:px-0" />
        </div>

        {/* Interactive Mini Simulator Workbench (Teaser Kelas C /24 - /30) */}
        <section className="flex flex-col gap-5">
          {/* Bar Kontrol Mini Simulator */}
          <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b pb-3.5">
              <div className="flex items-start sm:items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold tracking-tight text-foreground">
                      Mini Simulator Interaktif
                    </h2>
                    <Badge
                      variant="outline"
                      className="text-[11px] border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
                    >
                      Mode Pratinjau Kelas C (/24 – /30)
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ubah alamat IP Kelas C atau pilih prefix di bawah untuk melihat perubahan bit dan blok subnet secara langsung.
                  </p>
                </div>
              </div>

              <Link
                href="/simulator"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 shrink-0 self-start md:self-auto"
                )}
              >
                <Calculator className="h-3.5 w-3.5" />
                Buka Simulator Penuh (Kelas A–E)
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Input IP Kelas C */}
              <div className="lg:col-span-5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="mini-ip-input" className="text-xs font-semibold text-foreground">
                    Alamat IPv4 (Fokus Kelas C: 192–223.x.x.x)
                  </label>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Kelas: <strong className="text-foreground">{result.classification.ipClass}</strong>
                  </span>
                </div>
                <Input
                  id="mini-ip-input"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  placeholder="Contoh: 192.168.10.130"
                  className="font-mono text-sm h-9"
                />
                {inputError ? (
                  <p className="text-[11px] text-destructive font-medium">{inputError}</p>
                ) : isNonClassC ? (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400">
                    Alamat ini termasuk Kelas {result.classification.ipClass}. Untuk eksplorasi penuh Kelas A–E & prefix /0–/32, gunakan{" "}
                    <Link href="/simulator" className="underline font-semibold">
                      Simulator Lengkap
                    </Link>
                    .
                  </p>
                ) : (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[11px] text-muted-foreground">Contoh cepat:</span>
                    {MINI_IP_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setIpInput(preset.ip)
                          setSelectedPrefix(preset.prefix)
                        }}
                        className={cn(
                          "text-[11px] font-mono px-2 py-0.5 rounded border transition-colors",
                          ipInput.trim() === preset.ip && selectedPrefix === preset.prefix
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/50 dark:text-emerald-300"
                            : "border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {preset.label}/{preset.prefix}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pilihan Prefix Terbatas /24 s.d. /30 */}
              <div className="lg:col-span-7 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    Pilih Prefix CIDR Kelas C (/24 – /30)
                  </span>
                  <Link
                    href="/simulator"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    <Lock className="h-3 w-3" />
                    /8 – /23 & /31 – /32 di Simulator Lengkap
                  </Link>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {MINI_CLASS_C_PREFIXES.map((pref) => {
                    const isSelected = selectedPrefix === pref
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setSelectedPrefix(pref)}
                        className={cn(
                          "h-9 rounded-lg border font-mono text-xs font-bold transition-all flex flex-col items-center justify-center",
                          isSelected
                            ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                            : "border-border bg-background text-foreground hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30"
                        )}
                      >
                        <span>/{pref}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                  <span>
                    Mask aktif: <strong className="font-mono text-foreground">{result.subnetMask}</strong>
                  </span>
                  <span>
                    Bit pinjam: <strong className="font-mono text-blue-600 dark:text-blue-400">{result.borrowedSubnetBits} bit</strong> | Bit host:{" "}
                    <strong className="font-mono text-emerald-600 dark:text-emerald-400">{result.hostBits} bit</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 1. Preview Oktet & Masking */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {result.octetBreakdowns.map((oct) => (
              <div key={oct.octetIndex} className="rounded-xl border bg-card p-3.5 shadow-xs">
                <div className="text-lg font-bold font-mono tracking-wider text-center text-foreground">
                  {oct.ipBinary}
                </div>
                <div className="mt-2 pt-2 border-t flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>
                    Mask: <strong className="text-foreground">{oct.maskDecimal}</strong>
                  </span>
                  <span className="tracking-widest">{oct.maskBinary}</span>
                </div>
                <div className="text-[10px] text-center text-muted-foreground mt-1 font-sans">
                  {oct.roleLabel} ({oct.ipDecimal})
                </div>
              </div>
            ))}
          </div>

          {/* 2. Struktur 32-Bit Linear */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Binary className="h-4 w-4 text-emerald-600" />
                  Struktur 32-Bit Linear:
                </CardTitle>
              </div>
              <Badge
                variant="outline"
                className="font-mono text-xs border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
              >
                Subnet Mask: {result.subnetMask} (/{result.prefix})
              </Badge>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-3">
              {/* 32 Bits Linear Bar */}
              <div className="overflow-x-auto pb-1">
                <div className="flex items-center gap-1 min-w-[700px] justify-between">
                  {result.linearBits.map((bit) => {
                    if (bit.role === "network") {
                      return (
                        <div
                          key={bit.bitNumber}
                          className="flex-1 aspect-square max-w-[28px] flex items-center justify-center rounded border border-slate-300 bg-slate-100 text-slate-800 text-xs font-mono font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                          title={`Bit ke-${bit.bitNumber}: Default Network Bit`}
                        >
                          {bit.value}
                        </div>
                      )
                    }
                    if (bit.role === "subnet") {
                      return (
                        <div
                          key={bit.bitNumber}
                          className="flex-1 aspect-square max-w-[28px] flex items-center justify-center rounded border border-blue-700 bg-blue-600 text-white text-xs font-mono font-bold shadow-xs"
                          title={`Bit ke-${bit.bitNumber}: Subnet Borrow Bit (Biru Primer)`}
                        >
                          {bit.value}
                        </div>
                      )
                    }
                    return (
                      <div
                        key={bit.bitNumber}
                        className="flex-1 aspect-square max-w-[28px] flex items-center justify-center rounded border border-emerald-700 bg-emerald-600 text-white text-xs font-mono font-bold shadow-xs"
                        title={`Bit ke-${bit.bitNumber}: Host Bit (Hijau Primer)`}
                      >
                        {bit.value}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-between text-xs pt-1 text-muted-foreground">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs border border-slate-300 bg-slate-100 dark:bg-slate-800 inline-block"></span>
                    Default Network ({result.defaultNetworkBits}-bit)
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-medium">
                    <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block"></span>
                    Bit Pinjam Subnet ({result.borrowedSubnetBits}-bit)
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                    <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block"></span>
                    Host Bits ({result.hostBits}-bit)
                  </span>
                </div>
                <span className="font-mono text-[11px]">
                  IP: {result.ipAddress} /{result.prefix}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 3. Empat Kartu Metrik Kalkulasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border bg-card p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                SUBNET MASK
              </span>
              <p className="text-2xl font-bold font-mono text-foreground mt-1">
                {result.subnetMask}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Prefix /{result.prefix} ({result.borrowedSubnetBits} bit pinjam)
              </p>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                JUMLAH SUBNET (2^N)
              </span>
              <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
                {result.subnetCount.toLocaleString("id-ID")} Subnet
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Rumus 2^{result.borrowedSubnetBits}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                HOST VALID / SUBNET
              </span>
              <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {result.usableHosts.toLocaleString("id-ID")} Host
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Rumus 2^{result.hostBits} - 2
              </p>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                UKURAN BLOK (BLOCK SIZE)
              </span>
              <p className="text-2xl font-bold font-mono text-foreground mt-1">
                {result.blockSize}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Kelipatan di Oktet ke-{result.interestingOctet} (256 -{" "}
                {result.octetBreakdowns[result.interestingOctet - 1].maskDecimal})
              </p>
            </div>
          </div>

          {/* 4. Blok Alamat Tempat IP Berada (3 Kartu Identitas: Biru, Hijau, Orange) */}
          <div className="rounded-2xl border bg-card p-5 shadow-xs flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                Blok Alamat Tempat IP Berada
              </h3>
              <p className="text-xs text-muted-foreground">
                Rincian identitas jaringan, rentang pengalamatan perangkat, dan alamat broadcast untuk{" "}
                <span className="font-mono font-semibold text-foreground">
                  {result.ipAddress}/{result.prefix}
                </span>
                .
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Network ID (Blue Primer Border) */}
              <div className="rounded-xl border border-l-4 border-l-blue-600 bg-blue-50/30 dark:bg-blue-950/20 p-4 shadow-xs">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  NETWORK ID
                </span>
                <p className="text-2xl font-bold font-mono text-foreground mt-1">
                  {result.networkAddress}
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Pengenal jaringan (dicadangkan, tidak untuk host)
                </p>
              </div>

              {/* Rentang Host Valid (Green Primer Border) */}
              <div className="rounded-xl border border-l-4 border-l-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20 p-4 shadow-xs">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  RENTANG HOST VALID
                </span>
                <p className="text-lg sm:text-xl font-bold font-mono text-foreground mt-1">
                  {result.usableHostRangeLabel}
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Alamat yang dapat dikonfigurasi pada perangkat PC/Server
                </p>
              </div>

              {/* Broadcast ID (Amber/Orange Primer Border) */}
              <div className="rounded-xl border border-l-4 border-l-amber-600 bg-amber-50/30 dark:bg-amber-950/20 p-4 shadow-xs">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                  BROADCAST ID
                </span>
                <p className="text-2xl font-bold font-mono text-foreground mt-1">
                  {result.broadcastAddress}
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Pengiriman data serentak ke semua host di subnet
                </p>
              </div>
            </div>
          </div>

          {/* 5. Daftar Blok Subnet */}
          <div className="rounded-2xl border bg-card p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Daftar Blok Subnet (Menampilkan {previewBlocks.length} dari{" "}
                  {result.totalSubnetBlocksInScope.toLocaleString("id-ID")} Blok):
                </h3>
                <p className="text-xs text-muted-foreground">
                  Pembagian subnet hasil subnetting mask {result.subnetMask} (/{result.prefix})
                </p>
              </div>
              <Link
                href="/simulator"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-8 text-xs gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300"
                )}
              >
                <Calculator className="h-3.5 w-3.5" />
                Lihat Langkah Perhitungan & Kalkulator Lengkap
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground text-[11px]">
                    <th className="pb-2 font-medium">Subnet #</th>
                    <th className="pb-2 font-medium">Network ID</th>
                    <th className="pb-2 font-medium">Host Pertama</th>
                    <th className="pb-2 font-medium">Host Terakhir</th>
                    <th className="pb-2 font-medium">Broadcast ID</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {previewBlocks.map((block) => (
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
                          <Badge className="bg-emerald-600 text-white text-[10px] hover:bg-emerald-700">
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
          </div>
        </section>
      </main>

      {/* Footer */}
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
