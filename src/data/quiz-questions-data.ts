export interface QuizQuestion {
  id: string
  topicOrder: number
  topicTitle: string
  question: string
  contextIp?: string
  options: [string, string, string, string]
  correctIndex: number
  explanation: string
  steps: string[]
}

export const QUIZ_TOTAL_QUESTIONS = 20
export const QUIZ_POINTS_PER_QUESTION = 5
export const QUIZ_PASSING_SCORE = 75 // Minimal 15 benar x 5 poin = 75
export const QUIZ_DURATION_MINUTES = 60
export const QUIZ_DURATION_SECONDS = QUIZ_DURATION_MINUTES * 60

/**
 * Bank Soal Kuis Evaluasi Komprehensif (30 Butir Soal Pilihan Ganda Lintas Topik 1–12 Kelas C).
 * Setiap sesi kuis (Utama maupun Remedial) akan mengambil 20 soal secara teracak proporsional.
 */
export const QUIZ_QUESTIONS_BANK: QuizQuestion[] = [
  // Topik 1: Pengenalan IPv4
  {
    id: "quiz-q1",
    topicOrder: 1,
    topicTitle: "Pengenalan IPv4",
    question:
      "Pada model jaringan TCP/IP, protokol IPv4 bekerja pada lapisan yang bertanggung jawab atas pengalamatan logis dan perutean paket lintas jaringan, yaitu lapisan...",
    options: [
      "Application Layer",
      "Transport Layer",
      "Internet / Network Layer",
      "Physical Layer",
    ],
    correctIndex: 2,
    explanation:
      "IPv4 beroperasi pada Internet Layer (TCP/IP) atau Network Layer (Layer 3 OSI) untuk menangani pengalamatan logis (IP Address) dan penentuan jalur (routing).",
    steps: [
      "Layer 3 OSI / Internet Layer TCP/IP = Pengalamatan logis IPv4 & Routing",
      "Layer 2 Data Link = Pengalamatan fisik MAC Address",
    ],
  },
  {
    id: "quiz-q2",
    topicOrder: 1,
    topicTitle: "Pengenalan IPv4",
    question:
      "Berapa jumlah total kombinasi alamat teoritis yang dapat dibentuk oleh ruang alamat IPv4 32-bit?",
    options: [
      "2^16 = 65.536 alamat",
      "2^24 = 16.777.216 alamat",
      "2^32 = 4.294.967.296 alamat",
      "2^64 = 18.446.744.073.709.551.616 alamat",
    ],
    correctIndex: 2,
    explanation:
      "Karena setiap bit memiliki 2 kemungkinan nilai (0 atau 1) dan panjang IPv4 adalah 32 bit, maka ruang alamat totalnya adalah 2^32 = 4.294.967.296 alamat.",
    steps: [
      "Panjang IPv4 = 32 bit biner",
      "Total kombinasi = 2^32 = 4.294.967.296 alamat",
    ],
  },

  // Topik 2: Struktur & Format Alamat IPv4
  {
    id: "quiz-q3",
    topicOrder: 2,
    topicTitle: "Struktur & Format IPv4",
    question:
      "Manakah di antara alamat berikut yang memiliki format penulisan Dotted-Decimal Notation yang VALID sebagai alamat IPv4?",
    options: [
      "192.168.1.256",
      "192.168.0.1.5",
      "192.168.255.0",
      "192.168.-1.10",
    ],
    correctIndex: 2,
    explanation:
      "Setiap alamat IPv4 harus terdiri atas tepat 4 oktet yang masing-masing bernilai 0 hingga 255. Alamat 192.168.255.0 memenuhi syarat tersebut.",
    steps: [
      "192.168.1.256 -> Salah (256 > 255)",
      "192.168.0.1.5 -> Salah (terdiri dari 5 oktet)",
      "192.168.255.0 -> Valid (4 oktet, masing-masing dalam rentang 0–255)",
    ],
  },
  {
    id: "quiz-q4",
    topicOrder: 2,
    topicTitle: "Struktur & Format IPv4",
    question:
      "Pada struktur alamat IPv4 32-bit, oktet ketiga mencakup rentang posisi bit ke-...",
    options: [
      "Bit ke-1 sampai ke-8",
      "Bit ke-9 sampai ke-16",
      "Bit ke-17 sampai ke-24",
      "Bit ke-25 sampai ke-32",
    ],
    correctIndex: 2,
    explanation:
      "Oktet 1 = bit 1–8, Oktet 2 = bit 9–16, Oktet 3 = bit 17–24, dan Oktet 4 = bit 25–32.",
    steps: [
      "Oktet 1: bit 1..8",
      "Oktet 2: bit 9..16",
      "Oktet 3: bit 17..24",
      "Oktet 4: bit 25..32",
    ],
  },

  // Topik 3: Konversi Desimal & Biner
  {
    id: "quiz-q5",
    topicOrder: 3,
    topicTitle: "Konversi Desimal & Biner",
    question:
      "Berapakah representasi biner 8-bit yang tepat untuk nilai oktet desimal 210?",
    options: ["11010010", "11001010", "11010100", "10110010"],
    correctIndex: 0,
    explanation:
      "Angka 210 diperoleh dari penjumlahan bobot 128 + 64 + 16 + 2 = 210, sehingga bit aktif berada di posisi 128, 64, 16, dan 2 (11010010).",
    steps: [
      "210 - 128 = 82 (bit 128 = 1)",
      "82 - 64 = 18 (bit 64 = 1)",
      "18 < 32 (bit 32 = 0)",
      "18 - 16 = 2 (bit 16 = 1)",
      "2 < 8, 2 < 4 (bit 8, 4 = 0); 2 - 2 = 0 (bit 2 = 1; bit 1 = 0)",
      "Hasil = 11010010",
    ],
  },
  {
    id: "quiz-q6",
    topicOrder: 3,
    topicTitle: "Konversi Desimal & Biner",
    question:
      "Sebuah oktet keempat memiliki representasi biner 10010110. Berapakah nilai desimalnya?",
    options: ["146", "150", "154", "166"],
    correctIndex: 1,
    explanation:
      "Pada 10010110, bit bernilai 1 berada pada bobot 128, 16, 4, dan 2: 128 + 16 + 4 + 2 = 150.",
    steps: [
      "Bobot bit aktif: 128 + 0 + 0 + 16 + 0 + 4 + 2 + 0",
      "Total = 128 + 16 + 4 + 2 = 150",
    ],
  },
  {
    id: "quiz-q7",
    topicOrder: 3,
    topicTitle: "Konversi Desimal & Biner",
    question:
      "Alamat IPv4 192.168.10.129 jika dituliskan dalam format biner pada oktet keempatnya adalah...",
    contextIp: "192.168.10.129",
    options: ["10000001", "10000010", "11000001", "01111111"],
    correctIndex: 0,
    explanation:
      "Oktet keempat bernilai 129, yang merupakan hasil dari 128 + 1, sehingga binernya adalah 10000001.",
    steps: [
      "Oktet ke-4 = 129",
      "129 = 128 (bit ke-1) + 1 (bit ke-8) = 10000001",
    ],
  },

  // Topik 4: Network ID & Host ID Kelas C
  {
    id: "quiz-q8",
    topicOrder: 4,
    topicTitle: "Network ID & Host ID Kelas C",
    question:
      "Manakah di antara pasangan alamat IPv4 berikut yang KEDUANYA termasuk ke dalam Kelas C (rentang oktet pertama 192–223)?",
    options: [
      "192.168.1.10 dan 172.31.10.5",
      "191.255.10.1 dan 200.10.10.1",
      "192.0.2.15 dan 223.255.254.10",
      "220.10.5.1 dan 224.0.0.9",
    ],
    correctIndex: 2,
    explanation:
      "Rentang oktet pertama Kelas C adalah 192 hingga 223. Baik 192.0.2.15 (oktet pertama 192) maupun 223.255.254.10 (oktet pertama 223) berada di dalam rentang Kelas C.",
    steps: [
      "172.31.x.x dan 191.255.x.x -> Kelas B (128–191)",
      "224.0.0.9 -> Kelas D Multicast (224–239)",
      "192.0.2.15 dan 223.255.254.10 -> Keduanya Kelas C (192–223)",
    ],
  },
  {
    id: "quiz-q9",
    topicOrder: 4,
    topicTitle: "Network ID & Host ID Kelas C",
    question:
      "Agar dua komputer pada jaringan Kelas C default (/24) dapat berkomunikasi secara langsung melalui sebuah Switch tanpa melalui Router, syarat pengalamatannya adalah...",
    options: [
      "Oktet keempat keduanya harus bernilai sama persis",
      "Tiga oktet pertama (Network ID) harus identik dan oktet keempat (Host ID) harus unik (berbeda)",
      "Tiga oktet pertama harus berbeda dan oktet keempat harus sama",
      "Keduanya harus menggunakan alamat Broadcast yang berbeda",
    ],
    correctIndex: 1,
    explanation:
      "Komunikasi langsung dalam satu segmen LAN (/24) mensyaratkan Network ID (3 oktet pertama) yang sama dan Host ID (oktet keempat) yang unik agar tidak terjadi IP conflict.",
    steps: [
      "Satu jaringan /24 -> Oktet 1, 2, dan 3 wajib sama",
      "Identitas perangkat -> Oktet 4 wajib berbeda (1–254)",
    ],
  },

  // Topik 5: Subnet Mask
  {
    id: "quiz-q10",
    topicOrder: 5,
    topicTitle: "Subnet Mask",
    question:
      "Manakah di bawah ini yang merupakan Subnet Mask VALID dalam standar pengalamatan IPv4?",
    options: [
      "255.255.255.160",
      "255.255.255.224",
      "255.255.240.128",
      "255.255.255.200",
    ],
    correctIndex: 1,
    explanation:
      "Subnet Mask wajib memiliki bit '1' yang berurutan tanpa putus dari kiri (kontigu). 255.255.255.224 memiliki oktet keempat 11100000 (kontigu /27).",
    steps: [
      "160 = 10100000 (tidak kontigu)",
      "200 = 11001000 (tidak kontigu)",
      "255.255.240.128 = oktet ke-3 belum 255 namun oktet ke-4 bernilai 128 (tidak kontigu)",
      "255.255.255.224 = 11111111.11111111.11111111.11100000 (Valid /27)",
    ],
  },
  {
    id: "quiz-q11",
    topicOrder: 5,
    topicTitle: "Subnet Mask",
    question:
      "Jika sebuah sub-jaringan Kelas C menggunakan Subnet Mask 255.255.255.248, berapakah Wildcard Mask-nya?",
    options: ["0.0.0.3", "0.0.0.7", "0.0.0.15", "0.0.0.31"],
    correctIndex: 1,
    explanation:
      "Wildcard Mask diperoleh dengan mengurangkan 255.255.255.255 dengan Subnet Mask: 255 - 248 = 7, sehingga hasilnya 0.0.0.7.",
    steps: [
      "Wildcard Mask = 255.255.255.255 - 255.255.255.248",
      "Oktet ke-4 = 255 - 248 = 7 -> 0.0.0.7",
    ],
  },

  // Topik 6: Notasi CIDR
  {
    id: "quiz-q12",
    topicOrder: 6,
    topicTitle: "Notasi CIDR",
    question:
      "Pada konfigurasi jaringan 192.168.25.0/27, berapakah jumlah bit yang dipinjam untuk subnet (s) dari Kelas C default dan berapa sisa bit host (h)?",
    contextIp: "192.168.25.0/27",
    options: [
      "s = 2 bit subnet dan h = 6 bit host",
      "s = 3 bit subnet dan h = 5 bit host",
      "s = 4 bit subnet dan h = 4 bit host",
      "s = 5 bit subnet dan h = 3 bit host",
    ],
    correctIndex: 1,
    explanation:
      "Dari prefix dasar Kelas C (/24) menuju /27, jumlah bit yang dipinjam adalah s = 27 - 24 = 3 bit, dan sisa bit host adalah h = 32 - 27 = 5 bit.",
    steps: [
      "Bit pinjaman subnet (s) = 27 - 24 = 3 bit",
      "Sisa bit host (h) = 32 - 27 = 5 bit",
      "Subnet Mask = 255.255.255.224",
    ],
  },
  {
    id: "quiz-q13",
    topicOrder: 6,
    topicTitle: "Notasi CIDR",
    question:
      "Subnet Mask 255.255.255.252 setara dengan penulisan notasi prefix CIDR...",
    options: ["/27", "/28", "/29", "/30"],
    correctIndex: 3,
    explanation:
      "Angka 252 dalam biner adalah 11111100 (6 bit bernilai 1). Ditambah 24 bit dari tiga oktet pertama: 24 + 6 = /30.",
    steps: [
      "255.255.255 = 24 bit",
      "252 = 128 + 64 + 32 + 16 + 8 + 4 = 11111100 (6 bit)",
      "Total prefix = 24 + 6 = /30",
    ],
  },

  // Topik 7: Perhitungan Network Address
  {
    id: "quiz-q14",
    topicOrder: 7,
    topicTitle: "Network Address",
    question:
      "Sebuah host memiliki alamat IP 192.168.10.145 dengan Subnet Mask 255.255.255.192 (/26). Berapakah Network Address dari host tersebut?",
    contextIp: "192.168.10.145/26",
    options: [
      "192.168.10.0",
      "192.168.10.64",
      "192.168.10.128",
      "192.168.10.192",
    ],
    correctIndex: 2,
    explanation:
      "Ukuran blok /26 adalah 256 - 192 = 64. Kelipatan bloknya adalah 0, 64, 128, 192. Karena 145 berada di antara 128 dan 191, maka Network Address-nya adalah 192.168.10.128.",
    steps: [
      "Block Size /26 = 256 - 192 = 64",
      "Deret Network ID: .0, .64, .128, .192",
      "145 berada pada blok .128 s.d. .191 -> Network Address = 192.168.10.128",
    ],
  },
  {
    id: "quiz-q15",
    topicOrder: 7,
    topicTitle: "Network Address",
    question:
      "Berapakah Network Address untuk alamat IP 192.168.40.100/27?",
    contextIp: "192.168.40.100/27",
    options: [
      "192.168.40.64",
      "192.168.40.96",
      "192.168.40.128",
      "192.168.40.90",
    ],
    correctIndex: 1,
    explanation:
      "Prefix /27 memiliki Subnet Mask 255.255.255.224 (ukuran blok = 32). Kelipatan 32 adalah 0, 32, 64, 96, 128. Kelipatan terbesar <= 100 adalah 96 (192.168.40.96).",
    steps: [
      "Ukuran blok /27 = 256 - 224 = 32",
      "Kelipatan 32: 0, 32, 64, 96, 128",
      "100 jatuh di blok 96..127 -> Network Address = 192.168.40.96",
    ],
  },
  {
    id: "quiz-q16",
    topicOrder: 7,
    topicTitle: "Network Address",
    question:
      "Tentukan Network Address dari perangkat dengan IP 202.150.5.70/28!",
    contextIp: "202.150.5.70/28",
    options: [
      "202.150.5.48",
      "202.150.5.64",
      "202.150.5.68",
      "202.150.5.80",
    ],
    correctIndex: 1,
    explanation:
      "Ukuran blok /28 (Mask .240) adalah 16. Kelipatan 16 adalah 0, 16, 32, 48, 64, 80. Angka 70 berada pada blok yang diawali oleh 64, yaitu 202.150.5.64.",
    steps: [
      "Ukuran blok /28 = 256 - 240 = 16",
      "Kelipatan 16 terdekat <= 70 adalah 64 (4 x 16 = 64)",
      "Network Address = 202.150.5.64",
    ],
  },

  // Topik 8: Perhitungan Broadcast Address
  {
    id: "quiz-q17",
    topicOrder: 8,
    topicTitle: "Broadcast Address",
    question:
      "Berapakah Broadcast Address untuk sub-jaringan yang menaungi alamat 192.168.1.80/26?",
    contextIp: "192.168.1.80/26",
    options: [
      "192.168.1.63",
      "192.168.1.126",
      "192.168.1.127",
      "192.168.1.255",
    ],
    correctIndex: 2,
    explanation:
      "Pada /26 (ukuran blok 64), angka 80 berada di blok kedua (64 s.d. 127). Maka Broadcast Address-nya adalah 192.168.1.127.",
    steps: [
      "Ukuran blok /26 = 64",
      "Blok untuk .80 dimulai pada Network .64",
      "Broadcast = 64 + 64 - 1 = 127 -> 192.168.1.127",
    ],
  },
  {
    id: "quiz-q18",
    topicOrder: 8,
    topicTitle: "Broadcast Address",
    question:
      "Sebuah subnet memiliki Network Address 192.168.55.160/27. Berapakah Broadcast Address dari subnet tersebut?",
    contextIp: "192.168.55.160/27",
    options: [
      "192.168.55.190",
      "192.168.55.191",
      "192.168.55.192",
      "192.168.55.223",
    ],
    correctIndex: 1,
    explanation:
      "Ukuran blok untuk /27 adalah 32. Broadcast Address = Network + 32 - 1 = 160 + 32 - 1 = 191 (192.168.55.191).",
    steps: [
      "Network Address = 192.168.55.160",
      "Ukuran blok /27 = 32",
      "Broadcast = 160 + 32 - 1 = 191 -> 192.168.55.191",
    ],
  },
  {
    id: "quiz-q19",
    topicOrder: 8,
    topicTitle: "Broadcast Address",
    question:
      "Tentukan Broadcast Address dari jaringan yang menaungi IP 192.168.12.25/29!",
    contextIp: "192.168.12.25/29",
    options: [
      "192.168.12.23",
      "192.168.12.30",
      "192.168.12.31",
      "192.168.12.32",
    ],
    correctIndex: 2,
    explanation:
      "Pada prefix /29 (ukuran blok 8), kelipatan blok adalah 0, 8, 16, 24, 32. IP .25 berada di blok 24..31, sehingga Broadcast Address-nya adalah 192.168.12.31.",
    steps: [
      "Ukuran blok /29 = 256 - 248 = 8",
      "Network Address untuk .25 adalah .24",
      "Broadcast = 24 + 8 - 1 = 31 -> 192.168.12.31",
    ],
  },

  // Topik 9: Rentang Host Valid (Usable Host Range)
  {
    id: "quiz-q20",
    topicOrder: 9,
    topicTitle: "Rentang Host Valid",
    question:
      "Manakah rentang alamat IP host valid (Usable Host Range) untuk sub-jaringan 192.168.100.128/25?",
    contextIp: "192.168.100.128/25",
    options: [
      "192.168.100.128 – 192.168.100.255",
      "192.168.100.129 – 192.168.100.254",
      "192.168.100.129 – 192.168.100.255",
      "192.168.100.1 – 192.168.100.126",
    ],
    correctIndex: 1,
    explanation:
      "Blok kedua /25 memiliki Network Address .128 dan Broadcast Address .255. Maka First Host adalah .129 dan Last Host adalah .254.",
    steps: [
      "Network = 192.168.100.128 -> First Host = .129",
      "Broadcast = 192.168.100.255 -> Last Host = .254",
    ],
  },
  {
    id: "quiz-q21",
    topicOrder: 9,
    topicTitle: "Rentang Host Valid",
    question:
      "Diketahui sebuah server memiliki IP 192.168.20.135/27. Berapakah alamat First Usable Host dan Last Usable Host pada subnet tempat server tersebut berada?",
    contextIp: "192.168.20.135/27",
    options: [
      "192.168.20.129 dan 192.168.20.158",
      "192.168.20.128 dan 192.168.20.159",
      "192.168.20.129 dan 192.168.20.190",
      "192.168.20.130 dan 192.168.20.159",
    ],
    correctIndex: 0,
    explanation:
      "Pada /27 (ukuran blok 32), IP .135 berada di blok Network .128 dan Broadcast .159. Maka rentang host validnya adalah .129 s.d. .158.",
    steps: [
      "Ukuran blok /27 = 32 -> Blok: 128 s.d. 159",
      "First Usable Host = 128 + 1 = 192.168.20.129",
      "Last Usable Host = 159 - 1 = 192.168.20.158",
    ],
  },
  {
    id: "quiz-q22",
    topicOrder: 9,
    topicTitle: "Rentang Host Valid",
    question:
      "Manakah di antara alamat IP berikut yang TIDAK BOLEH diberikan ke komputer client pada jaringan berprefix /28?",
    options: [
      "192.168.1.17",
      "192.168.1.30",
      "192.168.1.31",
      "192.168.1.33",
    ],
    correctIndex: 2,
    explanation:
      "Pada prefix /28 (ukuran blok 16), blok kedua berjalan dari Network .16 hingga Broadcast .31. Alamat 192.168.1.31 merupakan Broadcast Address sehingga tidak boleh dipasang pada host.",
    steps: [
      "Blok 1 (/28): .0 – .15",
      "Blok 2 (/28): Network = .16, Usable = .17 – .30, Broadcast = .31",
      "Blok 3 (/28): Network = .32, Usable = .33 – .46, Broadcast = .47",
    ],
  },

  // Topik 10: Perhitungan Jumlah Host
  {
    id: "quiz-q23",
    topicOrder: 10,
    topicTitle: "Perhitungan Jumlah Host",
    question:
      "Sebuah subnet menggunakan Subnet Mask 255.255.255.192 (/26). Berapa jumlah Total Alamat dan Usable Host pada subnet tersebut?",
    options: [
      "128 total alamat dan 126 usable host",
      "64 total alamat dan 62 usable host",
      "32 total alamat dan 30 usable host",
      "64 total alamat dan 64 usable host",
    ],
    correctIndex: 1,
    explanation:
      "Prefix /26 menyisakan h = 32 - 26 = 6 bit host. Total alamat = 2^6 = 64, dan Usable Host = 64 - 2 = 62 host.",
    steps: [
      "h = 32 - 26 = 6 bit",
      "Total Alamat = 2^6 = 64",
      "Usable Host = 2^6 - 2 = 62",
    ],
  },
  {
    id: "quiz-q24",
    topicOrder: 10,
    topicTitle: "Perhitungan Jumlah Host",
    question:
      "Sebuah ruangan kantor membutuhkan jaringan untuk 12 komputer dan 1 router gateway (total 13 alamat IP). Prefix manakah yang paling tepat dan hemat alamat?",
    options: [
      "/29 (6 usable host)",
      "/28 (14 usable host)",
      "/27 (30 usable host)",
      "/26 (62 usable host)",
    ],
    correctIndex: 1,
    explanation:
      "Kebutuhan adalah 13 usable IP. Prefix /28 menyediakan 2^4 - 2 = 14 usable host, yang mencukupi 13 perangkat dengan sisa hanya 1 IP cadangan.",
    steps: [
      "Kebutuhan = 12 PC + 1 Gateway = 13 IP",
      "/29 -> 6 host (kurang)",
      "/28 -> 14 host (cukup & paling efisien)",
    ],
  },

  // Topik 11: Konsep Subnetting Kelas C
  {
    id: "quiz-q25",
    topicOrder: 11,
    topicTitle: "Konsep Subnetting Kelas C",
    question:
      "Jika sebuah jaringan 192.168.10.0/24 dipecah menggunakan prefix /28, berapa banyak blok subnet dan berapa usable host per subnet yang terbentuk?",
    contextIp: "192.168.10.0/28",
    options: [
      "8 subnet dan 30 usable host per subnet",
      "16 subnet dan 14 usable host per subnet",
      "16 subnet dan 16 usable host per subnet",
      "32 subnet dan 6 usable host per subnet",
    ],
    correctIndex: 1,
    explanation:
      "Bit pinjaman s = 28 - 24 = 4 bit (Jumlah Subnet = 2^4 = 16). Sisa bit host h = 32 - 28 = 4 bit (Usable Host = 2^4 - 2 = 14).",
    steps: [
      "Jumlah Subnet = 2^(28-24) = 2^4 = 16 subnet",
      "Usable Host per Subnet = 2^(32-28) - 2 = 16 - 2 = 14 host",
    ],
  },
  {
    id: "quiz-q26",
    topicOrder: 11,
    topicTitle: "Konsep Subnetting Kelas C",
    question:
      "Sebuah institusi memiliki 1 blok Kelas C (192.168.1.0/24) dan ingin membaginya untuk 4 departemen yang masing-masing membutuhkan minimal 50 host. Prefix dan Subnet Mask yang harus digunakan adalah...",
    options: [
      "/25 (255.255.255.128)",
      "/26 (255.255.255.192)",
      "/27 (255.255.255.224)",
      "/28 (255.255.255.240)",
    ],
    correctIndex: 1,
    explanation:
      "Prefix /26 menghasilkan 2^2 = 4 blok subnet dan setiap blok menampung 2^6 - 2 = 62 usable host (memenuhi syarat minimal 50 host per departemen).",
    steps: [
      "Syarat 1: 4 departemen -> s = 2 bit (2^2 = 4 subnet) -> /26",
      "Syarat 2: Kapasitas /26 = 62 usable host (>= 50 host)",
      "Subnet Mask /26 = 255.255.255.192",
    ],
  },
  {
    id: "quiz-q27",
    topicOrder: 11,
    topicTitle: "Konsep Subnetting Kelas C",
    question:
      "Pada pembagian jaringan 192.168.1.0/27, berapakah Network Address dan Broadcast Address untuk blok subnet ke-2 (dengan blok ke-1 dimulai dari .0)?",
    contextIp: "192.168.1.0/27",
    options: [
      "Network: 192.168.1.32 dan Broadcast: 192.168.1.63",
      "Network: 192.168.1.32 dan Broadcast: 192.168.1.64",
      "Network: 192.168.1.64 dan Broadcast: 192.168.1.95",
      "Network: 192.168.1.16 dan Broadcast: 192.168.1.31",
    ],
    correctIndex: 0,
    explanation:
      "Ukuran blok /27 adalah 32. Blok ke-1 adalah .0 s.d. .31, sedangkan Blok ke-2 dimulai dari Network 192.168.1.32 hingga Broadcast 192.168.1.63.",
    steps: [
      "Ukuran blok /27 = 32",
      "Blok 1: Network .0, Broadcast .31",
      "Blok 2: Network .32, Broadcast .63",
    ],
  },

  // Topik 12: Studi Kasus & Analisis Troubleshoot Subnetting Kelas C
  {
    id: "quiz-q28",
    topicOrder: 12,
    topicTitle: "Studi Kasus Subnetting Kelas C",
    question:
      "PC-1 (192.168.10.60/26) tidak dapat melakukan ping ke PC-2 (192.168.10.70/26) meskipun terhubung pada satu Switch yang sama tanpa VLAN. Apa penyebab teknis masalah ini?",
    options: [
      "Kabel UTP tidak mendukung prefix /26",
      "PC-1 berada pada subnet 192.168.10.0/26 (.0–.63) sedangkan PC-2 berada pada subnet 192.168.10.64/26 (.64–.127), sehingga berbeda jaringan dan wajib melewati Router",
      "Alamat 192.168.10.60 adalah alamat Broadcast",
      "Alamat 192.168.10.70 adalah alamat Network",
    ],
    correctIndex: 1,
    explanation:
      "Dengan /26 (ukuran blok 64), batas blok pertama berakhir di .63. PC-1 (.60) dan PC-2 (.70) berada pada dua sub-jaringan logis yang berbeda sehingga komunikasi antar-subnet harus melalui default gateway (Router).",
    steps: [
      "Subnet PC-1 (.60/26) -> Network 192.168.10.0 (rentang .1–.62)",
      "Subnet PC-2 (.70/26) -> Network 192.168.10.64 (rentang .65–.126)",
      "Berbeda Network ID -> Tidak bisa berkomunikasi langsung di Layer 2 tanpa Router",
    ],
  },
  {
    id: "quiz-q29",
    topicOrder: 12,
    topicTitle: "Studi Kasus Subnetting Kelas C",
    question:
      "Pada sebuah topologi kampus, Router memiliki interface GigabitEthernet0/0 dengan IP 192.168.99.65/26 yang berfungsi sebagai Default Gateway bagi Lab Jaringan. Manakah konfigurasi IP client yang BENAR agar dapat terhubung ke gateway tersebut?",
    contextIp: "192.168.99.65/26",
    options: [
      "IP: 192.168.99.60, Mask: 255.255.255.192, Gateway: 192.168.99.65",
      "IP: 192.168.99.100, Mask: 255.255.255.192, Gateway: 192.168.99.65",
      "IP: 192.168.99.127, Mask: 255.255.255.192, Gateway: 192.168.99.65",
      "IP: 192.168.99.130, Mask: 255.255.255.192, Gateway: 192.168.99.65",
    ],
    correctIndex: 1,
    explanation:
      "Gateway 192.168.99.65/26 berada pada blok kedua (Network .64, Broadcast .127, Usable Host .65 s.d. .126). Karena .65 sudah dipakai Gateway, maka client dapat memakai .100 dengan Mask 255.255.255.192.",
    steps: [
      "Blok /26 untuk .65: Network = .64, Usable = .65 – .126, Broadcast = .127",
      ".60 berada di blok pertama; .127 adalah Broadcast; .130 berada di blok ketiga",
      "192.168.99.100 berada satu subnet dengan gateway .65 dan valid",
    ],
  },
  {
    id: "quiz-q30",
    topicOrder: 12,
    topicTitle: "Studi Kasus Subnetting Kelas C",
    question:
      "Untuk menghubungkan dua buah Router antar-gedung secara point-to-point (hanya membutuhkan 2 alamat IP valid) menggunakan skema subnetting konvensional yang paling menghemat ruang alamat IPv4, prefix manakah yang digunakan?",
    options: ["/28", "/29", "/30", "/24"],
    correctIndex: 2,
    explanation:
      "Prefix /30 (Subnet Mask 255.255.255.252) memiliki ukuran blok 4 alamat dan menyediakan tepat 2^2 - 2 = 2 usable host untuk kedua ujung tautan router.",
    steps: [
      "h = 32 - 30 = 2 bit host",
      "Usable Host = 2^2 - 2 = 2 alamat IP (1 untuk Router A, 1 untuk Router B)",
    ],
  },
]

/**
 * Mengambil 20 soal kuis dari bank soal (30 soal) secara teracak deterministik berdasarkan seed
 * (Attempt 1 Utama vs Attempt 2 Remedial) dan mengurutkannya berdasarkan alur topik 1–12.
 */
export function selectQuizQuestions(seedNumber: number): QuizQuestion[] {
  const pool = [...QUIZ_QUESTIONS_BANK]
  let seed = (seedNumber * 9301 + 49297) % 233280

  for (let i = pool.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280
    const j = seed % (i + 1)
    const tmp = pool[i]
    pool[i] = pool[j]
    pool[j] = tmp
  }

  return pool
    .slice(0, QUIZ_TOTAL_QUESTIONS)
    .sort((a, b) => a.topicOrder - b.topicOrder)
}

/**
 * Menghitung skor kuis (skala 0–100, @5 poin per soal) dan status kelulusan KKM 75.
 */
export function evaluateQuizSubmission(
  questions: QuizQuestion[],
  answers: Record<string, number>
): {
  correctCount: number
  incorrectCount: number
  totalQuestions: number
  score: number
  passed: boolean
} {
  let correctCount = 0
  questions.forEach((q) => {
    if (answers[q.id] !== undefined && Number(answers[q.id]) === q.correctIndex) {
      correctCount += 1
    }
  })

  const totalQuestions = questions.length
  const incorrectCount = totalQuestions - correctCount
  const score = correctCount * QUIZ_POINTS_PER_QUESTION
  const passed = score >= QUIZ_PASSING_SCORE

  return {
    correctCount,
    incorrectCount,
    totalQuestions,
    score,
    passed,
  }
}

