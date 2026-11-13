import {
  buildLinearBits,
  buildOctetBreakdowns,
  intToIp,
  intToOctets,
   octetsToBinaryDotted,
  octetsToInt,
  prefixToMaskInt,
} from "./binary"
import { classifyIPv4 } from "./classifier"
import { buildCalculationSteps } from "./explainer"
import type { IPv4CalculationResult, SubnetBlock } from "./types"
import {
  parseIPv4Input,
  validateIPv4,
  validatePrefix,
  validateSubnetMask,
} from "./validator"

const MAX_GENERATED_SUBNET_BLOCKS = 64

function buildInvalidResult(rawInput: string, errorMessage: string): IPv4CalculationResult {
  const zeroOctets: [number, number, number, number] = [0, 0, 0, 0]
  const fallbackClassification = classifyIPv4([192, 168, 1, 1])
  return {
    isValid: false,
    error: errorMessage,
    ipAddress: rawInput.trim(),
    octets: zeroOctets,
    prefix: 24,
    subnetMask: "255.255.255.0",
    wildcardMask: "0.0.0.255",
    classification: fallbackClassification,
    networkAddress: "0.0.0.0",
    broadcastAddress: "0.0.0.0",
    firstUsableHost: null,
    lastUsableHost: null,
    usableHostRangeLabel: "-",
    totalAddresses: 0,
    usableHosts: 0,
    networkBits: 24,
    defaultNetworkBits: 24,
    borrowedSubnetBits: 0,
    hostBits: 8,
    subnetCount: 0,
    blockSize: 0,
    interestingOctet: 4,
    ipBinaryDotted: "00000000.00000000.00000000.00000000",
    maskBinaryDotted: "11111111.11111111.11111111.00000000",
    networkBinaryDotted: "00000000.00000000.00000000.00000000",
    broadcastBinaryDotted: "00000000.00000000.00000000.00000000",
    octetBreakdowns: buildOctetBreakdowns(zeroOctets, [255, 255, 255, 0], zeroOctets, zeroOctets, 24, 24),
    linearBits: buildLinearBits(zeroOctets, [255, 255, 255, 0], 24, 24),
    subnetBlocks: [],
    totalSubnetBlocksInScope: 0,
    steps: [],
  }
}

/**
 * Menghitung daftar blok subnet di dalam cakupan jaringan induk (default classful atau batas oktet).
 */
function generateSubnetBlocks(
  ipInt: number,
  networkInt: number,
  prefix: number,
  defaultNetworkBits: number,
  isUnicastCalculable: boolean
): { blocks: SubnetBlock[]; totalInScope: number } {
  if (!isUnicastCalculable) {
    return { blocks: [], totalInScope: 0 }
  }

  const basePrefix = prefix >= defaultNetworkBits ? defaultNetworkBits : Math.floor(prefix / 8) * 8
  const borrowedInScope = Math.max(0, prefix - basePrefix)
  const totalInScope = Math.pow(2, borrowedInScope)
  const baseMaskInt = prefixToMaskInt(basePrefix)
  const baseNetworkInt = (ipInt & baseMaskInt) >>> 0
  const subnetAddressCount = Math.pow(2, 32 - prefix)

  const countToGenerate = Math.min(totalInScope, MAX_GENERATED_SUBNET_BLOCKS)
  const currentBlockIndex =
    subnetAddressCount > 0 ? Math.floor((networkInt - baseNetworkInt) / subnetAddressCount) : 0

  let startIndex = 0
  if (totalInScope > MAX_GENERATED_SUBNET_BLOCKS && currentBlockIndex >= MAX_GENERATED_SUBNET_BLOCKS) {
    startIndex = Math.max(
      0,
      Math.min(
        currentBlockIndex - Math.floor(MAX_GENERATED_SUBNET_BLOCKS / 2),
        totalInScope - MAX_GENERATED_SUBNET_BLOCKS
      )
    )
  }

  const blocks: SubnetBlock[] = []

  for (let offset = 0; offset < countToGenerate; offset++) {
    const idx = startIndex + offset
    const blockNetInt = (baseNetworkInt + idx * subnetAddressCount) >>> 0
    const blockBcastInt = (blockNetInt + subnetAddressCount - 1) >>> 0

    let firstHost: string
    let lastHost: string

    if (prefix === 32) {
      firstHost = intToIp(blockNetInt)
      lastHost = intToIp(blockNetInt)
    } else if (prefix === 31) {
      firstHost = intToIp(blockNetInt)
      lastHost = intToIp(blockBcastInt)
    } else {
      firstHost = intToIp((blockNetInt + 1) >>> 0)
      lastHost = intToIp((blockBcastInt - 1) >>> 0)
    }

    blocks.push({
      index: idx + 1,
      networkAddress: intToIp(blockNetInt),
      firstHost,
      lastHost,
      broadcastAddress: intToIp(blockBcastInt),
      isCurrentSubnet: blockNetInt === networkInt,
    })
  }

  return { blocks, totalInScope }
}

/**
 * Fungsi kalkulator utama IPv4 & Subnetting (Pure Function tanpa ketergantungan DOM/React).
 * Menerima input IPv4 (misal "192.168.10.130" atau "192.168.10.130/26") serta opsional prefix/subnet mask.
 */
export function calculateIPv4(
  rawIpInput: string,
  prefixOrMask?: number | string
): IPv4CalculationResult {
  const parsed = parseIPv4Input(rawIpInput)
  const ipVal = validateIPv4(parsed.ip)

  if (!ipVal.isValid || !ipVal.octets) {
    return buildInvalidResult(rawIpInput, ipVal.error ?? "Alamat IPv4 tidak valid.")
  }

  const octets = ipVal.octets
  const ipAddress = octets.join(".")
  const classification = classifyIPv4(octets)

  // Resolve prefix
  let resolvedPrefix: number
  if (prefixOrMask !== undefined && prefixOrMask !== "") {
    if (typeof prefixOrMask === "number") {
      const pVal = validatePrefix(prefixOrMask)
      if (!pVal.isValid || pVal.prefix === undefined) {
        return buildInvalidResult(rawIpInput, pVal.error ?? "Prefix CIDR tidak valid.")
      }
      resolvedPrefix = pVal.prefix
    } else {
      const trimmedMask = prefixOrMask.trim()
      if (trimmedMask.startsWith("/")) {
        const num = Number(trimmedMask.slice(1))
        const pVal = validatePrefix(num)
        if (!pVal.isValid || pVal.prefix === undefined) {
          return buildInvalidResult(rawIpInput, pVal.error ?? "Prefix CIDR tidak valid.")
        }
        resolvedPrefix = pVal.prefix
      } else if (/^\d+$/.test(trimmedMask)) {
        const num = Number(trimmedMask)
        const pVal = validatePrefix(num)
        if (!pVal.isValid || pVal.prefix === undefined) {
          return buildInvalidResult(rawIpInput, pVal.error ?? "Prefix CIDR tidak valid.")
        }
        resolvedPrefix = pVal.prefix
      } else {
        const mVal = validateSubnetMask(trimmedMask)
        if (!mVal.isValid || mVal.prefix === undefined) {
          return buildInvalidResult(rawIpInput, mVal.error ?? "Subnet Mask tidak valid.")
        }
        resolvedPrefix = mVal.prefix
      }
    }
  } else if (parsed.prefix !== undefined) {
    const pVal = validatePrefix(parsed.prefix)
    if (!pVal.isValid || pVal.prefix === undefined) {
      return buildInvalidResult(rawIpInput, pVal.error ?? "Prefix CIDR tidak valid.")
    }
    resolvedPrefix = pVal.prefix
  } else {
    resolvedPrefix = classification.defaultPrefix ?? 24
  }

  // Bitwise 32-bit unsigned calculations
  const ipInt = octetsToInt(octets)
  const maskInt = prefixToMaskInt(resolvedPrefix)
  const wildcardInt = (~maskInt) >>> 0
  const networkInt = (ipInt & maskInt) >>> 0
  const broadcastInt = (networkInt | wildcardInt) >>> 0

  const maskOctets = intToOctets(maskInt)
  const wildcardOctets = intToOctets(wildcardInt)
  const networkOctets = intToOctets(networkInt)
  const broadcastOctets = intToOctets(broadcastInt)

  const subnetMask = maskOctets.join(".")
  const wildcardMask = wildcardOctets.join(".")
  const networkAddress = networkOctets.join(".")
  const broadcastAddress = broadcastOctets.join(".")

  const defaultNetworkBits = classification.defaultPrefix ?? 24
  const borrowedSubnetBits = Math.max(0, resolvedPrefix - defaultNetworkBits)
  const hostBits = 32 - resolvedPrefix
  const subnetCount = Math.pow(2, borrowedSubnetBits)

  let interestingOctet: 1 | 2 | 3 | 4 = 4
  if (resolvedPrefix <= 8) {
    interestingOctet = 1
  } else if (resolvedPrefix <= 16) {
    interestingOctet = 2
  } else if (resolvedPrefix <= 24) {
    interestingOctet = 3
  } else {
    interestingOctet = 4
  }

  const blockSize = 256 - maskOctets[interestingOctet - 1]

  const totalAddresses = classification.isUnicastCalculable ? Math.pow(2, hostBits) : 0
  let usableHosts = 0
  let firstUsableHost: string | null = null
  let lastUsableHost: string | null = null
  let usableHostRangeLabel = `Tidak Berlaku (${classification.usageType})`

  if (classification.isUnicastCalculable) {
    if (resolvedPrefix === 32) {
      usableHosts = 1
      firstUsableHost = ipAddress
      lastUsableHost = ipAddress
      usableHostRangeLabel = `${ipAddress} (Host Tunggal /32)`
    } else if (resolvedPrefix === 31) {
      usableHosts = 2
      firstUsableHost = networkAddress
      lastUsableHost = broadcastAddress
      usableHostRangeLabel = `${firstUsableHost} s.d. ${lastUsableHost}`
    } else {
      usableHosts = Math.max(0, totalAddresses - 2)
      firstUsableHost = intToIp((networkInt + 1) >>> 0)
      lastUsableHost = intToIp((broadcastInt - 1) >>> 0)
      usableHostRangeLabel = `${firstUsableHost} s.d. ${lastUsableHost}`
    }
  }

  const ipBinaryDotted = octetsToBinaryDotted(octets)
  const maskBinaryDotted = octetsToBinaryDotted(maskOctets)
  const networkBinaryDotted = octetsToBinaryDotted(networkOctets)
  const broadcastBinaryDotted = octetsToBinaryDotted(broadcastOctets)

  const octetBreakdowns = buildOctetBreakdowns(
    octets,
    maskOctets,
    networkOctets,
    broadcastOctets,
    defaultNetworkBits,
    resolvedPrefix
  )

  const linearBits = buildLinearBits(octets, maskOctets, defaultNetworkBits, resolvedPrefix)

  const { blocks: subnetBlocks, totalInScope: totalSubnetBlocksInScope } = generateSubnetBlocks(
    ipInt,
    networkInt,
    resolvedPrefix,
    defaultNetworkBits,
    classification.isUnicastCalculable
  )

  const steps = buildCalculationSteps({
    ipAddress,
    prefix: resolvedPrefix,
    subnetMask,
    wildcardMask,
    classification,
    networkAddress,
    broadcastAddress,
    firstUsableHost,
    lastUsableHost,
    totalAddresses,
    usableHosts,
    defaultNetworkBits,
    borrowedSubnetBits,
    hostBits,
    subnetCount,
    blockSize,
    interestingOctet,
    ipBinaryDotted,
    maskBinaryDotted,
    networkBinaryDotted,
    broadcastBinaryDotted,
  })

  return {
    isValid: true,
    ipAddress,
    octets,
    prefix: resolvedPrefix,
    subnetMask,
    wildcardMask,
    classification,
    networkAddress,
    broadcastAddress,
    firstUsableHost,
    lastUsableHost,
    usableHostRangeLabel,
    totalAddresses,
    usableHosts,
    networkBits: resolvedPrefix,
    defaultNetworkBits,
    borrowedSubnetBits,
    hostBits,
    subnetCount,
    blockSize,
    interestingOctet,
    ipBinaryDotted,
    maskBinaryDotted,
    networkBinaryDotted,
    broadcastBinaryDotted,
    octetBreakdowns,
    linearBits,
    subnetBlocks,
    totalSubnetBlocksInScope,
    steps,
  }
}

