import type { ClassIdentification, SpecialAddressType } from "./types"

/**
 * Mengidentifikasi Kelas IPv4 (A, B, C, D, E, Loopback, Unspecified) beserta karakteristik khususnya.
 * Sesuai PRD Bagian 7.1:
 * - Kelas A: 1–126 (Default /8, Unicast)
 * - 127.0.0.0/8: Loopback
 * - 0.0.0.0/8: Unspecified / "This Network"
 * - Kelas B: 128–191 (Default /16, Unicast)
 * - Kelas C: 192–223 (Default /24, Unicast)
 * - Kelas D: 224–239 (Multicast)
 * - Kelas E: 240–255 (Reserved / Experimental)
 */
export function classifyIPv4(octets: [number, number, number, number]): ClassIdentification {
  const [o1, o2, o3, o4] = octets

  // Detect Special Address Scope
  let specialType: SpecialAddressType = "public-unicast"
  let specialLabel = "Public Unicast"

  if (o1 === 0) {
    specialType = "unspecified"
    specialLabel = "Alamat Khusus (0.0.0.0/8 - This Network)"
  } else if (o1 === 127) {
    specialType = "loopback"
    specialLabel = "Loopback Address (RFC 1122)"
  } else if (o1 === 10) {
    specialType = "private-rfc1918"
    specialLabel = "Private IP Kelas A (RFC 1918: 10.0.0.0/8)"
  } else if (o1 === 172 && o2 >= 16 && o2 <= 31) {
    specialType = "private-rfc1918"
    specialLabel = "Private IP Kelas B (RFC 1918: 172.16.0.0/12)"
  } else if (o1 === 192 && o2 === 168) {
    specialType = "private-rfc1918"
    specialLabel = "Private IP Kelas C (RFC 1918: 192.168.0.0/16)"
  } else if (o1 === 169 && o2 === 254) {
    specialType = "apipa-link-local"
    specialLabel = "APIPA / Link-Local (RFC 3927: 169.254.0.0/16)"
  } else if (o1 === 255 && o2 === 255 && o3 === 255 && o4 === 255) {
    specialType = "limited-broadcast"
    specialLabel = "Limited Broadcast (255.255.255.255)"
  } else if (o1 >= 224 && o1 <= 239) {
    specialType = "multicast"
    specialLabel = "Multicast Group Address (RFC 5771)"
  } else if (o1 >= 240 && o1 <= 255) {
    specialType = "experimental-reserved"
    specialLabel = "Reserved / Experimental Address (RFC 1112)"
  }

  // Class determination
  if (o1 === 0) {
    return {
      ipClass: "Unspecified",
      defaultPrefix: 8,
      defaultMask: "255.0.0.0",
      usageType: "Special",
      specialType,
      specialLabel,
      description:
        "Rentang 0.0.0.0/8 dicadangkan untuk pengalamatan sumber saat host belum memiliki IP (misal proses DHCP Discovery).",
      isUnicastCalculable: true,
    }
  }

  if (o1 >= 1 && o1 <= 126) {
    return {
      ipClass: "A",
      defaultPrefix: 8,
      defaultMask: "255.0.0.0",
      usageType: "Unicast",
      specialType,
      specialLabel,
      description:
        "Kelas A (1–126) dirancang untuk jaringan unicast berskala sangat besar dengan default prefix /8 (8 bit Network, 24 bit Host).",
      isUnicastCalculable: true,
    }
  }

  if (o1 === 127) {
    return {
      ipClass: "Loopback",
      defaultPrefix: 8,
      defaultMask: "255.0.0.0",
      usageType: "Loopback",
      specialType,
      specialLabel,
      description:
        "Rentang 127.0.0.0/8 digunakan untuk pengujian loopback internal perangkat (localhost) dan tidak pernah dikirim ke jaringan fisik.",
      isUnicastCalculable: true,
    }
  }

  if (o1 >= 128 && o1 <= 191) {
    return {
      ipClass: "B",
      defaultPrefix: 16,
      defaultMask: "255.255.0.0",
      usageType: "Unicast",
      specialType,
      specialLabel,
      description:
        "Kelas B (128–191) digunakan untuk jaringan unicast skala menengah hingga besar dengan default prefix /16 (16 bit Network, 16 bit Host).",
      isUnicastCalculable: true,
    }
  }

  if (o1 >= 192 && o1 <= 223) {
    return {
      ipClass: "C",
      defaultPrefix: 24,
      defaultMask: "255.255.255.0",
      usageType: "Unicast",
      specialType,
      specialLabel,
      description:
        "Kelas C (192–223) digunakan untuk jaringan unicast skala kecil (LAN) dengan default prefix /24 (24 bit Network, 8 bit Host).",
      isUnicastCalculable: true,
    }
  }

  if (o1 >= 224 && o1 <= 239) {
    return {
      ipClass: "D",
      defaultPrefix: null,
      defaultMask: null,
      usageType: "Multicast",
      specialType,
      specialLabel,
      description:
        "Kelas D (224–239) merupakan alamat Multicast untuk pengiriman paket satu-ke-banyak grup. Kelas D tidak memiliki pembagian Network/Host atau Subnet Mask unicast konvensional.",
      isUnicastCalculable: false,
    }
  }

  return {
    ipClass: "E",
    defaultPrefix: null,
    defaultMask: null,
    usageType: "Reserved/Experimental",
    specialType,
    specialLabel,
    description:
      "Kelas E (240–255) dicadangkan untuk keperluan eksperimental dan riset oleh IETF/IANA. Alamat ini tidak dapat digunakan untuk pengalamatan host unicast standar.",
    isUnicastCalculable: false,
  }
}

