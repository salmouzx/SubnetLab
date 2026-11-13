import { describe, expect, it } from "vitest"
import {
  calculateIPv4,
  classifyIPv4,
  maskToPrefix,
  octetToBinary,
  prefixToMask,
  validateIPv4,
  validatePrefix,
  validateSubnetMask,
} from "@/features/ipv4"

describe("IPv4 Domain Engine (PRD Section 7.4 Test Suite)", () => {
  it("1. 192.168.1.10/24 - Kelas C Default Prefix", () => {
    const res = calculateIPv4("192.168.1.10/24")
    expect(res.isValid).toBe(true)
    expect(res.classification.ipClass).toBe("C")
    expect(res.classification.specialType).toBe("private-rfc1918")
    expect(res.subnetMask).toBe("255.255.255.0")
    expect(res.wildcardMask).toBe("0.0.0.255")
    expect(res.networkAddress).toBe("192.168.1.0")
    expect(res.broadcastAddress).toBe("192.168.1.255")
    expect(res.firstUsableHost).toBe("192.168.1.1")
    expect(res.lastUsableHost).toBe("192.168.1.254")
    expect(res.totalAddresses).toBe(256)
    expect(res.usableHosts).toBe(254)
    expect(res.borrowedSubnetBits).toBe(0)
    expect(res.hostBits).toBe(8)
    expect(res.subnetCount).toBe(1)
  })

  it("2. 192.168.1.10/25 - Kelas C Subnet Pertama (/25)", () => {
    const res = calculateIPv4("192.168.1.10", 25)
    expect(res.isValid).toBe(true)
    expect(res.subnetMask).toBe("255.255.255.128")
    expect(res.networkAddress).toBe("192.168.1.0")
    expect(res.broadcastAddress).toBe("192.168.1.127")
    expect(res.firstUsableHost).toBe("192.168.1.1")
    expect(res.lastUsableHost).toBe("192.168.1.126")
    expect(res.totalAddresses).toBe(128)
    expect(res.usableHosts).toBe(126)
    expect(res.borrowedSubnetBits).toBe(1)
    expect(res.subnetCount).toBe(2)
    expect(res.blockSize).toBe(128)
    expect(res.subnetBlocks[0].isCurrentSubnet).toBe(true)
    expect(res.subnetBlocks[1].isCurrentSubnet).toBe(false)
  })

  it("3. 192.168.1.130/25 - Kelas C Subnet Kedua (/25)", () => {
    const res = calculateIPv4("192.168.1.130/25")
    expect(res.isValid).toBe(true)
    expect(res.subnetMask).toBe("255.255.255.128")
    expect(res.networkAddress).toBe("192.168.1.128")
    expect(res.broadcastAddress).toBe("192.168.1.255")
    expect(res.firstUsableHost).toBe("192.168.1.129")
    expect(res.lastUsableHost).toBe("192.168.1.254")
    expect(res.totalAddresses).toBe(128)
    expect(res.usableHosts).toBe(126)
    expect(res.subnetBlocks[0].isCurrentSubnet).toBe(false)
    expect(res.subnetBlocks[1].isCurrentSubnet).toBe(true)
  })

  it("4. 192.168.10.130/26 - Kasus Referensi Workbench (Subnet ke-3 dari 4)", () => {
    const res = calculateIPv4("192.168.10.130", 26)
    expect(res.isValid).toBe(true)
    expect(res.subnetMask).toBe("255.255.255.192")
    expect(res.networkAddress).toBe("192.168.10.128")
    expect(res.broadcastAddress).toBe("192.168.10.191")
    expect(res.firstUsableHost).toBe("192.168.10.129")
    expect(res.lastUsableHost).toBe("192.168.10.190")
    expect(res.borrowedSubnetBits).toBe(2)
    expect(res.hostBits).toBe(6)
    expect(res.subnetCount).toBe(4)
    expect(res.usableHosts).toBe(62)
    expect(res.blockSize).toBe(64)
    expect(res.subnetBlocks).toHaveLength(4)
    expect(res.subnetBlocks[2].isCurrentSubnet).toBe(true)
    expect(res.linearBits.filter((b) => b.role === "network")).toHaveLength(24)
    expect(res.linearBits.filter((b) => b.role === "subnet")).toHaveLength(2)
    expect(res.linearBits.filter((b) => b.role === "host")).toHaveLength(6)
  })

  it("5. 172.16.10.20/16 - Kelas B Private IP", () => {
    const res = calculateIPv4("172.16.10.20/16")
    expect(res.isValid).toBe(true)
    expect(res.classification.ipClass).toBe("B")
    expect(res.classification.specialType).toBe("private-rfc1918")
    expect(res.subnetMask).toBe("255.255.0.0")
    expect(res.networkAddress).toBe("172.16.0.0")
    expect(res.broadcastAddress).toBe("172.16.255.255")
    expect(res.firstUsableHost).toBe("172.16.0.1")
    expect(res.lastUsableHost).toBe("172.16.255.254")
    expect(res.totalAddresses).toBe(65536)
    expect(res.usableHosts).toBe(65534)
  })

  it("6. 10.10.10.10/8 - Kelas A Private IP", () => {
    const res = calculateIPv4("10.10.10.10/8")
    expect(res.isValid).toBe(true)
    expect(res.classification.ipClass).toBe("A")
    expect(res.classification.specialType).toBe("private-rfc1918")
    expect(res.subnetMask).toBe("255.0.0.0")
    expect(res.networkAddress).toBe("10.0.0.0")
    expect(res.broadcastAddress).toBe("10.255.255.255")
    expect(res.firstUsableHost).toBe("10.0.0.1")
    expect(res.lastUsableHost).toBe("10.255.255.254")
    expect(res.totalAddresses).toBe(16777216)
    expect(res.usableHosts).toBe(16777214)
  })

  it("7. 192.168.1.10/30 - Subnet Point-to-Point Konvensional (/30)", () => {
    const res = calculateIPv4("192.168.1.10/30")
    expect(res.isValid).toBe(true)
    expect(res.subnetMask).toBe("255.255.255.252")
    expect(res.networkAddress).toBe("192.168.1.8")
    expect(res.broadcastAddress).toBe("192.168.1.11")
    expect(res.firstUsableHost).toBe("192.168.1.9")
    expect(res.lastUsableHost).toBe("192.168.1.10")
    expect(res.totalAddresses).toBe(4)
    expect(res.usableHosts).toBe(2)
    expect(res.subnetCount).toBe(64)
    expect(res.blockSize).toBe(4)
  })

  it("8. Prefix /31 - RFC 3021 Point-to-Point Link (2 Usable Hosts)", () => {
    const res = calculateIPv4("192.168.1.10/31")
    expect(res.isValid).toBe(true)
    expect(res.subnetMask).toBe("255.255.255.254")
    expect(res.networkAddress).toBe("192.168.1.10")
    expect(res.broadcastAddress).toBe("192.168.1.11")
    expect(res.totalAddresses).toBe(2)
    expect(res.usableHosts).toBe(2)
    expect(res.firstUsableHost).toBe("192.168.1.10")
    expect(res.lastUsableHost).toBe("192.168.1.11")
  })

  it("9. Prefix /32 - Single Host Route (1 Usable Host)", () => {
    const res = calculateIPv4("192.168.1.10/32")
    expect(res.isValid).toBe(true)
    expect(res.subnetMask).toBe("255.255.255.255")
    expect(res.networkAddress).toBe("192.168.1.10")
    expect(res.broadcastAddress).toBe("192.168.1.10")
    expect(res.totalAddresses).toBe(1)
    expect(res.usableHosts).toBe(1)
    expect(res.firstUsableHost).toBe("192.168.1.10")
    expect(res.lastUsableHost).toBe("192.168.1.10")
  })

  it("10. Loopback Address (127.0.0.1)", () => {
    const res = calculateIPv4("127.0.0.1")
    expect(res.isValid).toBe(true)
    expect(res.classification.ipClass).toBe("Loopback")
    expect(res.classification.specialType).toBe("loopback")
    expect(res.prefix).toBe(8)
    expect(res.networkAddress).toBe("127.0.0.0")
    expect(res.broadcastAddress).toBe("127.255.255.255")
  })

  it("11. Multicast Class D (224.0.0.5)", () => {
    const res = calculateIPv4("224.0.0.5")
    expect(res.isValid).toBe(true)
    expect(res.classification.ipClass).toBe("D")
    expect(res.classification.usageType).toBe("Multicast")
    expect(res.classification.isUnicastCalculable).toBe(false)
    expect(res.usableHosts).toBe(0)
    expect(res.firstUsableHost).toBeNull()
    expect(res.lastUsableHost).toBeNull()
  })

  it("12. Experimental Class E (240.0.0.1)", () => {
    const res = calculateIPv4("240.0.0.1")
    expect(res.isValid).toBe(true)
    expect(res.classification.ipClass).toBe("E")
    expect(res.classification.usageType).toBe("Reserved/Experimental")
    expect(res.classification.isUnicastCalculable).toBe(false)
    expect(res.usableHosts).toBe(0)
  })

  it("13. Invalid IP & Non-Contiguous Subnet Mask Validation", () => {
    expect(validateIPv4("").isValid).toBe(false)
    expect(validateIPv4("192.168.1").isValid).toBe(false)
    expect(validateIPv4("192.168.1.256").isValid).toBe(false)
    expect(validateIPv4("192.168.01.10").isValid).toBe(false)
    expect(validateIPv4("192.168.1.abc").isValid).toBe(false)

    expect(validatePrefix(-1).isValid).toBe(false)
    expect(validatePrefix(33).isValid).toBe(false)
    expect(validatePrefix(26).mask).toBe("255.255.255.192")

    // Non-contiguous subnet mask: 255.255.255.160 (10100000 in last octet)
    const badMask = validateSubnetMask("255.255.255.160")
    expect(badMask.isValid).toBe(false)
    expect(badMask.error).toContain("tidak kontigu")

    // Valid contiguous mask
    const goodMask = validateSubnetMask("255.255.255.240")
    expect(goodMask.isValid).toBe(true)
    expect(goodMask.prefix).toBe(28)
    expect(maskToPrefix("255.255.255.240")).toBe(28)
    expect(prefixToMask(28)).toBe("255.255.255.240")
    expect(octetToBinary(130)).toBe("10000010")
    expect(classifyIPv4([169, 254, 1, 10]).specialType).toBe("apipa-link-local")
  })
})

