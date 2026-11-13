import { intToIp, octetToBinary, prefixToMaskInt } from "./binary"
import type { MaskValidationResult, ValidationResult } from "./types"

/**
 * Memvalidasi string alamat IPv4 (harus 4 oktet, masing-masing 0-255, tanpa karakter ilegal).
 */
export function validateIPv4(ip: string): ValidationResult {
  const trimmed = ip.trim()
  if (!trimmed) {
    return {
      isValid: false,
      error: "Alamat IPv4 tidak boleh kosong.",
    }
  }

  const parts = trimmed.split(".")
  if (parts.length !== 4) {
    return {
      isValid: false,
      error: "Format IPv4 harus terdiri dari 4 oktet yang dipisahkan titik (contoh: 192.168.1.10).",
    }
  }

  const octets: number[] = []
  for (let i = 0; i < 4; i++) {
    const part = parts[i]
    if (!/^\d+$/.test(part)) {
      return {
        isValid: false,
        error: `Oktet ke-${i + 1} ("${part}") tidak valid. Gunakan angka desimal 0–255.`,
      }
    }

    if (part.length > 1 && part.startsWith("0")) {
      return {
        isValid: false,
        error: `Oktet ke-${i + 1} ("${part}") tidak boleh memiliki angka nol di depan (leading zero).`,
      }
    }

    const num = Number(part)
    if (!Number.isInteger(num) || num < 0 || num > 255) {
      return {
        isValid: false,
        error: `Nilai oktet ke-${i + 1} (${num}) di luar rentang. Setiap oktet harus bernilai antara 0 hingga 255.`,
      }
    }

    octets.push(num)
  }

  return {
    isValid: true,
    octets: octets as [number, number, number, number],
  }
}

/**
 * Mengonversi nilai CIDR prefix (0-32) menjadi string Subnet Mask desimal bertitik.
 */
export function prefixToMask(prefix: number): string {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    throw new Error(`Prefix /${prefix} tidak valid. Harus berada di rentang /0 sampai /32.`)
  }
  return intToIp(prefixToMaskInt(prefix))
}

/**
 * Memvalidasi nilai CIDR prefix (/0 sampai /32).
 */
export function validatePrefix(prefix: number): MaskValidationResult {
  if (typeof prefix !== "number" || Number.isNaN(prefix) || !Number.isInteger(prefix)) {
    return {
      isValid: false,
      error: "Nilai prefix CIDR harus berupa bilangan bulat.",
    }
  }

  if (prefix < 0 || prefix > 32) {
    return {
      isValid: false,
      error: `Prefix /${prefix} tidak valid. Rentang CIDR yang diizinkan adalah /0 hingga /32.`,
    }
  }

  return {
    isValid: true,
    prefix,
    mask: prefixToMask(prefix),
  }
}

/**
 * Memvalidasi Subnet Mask desimal bertitik.
 * Subnet Mask wajib memiliki deretan bit '1' yang kontigu (berurutan tanpa terputus) dari kiri,
 * diikuti deretan bit '0'.
 */
export function validateSubnetMask(mask: string): MaskValidationResult {
  const ipValidation = validateIPv4(mask)
  if (!ipValidation.isValid || !ipValidation.octets) {
    return {
      isValid: false,
      error: ipValidation.error
        ? `Subnet Mask tidak valid: ${ipValidation.error}`
        : "Format Subnet Mask tidak valid.",
    }
  }

  const binaryStr = ipValidation.octets.map(octetToBinary).join("")

  // Subnet mask harus kontigu: 1*0*
  if (!/^1*0*$/.test(binaryStr)) {
    return {
      isValid: false,
      error: `Subnet Mask "${mask}" tidak kontigu (bit 1 dan 0 berselang-seling: ${ipValidation.octets
        .map(octetToBinary)
        .join(".")}). Subnet mask wajib berupa deretan bit 1 berurutan dari kiri.`,
    }
  }

  const prefix = binaryStr.indexOf("0") === -1 ? 32 : binaryStr.indexOf("0")
  return {
    isValid: true,
    prefix,
    mask: ipValidation.octets.join("."),
  }
}

/**
 * Mengonversi Subnet Mask desimal ke angka prefix CIDR, atau mengembalikan null jika tidak valid.
 */
export function maskToPrefix(mask: string): number | null {
  const res = validateSubnetMask(mask)
  return res.isValid && typeof res.prefix === "number" ? res.prefix : null
}

/**
 * Mem-parsing input gabungan seperti "192.168.10.130/26" atau "192.168.10.130".
 */
export function parseIPv4Input(raw: string): {
  ip: string
  prefix?: number
} {
  const trimmed = raw.trim()
  if (trimmed.includes("/")) {
    const [ipPart, prefixPart] = trimmed.split("/")
    const parsedPrefix = prefixPart !== undefined && prefixPart !== "" ? Number(prefixPart) : undefined
    return {
      ip: ipPart.trim(),
      prefix: parsedPrefix,
    }
  }
  return { ip: trimmed }
}

