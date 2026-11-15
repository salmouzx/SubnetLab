"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  AlertTriangle,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  GraduationCap,
  History,
  Info,
  RotateCcw,
  ShieldAlert,
  Bookmark,
  XCircle,
} from "lucide-react"

import {
  calculateIPv4,
  prefixToMask,
  validateIPv4,
  validateSubnetMask,
} from "@/features/ipv4"
import { BinaryVisualizer } from "@/components/simulator/binary-visualizer"
import { CalculationSteps } from "@/components/simulator/calculation-steps"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SimPreset {
  id: string
  badge: string
  label: string
  ip: string
  prefix: number
  desc: string
}

const SIMULATOR_PRESETS: SimPreset[] = [
  {
    id: "class-c-26",
    badge: "Kelas C",
    label: "192.168.10.130 /26",
    ip: "192.168.10.130",
    prefix: 26,
    desc: "Subnetting LAN 4 blok (62 host/subnet)",
  },
  {
    id: "class-c-24",
    badge: "Kelas C",
    label: "192.168.1.10 /24",
    ip: "192.168.1.10",
    prefix: 24,
    desc: "Default Kelas C (254 usable host)",
  },
  {
    id: "class-c-30",
    badge: "P2P /30",
    label: "192.168.1.10 /30",
    ip: "192.168.1.10",
    prefix: 30,
    desc: "Tautan antar-router konvensional (2 host)",
  },
  {
    id: "class-b-20",
    badge: "Kelas B",
    label: "172.16.10.20 /20",
    ip: "172.16.10.20",
    prefix: 20,
    desc: "Jaringan kampus/enterprise (4.094 host)",
  },
  {
    id: "class-a-12",
    badge: "Kelas A",
    label: "10.10.10.10 /12",
    ip: "10.10.10.10",
    prefix: 12,
    desc: "Backbone Private IP Kelas A",
  },
  {
    id: "rfc3021-31",
    badge: "RFC 3021",
    label: "192.168.1.10 /31",
    ip: "192.168.1.10",
    prefix: 31,
    desc: "Point-to-Point tanpa broadcast (/31)",
  },
  {
    id: "host-32",
    badge: "Host /32",
    label: "192.168.1.10 /32",
    ip: "192.168.1.10",
    prefix: 32,
    desc: "Single Host Route (1 alamat tunggal)",
  },
  {
    id: "loopback",
    badge: "Loopback",
    label: "127.0.0.1 /8",
    ip: "127.0.0.1",
    prefix: 8,
    desc: "Pengujian internal localhost (RFC 1122)",
  },
  {
    id: "class-d",
    badge: "Kelas D",
    label: "224.0.0.5",
    ip: "224.0.0.5",
    prefix: 24,
    desc: "Multicast OSPF Routers (Non-Unicast)",
  },
  {
    id: "class-e",
    badge: "Kelas E",
    label: "240.0.0.1",
    ip: "240.0.0.1",
    prefix: 24,
    desc: "Reserved / Experimental (Non-Unicast)",
  },
]

interface SimHistoryItem {
  ip: string
  prefix: number
  ipClass: string
  networkAddress: string
  timestamp: string
}

const HISTORY_STORAGE_KEY = "subnetlab_sim_history_v1"

export function SimulatorWorkbench() {
  const searchParams = useSearchParams()

  const [ipInput, setIpInput] = React.useState("192.168.10.130")
  const [prefixInput, setPrefixInput] = React.useState<number>(26)
  const [maskInput, setMaskInput] = React.useState("255.255.255.192")
  const [maskError, setMaskError] = React.useState<string | null>(null)
  const [copiedField, setCopiedField] = React.useState<string | null>(null)
  const [history, setHistory] = React.useState<SimHistoryItem[]>([])

  // Sinkronisasi awal dari URL searchParams (?ip=...&prefix=...)
  React.useEffect(() => {
    const qIp = searchParams.get("ip")
    const qPrefix = searchParams.get("prefix")

    if (qIp && validateIPv4(qIp).isValid) {
      setIpInput(qIp.trim())
    }
    if (qPrefix !== null) {
      const pNum = Number(qPrefix)
      if (Number.isInteger(pNum) && pNum >= 0 && pNum <= 32) {
        setPrefixInput(pNum)
        setMaskInput(prefixToMask(pNum))
        setMaskError(null)
      }
    }
  }, [searchParams])

  // Load riwayat simulasi dari localStorage
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as SimHistoryItem[]
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, 6))
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const handlePrefixChange = (newPrefix: number) => {
    const clamped = Math.max(0, Math.min(32, Math.floor(newPrefix)))
    setPrefixInput(clamped)
    setMaskInput(prefixToMask(clamped))
    setMaskError(null)
  }

  const handleMaskInputChange = (val: string) => {
    setMaskInput(val)
    const validation = validateSubnetMask(val)
    if (validation.isValid && typeof validation.prefix === "number") {
      setPrefixInput(validation.prefix)
      setMaskError(null)
    } else {
      setMaskError(validation.error ?? "Subnet Mask tidak valid.")
    }
  }

  const applyPreset = (preset: SimPreset) => {
    setIpInput(preset.ip)
    setPrefixInput(preset.prefix)
    setMaskInput(prefixToMask(preset.prefix))
    setMaskError(null)
  }

  const handleReset = () => {
    setIpInput("192.168.10.130")
    setPrefixInput(26)
    setMaskInput("255.255.255.192")
    setMaskError(null)
  }

  // Validasi & Kalkulasi
  const ipValidation = React.useMemo(() => validateIPv4(ipInput), [ipInput])

  // Gunakan hasil valid terakhir atau default jika input sedang diketik tidak valid
  const calcResult = React.useMemo(() => {
    const res = calculateIPv4(ipInput, prefixInput)
    if (res.isValid) {
      return res
    }
    return calculateIPv4("192.168.10.130", prefixInput)
  }, [ipInput, prefixInput])

  // Simpan ke riwayat saat pengguna menekan tombol simpan atau menyalin hasil
  const saveToHistory = React.useCallback(
    (res = calcResult) => {
      if (!ipValidation.isValid) return
      try {
        const entry: SimHistoryItem = {
          ip: res.ipAddress,
          prefix: res.prefix,
          ipClass: res.classification.ipClass,
          networkAddress: res.networkAddress,
          timestamp: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }
        setHistory((prev) => {
          const filtered = prev.filter(
            (item) => !(item.ip === entry.ip && item.prefix === entry.prefix)
          )
          const updated = [entry, ...filtered].slice(0, 6)
          window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated))
          return updated
        })
      } catch {
        // Ignore storage errors
      }
    },
    [calcResult, ipValidation.isValid]
  )

  const handleCopySummary = async () => {
    const summaryText = [
      `=== Hasil Kalkulasi SubnetLab IPv4 ===`,
      `IP Address       : ${calcResult.ipAddress}/${calcResult.prefix}`,
      `Kelas IP         : Kelas ${calcResult.classification.ipClass} (${calcResult.classification.specialLabel})`,
      `Subnet Mask      : ${calcResult.subnetMask}`,
      `Wildcard Mask    : ${calcResult.wildcardMask}`,
      `Network Address  : ${calcResult.networkAddress}`,
      `Broadcast Address: ${calcResult.broadcastAddress}`,
      `Rentang Host     : ${calcResult.usableHostRangeLabel}`,
      `Total Alamat     : ${calcResult.totalAddresses.toLocaleString("id-ID")}`,
      `Usable Host      : ${calcResult.usableHosts.toLocaleString("id-ID")}`,
      `IP Biner         : ${calcResult.ipBinaryDotted}`,
      `Mask Biner       : ${calcResult.maskBinaryDotted}`,
    ].join("\n")

    try {
      await navigator.clipboard.writeText(summaryText)
      setCopiedField("summary")
      saveToHistory()
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      // Ignore clipboard failure
    }
  }

  const handleCopyText = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(key)
      setTimeout(() => setCopiedField(null), 1500)
    } catch {
      // Ignore
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header Banner */}
      <div className="rounded-2xl border border-[#113057] bg-[#113057] p-5 sm:p-6 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Kalkulator IPv4 & Visualizer Biner 32-Bit
          </h1>
          <p className="text-xs sm:text-sm text-white/85 max-w-2xl">
            Ubah IP atau prefix CIDR, lalu langsung lihat pembagian bit biner, langkah bitwise AND/OR, dan daftar blok subnetnya.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopySummary}
            className="gap-1.5 border-[#FFB61E] bg-[#FFB61E] text-[#113057] font-semibold hover:bg-[#F59E0B] hover:text-[#113057]"
          >
            {copiedField === "summary" ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#113057]" />
                Hasil Disalin!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Salin Hasil
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </div>

      {/* Layout 2 Kolom Desktop (Input di Kiri, Ringkasan Hasil di Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI: Panel Input, Slider Prefix, Validasi & Preset */}
        <div className="lg:col-span-5 min-w-0 flex flex-col gap-4">
          <Card className="shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-[#113057]" />
                  Parameter Input IPv4 & Subnet
                </span>
                <button
                  type="button"
                  onClick={() => saveToHistory()}
                  className="text-[11px] font-medium text-[#113057] hover:underline dark:text-[#60A5FA] inline-flex items-center gap-1"
                >
                  <History className="h-3 w-3" />
                  Catat ke Riwayat
                </button>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 flex flex-col gap-4">
              {/* 1. Input Alamat IPv4 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <label htmlFor="sim-ip-input" className="text-xs font-semibold text-foreground">
                    Alamat IPv4 (Desimal Bertitik)
                  </label>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Contoh: 192.168.10.130
                  </span>
                </div>
                <Input
                  id="sim-ip-input"
                  value={ipInput}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val.includes("/")) {
                      const [ipPart, prefPart] = val.split("/")
                      setIpInput(ipPart)
                      const num = Number(prefPart)
                      if (prefPart !== "" && Number.isInteger(num) && num >= 0 && num <= 32) {
                        handlePrefixChange(num)
                      }
                    } else {
                      setIpInput(val)
                    }
                  }}
                  placeholder="Masukkan IP (misal 192.168.10.130)"
                  className={cn(
                    "font-mono text-sm h-10",
                    !ipValidation.isValid && "border-red-500 focus-visible:ring-red-500"
                  )}
                />

                {/* Status Alert Validasi IPv4 (Semantic Rules PRD 5.2) */}
                {!ipValidation.isValid ? (
                  <div
                    role="alert"
                    className="rounded-lg border border-[#FCA5A5] bg-[#FEE2E2] p-2.5 text-[#991B1B] text-xs flex items-start gap-2"
                  >
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Alamat IPv4 Tidak Valid: </span>
                      <span>{ipValidation.error}</span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-[#86EFAC] bg-[#DCFCE7] px-2.5 py-1.5 text-[#166534] text-xs flex flex-wrap items-center justify-between gap-1.5">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      Format IPv4 Valid
                    </span>
                    <span className="font-mono font-bold">
                      Kelas {calcResult.classification.ipClass} ({calcResult.classification.usageType})
                    </span>
                  </div>
                )}
              </div>

              {/* 2. Input CIDR Prefix (/0 - /32) dengan Slider + Quick Buttons */}
              <div className="flex flex-col gap-2 pt-1 border-t">
                <div className="flex items-center justify-between">
                  <label htmlFor="sim-prefix-slider" className="text-xs font-semibold text-foreground">
                    CIDR Prefix Length (/0 - /32)
                  </label>
                  <Badge className="font-mono text-xs bg-[#113057] text-white hover:bg-[#0A2342]">
                    /{prefixInput}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-muted-foreground">/0</span>
                  <input
                    id="sim-prefix-slider"
                    type="range"
                    min={0}
                    max={32}
                    value={prefixInput}
                    onChange={(e) => handlePrefixChange(Number(e.target.value))}
                    className="w-full accent-[#113057] cursor-pointer h-2 rounded-lg bg-muted"
                  />
                  <span className="text-[11px] font-mono text-muted-foreground">/32</span>
                </div>

                {/* Tombol Cepat Prefix Populer */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {[8, 12, 16, 20, 24, 25, 26, 27, 28, 29, 30, 31, 32].map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => handlePrefixChange(pref)}
                      className={cn(
                        "px-2 py-1 rounded text-[11px] font-mono font-semibold border transition-colors",
                        prefixInput === pref
                          ? "border-[#113057] bg-[#113057] text-white"
                          : "border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      /{pref}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Input Subnet Mask (Sinkron Dua Arah + Validasi Kontigu) */}
              <div className="flex flex-col gap-1.5 pt-1 border-t">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <label htmlFor="sim-mask-input" className="text-xs font-semibold text-foreground">
                    Subnet Mask (Sinkron dengan Prefix)
                  </label>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Wildcard: {calcResult.wildcardMask}
                  </span>
                </div>
                <Input
                  id="sim-mask-input"
                  value={maskInput}
                  onChange={(e) => handleMaskInputChange(e.target.value)}
                  placeholder="Contoh: 255.255.255.192"
                  className={cn(
                    "font-mono text-sm h-10",
                    maskError && "border-red-500 focus-visible:ring-red-500"
                  )}
                />

                {maskError && (
                  <div
                    role="alert"
                    className="rounded-lg border border-[#FCA5A5] bg-[#FEE2E2] p-2.5 text-[#991B1B] text-xs flex items-start gap-2"
                  >
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Subnet Mask Tidak Valid: </span>
                      <span>{maskError}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Daftar Skenario Preset Kelas A - E */}
              <div className="flex flex-col gap-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Bookmark className="h-3.5 w-3.5 text-[#113057]" />
                    Skenario Uji Cepat (Kelas A-E & Kasus Khusus)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {SIMULATOR_PRESETS.map((preset) => {
                    const isActive =
                      ipInput.trim() === preset.ip && prefixInput === preset.prefix
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className={cn(
                          "text-left rounded-lg border p-2 transition-all flex flex-col gap-0.5",
                          isActive
                            ? "border-[#113057] bg-[#113057]/8 dark:bg-[#113057]/20 ring-1 ring-[#113057]/30"
                            : "border-border bg-card hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {preset.label}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-4 font-sans"
                          >
                            {preset.badge}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-muted-foreground line-clamp-1">
                          {preset.desc}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 5. Riwayat Simulasi Terakhir */}
              {history.length > 0 && (
                <div className="flex flex-col gap-1.5 pt-2 border-t">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" />
                    Riwayat Simulasi Terakhir
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {history.map((item, i) => (
                      <button
                        key={`${item.ip}-${item.prefix}-${i}`}
                        type="button"
                        onClick={() => {
                          setIpInput(item.ip)
                          handlePrefixChange(item.prefix)
                        }}
                        className="text-[11px] font-mono px-2 py-1 rounded border bg-muted/30 hover:bg-muted text-foreground transition-colors"
                      >
                        {item.ip}/{item.prefix} (Kls {item.ipClass})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: Identifikasi Kelas, Kartu Metrik, Kartu Blok Alamat & Tabel Output Lengkap */}
        <div className="lg:col-span-7 min-w-0 flex flex-col gap-4">
          {/* Banner Identifikasi Kelas & Status Khusus */}
          <Card className="shadow-xs">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#113057] text-white font-mono font-extrabold text-lg shadow-xs">
                    {calcResult.classification.ipClass === "Loopback"
                      ? "LB"
                      : calcResult.classification.ipClass === "Unspecified"
                        ? "0"
                        : calcResult.classification.ipClass}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-foreground">
                        Kelas {calcResult.classification.ipClass} - {calcResult.classification.usageType}
                      </h2>
                      <Badge
                        variant="outline"
                        className="text-xs border-[#FFB61E] bg-[#FFB61E]/20 text-[#92400E] dark:bg-[#FFB61E]/15 dark:border-[#FFB61E]/50 dark:text-[#FFB61E]"
                      >
                        {calcResult.classification.specialLabel}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {calcResult.classification.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Peringatan Khusus untuk Kelas D (Multicast) & Kelas E (Experimental) */}
              {!calcResult.classification.isUnicastCalculable && (
                <div
                  role="status"
                  className="rounded-xl border border-[#FCD34D] bg-[#FEF3C7] p-3.5 text-[#92400E] text-xs flex items-start gap-2.5"
                >
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="font-bold">
                      Perhatian: Alamat Non-Unicast (Kelas {calcResult.classification.ipClass} -{" "}
                      {calcResult.classification.usageType})
                    </span>
                    <span>
                      Alamat pada rentang Kelas {calcResult.classification.ipClass} tidak menggunakan konsep Network ID,
                      Broadcast ID, maupun Usable Host seperti alamat unicast Kelas A, B, dan C. Representasi biner 32-bit
                      tetap ditampilkan di bawah untuk keperluan analisis bit.
                    </span>
                  </div>
                </div>
              )}

              {/* Informasi Khusus untuk /31 (RFC 3021) atau /32 */}
              {calcResult.classification.isUnicastCalculable && calcResult.prefix === 31 && (
                <div
                  role="status"
                  className="rounded-xl border border-[#FCD34D] bg-[#FEF3C7] p-3 text-[#92400E] text-xs flex items-start gap-2"
                >
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Aturan Khusus Prefix /31 (RFC 3021 Point-to-Point): </span>
                    <span>
                      Pada subnet /31, kedua alamat ({calcResult.firstUsableHost} dan {calcResult.lastUsableHost}) dapat
                      digunakan sebagai alamat host tautan point-to-point tanpa alamat broadcast terpisah.
                    </span>
                  </div>
                </div>
              )}

              {calcResult.classification.isUnicastCalculable && calcResult.prefix === 32 && (
                <div
                  role="status"
                  className="rounded-xl border border-[#FCD34D] bg-[#FEF3C7] p-3 text-[#92400E] text-xs flex items-start gap-2"
                >
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Aturan Khusus Prefix /32 (Single Host Route): </span>
                    <span>
                      Prefix /32 memiliki 32 bit Network dan 0 bit Host, sehingga merepresentasikan tepat 1 alamat host
                      tunggal ({calcResult.ipAddress}).
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4 Kartu Metrik Kalkulasi Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="rounded-xl border bg-card p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                SUBNET MASK & CIDR
              </span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-1">
                {calcResult.subnetMask}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Prefix /{calcResult.prefix} | Wildcard: {calcResult.wildcardMask}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                JUMLAH SUBNET (2^N)
              </span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-[#113057] dark:text-[#93C5FD] mt-1">
                {calcResult.classification.isUnicastCalculable
                  ? `${calcResult.subnetCount.toLocaleString("id-ID")} Subnet`
                  : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {calcResult.classification.isUnicastCalculable
                  ? `Rumus 2^${calcResult.borrowedSubnetBits} (${calcResult.borrowedSubnetBits} bit pinjam)`
                  : `Kelas ${calcResult.classification.ipClass} (${calcResult.classification.usageType})`}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                HOST VALID / SUBNET
              </span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-[#15803D] dark:text-green-400 mt-1">
                {calcResult.classification.isUnicastCalculable
                  ? `${calcResult.usableHosts.toLocaleString("id-ID")} Host`
                  : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {calcResult.classification.isUnicastCalculable
                  ? calcResult.prefix >= 31
                    ? `Total Alamat: ${calcResult.totalAddresses} (Kasus /${calcResult.prefix})`
                    : `Rumus 2^${calcResult.hostBits} - 2 (Total: ${calcResult.totalAddresses.toLocaleString("id-ID")})`
                  : "Tidak memiliki host unicast"}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                UKURAN BLOK (BLOCK SIZE)
              </span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-1">
                {calcResult.blockSize}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Kelipatan di Oktet ke-{calcResult.interestingOctet} (256 -{" "}
                {calcResult.octetBreakdowns[calcResult.interestingOctet - 1].maskDecimal})
              </p>
            </div>
          </div>

          {/* 3 Kartu Blok Alamat Tempat IP Berada (Biru, Hijau, Oranye) */}
          {calcResult.classification.isUnicastCalculable && (
            <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-xs flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#113057]" />
                    Blok Alamat Tempat IP Berada
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Identitas jaringan, rentang host valid, dan alamat broadcast untuk{" "}
                    <span className="font-mono font-semibold text-foreground">
                      {calcResult.ipAddress}/{calcResult.prefix}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Network ID (Blue Primer Border) */}
                <div className="rounded-xl border border-l-4 border-l-[#113057] bg-[#113057]/[0.04] dark:bg-[#113057]/15 p-3.5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#113057] dark:text-[#60A5FA] uppercase tracking-wide">
                        NETWORK ID
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText("net", calcResult.networkAddress)}
                        className="text-muted-foreground hover:text-foreground"
                        title="Salin Network ID"
                      >
                        {copiedField === "net" ? (
                          <Check className="h-3.5 w-3.5 text-[#113057]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xl font-bold font-mono text-foreground mt-1">
                      {calcResult.networkAddress}
                    </p>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Pengenal jaringan (semua bit host = 0)
                  </p>
                </div>

                {/* Rentang Host Valid (Hijau Primer) */}
                <div className="rounded-xl border border-l-4 border-l-[#16A34A] bg-green-50/40 dark:bg-green-950/20 p-3.5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#15803D] dark:text-green-400 uppercase tracking-wide">
                        RENTANG HOST VALID
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText("range", calcResult.usableHostRangeLabel)}
                        className="text-muted-foreground hover:text-foreground"
                        title="Salin Rentang Host"
                      >
                        {copiedField === "range" ? (
                          <Check className="h-3.5 w-3.5 text-[#16A34A]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm sm:text-base font-bold font-mono text-foreground mt-1 leading-snug">
                      {calcResult.usableHostRangeLabel}
                    </p>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Alamat yang bisa dipasang ke perangkat
                  </p>
                </div>

                {/* Broadcast ID (Amber / Kuning Border) */}
                <div className="rounded-xl border border-l-4 border-l-amber-600 bg-amber-50/40 dark:bg-amber-950/20 p-3.5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                        BROADCAST ID
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText("bcast", calcResult.broadcastAddress)}
                        className="text-muted-foreground hover:text-foreground"
                        title="Salin Broadcast ID"
                      >
                        {copiedField === "bcast" ? (
                          <Check className="h-3.5 w-3.5 text-amber-700" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xl font-bold font-mono text-foreground mt-1">
                      {calcResult.broadcastAddress}
                    </p>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Alamat transmisi ke seluruh host subnet (bit host = 1)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabel Ringkasan Teknis Lengkap (13 Output Wajib PRD 4.3) */}
          <Card className="shadow-xs">
            <CardHeader className="pb-2.5 border-b">
              <CardTitle className="text-sm font-semibold">
                Ringkasan Parameter Teknis IPv4
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">IP Address</span>
                  <span className="font-mono font-semibold text-foreground">{calcResult.ipAddress}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">IP Class</span>
                  <span className="font-semibold text-foreground">
                    Kelas {calcResult.classification.ipClass} ({calcResult.classification.usageType})
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">Subnet Mask</span>
                  <span className="font-mono font-semibold text-foreground">{calcResult.subnetMask}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">CIDR Notation</span>
                  <span className="font-mono font-semibold text-[#113057] dark:text-[#60A5FA]">
                    /{calcResult.prefix}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">Network Address</span>
                  <span className="font-mono font-bold text-[#113057] dark:text-[#60A5FA]">
                    {calcResult.classification.isUnicastCalculable ? calcResult.networkAddress : "-"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">Broadcast Address</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                    {calcResult.classification.isUnicastCalculable ? calcResult.broadcastAddress : "-"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">First Usable Host</span>
                  <span className="font-mono font-semibold text-[#15803D] dark:text-green-400">
                    {calcResult.firstUsableHost ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">Last Usable Host</span>
                  <span className="font-mono font-semibold text-[#15803D] dark:text-green-400">
                    {calcResult.lastUsableHost ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">Total Address</span>
                  <span className="font-mono font-semibold text-foreground">
                    {calcResult.totalAddresses.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">Usable Host</span>
                  <span className="font-mono font-semibold text-[#15803D] dark:text-green-400">
                    {calcResult.usableHosts.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">Network Bits (Aktif / Pinjam)</span>
                  <span className="font-mono font-semibold text-foreground">
                    {calcResult.networkBits} bit ({calcResult.borrowedSubnetBits} bit pinjam)
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground">Host Bits</span>
                  <span className="font-mono font-semibold text-foreground">
                    {calcResult.hostBits} bit
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* BAGIAN BAWAH 1: Visualisasi Biner 32-Bit & Rincian Oktet */}
      <BinaryVisualizer result={calcResult} />

      {/* BAGIAN BAWAH 2: Daftar Blok Subnet & Penjelasan Langkah Perhitungan */}
      <CalculationSteps result={calcResult} />

      {/* Navigasi Lanjutan ke Materi & Latihan */}
      <div className="rounded-2xl border bg-card p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Mau uji pemahaman dari hasil hitung di atas?
          </h3>
          <p className="text-xs text-muted-foreground">
            Cek teori subnetting Kelas C di Materi atau langsung kerjakan soal interaktif di Latihan.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/materi"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5"
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Buka Materi
          </Link>
          <Link
            href="/latihan"
            className={cn(
              buttonVariants({ size: "sm" }),
              "gap-1.5 bg-[#113057] text-white hover:bg-[#0A2342]"
            )}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Lanjut ke Latihan Soal
          </Link>
        </div>
      </div>
    </div>
  )
}

