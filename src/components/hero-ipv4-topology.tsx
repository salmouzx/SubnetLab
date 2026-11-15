import * as React from "react"

/**
 * Ilustrasi topologi IPv4 berbasis SVG transparan (tanpa background & tanpa efek glow)
 * yang menonjolkan pemetaan bit 32-bit, subnet mask, dan blok alamat CIDR.
 */
export function HeroIpv4Topology() {
  return (
    <div className="w-full flex items-center justify-center">
      <svg
        viewBox="0 0 460 304"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-full max-w-[440px] h-auto select-none"
      >
        {/* Jalur Sirkuit Cabang IPv4 (45 derajat, tanpa blur/glow) */}
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
          {/* A: Hub -> Top Center (Bit Biner) */}
          <path
            d="M230 214 V126 L235 121 V64"
            stroke="#FFB61E"
            strokeOpacity="0.8"
          />
          {/* B: Hub -> Top Left (Subnet Mask) */}
          <path
            d="M196 214 V178 L100 82"
            stroke="#FFFFFF"
            strokeOpacity="0.38"
          />
          {/* C: Hub -> Mid Left (Bit Pinjam Subnet) */}
          <path
            d="M158 228 H142 L142 161 L130 149"
            stroke="#4ADE80"
            strokeOpacity="0.7"
          />
          {/* D: Hub -> Bottom Left (Network ID) */}
          <path
            d="M158 256 H142 L130 268"
            stroke="#FFFFFF"
            strokeOpacity="0.38"
          />
          {/* E: Hub -> Top Right (Host Valid) */}
          <path
            d="M272 214 V196 L364 104"
            stroke="#FFB61E"
            strokeOpacity="0.75"
          />
          {/* F: Hub -> Mid Right (Ukuran Blok) */}
          <path
            d="M302 228 H320 V183 L338 165"
            stroke="#FFFFFF"
            strokeOpacity="0.38"
          />
          {/* G: Hub -> Bottom Right (Broadcast ID) */}
          <path
            d="M302 256 H320 L332 268 H338"
            stroke="#FFFFFF"
            strokeOpacity="0.38"
          />
        </g>

        {/* Titik Sambung (Terminal Pads) di Ujung Jalur */}
        <circle cx="235" cy="62" r="3.5" fill="#FFB61E" />
        <circle cx="100" cy="82" r="3.5" fill="#FFFFFF" fillOpacity="0.85" />
        <circle cx="129" cy="149" r="3.5" fill="#4ADE80" />
        <circle cx="129" cy="268" r="3.5" fill="#FFFFFF" fillOpacity="0.85" />
        <circle cx="364" cy="104" r="3.5" fill="#FFB61E" />
        <circle cx="336" cy="165" r="3.5" fill="#FFFFFF" fillOpacity="0.85" />
        <circle cx="336" cy="268" r="3.5" fill="#FFFFFF" fillOpacity="0.85" />

        {/* Titik Pangkal pada Hub */}
        <circle cx="230" cy="214" r="2.5" fill="#FFB61E" />
        <circle cx="196" cy="214" r="2.5" fill="#FFFFFF" fillOpacity="0.65" />
        <circle cx="272" cy="214" r="2.5" fill="#FFB61E" />

        {/* HUB PUSAT: Alamat IPv4 & Struktur 4 Oktet */}
        <g>
          <rect
            x="158"
            y="214"
            width="144"
            height="64"
            rx="10"
            fill="none"
            stroke="#FFB61E"
            strokeWidth="1.6"
          />
          <text
            x="230"
            y="231"
            textAnchor="middle"
            fill="#FFB61E"
            fontSize="9"
            fontWeight="700"
            fontFamily="var(--font-mono), monospace"
            letterSpacing="0.06em"
          >
            IPv4 • 32-BIT ADDRESS
          </text>
          <text
            x="230"
            y="248"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="12.5"
            fontWeight="700"
            fontFamily="var(--font-mono), monospace"
          >
            192.168.10.130/26
          </text>
          {/* 4 Oktet Mini Indicators */}
          <rect x="174" y="257" width="24" height="11" rx="2.5" fill="#FFFFFF" fillOpacity="0.14" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="0.8" />
          <text x="186" y="265" textAnchor="middle" fill="#FFFFFF" fillOpacity="0.8" fontSize="7" fontFamily="var(--font-mono), monospace">192</text>
          <circle cx="201" cy="265" r="1" fill="#FFFFFF" fillOpacity="0.6" />

          <rect x="204" y="257" width="24" height="11" rx="2.5" fill="#FFFFFF" fillOpacity="0.14" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="0.8" />
          <text x="216" y="265" textAnchor="middle" fill="#FFFFFF" fillOpacity="0.8" fontSize="7" fontFamily="var(--font-mono), monospace">168</text>
          <circle cx="231" cy="265" r="1" fill="#FFFFFF" fillOpacity="0.6" />

          <rect x="234" y="257" width="22" height="11" rx="2.5" fill="#FFFFFF" fillOpacity="0.14" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="0.8" />
          <text x="245" y="265" textAnchor="middle" fill="#FFFFFF" fillOpacity="0.8" fontSize="7" fontFamily="var(--font-mono), monospace">10</text>
          <circle cx="259" cy="265" r="1" fill="#FFFFFF" fillOpacity="0.6" />

          <rect x="262" y="257" width="24" height="11" rx="2.5" fill="#FFB61E" fillOpacity="0.22" stroke="#FFB61E" strokeOpacity="0.8" strokeWidth="0.9" />
          <text x="274" y="265" textAnchor="middle" fill="#FFB61E" fontSize="7" fontWeight="700" fontFamily="var(--font-mono), monospace">130</text>
        </g>

        {/* A: Node Top Center - Dekomposisi Bit Oktet ke-4 */}
        <g>
          <rect
            x="164"
            y="14"
            width="142"
            height="46"
            rx="8"
            fill="none"
            stroke="#FFB61E"
            strokeOpacity="0.65"
            strokeWidth="1.2"
          />
          <text
            x="235"
            y="30"
            textAnchor="middle"
            fill="#FFFFFF"
            fillOpacity="0.75"
            fontSize="8.5"
            fontWeight="600"
            fontFamily="var(--font-mono), monospace"
          >
            OKTET 4 • CIDR /26
          </text>
          {/* 2 Bit Subnet Hijau + Garis Prefix + 6 Bit Host Kuning */}
          <rect x="176" y="37" width="13" height="14" rx="2.5" fill="#16A34A" />
          <text x="182.5" y="47" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono), monospace">1</text>
          <rect x="191" y="37" width="13" height="14" rx="2.5" fill="#16A34A" />
          <text x="197.5" y="47" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono), monospace">0</text>

          <line x1="208" y1="35" x2="208" y2="53" stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="1.4" />

          {[
            { x: 212, v: "0" },
            { x: 226, v: "0" },
            { x: 240, v: "0" },
            { x: 254, v: "0" },
            { x: 268, v: "1" },
            { x: 282, v: "0" },
          ].map((b) => (
            <React.Fragment key={b.x}>
              <rect x={b.x} y="37" width="12" height="14" rx="2.5" fill="#FFB61E" />
              <text
                x={b.x + 6}
                y="47"
                textAnchor="middle"
                fill="#113057"
                fontSize="8.5"
                fontWeight="700"
                fontFamily="var(--font-mono), monospace"
              >
                {b.v}
              </text>
            </React.Fragment>
          ))}
        </g>

        {/* B: Node Top Left - Subnet Mask */}
        <g>
          <rect
            x="16"
            y="38"
            width="130"
            height="42"
            rx="8"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.3"
            strokeWidth="1.2"
          />
          <text
            x="81"
            y="54"
            textAnchor="middle"
            fill="#FFFFFF"
            fillOpacity="0.68"
            fontSize="8.5"
            fontWeight="600"
            fontFamily="var(--font-mono), monospace"
          >
            SUBNET MASK
          </text>
          <text
            x="81"
            y="70"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="11"
            fontWeight="700"
            fontFamily="var(--font-mono), monospace"
          >
            255.255.255.192
          </text>
        </g>

        {/* C: Node Mid Left - Bit Pinjam Subnet */}
        <g>
          <rect
            x="10"
            y="128"
            width="116"
            height="42"
            rx="8"
            fill="none"
            stroke="#4ADE80"
            strokeOpacity="0.6"
            strokeWidth="1.2"
          />
          <text
            x="68"
            y="144"
            textAnchor="middle"
            fill="#86EFAC"
            fontSize="8.5"
            fontWeight="700"
            fontFamily="var(--font-mono), monospace"
          >
            BIT SUBNET (S)
          </text>
          <text
            x="68"
            y="160"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="var(--font-mono), monospace"
          >
            2² = 4 Subnet
          </text>
        </g>

        {/* D: Node Bottom Left - Network ID */}
        <g>
          <rect
            x="10"
            y="247"
            width="116"
            height="42"
            rx="8"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.3"
            strokeWidth="1.2"
          />
          <text
            x="68"
            y="263"
            textAnchor="middle"
            fill="#FFFFFF"
            fillOpacity="0.68"
            fontSize="8.5"
            fontWeight="600"
            fontFamily="var(--font-mono), monospace"
          >
            NETWORK ID
          </text>
          <text
            x="68"
            y="279"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="var(--font-mono), monospace"
          >
            192.168.10.128
          </text>
        </g>

        {/* E: Node Top Right - Host Valid */}
        <g>
          <rect
            x="328"
            y="60"
            width="120"
            height="42"
            rx="8"
            fill="none"
            stroke="#FFB61E"
            strokeOpacity="0.65"
            strokeWidth="1.2"
          />
          <text
            x="388"
            y="76"
            textAnchor="middle"
            fill="#FFB61E"
            fontSize="8.5"
            fontWeight="700"
            fontFamily="var(--font-mono), monospace"
          >
            HOST VALID (62)
          </text>
          <text
            x="388"
            y="92"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="var(--font-mono), monospace"
          >
            .129 s.d. .190
          </text>
        </g>

        {/* F: Node Mid Right - Ukuran Blok */}
        <g>
          <rect
            x="338"
            y="144"
            width="112"
            height="42"
            rx="8"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.3"
            strokeWidth="1.2"
          />
          <text
            x="394"
            y="160"
            textAnchor="middle"
            fill="#FFFFFF"
            fillOpacity="0.68"
            fontSize="8.5"
            fontWeight="600"
            fontFamily="var(--font-mono), monospace"
          >
            UKURAN BLOK
          </text>
          <text
            x="394"
            y="176"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="var(--font-mono), monospace"
          >
            256 - 192 = 64
          </text>
        </g>

        {/* G: Node Bottom Right - Broadcast ID */}
        <g>
          <rect
            x="338"
            y="247"
            width="112"
            height="42"
            rx="8"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.3"
            strokeWidth="1.2"
          />
          <text
            x="394"
            y="263"
            textAnchor="middle"
            fill="#FFFFFF"
            fillOpacity="0.68"
            fontSize="8.5"
            fontWeight="600"
            fontFamily="var(--font-mono), monospace"
          >
            BROADCAST ID
          </text>
          <text
            x="394"
            y="279"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="var(--font-mono), monospace"
          >
            192.168.10.191
          </text>
        </g>
      </svg>
    </div>
  )
}
