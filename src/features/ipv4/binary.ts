import type { BitRole, LinearBit, OctetBreakdown } from "./types"

/**
 * Mengonversi angka desimal (0-255) menjadi string biner 8-bit dengan leading zero.
 */
export function octetToBinary(octet: number): string {
  const clamped = Math.max(0, Math.min(255, Math.floor(octet)))
  return clamped.toString(2).padStart(8, "0")
}

/**
 * Mengonversi array 4 oktet menjadi bilangan bulat unsigned 32-bit.
 */
export function octetsToInt(octets: [number, number, number, number]): number {
  return (
    (((octets[0] & 255) << 24) |
      ((octets[1] & 255) << 16) |
      ((octets[2] & 255) << 8) |
      (octets[3] & 255)) >>>
    0
  )
}

/**
 * Mengonversi bilangan bulat unsigned 32-bit menjadi tuple 4 oktet.
 */
export function intToOctets(int32: number): [number, number, number, number] {
  const unsigned = int32 >>> 0
  return [
    (unsigned >>> 24) & 255,
    (unsigned >>> 16) & 255,
    (unsigned >>> 8) & 255,
    unsigned & 255,
  ]
}

/**
 * Mengonversi bilangan bulat unsigned 32-bit menjadi string IPv4 desimal bertitik.
 */
export function intToIp(int32: number): string {
  return intToOctets(int32).join(".")
}

/**
 * Mengonversi tuple 4 oktet menjadi representasi biner 32-bit bertitik (8.8.8.8).
 */
export function octetsToBinaryDotted(octets: [number, number, number, number]): string {
  return octets.map(octetToBinary).join(".")
}

/**
 * Menghasilkan nilai unsigned 32-bit integer dari prefix CIDR (/0 s.d. /32).
 */
export function prefixToMaskInt(prefix: number): number {
  if (prefix <= 0) return 0
  if (prefix >= 32) return 0xffffffff >>> 0
  return (0xffffffff << (32 - prefix)) >>> 0
}

/**
 * Menghasilkan rincian 4 oktet (desimal, biner, mask, dan peran oktet).
 */
export function buildOctetBreakdowns(
  ipOctets: [number, number, number, number],
  maskOctets: [number, number, number, number],
  netOctets: [number, number, number, number],
  bcastOctets: [number, number, number, number],
  defaultNetworkBits: number,
  prefix: number
): [OctetBreakdown, OctetBreakdown, OctetBreakdown, OctetBreakdown] {
  const items = [0, 1, 2, 3].map((idx) => {
    const startBit = idx * 8 + 1
    const endBit = (idx + 1) * 8

    let roleLabel = "Oktet Host"
    if (endBit <= defaultNetworkBits && endBit <= prefix) {
      roleLabel = `Oktet ${idx + 1} (Network)`
    } else if (endBit <= prefix) {
      roleLabel = `Oktet ${idx + 1} (Network/Subnet)`
    } else if (startBit > prefix) {
      roleLabel = `Oktet ${idx + 1} (Host)`
    } else {
      roleLabel = `Oktet ${idx + 1} (Subnet + Host)`
    }

    return {
      octetIndex: (idx + 1) as 1 | 2 | 3 | 4,
      ipDecimal: ipOctets[idx],
      ipBinary: octetToBinary(ipOctets[idx]),
      maskDecimal: maskOctets[idx],
      maskBinary: octetToBinary(maskOctets[idx]),
      networkDecimal: netOctets[idx],
      broadcastDecimal: bcastOctets[idx],
      roleLabel,
    }
  })

  return items as [OctetBreakdown, OctetBreakdown, OctetBreakdown, OctetBreakdown]
}

/**
 * Menghasilkan 32 elemen bit individual dengan peran ('network' | 'subnet' | 'host')
 * untuk visualisasi Struktur 32-Bit Linear.
 */
export function buildLinearBits(
  ipOctets: [number, number, number, number],
  maskOctets: [number, number, number, number],
  defaultNetworkBits: number,
  prefix: number
): LinearBit[] {
  const ipBitsStr = ipOctets.map(octetToBinary).join("")
  const maskBitsStr = maskOctets.map(octetToBinary).join("")
  const result: LinearBit[] = []

  const effectiveDefaultNet = Math.min(defaultNetworkBits, prefix)

  for (let i = 0; i < 32; i++) {
    const bitNumber = i + 1
    const octetIndex = (Math.floor(i / 8) + 1) as 1 | 2 | 3 | 4
    let role: BitRole = "host"

    if (bitNumber <= effectiveDefaultNet) {
      role = "network"
    } else if (bitNumber <= prefix) {
      role = "subnet"
    } else {
      role = "host"
    }

    result.push({
      bitNumber,
      octetIndex,
      value: ipBitsStr[i] === "1" ? "1" : "0",
      maskBit: maskBitsStr[i] === "1" ? "1" : "0",
      role,
    })
  }

  return result
}

