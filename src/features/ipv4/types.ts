export type IPv4Class = "A" | "B" | "C" | "D" | "E" | "Loopback" | "Unspecified"

export type SpecialAddressType =
  | "public-unicast"
  | "private-rfc1918"
  | "loopback"
  | "apipa-link-local"
  | "multicast"
  | "experimental-reserved"
  | "limited-broadcast"
  | "unspecified"

export type BitRole = "network" | "subnet" | "host"

export interface ValidationResult {
  isValid: boolean
  error?: string
  octets?: [number, number, number, number]
}

export interface MaskValidationResult {
  isValid: boolean
  error?: string
  prefix?: number
  mask?: string
}

export interface ClassIdentification {
  ipClass: IPv4Class
  defaultPrefix: number | null
  defaultMask: string | null
  usageType: "Unicast" | "Multicast" | "Reserved/Experimental" | "Loopback" | "Special"
  specialType: SpecialAddressType
  specialLabel: string
  description: string
  isUnicastCalculable: boolean
}

export interface OctetBreakdown {
  octetIndex: 1 | 2 | 3 | 4
  ipDecimal: number
  ipBinary: string
  maskDecimal: number
  maskBinary: string
  networkDecimal: number
  broadcastDecimal: number
  roleLabel: string
}

export interface LinearBit {
  bitNumber: number // 1 to 32
  octetIndex: 1 | 2 | 3 | 4
  value: "0" | "1"
  maskBit: "0" | "1"
  role: BitRole
}

export interface SubnetBlock {
  index: number
  networkAddress: string
  firstHost: string
  lastHost: string
  broadcastAddress: string
  isCurrentSubnet: boolean
}

export interface CalculationStep {
  stepNumber: number
  title: string
  formula?: string
  summary: string
  details: string[]
}

export interface IPv4CalculationResult {
  isValid: boolean
  error?: string
  // Input Normalized
  ipAddress: string
  octets: [number, number, number, number]
  prefix: number
  subnetMask: string
  wildcardMask: string
  // Class & Special Status
  classification: ClassIdentification
  // Unicast Subnet Outputs
  networkAddress: string
  broadcastAddress: string
  firstUsableHost: string | null
  lastUsableHost: string | null
  usableHostRangeLabel: string
  totalAddresses: number
  usableHosts: number
  networkBits: number
  defaultNetworkBits: number
  borrowedSubnetBits: number
  hostBits: number
  subnetCount: number
  blockSize: number
  interestingOctet: 1 | 2 | 3 | 4
  // Binary & Visuals
  ipBinaryDotted: string
  maskBinaryDotted: string
  networkBinaryDotted: string
  broadcastBinaryDotted: string
  octetBreakdowns: [OctetBreakdown, OctetBreakdown, OctetBreakdown, OctetBreakdown]
  linearBits: LinearBit[]
  // Sample Subnet Blocks & Step-by-Step Explanations
  subnetBlocks: SubnetBlock[]
  totalSubnetBlocksInScope: number
  steps: CalculationStep[]
}

