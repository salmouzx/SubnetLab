import type { CalculationStep, ClassIdentification } from "./types"

export interface ExplainerParams {
  ipAddress: string
  prefix: number
  subnetMask: string
  wildcardMask: string
  classification: ClassIdentification
  networkAddress: string
  broadcastAddress: string
  firstUsableHost: string | null
  lastUsableHost: string | null
  totalAddresses: number
  usableHosts: number
  defaultNetworkBits: number
  borrowedSubnetBits: number
  hostBits: number
  subnetCount: number
  blockSize: number
  interestingOctet: 1 | 2 | 3 | 4
  ipBinaryDotted: string
  maskBinaryDotted: string
  networkBinaryDotted: string
  broadcastBinaryDotted: string
}

/**
 * Membangun penjelasan langkah demi langkah (Step-by-Step) perhitungan IPv4 & Subnetting.
 */
export function buildCalculationSteps(params: ExplainerParams): CalculationStep[] {
  const {
    ipAddress,
    prefix,
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
  } = params

  if (!classification.isUnicastCalculable) {
    return [
      {
        stepNumber: 1,
        title: `Identifikasi Kelas ${classification.ipClass} (${classification.usageType})`,
        summary: classification.description,
        details: [
          `Alamat IP: ${ipAddress}`,
          `Representasi Biner 32-bit: ${ipBinaryDotted}`,
          `Status Khusus: ${classification.specialLabel}`,
          `Catatan Teknis: Karena termasuk ${classification.usageType}, alamat ini tidak dibagi menjadi Network ID, Broadcast ID, maupun Usable Host seperti alamat unicast Kelas A, B, dan C.`,
        ],
      },
    ]
  }

  const steps: CalculationStep[] = [
    {
      stepNumber: 1,
      title: "Identifikasi Kelas & Konversi Biner 32-Bit",
      summary: `Alamat ${ipAddress} teridentifikasi sebagai Kelas ${classification.ipClass} (${classification.specialLabel}).`,
      details: [
        `Oktet pertama menentukan kelas alamat: Kelas ${classification.ipClass} (Default Prefix /${classification.defaultPrefix ?? 24}).`,
        `IP Desimal : ${ipAddress}`,
        `IP Biner   : ${ipBinaryDotted}`,
      ],
    },
    {
      stepNumber: 2,
      title: "Penentuan Subnet Mask, Prefix CIDR & Bit Pinjam",
      formula: `Prefix /${prefix} = ${prefix} bit '1' dan ${hostBits} bit '0'`,
      summary: `Prefix /${prefix} menghasilkan Subnet Mask ${subnetMask} dengan ${borrowedSubnetBits} bit pinjam subnet dan ${hostBits} bit host.`,
      details: [
        `Mask Biner   : ${maskBinaryDotted}`,
        `Mask Desimal : ${subnetMask} (Wildcard: ${wildcardMask})`,
        `Pembagian 32-bit: ${defaultNetworkBits} bit Default Network + ${borrowedSubnetBits} bit Pinjam Subnet + ${hostBits} bit Host = 32 bit.`,
        `Jumlah Subnet = 2^${borrowedSubnetBits} = ${subnetCount.toLocaleString("id-ID")} blok subnet (Ukuran blok: ${blockSize} pada Oktet ke-${interestingOctet}).`,
      ],
    },
    {
      stepNumber: 3,
      title: "Menghitung Network Address (Operasi Bitwise AND)",
      formula: "Network Address = IP Address AND Subnet Mask",
      summary: `Hasil operasi logika AND antara setiap bit IP dan Subnet Mask menghasilkan Network ID ${networkAddress}.`,
      details: [
        `IP Biner      : ${ipBinaryDotted}`,
        `Mask Biner    : ${maskBinaryDotted}`,
        `Hasil AND     : ${networkBinaryDotted}`,
        `Network ID    : ${networkAddress} (Semua ${hostBits} bit host diset menjadi 0).`,
      ],
    },
    {
      stepNumber: 4,
      title: "Menghitung Broadcast Address (Operasi Bitwise OR Wildcard)",
      formula: "Broadcast Address = Network Address OR Wildcard Mask",
      summary: `Mengubah seluruh ${hostBits} bit host menjadi '1' menghasilkan Broadcast ID ${broadcastAddress}.`,
      details: [
        `Network Biner   : ${networkBinaryDotted}`,
        `Broadcast Biner : ${broadcastBinaryDotted}`,
        `Broadcast ID    : ${broadcastAddress} (Alamat terakhir pada blok subnet ini).`,
      ],
    },
  ]

  if (prefix === 32) {
    steps.push({
      stepNumber: 5,
      title: "Perhitungan Host Valid (Kasus Khusus /32 Host Route)",
      formula: "Total Address = 2^(32 - 32) = 1",
      summary: `Prefix /32 merepresentasikan satu alamat host tunggal (${ipAddress}).`,
      details: [
        `Bit Host (h) = 0 bit.`,
        `Total Alamat = 2^0 = 1 alamat tunggal (${ipAddress}).`,
        `Digunakan untuk host route spesifik atau interface loopback.`,
      ],
    })
  } else if (prefix === 31) {
    steps.push({
      stepNumber: 5,
      title: "Perhitungan Host Valid (Kasus Khusus /31 Point-to-Point RFC 3021)",
      formula: "Usable Host (/31) = 2^(32 - 31) = 2 alamat",
      summary: `Sesuai standar RFC 3021, subnet /31 menyediakan 2 alamat usable (${firstUsableHost} dan ${lastUsableHost}) untuk tautan point-to-point.`,
      details: [
        `Bit Host (h) = 1 bit -> Total Alamat = 2^1 = 2.`,
        `Pada tautan point-to-point (/31), tidak diperlukan alamat directed broadcast terpisah.`,
        `Host Pertama : ${firstUsableHost}`,
        `Host Terakhir: ${lastUsableHost}`,
      ],
    })
  } else {
    steps.push({
      stepNumber: 5,
      title: "Perhitungan Total Alamat & Rentang Host Valid (Usable Host)",
      formula: `Total = 2^${hostBits} = ${totalAddresses.toLocaleString("id-ID")} | Usable = 2^${hostBits} - 2 = ${usableHosts.toLocaleString("id-ID")}`,
      summary: `Terdapat ${usableHosts.toLocaleString("id-ID")} alamat host yang dapat digunakan dari ${firstUsableHost} s.d. ${lastUsableHost}.`,
      details: [
        `Total Alamat = 2^${hostBits} = ${totalAddresses.toLocaleString("id-ID")} alamat.`,
        `Dikurangi 2 alamat cadangan (1 Network ID: ${networkAddress} dan 1 Broadcast ID: ${broadcastAddress}).`,
        `Host Pertama (Network + 1)   : ${firstUsableHost}`,
        `Host Terakhir (Broadcast - 1): ${lastUsableHost}`,
      ],
    })
  }

  return steps
}

