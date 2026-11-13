import { calculateIPv4, octetToBinary } from "@/features/ipv4"

export type PracticeCategoryId =
  | "identifikasi-ipv4"
  | "konversi-biner"
  | "subnet-mask"
  | "cidr"
  | "network-address"
  | "broadcast-address"
  | "host-address"
  | "jumlah-host"
  | "subnetting"

export type PracticeDifficulty = "Mudah" | "Menengah" | "Sulit"

export type PracticeQuestionType = "multiple_choice" | "short_answer"

export interface PracticeCategoryMeta {
  id: PracticeCategoryId
  title: string
  shortTitle: string
  description: string
  relatedMaterialSlug: string
}

export interface PracticeQuestion {
  id: string
  categoryId: PracticeCategoryId
  difficulty: PracticeDifficulty
  type: PracticeQuestionType
  prompt: string
  contextIp?: string
  /** Untuk multiple_choice */
  options?: [string, string, string, string]
  correctIndex?: number
  /** Untuk short_answer (mendukung beberapa format ekuivalen, misal "62" atau "/26") */
  acceptedAnswers?: string[]
  placeholder?: string
  answerHint?: string
  explanation: string
  steps: string[]
}

export const PRACTICE_CATEGORIES: PracticeCategoryMeta[] = [
  {
    id: "identifikasi-ipv4",
    title: "Identifikasi IPv4",
    shortTitle: "Identifikasi IPv4",
    description:
      "Mengenali struktur 32-bit, aturan nilai oktet (0–255), rentang Kelas C (192–223), serta alamat privat RFC 1918.",
    relatedMaterialSlug: "pengenalan-ipv4",
  },
  {
    id: "konversi-biner",
    title: "Konversi Biner",
    shortTitle: "Konversi Biner",
    description:
      "Mengubah nilai oktet desimal ke deretan biner 8-bit (128, 64, 32, 16, 8, 4, 2, 1) dan sebaliknya.",
    relatedMaterialSlug: "konversi-desimal-ke-biner",
  },
  {
    id: "subnet-mask",
    title: "Subnet Mask",
    shortTitle: "Subnet Mask",
    description:
      "Menentukan nilai desimal bertitik Subnet Mask Kelas C dari /24 hingga /30 beserta sifat bit kontigunya.",
    relatedMaterialSlug: "subnet-mask",
  },
  {
    id: "cidr",
    title: "CIDR & Prefix",
    shortTitle: "CIDR",
    description:
      "Menganalisis notasi prefix (/24–/32), jumlah bit network, bit pinjaman subnet (s), dan sisa bit host (h).",
    relatedMaterialSlug: "notasi-cidr",
  },
  {
    id: "network-address",
    title: "Network Address",
    shortTitle: "Network Address",
    description:
      "Menghitung alamat awal blok jaringan (Network ID) menggunakan operasi logika bitwise AND maupun kelipatan blok.",
    relatedMaterialSlug: "network-address",
  },
  {
    id: "broadcast-address",
    title: "Broadcast Address",
    shortTitle: "Broadcast Address",
    description:
      "Menentukan alamat terakhir pada blok subnet di mana seluruh bit host bernilai 1.",
    relatedMaterialSlug: "broadcast-address",
  },
  {
    id: "host-address",
    title: "Host Address",
    shortTitle: "Host Address",
    description:
      "Menentukan alamat IP valid pertama (First Usable Host) dan terakhir (Last Usable Host) bagi perangkat.",
    relatedMaterialSlug: "rentang-host-valid",
  },
  {
    id: "jumlah-host",
    title: "Jumlah Host",
    shortTitle: "Jumlah Host",
    description:
      "Menghitung kapasitas total alamat (2^h) dan jumlah host bersih yang dapat digunakan (2^h - 2).",
    relatedMaterialSlug: "perhitungan-jumlah-host",
  },
  {
    id: "subnetting",
    title: "Subnetting Kelas C",
    shortTitle: "Subnetting",
    description:
      "Memecah jaringan /24 menjadi beberapa sub-jaringan berdasarkan kebutuhan gedung, divisi, atau jumlah perangkat.",
    relatedMaterialSlug: "konsep-subnetting-kelas-c",
  },
]

// ============================================================================
// 1. KATEGORI: IDENTIFIKASI IPv4 (16 Soal)
// ============================================================================
const IDENTIFIKASI_QUESTIONS: PracticeQuestion[] = [
  {
    id: "id-ipv4-1",
    categoryId: "identifikasi-ipv4",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Berapa total panjang bit dan jumlah oktet pada sebuah alamat IPv4 standar?",
    options: [
      "32 bit yang terbagi menjadi 4 oktet",
      "64 bit yang terbagi menjadi 8 oktet",
      "128 bit yang terbagi menjadi 16 oktet",
      "24 bit yang terbagi menjadi 3 oktet",
    ],
    correctIndex: 0,
    explanation:
      "Alamat IPv4 memiliki panjang total 32 bit yang dikelompokkan menjadi 4 bagian (oktet), di mana masing-masing oktet terdiri atas 8 bit.",
    steps: [
      "Total panjang IPv4 = 32 bit",
      "1 Oktet = 8 bit",
      "Jumlah Oktet = 32 / 8 = 4 oktet (dipisahkan tanda titik)",
    ],
  },
  {
    id: "id-ipv4-2",
    categoryId: "identifikasi-ipv4",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Rentang nilai oktet pertama untuk alamat IPv4 Kelas C adalah...",
    options: ["1 – 126", "128 – 191", "192 – 223", "224 – 239"],
    correctIndex: 2,
    explanation:
      "Kelas C diawali dengan pola bit 110xxxxx pada oktet pertama, sehingga rentang desimalnya adalah 192 sampai 223.",
    steps: [
      "Kelas A: 1 – 126",
      "Kelas B: 128 – 191",
      "Kelas C: 192 – 223 (Bit awal 110)",
      "Kelas D: 224 – 239 (Multicast)",
    ],
  },
  {
    id: "id-ipv4-3",
    categoryId: "identifikasi-ipv4",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Manakah di antara alamat berikut yang termasuk alamat IPv4 Kelas C yang valid?",
    options: [
      "172.16.25.10",
      "192.168.100.25",
      "224.0.0.5",
      "192.168.1.256",
    ],
    correctIndex: 1,
    explanation:
      "192.168.100.25 memiliki oktet pertama 192 (berada di rentang 192–223) dan seluruh oktetnya berada di antara 0–255.",
    steps: [
      "172.16.25.10 -> Kelas B (oktet pertama 172)",
      "192.168.100.25 -> Kelas C valid (oktet pertama 192, semua oktet <= 255)",
      "224.0.0.5 -> Kelas D Multicast",
      "192.168.1.256 -> Tidak valid karena 256 melebihi batas 255",
    ],
  },
  {
    id: "id-ipv4-4",
    categoryId: "identifikasi-ipv4",
    difficulty: "Mudah",
    type: "short_answer",
    prompt: "Berapakah nilai desimal maksimum yang diizinkan pada satu oktet IPv4 (ketik angkanya saja)?",
    acceptedAnswers: ["255"],
    placeholder: "Contoh: 128",
    answerHint: "Nilai saat ke-8 bit bernilai 1 semua (2^8 - 1).",
    explanation:
      "Karena 1 oktet terdiri dari 8 bit biner, nilai maksimum tercapai saat seluruh bit bernilai 1 (11111111), yaitu 255.",
    steps: [
      "1 oktet = 8 bit",
      "Nilai tertinggi = 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255",
    ],
  },
  {
    id: "id-ipv4-5",
    categoryId: "identifikasi-ipv4",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Mengapa alamat 200.10.300.5 dinyatakan TIDAK VALID sebagai alamat IPv4?",
    options: [
      "Karena oktet pertama 200 tidak boleh digunakan untuk jaringan lokal",
      "Karena oktet ketiga bernilai 300 yang melampaui nilai maksimum 8-bit (255)",
      "Karena oktet keempat bernilai ganjil",
      "Karena hanya terdiri dari empat oktet",
    ],
    correctIndex: 1,
    explanation:
      "Setiap oktet IPv4 hanya memiliki lebar 8 bit sehingga hanya mampu menampung angka bulat 0 sampai 255. Nilai 300 melampaui batas tersebut.",
    steps: [
      "Periksa tiap oktet: 200 (OK), 10 (OK), 300 (ERROR > 255), 5 (OK)",
      "Kesimpulan: Oktet ketiga tidak valid",
    ],
  },
  {
    id: "id-ipv4-6",
    categoryId: "identifikasi-ipv4",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Berdasarkan standar RFC 1918, berapakah rentang alamat IP Private untuk Kelas C?",
    options: [
      "10.0.0.0 – 10.255.255.255",
      "172.16.0.0 – 172.31.255.255",
      "192.168.0.0 – 192.168.255.255",
      "169.254.0.0 – 169.254.255.255",
    ],
    correctIndex: 2,
    explanation:
      "RFC 1918 menetapkan blok 192.168.0.0/16 (192.168.0.0 sampai 192.168.255.255) sebagai alamat privat Kelas C untuk penggunaan LAN internal.",
    steps: [
      "Kelas A Private: 10.0.0.0/8",
      "Kelas B Private: 172.16.0.0/12",
      "Kelas C Private: 192.168.0.0/16 (192.168.0.0 – 192.168.255.255)",
    ],
  },
  {
    id: "id-ipv4-7",
    categoryId: "identifikasi-ipv4",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Alamat IPv4 203.119.12.50 termasuk ke dalam kategori...",
    contextIp: "203.119.12.50",
    options: [
      "Kelas C Public (Unicast)",
      "Kelas C Private (RFC 1918)",
      "Kelas B Public (Unicast)",
      "Kelas D Multicast",
    ],
    correctIndex: 0,
    explanation:
      "Oktet pertama 203 berada pada rentang Kelas C (192–223), namun di luar rentang privat 192.168.x.x, sehingga merupakan alamat Kelas C Public.",
    steps: [
      "Oktet ke-1 = 203 -> Rentang 192–223 (Kelas C)",
      "Bukan 192.168.x.x -> Berarti alamat Public yang dapat dirutekan di internet",
    ],
  },
  {
    id: "id-ipv4-8",
    categoryId: "identifikasi-ipv4",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Pada alamat Kelas C default 192.168.45.120/24, tuliskan porsi Network ID-nya (3 oktet pertama dipisahkan titik)!",
    contextIp: "192.168.45.120/24",
    acceptedAnswers: ["192.168.45", "192.168.45.0"],
    placeholder: "Contoh: 192.168.1",
    answerHint: "Tiga oktet pertama menunjukkan identitas jaringan pada Kelas C /24.",
    explanation:
      "Pada Kelas C default (/24), 3 oktet pertama (24 bit pertama) adalah Network ID (192.168.45), sedangkan oktet ke-4 (120) adalah Host ID.",
    steps: [
      "Alamat: 192.168.45.120/24",
      "Oktet 1–3 (Network ID): 192.168.45 (atau Network Address 192.168.45.0)",
      "Oktet 4 (Host ID): 120",
    ],
  },
  {
    id: "id-ipv4-9",
    categoryId: "identifikasi-ipv4",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Manakah pola bit paling kiri (Leading Bits) pada oktet pertama yang menjadi ciri mutlak alamat IPv4 Kelas C?",
    options: ["0xxxxxxx", "10xxxxxx", "110xxxxx", "1110xxxx"],
    correctIndex: 2,
    explanation:
      "Dalam arsitektur classful IPv4, Kelas C selalu memiliki 3 bit pertama bernilai 110 (128 + 64 + 0 = 192 hingga 128 + 64 + 31 = 223).",
    steps: [
      "0xxxxxxx -> Kelas A (0–127)",
      "10xxxxxx -> Kelas B (128–191)",
      "110xxxxx -> Kelas C (192–223)",
      "1110xxxx -> Kelas D (224–239)",
    ],
  },
  {
    id: "id-ipv4-10",
    categoryId: "identifikasi-ipv4",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Jika sebuah paket dikirim ke alamat 127.0.0.1, apa fungsi khusus dari alamat tersebut?",
    contextIp: "127.0.0.1",
    options: [
      "Alamat Broadcast ke seluruh router di internet",
      "Alamat Loopback untuk pengujian tumpukan protokol TCP/IP pada host lokal itu sendiri",
      "Alamat Private Kelas C untuk komunikasi antar-switch",
      "Alamat Multicast untuk streaming video",
    ],
    correctIndex: 1,
    explanation:
      "Blok 127.0.0.0/8 dicadangkan sebagai alamat Loopback (localhost) untuk menguji fungsi jaringan internal perangkat tanpa melewati kartu jaringan fisik.",
    steps: [
      "127.0.0.0/8 = Loopback Address (RFC 1122)",
      "Paket tidak pernah keluar ke kabel/udara jaringan, melainkan kembali ke host pengirim",
    ],
  },
  {
    id: "id-ipv4-11",
    categoryId: "identifikasi-ipv4",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Sebuah PC gagal menghubungi DHCP Server dan secara otomatis menggunakan alamat 169.254.20.45. Jenis alamat apakah ini?",
    contextIp: "169.254.20.45",
    options: [
      "Alamat Public Kelas B",
      "Alamat Link-Local / APIPA (Automatic Private IP Addressing)",
      "Alamat Multicast OSPF",
      "Alamat Eksperimental Kelas E",
    ],
    correctIndex: 1,
    explanation:
      "Rentang 169.254.0.0/16 adalah alamat Link-Local (APIPA) yang ditetapkan otomatis oleh sistem operasi ketika tidak mendapatkan respons dari server DHCP.",
    steps: [
      "Rentang 169.254.0.0/16 (RFC 3927) = Link-Local / APIPA",
      "Hanya berlaku pada segmen lokal dan tidak dapat diteruskan oleh router",
    ],
  },
  {
    id: "id-ipv4-12",
    categoryId: "identifikasi-ipv4",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Pada alamat IPv4 210.45.88.19/24, berapakah nilai desimal dari Host ID-nya?",
    contextIp: "210.45.88.19/24",
    acceptedAnswers: ["19", ".19"],
    placeholder: "Contoh: 45",
    answerHint: "Pada prefix /24, Host ID terletak pada oktet keempat (terakhir).",
    explanation:
      "Untuk prefix /24 (24 bit network), tiga oktet pertama (210.45.88) merupakan porsi Network, dan oktet keempat (19) adalah porsi Host ID.",
    steps: [
      "Prefix /24 = 3 oktet Network + 1 oktet Host",
      "Oktet ke-4 dari 210.45.88.19 adalah 19",
    ],
  },
]

// ============================================================================
// 2. KATEGORI: KONVERSI BINER (14 Soal)
// ============================================================================
const KONVERSI_BINER_QUESTIONS: PracticeQuestion[] = [
  {
    id: "bin-1",
    categoryId: "konversi-biner",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Berapakah representasi biner 8-bit dari angka desimal 192?",
    options: ["11000000", "10100000", "11100000", "10000001"],
    correctIndex: 0,
    explanation:
      "Angka 192 terbentuk dari penjumlahan bobot bit paling kiri ke-1 (128) dan ke-2 (64): 128 + 64 = 192.",
    steps: [
      "192 >= 128 -> bit 128 = 1 (sisa 64)",
      "64 >= 64 -> bit 64 = 1 (sisa 0)",
      "Sisa bobot (32, 16, 8, 4, 2, 1) = 0",
      "Hasil 8-bit = 11000000",
    ],
  },
  {
    id: "bin-2",
    categoryId: "konversi-biner",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Deretan biner 8-bit 11110000 jika dikonversi ke desimal bernilai...",
    options: ["224", "240", "248", "252"],
    correctIndex: 1,
    explanation:
      "Empat bit pertama bernilai 1: 128 + 64 + 32 + 16 = 240.",
    steps: [
      "Bit bernilai 1 berada di posisi bobot 128, 64, 32, dan 16",
      "128 + 64 + 32 + 16 = 240",
    ],
  },
  {
    id: "bin-3",
    categoryId: "konversi-biner",
    difficulty: "Mudah",
    type: "short_answer",
    prompt: "Tuliskan hasil konversi biner 8-bit dari nilai desimal 128!",
    acceptedAnswers: ["10000000"],
    placeholder: "8 digit biner (0/1)",
    answerHint: "Hanya bit paling kiri (bobot 128) yang bernilai 1.",
    explanation:
      "Angka 128 tepat sama dengan bobot bit pertama dari kiri, sehingga bit pertama bernilai 1 dan 7 bit berikutnya bernilai 0.",
    steps: [
      "Bobot posisi 8-bit: 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1",
      "128 = 10000000",
    ],
  },
  {
    id: "bin-4",
    categoryId: "konversi-biner",
    difficulty: "Mudah",
    type: "short_answer",
    prompt: "Berapakah nilai desimal dari oktet biner 00001010?",
    acceptedAnswers: ["10"],
    placeholder: "Ketik angka desimal",
    answerHint: "Jumlahkan bobot posisi yang bernilai 1 (8 dan 2).",
    explanation:
      "Pada 00001010, bit yang bernilai 1 berada pada bobot 8 dan 2, sehingga 8 + 2 = 10.",
    steps: [
      "00001010 -> bit aktif di posisi 8 dan 2",
      "Total desimal = 8 + 2 = 10",
    ],
  },
  {
    id: "bin-5",
    categoryId: "konversi-biner",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Berapakah representasi biner 8-bit dari oktet desimal 168 (seperti pada 192.168.x.x)?",
    options: ["10101000", "10100100", "11001000", "10011000"],
    correctIndex: 0,
    explanation:
      "168 diuraikan menjadi 128 + 32 + 8 = 168, sehingga bit aktif berada pada posisi 128, 32, dan 8 (10101000).",
    steps: [
      "168 - 128 = 40 (bit 128 = 1)",
      "40 < 64 (bit 64 = 0)",
      "40 - 32 = 8 (bit 32 = 1)",
      "8 < 16 (bit 16 = 0)",
      "8 - 8 = 0 (bit 8 = 1; bit 4, 2, 1 = 0)",
      "Hasil = 10101000",
    ],
  },
  {
    id: "bin-6",
    categoryId: "konversi-biner",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Oktet biner 11001010 memiliki nilai desimal...",
    options: ["198", "202", "204", "210"],
    correctIndex: 1,
    explanation:
      "Bit yang bernilai 1 pada 11001010 adalah 128 + 64 + 8 + 2 = 202.",
    steps: [
      "Posisi bit 1: 128, 64, 8, 2",
      "128 + 64 = 192",
      "192 + 8 + 2 = 202",
    ],
  },
  {
    id: "bin-7",
    categoryId: "konversi-biner",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Konversikan nilai desimal 224 ke dalam biner 8-bit!",
    acceptedAnswers: ["11100000"],
    placeholder: "Contoh: 11000000",
    answerHint: "128 + 64 + 32 = 224.",
    explanation:
      "224 merupakan hasil penjumlahan tiga bobot tertinggi: 128 + 64 + 32 = 224, sehingga binernya adalah 11100000.",
    steps: [
      "128 + 64 + 32 = 224",
      "3 bit pertama bernilai 1, 5 bit sisanya 0 -> 11100000",
    ],
  },
  {
    id: "bin-8",
    categoryId: "konversi-biner",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Berapakah nilai desimal dari deretan biner 11111100?",
    acceptedAnswers: ["252"],
    placeholder: "Ketik angka desimal",
    answerHint: "255 dikurangi (2 + 1).",
    explanation:
      "Enam bit pertama bernilai 1 (128+64+32+16+8+4 = 252), atau dihitung cepat dengan 255 - 3 = 252.",
    steps: [
      "Total 8 bit penuh = 255",
      "Bit yang bernilai 0 adalah bobot 2 dan 1 (total 3)",
      "255 - 3 = 252",
    ],
  },
  {
    id: "bin-9",
    categoryId: "konversi-biner",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Manakah representasi biner lengkap yang tepat untuk alamat IPv4 192.168.1.50?",
    contextIp: "192.168.1.50",
    options: [
      "11000000.10101000.00000001.00110010",
      "11000000.10101000.00000001.00101010",
      "11000000.10100100.00000001.00110010",
      "10100000.10101000.00000001.00110010",
    ],
    correctIndex: 0,
    explanation:
      "192 = 11000000, 168 = 10101000, 1 = 00000001, dan 50 = 32 + 16 + 2 = 00110010.",
    steps: [
      `192 -> ${octetToBinary(192)}`,
      `168 -> ${octetToBinary(168)}`,
      `1   -> ${octetToBinary(1)}`,
      `50  -> ${octetToBinary(50)} (32 + 16 + 2)`,
    ],
  },
  {
    id: "bin-10",
    categoryId: "konversi-biner",
    difficulty: "Sulit",
    type: "short_answer",
    prompt: "Tuliskan biner 8-bit untuk angka desimal 130!",
    acceptedAnswers: ["10000010"],
    placeholder: "8 digit biner (0/1)",
    answerHint: "130 = 128 + 2.",
    explanation:
      "Angka 130 tersusun dari bobot 128 dan 2, sehingga bit ke-1 dan ke-7 bernilai 1: 10000010.",
    steps: [
      "130 - 128 = 2 -> bit 128 = 1",
      "Sisa 2 -> bit 2 = 1",
      "Hasil 8-bit = 10000010",
    ],
  },
  {
    id: "bin-11",
    categoryId: "konversi-biner",
    difficulty: "Sulit",
    type: "short_answer",
    prompt: "Jika sebuah alamat IPv4 dalam biner adalah 11000000.10101000.00001010.01000001, tuliskan dalam format desimal bertitik!",
    acceptedAnswers: ["192.168.10.65"],
    placeholder: "Contoh: 192.168.1.1",
    answerHint: "Konversikan tiap blok 8-bit secara berurutan.",
    explanation:
      "11000000 = 192, 10101000 = 168, 00001010 = 10 (8+2), dan 01000001 = 65 (64+1).",
    steps: [
      "Oktet 1: 11000000 = 128 + 64 = 192",
      "Oktet 2: 10101000 = 128 + 32 + 8 = 168",
      "Oktet 3: 00001010 = 8 + 2 = 10",
      "Oktet 4: 01000001 = 64 + 1 = 65",
      "Alamat Desimal = 192.168.10.65",
    ],
  },
  {
    id: "bin-12",
    categoryId: "konversi-biner",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Berapakah nilai desimal dari oktet biner 01111111?",
    options: ["126", "127", "128", "254"],
    correctIndex: 1,
    explanation:
      "Bit pertama (128) bernilai 0 dan 7 bit sisanya bernilai 1: 64 + 32 + 16 + 8 + 4 + 2 + 1 = 127 (atau 255 - 128 = 127).",
    steps: [
      "Total semua 8 bit = 255",
      "Kurangi bit 128 yang bernilai 0: 255 - 128 = 127",
    ],
  },
]

// ============================================================================
// 3. KATEGORI: SUBNET MASK (12 Soal)
// ============================================================================
const SUBNET_MASK_QUESTIONS: PracticeQuestion[] = [
  {
    id: "mask-1",
    categoryId: "subnet-mask",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Berapakah Subnet Mask default untuk jaringan IPv4 Kelas C (/24)?",
    options: [
      "255.0.0.0",
      "255.255.0.0",
      "255.255.255.0",
      "255.255.255.128",
    ],
    correctIndex: 2,
    explanation:
      "Kelas C default menggunakan 24 bit pertama untuk network (tiga oktet penuh bernilai 255) dan 8 bit terakhir untuk host (0), yaitu 255.255.255.0.",
    steps: [
      "/24 = 11111111.11111111.11111111.00000000",
      "Desimal = 255.255.255.0",
    ],
  },
  {
    id: "mask-2",
    categoryId: "subnet-mask",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Jika prefix jaringan Kelas C diubah menjadi /25, maka Subnet Mask desimalnya adalah...",
    options: [
      "255.255.255.128",
      "255.255.255.192",
      "255.255.255.224",
      "255.255.255.240",
    ],
    correctIndex: 0,
    explanation:
      "Prefix /25 berarti meminjam 1 bit pada oktet ke-4 (10000000), yang bernilai desimal 128.",
    steps: [
      "/25 = 24 bit + 1 bit pada oktet ke-4",
      "Oktet ke-4 biner: 10000000 = 128",
      "Subnet Mask = 255.255.255.128",
    ],
  },
  {
    id: "mask-3",
    categoryId: "subnet-mask",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Tuliskan Subnet Mask dalam format desimal bertitik untuk prefix /26!",
    acceptedAnswers: ["255.255.255.192"],
    placeholder: "Contoh: 255.255.255.0",
    answerHint: "Oktet ke-4 memiliki 2 bit pertama bernilai 1 (128 + 64).",
    explanation:
      "Prefix /26 memiliki 2 bit bernilai 1 di oktet keempat (11000000 = 128 + 64 = 192), sehingga Subnet Mask-nya adalah 255.255.255.192.",
    steps: [
      "26 bit = 8 + 8 + 8 + 2 bit",
      "2 bit di oktet keempat: 11000000 = 192",
      "Subnet Mask = 255.255.255.192",
    ],
  },
  {
    id: "mask-4",
    categoryId: "subnet-mask",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Prefix /27 pada jaringan Kelas C setara dengan Subnet Mask...",
    options: [
      "255.255.255.192",
      "255.255.255.224",
      "255.255.255.240",
      "255.255.255.248",
    ],
    correctIndex: 1,
    explanation:
      "Pada /27, 3 bit pertama di oktet keempat bernilai 1 (11100000 = 128 + 64 + 32 = 224).",
    steps: [
      "/27 = 24 + 3 bit di oktet ke-4",
      "11100000 = 128 + 64 + 32 = 224",
      "Subnet Mask = 255.255.255.224",
    ],
  },
  {
    id: "mask-5",
    categoryId: "subnet-mask",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Tuliskan Subnet Mask desimal bertitik untuk prefix /28!",
    acceptedAnswers: ["255.255.255.240"],
    placeholder: "Contoh: 255.255.255.224",
    answerHint: "Empat bit pertama di oktet ke-4 bernilai 1 (128+64+32+16).",
    explanation:
      "Prefix /28 mengaktifkan 4 bit pertama pada oktet keempat (11110000 = 240), menghasilkan 255.255.255.240.",
    steps: [
      "/28 = 24 + 4 bit",
      "Oktet ke-4: 11110000 = 128 + 64 + 32 + 16 = 240",
      "Subnet Mask = 255.255.255.240",
    ],
  },
  {
    id: "mask-6",
    categoryId: "subnet-mask",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Subnet Mask untuk jaringan point-to-point WAN dengan prefix /30 adalah...",
    options: [
      "255.255.255.240",
      "255.255.255.248",
      "255.255.255.252",
      "255.255.255.254",
    ],
    correctIndex: 2,
    explanation:
      "Prefix /30 menyisakan 2 bit host (00) di ujung kanan oktet ke-4 (11111100 = 255 - 3 = 252).",
    steps: [
      "/30 = 24 + 6 bit di oktet ke-4",
      "11111100 = 252",
      "Subnet Mask = 255.255.255.252",
    ],
  },
  {
    id: "mask-7",
    categoryId: "subnet-mask",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Mengapa 255.255.255.160 TIDAK VALID dijadikan sebagai Subnet Mask IPv4?",
    options: [
      "Karena angka 160 adalah bilangan genap",
      "Karena biner dari 160 (10100000) tidak kontigu (bit 1 dan 0 berselang-seling)",
      "Karena 160 hanya boleh dipakai di Kelas A",
      "Karena lebih kecil dari 192",
    ],
    correctIndex: 1,
    explanation:
      "Syarat mutlak Subnet Mask adalah deretan bit 1 harus berurutan tanpa terputus (contiguous) dari kiri ke kanan. Biner 160 adalah 10100000 (terputus oleh 0 di bit ke-2).",
    steps: [
      "Konversi 160 ke biner: 128 + 32 = 10100000",
      "Terdapat bit 0 di antara bit 1 -> Tidak kontigu (Invalid Subnet Mask)",
    ],
  },
  {
    id: "mask-8",
    categoryId: "subnet-mask",
    difficulty: "Sulit",
    type: "short_answer",
    prompt: "Berapakah nilai oktet keempat dari Subnet Mask dengan prefix /29 (ketik angkanya saja)?",
    acceptedAnswers: ["248"],
    placeholder: "Contoh: 240",
    answerHint: "5 bit pertama bernilai 1 (11111000).",
    explanation:
      "Pada /29, terdapat 5 bit bernilai 1 di oktet keempat: 128 + 64 + 32 + 16 + 8 = 248.",
    steps: [
      "/29 = 24 + 5 bit",
      "Oktet ke-4: 11111000 = 248",
    ],
  },
  {
    id: "mask-9",
    categoryId: "subnet-mask",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Berapakah Wildcard Mask (kebalikan dari Subnet Mask) untuk jaringan dengan Subnet Mask 255.255.255.192?",
    options: [
      "0.0.0.63",
      "0.0.0.64",
      "0.0.0.127",
      "0.0.0.192",
    ],
    correctIndex: 0,
    explanation:
      "Wildcard Mask dihitung dengan mengurangkan 255 pada setiap oktet Subnet Mask: (255-255).(255-255).(255-255).(255-192) = 0.0.0.63.",
    steps: [
      "Rumus Wildcard per oktet = 255 - Nilai Mask",
      "Oktet 4: 255 - 192 = 63",
      "Wildcard Mask = 0.0.0.63",
    ],
  },
  {
    id: "mask-10",
    categoryId: "subnet-mask",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Pada Subnet Mask, bit yang bernilai 1 merepresentasikan porsi..., sedangkan bit 0 merepresentasikan porsi...",
    options: [
      "Host; Network",
      "Network; Host",
      "Broadcast; Multicast",
      "Gateway; DNS",
    ],
    correctIndex: 1,
    explanation:
      "Dalam Subnet Mask 32-bit, seluruh bit '1' dari kiri menandai porsi Network (termasuk bit subnet), sedangkan bit '0' di kanan menandai porsi Host.",
    steps: [
      "Bit 1 = Network / Subnet portion",
      "Bit 0 = Host portion",
    ],
  },
  {
    id: "mask-11",
    categoryId: "subnet-mask",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Jika Wildcard Mask sebuah jaringan adalah 0.0.0.31, tuliskan Subnet Mask desimal bertitiknya!",
    acceptedAnswers: ["255.255.255.224"],
    placeholder: "Contoh: 255.255.255.0",
    answerHint: "Kurangkan 255 dengan nilai tiap oktet Wildcard Mask.",
    explanation:
      "Oktet keempat Subnet Mask = 255 - 31 = 224. Maka Subnet Mask lengkapnya adalah 255.255.255.224 (/27).",
    steps: [
      "Oktet 1–3: 255 - 0 = 255",
      "Oktet 4: 255 - 31 = 224",
      "Subnet Mask = 255.255.255.224",
    ],
  },
  {
    id: "mask-12",
    categoryId: "subnet-mask",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Manakah di antara daftar nilai oktet berikut yang SELURUHNYA merupakan angka valid pada Subnet Mask?",
    options: [
      "0, 128, 192, 224, 240, 248, 252, 254, 255",
      "0, 128, 160, 192, 224, 240, 250, 255",
      "0, 64, 128, 192, 255",
      "128, 192, 200, 224, 240, 255",
    ],
    correctIndex: 0,
    explanation:
      "Hanya ada 9 nilai desimal yang mungkin untuk oktet Subnet Mask kontigu: 0, 128, 192, 224, 240, 248, 252, 254, dan 255.",
    steps: [
      "0 bit 1 = 0",
      "1..8 bit 1 berurutan = 128, 192, 224, 240, 248, 252, 254, 255",
    ],
  },
]

// ============================================================================
// 4. KATEGORI: CIDR & PREFIX (12 Soal)
// ============================================================================
const CIDR_QUESTIONS: PracticeQuestion[] = [
  {
    id: "cidr-1",
    categoryId: "cidr",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Pada penulisan alamat 192.168.10.5/26, angka 26 menunjukkan...",
    contextIp: "192.168.10.5/26",
    options: [
      "Jumlah komputer maksimal di dalam jaringan",
      "Jumlah bit '1' pada Subnet Mask (panjang prefix Network)",
      "Nomor urut router di dalam gedung",
      "Jumlah sisa bit Host yang bernilai 0",
    ],
    correctIndex: 1,
    explanation:
      "Notasi CIDR /26 menyatakan bahwa 26 bit pertama dari total 32 bit digunakan sebagai penanda Network (bit '1' pada Subnet Mask).",
    steps: [
      "/n = Panjang prefix (Network Bits)",
      "Untuk /26 -> 26 bit Network dan (32 - 26) = 6 bit Host",
    ],
  },
  {
    id: "cidr-2",
    categoryId: "cidr",
    difficulty: "Mudah",
    type: "short_answer",
    prompt: "Berapa jumlah bit Host (h) yang tersisa pada jaringan dengan prefix /27 (ketik angkanya saja)?",
    acceptedAnswers: ["5"],
    placeholder: "Contoh: 6",
    answerHint: "Gunakan rumus h = 32 - prefix.",
    explanation:
      "Total bit IPv4 adalah 32. Untuk prefix /27, sisa bit host h = 32 - 27 = 5 bit.",
    steps: [
      "Rumus sisa bit host: h = 32 - n",
      "h = 32 - 27 = 5 bit",
    ],
  },
  {
    id: "cidr-3",
    categoryId: "cidr",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Subnet Mask 255.255.255.240 jika ditulis dalam notasi prefix CIDR adalah...",
    options: ["/26", "/27", "/28", "/29"],
    correctIndex: 2,
    explanation:
      "Tiga oktet 255 bernilai 24 bit, ditambah oktet keempat 240 (11110000) yang memiliki 4 bit bernilai 1: 24 + 4 = /28.",
    steps: [
      "255.255.255 = 8 + 8 + 8 = 24 bit",
      "240 = 11110000 = 4 bit",
      "Total prefix = 24 + 4 = /28",
    ],
  },
  {
    id: "cidr-4",
    categoryId: "cidr",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Tuliskan notasi prefix CIDR (misal: /24) untuk Subnet Mask 255.255.255.224!",
    acceptedAnswers: ["/27", "27"],
    placeholder: "Contoh: /26",
    answerHint: "224 dalam biner adalah 11100000 (3 bit bernilai 1).",
    explanation:
      "255.255.255 menyumbang 24 bit, dan 224 (11100000) menyumbang 3 bit, sehingga 24 + 3 = /27.",
    steps: [
      "224 = 128 + 64 + 32 -> 3 bit bernilai 1",
      "Prefix = 24 + 3 = /27",
    ],
  },
  {
    id: "cidr-5",
    categoryId: "cidr",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Terhadap jaringan Kelas C default (/24), berapa banyak bit yang dipinjam (s) untuk membentuk prefix /29?",
    options: ["3 bit", "4 bit", "5 bit", "6 bit"],
    correctIndex: 2,
    explanation:
      "Jumlah bit yang dipinjam dari porsi host Kelas C adalah s = prefix baru - 24 = 29 - 24 = 5 bit.",
    steps: [
      "Prefix default Kelas C = /24",
      "Bit pinjaman (s) = 29 - 24 = 5 bit",
    ],
  },
  {
    id: "cidr-6",
    categoryId: "cidr",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Pada jaringan 192.168.5.0/25, berapakah jumlah sisa bit Host (h)?",
    contextIp: "192.168.5.0/25",
    acceptedAnswers: ["7"],
    placeholder: "Ketik angka",
    answerHint: "32 dikurangi 25.",
    explanation:
      "Dengan 25 bit dialokasikan sebagai Network, maka sisa bit Host adalah 32 - 25 = 7 bit.",
    steps: [
      "h = 32 - 25 = 7 bit host",
    ],
  },
  {
    id: "cidr-7",
    categoryId: "cidr",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Jika sebuah jaringan Kelas C meminjam 2 bit host untuk subnetting, maka notasi CIDR barunya menjadi...",
    options: ["/25", "/26", "/27", "/28"],
    correctIndex: 1,
    explanation:
      "Kelas C dimulai dari /24. Meminjam 2 bit host berarti menambah panjang prefix menjadi 24 + 2 = /26.",
    steps: [
      "Prefix awal = /24",
      "Pinjam s = 2 bit -> 24 + 2 = /26",
    ],
  },
  {
    id: "cidr-8",
    categoryId: "cidr",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Menurut standar RFC 3021, prefix berapakah yang dirancang khusus untuk tautan Point-to-Point (hanya 2 alamat tanpa alamat broadcast)?",
    options: ["/29", "/30", "/31", "/32"],
    correctIndex: 2,
    explanation:
      "RFC 3021 mengizinkan penggunaan prefix /31 (total 2 alamat) secara efisien untuk koneksi point-to-point antar-router tanpa membuang alamat network & broadcast.",
    steps: [
      "/30 -> 4 alamat (2 usable host konvensional)",
      "/31 -> 2 alamat (khusus Point-to-Point RFC 3021)",
      "/32 -> 1 alamat (Host Route tunggal)",
    ],
  },
  {
    id: "cidr-9",
    categoryId: "cidr",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Apa arti dari penulisan rute statis 192.168.10.25/32 pada tabel routing?",
    contextIp: "192.168.10.25/32",
    options: [
      "Rute menuju seluruh perangkat di jaringan 192.168.10.0",
      "Host Route yang menunjuk tepat ke satu alamat IP tunggal (192.168.10.25)",
      "Alamat broadcast untuk 32 komputer",
      "Jaringan dengan 32 bit host kosong",
    ],
    correctIndex: 1,
    explanation:
      "Prefix /32 memiliki 0 bit host (32 - 32 = 0), sehingga mengidentifikasi tepat satu alamat host spesifik (Host Route).",
    steps: [
      "h = 32 - 32 = 0 bit host",
      "Total alamat = 2^0 = 1 alamat spesifik (Host Route)",
    ],
  },
  {
    id: "cidr-10",
    categoryId: "cidr",
    difficulty: "Sulit",
    type: "short_answer",
    prompt: "Jika diketahui sebuah subnet memiliki sisa bit host h = 4, tuliskan notasi prefix CIDR-nya (misal: /26)!",
    acceptedAnswers: ["/28", "28"],
    placeholder: "Contoh: /26",
    answerHint: "Prefix = 32 - h.",
    explanation:
      "Jika sisa bit host h = 4, maka panjang prefix n = 32 - 4 = 28 (/28).",
    steps: [
      "n + h = 32",
      "n = 32 - 4 = 28 -> /28",
    ],
  },
  {
    id: "cidr-11",
    categoryId: "cidr",
    difficulty: "Mudah",
    type: "short_answer",
    prompt: "Subnet Mask 255.255.255.252 memiliki notasi prefix CIDR...",
    acceptedAnswers: ["/30", "30"],
    placeholder: "Contoh: /24",
    answerHint: "252 adalah 11111100 (6 bit bernilai 1 di oktet ke-4).",
    explanation:
      "255.255.255 (24 bit) + 252 (6 bit) = /30.",
    steps: [
      "252 = 11111100 (6 bit 1)",
      "24 + 6 = /30",
    ],
  },
  {
    id: "cidr-12",
    categoryId: "cidr",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Kepanjangan dari istilah CIDR dalam pengalamatan jaringan adalah...",
    options: [
      "Classful Internet Domain Routing",
      "Classless Inter-Domain Routing",
      "Centralized IPv4 Data Routing",
      "Computer Internal Dynamic Routing",
    ],
    correctIndex: 1,
    explanation:
      "CIDR adalah singkatan dari Classless Inter-Domain Routing, metode alokasi IP modern yang menggantikan batasan kaku kelas A, B, dan C.",
    steps: [
      "CIDR = Classless Inter-Domain Routing (diperkenalkan pada RFC 1519 / RFC 4632)",
    ],
  },
]

// ============================================================================
// 5. KATEGORI: NETWORK ADDRESS (14 Soal Terverifikasi Engine)
// ============================================================================
function buildNetworkQuestion(
  id: string,
  ip: string,
  prefix: number,
  difficulty: PracticeDifficulty,
  type: PracticeQuestionType,
  distractors?: [string, string, string]
): PracticeQuestion {
  const res = calculateIPv4(ip, prefix)
  const blockSize = 256 - Number(res.subnetMask.split(".")[3])
  const lastOctet = Number(ip.split(".")[3])
  const netLastOctet = Number(res.networkAddress.split(".")[3])

  if (type === "short_answer") {
    return {
      id,
      categoryId: "network-address",
      difficulty,
      type: "short_answer",
      prompt: `Tentukan Network Address dari alamat IPv4 ${ip}/${prefix}!`,
      contextIp: `${ip}/${prefix}`,
      acceptedAnswers: [res.networkAddress, `${res.networkAddress}/${prefix}`],
      placeholder: "Contoh: 192.168.1.0",
      answerHint: `Ukuran blok /${prefix} adalah ${blockSize}. Cari kelipatan ${blockSize} terbesar yang <= ${lastOctet}.`,
      explanation: `Dengan prefix /${prefix} (Mask ${res.subnetMask}), ukuran blok adalah ${blockSize}. Kelipatan ${blockSize} yang menaungi oktet ke-4 (${lastOctet}) adalah ${netLastOctet}, sehingga Network Address-nya ${res.networkAddress}.`,
      steps: [
        `Subnet Mask /${prefix} = ${res.subnetMask}`,
        `Ukuran blok (Block Size) = 256 - ${res.subnetMask.split(".")[3]} = ${blockSize}`,
        `Kelipatan ${blockSize} terdekat <= ${lastOctet} adalah ${netLastOctet}`,
        `Network Address = ${res.networkAddress}`,
      ],
    }
  }

  const allOpts = [res.networkAddress, ...(distractors ?? ["192.168.1.0", "192.168.1.64", "192.168.1.128"])]
  // Put correct answer in deterministic position based on id
  const correctIdx = id.charCodeAt(id.length - 1) % 4
  const ordered: string[] = [...(distractors ?? ["192.168.1.0", "192.168.1.64", "192.168.1.128"])]
  ordered.splice(correctIdx, 0, res.networkAddress)

  return {
    id,
    categoryId: "network-address",
    difficulty,
    type: "multiple_choice",
    prompt: `Berapakah Network Address dari alamat host ${ip}/${prefix}?`,
    contextIp: `${ip}/${prefix}`,
    options: ordered.slice(0, 4) as [string, string, string, string],
    correctIndex: correctIdx,
    explanation: `Operasi bitwise AND antara ${ip} dan Subnet Mask ${res.subnetMask} menghasilkan Network Address ${res.networkAddress}.`,
    steps: [
      `IP Address  : ${ip} (Oktet ke-4 = ${lastOctet})`,
      `Subnet Mask : ${res.subnetMask} (Ukuran blok = ${blockSize})`,
      `Kelipatan blok ${blockSize}: ..., ${netLastOctet}, ${netLastOctet + blockSize}`,
      `Network Address = ${res.networkAddress}`,
    ],
  }
}

const NETWORK_ADDRESS_QUESTIONS: PracticeQuestion[] = [
  buildNetworkQuestion("net-1", "192.168.1.45", 24, "Mudah", "multiple_choice", [
    "192.168.1.1",
    "192.168.1.255",
    "192.168.0.0",
  ]),
  buildNetworkQuestion("net-2", "192.168.10.200", 24, "Mudah", "short_answer"),
  buildNetworkQuestion("net-3", "192.168.1.90", 25, "Mudah", "multiple_choice", [
    "192.168.1.64",
    "192.168.1.128",
    "192.168.1.1",
  ]),
  buildNetworkQuestion("net-4", "192.168.1.150", 25, "Mudah", "short_answer"),
  buildNetworkQuestion("net-5", "192.168.10.130", 26, "Menengah", "multiple_choice", [
    "192.168.10.0",
    "192.168.10.64",
    "192.168.10.192",
  ]),
  buildNetworkQuestion("net-6", "192.168.5.75", 26, "Menengah", "short_answer"),
  buildNetworkQuestion("net-7", "192.168.20.100", 27, "Menengah", "multiple_choice", [
    "192.168.20.64",
    "192.168.20.128",
    "192.168.20.0",
  ]),
  buildNetworkQuestion("net-8", "192.168.3.210", 27, "Menengah", "short_answer"),
  buildNetworkQuestion("net-9", "200.10.5.50", 28, "Sulit", "multiple_choice", [
    "200.10.5.32",
    "200.10.5.64",
    "200.10.5.0",
  ]),
  buildNetworkQuestion("net-10", "192.168.88.115", 28, "Sulit", "short_answer"),
  buildNetworkQuestion("net-11", "192.168.100.37", 29, "Sulit", "multiple_choice", [
    "192.168.100.24",
    "192.168.100.36",
    "192.168.100.40",
  ]),
  buildNetworkQuestion("net-12", "192.168.50.22", 30, "Sulit", "short_answer"),
]

// ============================================================================
// 6. KATEGORI: BROADCAST ADDRESS (12 Soal Terverifikasi Engine)
// ============================================================================
function buildBroadcastQuestion(
  id: string,
  ip: string,
  prefix: number,
  difficulty: PracticeDifficulty,
  type: PracticeQuestionType,
  distractors?: [string, string, string]
): PracticeQuestion {
  const res = calculateIPv4(ip, prefix)
  const blockSize = 256 - Number(res.subnetMask.split(".")[3])
  const netLastOctet = Number(res.networkAddress.split(".")[3])
  const bcLastOctet = Number(res.broadcastAddress.split(".")[3])

  if (type === "short_answer") {
    return {
      id,
      categoryId: "broadcast-address",
      difficulty,
      type: "short_answer",
      prompt: `Tentukan Broadcast Address untuk jaringan yang menaungi IP ${ip}/${prefix}!`,
      contextIp: `${ip}/${prefix}`,
      acceptedAnswers: [res.broadcastAddress],
      placeholder: "Contoh: 192.168.1.255",
      answerHint: `Broadcast = Network Address (${res.networkAddress}) + Ukuran Blok (${blockSize}) - 1.`,
      explanation: `Sub-jaringan ini dimulai pada Network Address ${res.networkAddress} dengan ukuran blok ${blockSize}. Alamat terakhir pada blok ini adalah ${netLastOctet} + ${blockSize} - 1 = ${bcLastOctet}, yaitu ${res.broadcastAddress}.`,
      steps: [
        `Network Address = ${res.networkAddress}`,
        `Ukuran Blok /${prefix} = ${blockSize}`,
        `Oktet ke-4 Broadcast = ${netLastOctet} + ${blockSize} - 1 = ${bcLastOctet}`,
        `Broadcast Address = ${res.broadcastAddress}`,
      ],
    }
  }

  const correctIdx = id.charCodeAt(id.length - 1) % 4
  const ordered: string[] = [...(distractors ?? ["192.168.1.127", "192.168.1.191", "192.168.1.254"])]
  ordered.splice(correctIdx, 0, res.broadcastAddress)

  return {
    id,
    categoryId: "broadcast-address",
    difficulty,
    type: "multiple_choice",
    prompt: `Berapakah Broadcast Address dari jaringan ${ip}/${prefix}?`,
    contextIp: `${ip}/${prefix}`,
    options: ordered.slice(0, 4) as [string, string, string, string],
    correctIndex: correctIdx,
    explanation: `Ketika seluruh ${res.hostBits} bit host pada jaringan ${res.networkAddress}/${prefix} diset menjadi 1, diperoleh Broadcast Address ${res.broadcastAddress}.`,
    steps: [
      `Network Address : ${res.networkAddress}`,
      `Ukuran Blok /${prefix} : ${blockSize} alamat`,
      `Broadcast = ${netLastOctet} + ${blockSize} - 1 = ${bcLastOctet}`,
      `Broadcast Address = ${res.broadcastAddress}`,
    ],
  }
}

const BROADCAST_ADDRESS_QUESTIONS: PracticeQuestion[] = [
  buildBroadcastQuestion("bc-1", "192.168.1.25", 24, "Mudah", "multiple_choice", [
    "192.168.1.0",
    "192.168.1.254",
    "192.168.255.255",
  ]),
  buildBroadcastQuestion("bc-2", "192.168.50.10", 24, "Mudah", "short_answer"),
  buildBroadcastQuestion("bc-3", "192.168.1.30", 25, "Mudah", "multiple_choice", [
    "192.168.1.128",
    "192.168.1.255",
    "192.168.1.126",
  ]),
  buildBroadcastQuestion("bc-4", "192.168.1.180", 25, "Mudah", "short_answer"),
  buildBroadcastQuestion("bc-5", "192.168.10.20", 26, "Menengah", "multiple_choice", [
    "192.168.10.62",
    "192.168.10.64",
    "192.168.10.127",
  ]),
  buildBroadcastQuestion("bc-6", "192.168.10.130", 26, "Menengah", "short_answer"),
  buildBroadcastQuestion("bc-7", "192.168.4.70", 27, "Menengah", "multiple_choice", [
    "192.168.4.94",
    "192.168.4.96",
    "192.168.4.127",
  ]),
  buildBroadcastQuestion("bc-8", "192.168.4.200", 27, "Menengah", "short_answer"),
  buildBroadcastQuestion("bc-9", "192.168.15.35", 28, "Sulit", "multiple_choice", [
    "192.168.15.46",
    "192.168.15.48",
    "192.168.15.63",
  ]),
  buildBroadcastQuestion("bc-10", "202.134.1.100", 28, "Sulit", "short_answer"),
  buildBroadcastQuestion("bc-11", "192.168.77.18", 29, "Sulit", "multiple_choice", [
    "192.168.77.22",
    "192.168.77.24",
    "192.168.77.31",
  ]),
  buildBroadcastQuestion("bc-12", "192.168.99.9", 30, "Sulit", "short_answer"),
]

// ============================================================================
// 7. KATEGORI: HOST ADDRESS (12 Soal Terverifikasi Engine)
// ============================================================================
const HOST_ADDRESS_QUESTIONS: PracticeQuestion[] = [
  {
    id: "host-1",
    categoryId: "host-address",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Pada jaringan 192.168.1.0/24, berapakah alamat IP valid pertama (First Usable Host) yang dapat dipasang pada komputer?",
    contextIp: "192.168.1.0/24",
    options: [
      "192.168.1.0",
      "192.168.1.1",
      "192.168.1.2",
      "192.168.1.254",
    ],
    correctIndex: 1,
    explanation:
      "First Usable Host selalu berada tepat 1 angka setelah Network Address: 192.168.1.0 + 1 = 192.168.1.1.",
    steps: [
      "Network Address = 192.168.1.0 (tidak boleh dipakai host)",
      "First Usable Host = Network + 1 = 192.168.1.1",
    ],
  },
  {
    id: "host-2",
    categoryId: "host-address",
    difficulty: "Mudah",
    type: "short_answer",
    prompt: "Tuliskan alamat IP valid terakhir (Last Usable Host) pada jaringan 192.168.1.0/24!",
    contextIp: "192.168.1.0/24",
    acceptedAnswers: ["192.168.1.254"],
    placeholder: "Contoh: 192.168.1.254",
    answerHint: "Satu angka sebelum Broadcast Address (192.168.1.255).",
    explanation:
      "Broadcast Address untuk /24 adalah 192.168.1.255. Maka Last Usable Host = 192.168.1.255 - 1 = 192.168.1.254.",
    steps: [
      "Broadcast Address = 192.168.1.255",
      "Last Usable Host = Broadcast - 1 = 192.168.1.254",
    ],
  },
  {
    id: "host-3",
    categoryId: "host-address",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Manakah rentang host valid (Usable Host Range) untuk subnet 192.168.10.0/25?",
    contextIp: "192.168.10.0/25",
    options: [
      "192.168.10.0 – 192.168.10.127",
      "192.168.10.1 – 192.168.10.126",
      "192.168.10.1 – 192.168.10.127",
      "192.168.10.1 – 192.168.10.254",
    ],
    correctIndex: 1,
    explanation:
      "Blok pertama /25 memiliki Network 192.168.10.0 dan Broadcast 192.168.10.127. Rentang host validnya adalah 192.168.10.1 sampai 192.168.10.126.",
    steps: [
      "Network Address = 192.168.10.0",
      "Broadcast Address = 192.168.10.127",
      "Rentang Host Valid = 192.168.10.1 – 192.168.10.126",
    ],
  },
  {
    id: "host-4",
    categoryId: "host-address",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Sebuah subnet memiliki alamat Network 192.168.5.64/26. Berapakah alamat First Host dan Last Host-nya?",
    contextIp: "192.168.5.64/26",
    options: [
      "192.168.5.64 dan 192.168.5.127",
      "192.168.5.65 dan 192.168.5.126",
      "192.168.5.65 dan 192.168.5.128",
      "192.168.5.66 dan 192.168.5.125",
    ],
    correctIndex: 1,
    explanation:
      "Untuk blok 192.168.5.64/26 (ukuran blok 64), Broadcast-nya adalah 192.168.5.127. Maka First Host = .65 dan Last Host = .126.",
    steps: [
      "Network = 192.168.5.64 -> First Host = 192.168.5.65",
      "Broadcast = 64 + 64 - 1 = 127 -> Last Host = 192.168.5.126",
    ],
  },
  {
    id: "host-5",
    categoryId: "host-address",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Tentukan alamat First Usable Host dari jaringan yang menaungi IP 192.168.10.130/26!",
    contextIp: "192.168.10.130/26",
    acceptedAnswers: ["192.168.10.129"],
    placeholder: "Contoh: 192.168.10.1",
    answerHint: "Cari dulu Network Address dari .130/26, lalu tambah 1.",
    explanation:
      "IP 192.168.10.130/26 berada pada blok Network 192.168.10.128. Maka First Usable Host adalah 192.168.10.128 + 1 = 192.168.10.129.",
    steps: [
      "Ukuran blok /26 = 64 (0, 64, 128, 192)",
      "Network Address untuk .130 = 192.168.10.128",
      "First Usable Host = 192.168.10.129",
    ],
  },
  {
    id: "host-6",
    categoryId: "host-address",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Tentukan alamat Last Usable Host dari jaringan yang menaungi IP 192.168.10.130/26!",
    contextIp: "192.168.10.130/26",
    acceptedAnswers: ["192.168.10.190"],
    placeholder: "Contoh: 192.168.10.62",
    answerHint: "Broadcast blok 128..191 adalah .191. Kurangi 1.",
    explanation:
      "Blok 192.168.10.128/26 berakhir pada Broadcast 192.168.10.191. Maka Last Usable Host adalah 192.168.10.190.",
    steps: [
      "Network = 192.168.10.128, Broadcast = 192.168.10.191",
      "Last Usable Host = 192.168.10.191 - 1 = 192.168.10.190",
    ],
  },
  {
    id: "host-7",
    categoryId: "host-address",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Mengapa seorang teknisi gagal mengonfigurasi IP 192.168.1.63/26 pada sebuah PC client?",
    contextIp: "192.168.1.63/26",
    options: [
      "Karena 192.168.1.63 merupakan Broadcast Address untuk blok pertama /26",
      "Karena 192.168.1.63 merupakan Network Address untuk blok kedua /26",
      "Karena angka 63 adalah bilangan ganjil",
      "Karena prefix /26 hanya mengizinkan oktet keempat di atas 100",
    ],
    correctIndex: 0,
    explanation:
      "Pada prefix /26 (ukuran blok 64), blok pertama berjalan dari 192.168.1.0 (Network) hingga 192.168.1.63 (Broadcast). Alamat Broadcast tidak boleh dipasang pada PC client.",
    steps: [
      "Blok 1 (/26): Network = .0, Host Valid = .1 s.d. .62, Broadcast = .63",
      "Kesimpulan: 192.168.1.63 adalah alamat Broadcast",
    ],
  },
  {
    id: "host-8",
    categoryId: "host-address",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Manakah di antara alamat berikut yang dapat dipasang secara VALID sebagai IP host pada jaringan 192.168.20.32/27?",
    contextIp: "192.168.20.32/27",
    options: [
      "192.168.20.31",
      "192.168.20.32",
      "192.168.20.45",
      "192.168.20.63",
    ],
    correctIndex: 2,
    explanation:
      "Blok 192.168.20.32/27 (ukuran blok 32) memiliki Broadcast 192.168.20.63 dan rentang host valid .33 sampai .62. Alamat .45 berada tepat di dalam rentang tersebut.",
    steps: [
      "Network = 192.168.20.32 (tidak valid untuk host)",
      "Broadcast = 192.168.20.63 (tidak valid untuk host)",
      "Rentang Host Valid = 192.168.20.33 – 192.168.20.62 -> .45 VALID",
    ],
  },
  {
    id: "host-9",
    categoryId: "host-address",
    difficulty: "Sulit",
    type: "short_answer",
    prompt: "Tentukan alamat Last Usable Host untuk jaringan 192.168.30.48/28!",
    contextIp: "192.168.30.48/28",
    acceptedAnswers: ["192.168.30.62"],
    placeholder: "Contoh: 192.168.30.62",
    answerHint: "Ukuran blok /28 adalah 16. Broadcast = 48 + 16 - 1 = 63.",
    explanation:
      "Pada prefix /28 (ukuran blok 16), subnet 192.168.30.48 memiliki Broadcast 192.168.30.63, sehingga Last Usable Host adalah 192.168.30.62.",
    steps: [
      "Ukuran blok /28 = 16",
      "Broadcast = 48 + 16 - 1 = 63 (192.168.30.63)",
      "Last Usable Host = 192.168.30.62",
    ],
  },
  {
    id: "host-10",
    categoryId: "host-address",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Sepasang router dihubungkan menggunakan subnet 192.168.100.8/30. Pasangan alamat IP manakah yang harus dipasang pada kedua interface router tersebut?",
    contextIp: "192.168.100.8/30",
    options: [
      "192.168.100.8 dan 192.168.100.9",
      "192.168.100.9 dan 192.168.100.10",
      "192.168.100.10 dan 192.168.100.11",
      "192.168.100.8 dan 192.168.100.11",
    ],
    correctIndex: 1,
    explanation:
      "Pada blok 192.168.100.8/30 (ukuran blok 4), .8 adalah Network Address dan .11 adalah Broadcast Address. Dua alamat usable untuk router adalah .9 dan .10.",
    steps: [
      "Network Address = 192.168.100.8",
      "Usable Host 1 = 192.168.100.9",
      "Usable Host 2 = 192.168.100.10",
      "Broadcast Address = 192.168.100.11",
    ],
  },
  {
    id: "host-11",
    categoryId: "host-address",
    difficulty: "Sulit",
    type: "short_answer",
    prompt: "Tentukan alamat First Usable Host dari jaringan yang menaungi IP 192.168.7.20/29!",
    contextIp: "192.168.7.20/29",
    acceptedAnswers: ["192.168.7.17"],
    placeholder: "Contoh: 192.168.7.17",
    answerHint: "Ukuran blok /29 adalah 8 (0, 8, 16, 24). Cari blok untuk .20.",
    explanation:
      "Ukuran blok /29 adalah 8. Angka 20 berada di dalam blok 192.168.7.16/29 (rentang 16..23). Maka First Usable Host adalah 192.168.7.17.",
    steps: [
      "Kelipatan blok 8: 0, 8, 16, 24",
      "Network Address untuk .20 adalah 192.168.7.16",
      "First Usable Host = 192.168.7.16 + 1 = 192.168.7.17",
    ],
  },
  {
    id: "host-12",
    categoryId: "host-address",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Apakah PC A (192.168.1.60/26) dan PC B (192.168.1.70/26) berada di dalam satu subnet yang sama?",
    options: [
      "Ya, karena keduanya sama-sama diawali 192.168.1",
      "Tidak, karena PC A berada di blok 192.168.1.0/26 (.0–.63) sedangkan PC B berada di blok 192.168.1.64/26 (.64–.127)",
      "Ya, karena selisihnya hanya 10 angka",
      "Tidak, karena /26 hanya menampung maksimal 10 komputer",
    ],
    correctIndex: 1,
    explanation:
      "Dengan prefix /26 (ukuran blok 64), batas blok pertama adalah 0..63 dan blok kedua adalah 64..127. PC A (.60) dan PC B (.70) berbeda subnet sehingga memerlukan router untuk berkomunikasi.",
    steps: [
      "PC A (.60/26) -> Network Address = 192.168.1.0",
      "PC B (.70/26) -> Network Address = 192.168.1.64",
      "Berbeda Network Address = Berbeda Subnet",
    ],
  },
]

// ============================================================================
// 8. KATEGORI: JUMLAH HOST (12 Soal)
// ============================================================================
const JUMLAH_HOST_QUESTIONS: PracticeQuestion[] = [
  {
    id: "jhost-1",
    categoryId: "jumlah-host",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Berapa jumlah maksimal Usable Host (perangkat yang dapat diberi IP) pada jaringan Kelas C default (/24)?",
    options: ["256 host", "254 host", "252 host", "128 host"],
    correctIndex: 1,
    explanation:
      "Pada /24 terdapat 8 bit host: Total alamat = 2^8 = 256. Dikurangi 2 (Network & Broadcast) = 254 usable host.",
    steps: [
      "h = 32 - 24 = 8 bit",
      "Usable Host = 2^8 - 2 = 256 - 2 = 254 host",
    ],
  },
  {
    id: "jhost-2",
    categoryId: "jumlah-host",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Mengapa dalam rumus menghitung Usable Host selalu dikurangi angka 2 (2^h - 2)?",
    options: [
      "Karena 2 alamat dicadangkan untuk Server Utama dan Printer",
      "Karena 1 alamat digunakan sebagai Network Address dan 1 alamat digunakan sebagai Broadcast Address",
      "Karena 2 bit pertama selalu bernilai 0",
      "Karena aturan khusus untuk cadangan DNS primer dan sekunder",
    ],
    correctIndex: 1,
    explanation:
      "Pada setiap subnet konvensional (/0 s.d. /30), alamat paling awal dipakai sebagai identitas jaringan (Network Address) dan alamat paling akhir sebagai Broadcast Address.",
    steps: [
      "Alamat ke-1 (semua bit host 0) = Network Address",
      "Alamat terakhir (semua bit host 1) = Broadcast Address",
      "Sisa alamat untuk perangkat = 2^h - 2",
    ],
  },
  {
    id: "jhost-3",
    categoryId: "jumlah-host",
    difficulty: "Mudah",
    type: "short_answer",
    prompt: "Berapakah jumlah Usable Host pada sebuah subnet dengan prefix /25 (ketik angkanya saja)?",
    acceptedAnswers: ["126"],
    placeholder: "Contoh: 254",
    answerHint: "h = 7 bit -> 2^7 - 2.",
    explanation:
      "Pada /25, sisa bit host h = 32 - 25 = 7. Maka Usable Host = 2^7 - 2 = 128 - 2 = 126 host.",
    steps: [
      "h = 32 - 25 = 7",
      "Total alamat = 2^7 = 128",
      "Usable Host = 128 - 2 = 126",
    ],
  },
  {
    id: "jhost-4",
    categoryId: "jumlah-host",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Hitunglah jumlah Usable Host yang tersedia pada jaringan 192.168.10.0/26!",
    contextIp: "192.168.10.0/26",
    acceptedAnswers: ["62"],
    placeholder: "Ketik angka",
    answerHint: "h = 6 bit -> 2^6 - 2.",
    explanation:
      "Prefix /26 menyisakan h = 6 bit host. Kapasitas host valid adalah 2^6 - 2 = 64 - 2 = 62 host.",
    steps: [
      "h = 32 - 26 = 6 bit",
      "Usable Host = 2^6 - 2 = 64 - 2 = 62",
    ],
  },
  {
    id: "jhost-5",
    categoryId: "jumlah-host",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Berapa jumlah Total Alamat dan Usable Host secara berturut-turut pada subnet berprefix /27?",
    options: [
      "64 total alamat dan 62 usable host",
      "32 total alamat dan 30 usable host",
      "16 total alamat dan 14 usable host",
      "30 total alamat dan 28 usable host",
    ],
    correctIndex: 1,
    explanation:
      "Pada /27, sisa bit host h = 5. Total alamat = 2^5 = 32 alamat, dan Usable Host = 32 - 2 = 30 host.",
    steps: [
      "h = 32 - 27 = 5 bit",
      "Total Alamat = 2^5 = 32",
      "Usable Host = 32 - 2 = 30",
    ],
  },
  {
    id: "jhost-6",
    categoryId: "jumlah-host",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Berapa jumlah Usable Host pada subnet dengan Subnet Mask 255.255.255.240 (/28)?",
    acceptedAnswers: ["14"],
    placeholder: "Ketik angka",
    answerHint: "h = 4 bit -> 2^4 - 2.",
    explanation:
      "Prefix /28 memiliki h = 4 bit host. Jumlah Usable Host = 2^4 - 2 = 16 - 2 = 14 host.",
    steps: [
      "h = 32 - 28 = 4 bit",
      "Usable Host = 2^4 - 2 = 16 - 2 = 14",
    ],
  },
  {
    id: "jhost-7",
    categoryId: "jumlah-host",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Sebuah ruang rapat kecil membutuhkan jaringan dengan prefix /29. Berapa banyak perangkat maksimal yang dapat terhubung di subnet tersebut?",
    options: ["4 perangkat", "6 perangkat", "8 perangkat", "14 perangkat"],
    correctIndex: 1,
    explanation:
      "Pada /29, sisa bit host h = 32 - 29 = 3 bit. Jumlah perangkat (usable host) = 2^3 - 2 = 8 - 2 = 6 perangkat.",
    steps: [
      "h = 32 - 29 = 3 bit",
      "Usable Host = 2^3 - 2 = 6 perangkat",
    ],
  },
  {
    id: "jhost-8",
    categoryId: "jumlah-host",
    difficulty: "Sulit",
    type: "short_answer",
    prompt: "Berapakah jumlah Usable Host pada subnet point-to-point berprefix /30?",
    acceptedAnswers: ["2"],
    placeholder: "Ketik angka",
    answerHint: "h = 2 bit -> 2^2 - 2.",
    explanation:
      "Prefix /30 memiliki 2 bit host: 2^2 - 2 = 4 - 2 = 2 usable host, sangat pas untuk menghubungkan 2 interface router.",
    steps: [
      "h = 32 - 30 = 2 bit",
      "Usable Host = 2^2 - 2 = 2 host",
    ],
  },
  {
    id: "jhost-9",
    categoryId: "jumlah-host",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Sebuah laboratorium komputer memiliki 25 PC client dan 1 interface router gateway (total 26 IP). Prefix paling efisien (tidak banyak membuang IP) yang mampu menampung kebutuhan tersebut adalah...",
    options: [
      "/28 (14 usable host)",
      "/27 (30 usable host)",
      "/26 (62 usable host)",
      "/25 (126 usable host)",
    ],
    correctIndex: 1,
    explanation:
      "Kebutuhan adalah 26 IP. Prefix /28 (14 host) tidak cukup, sedangkan /27 menyediakan 30 usable host (cukup untuk 26 IP dan paling hemat dibanding /26).",
    steps: [
      "Kebutuhan = 26 usable IP",
      "Cek 2^h - 2 >= 26 -> 2^5 - 2 = 30 (h = 5)",
      "Prefix = 32 - 5 = /27",
    ],
  },
  {
    id: "jhost-10",
    categoryId: "jumlah-host",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Divisi Riset membutuhkan subnet yang sanggup menampung minimal 50 host. Berapa jumlah bit host (h) minimum yang harus disisakan?",
    options: ["5 bit", "6 bit", "7 bit", "8 bit"],
    correctIndex: 1,
    explanation:
      "Jika h = 5, hanya tersedia 2^5 - 2 = 30 host (kurang). Jika h = 6, tersedia 2^6 - 2 = 62 host (mencukupi 50 host).",
    steps: [
      "Uji h = 5 -> 32 - 2 = 30 (< 50, tidak cukup)",
      "Uji h = 6 -> 64 - 2 = 62 (>= 50, mencukupi)",
      "Jadi dibutuhkan minimal 6 bit host (/26)",
    ],
  },
  {
    id: "jhost-11",
    categoryId: "jumlah-host",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Berapa TOTAL keseluruhan alamat IP (termasuk Network dan Broadcast) dalam satu blok subnet /26?",
    acceptedAnswers: ["64"],
    placeholder: "Ketik angka",
    answerHint: "Gunakan rumus Total Alamat = 2^h tanpa dikurangi 2.",
    explanation:
      "Pada /26 terdapat h = 6 bit host. Total keseluruhan alamat dalam 1 blok adalah 2^6 = 64 alamat.",
    steps: [
      "h = 32 - 26 = 6 bit",
      "Total Alamat = 2^6 = 64 alamat",
    ],
  },
  {
    id: "jhost-12",
    categoryId: "jumlah-host",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Jika sebuah blok Kelas C /24 dipecah menjadi 4 subnet berukuran sama (/26), berapakah total alamat IP yang hilang/terpakai untuk Network & Broadcast di keempat subnet tersebut?",
    options: ["2 alamat", "4 alamat", "8 alamat", "16 alamat"],
    correctIndex: 2,
    explanation:
      "Setiap subnet membutuhkan 2 alamat (1 Network + 1 Broadcast). Karena terdapat 4 subnet, maka 4 x 2 = 8 alamat tidak dapat dipakai sebagai host.",
    steps: [
      "Jumlah subnet pada /26 = 4 blok",
      "Tiap blok dikurangi 2 alamat (Network & Broadcast)",
      "Total alamat terpakai untuk identitas & broadcast = 4 x 2 = 8 alamat (tersisa 4 x 62 = 248 host)",
    ],
  },
]

// ============================================================================
// 9. KATEGORI: SUBNETTING KELAS C (14 Soal)
// ============================================================================
const SUBNETTING_QUESTIONS: PracticeQuestion[] = [
  {
    id: "sub-1",
    categoryId: "subnetting",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Jika jaringan 192.168.1.0/24 disubnet menjadi /25 (meminjam 1 bit host), berapa banyak blok subnet baru yang terbentuk?",
    options: ["2 subnet", "4 subnet", "8 subnet", "16 subnet"],
    correctIndex: 0,
    explanation:
      "Meminjam s = 1 bit dari porsi host menghasilkan 2^1 = 2 blok subnet (blok .0–.127 dan blok .128–.255).",
    steps: [
      "Bit pinjaman (s) = 25 - 24 = 1 bit",
      "Jumlah Subnet = 2^s = 2^1 = 2 subnet",
    ],
  },
  {
    id: "sub-2",
    categoryId: "subnetting",
    difficulty: "Mudah",
    type: "short_answer",
    prompt: "Berapa banyak blok subnet yang dihasilkan jika jaringan Kelas C /24 dipecah menggunakan prefix /26 (ketik angkanya saja)?",
    acceptedAnswers: ["4"],
    placeholder: "Contoh: 2",
    answerHint: "s = 26 - 24 = 2 bit -> hitung 2^s.",
    explanation:
      "Pada /26, jumlah bit yang dipinjam adalah s = 26 - 24 = 2 bit. Jumlah subnet = 2^2 = 4 blok subnet.",
    steps: [
      "s = 26 - 24 = 2 bit",
      "Jumlah Subnet = 2^2 = 4 blok",
    ],
  },
  {
    id: "sub-3",
    categoryId: "subnetting",
    difficulty: "Mudah",
    type: "multiple_choice",
    prompt: "Berapakah ukuran lompatan blok (Block Size / Magic Number) untuk Subnet Mask 255.255.255.192 (/26)?",
    options: ["32", "64", "128", "192"],
    correctIndex: 1,
    explanation:
      "Ukuran blok dihitung dengan rumus 256 dikurangi nilai oktet keempat Subnet Mask: 256 - 192 = 64.",
    steps: [
      "Rumus Block Size = 256 - Oktet ke-4 Mask",
      "Block Size = 256 - 192 = 64",
    ],
  },
  {
    id: "sub-4",
    categoryId: "subnetting",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Jika jaringan 192.168.1.0/24 disubnet dengan prefix /27, berapakah jumlah blok subnet yang terbentuk?",
    acceptedAnswers: ["8"],
    placeholder: "Ketik angka",
    answerHint: "s = 27 - 24 = 3 bit -> 2^3.",
    explanation:
      "Meminjam s = 3 bit (27 - 24) menghasilkan 2^3 = 8 blok subnet yang masing-masing berukuran 32 alamat.",
    steps: [
      "s = 27 - 24 = 3 bit",
      "Jumlah Subnet = 2^3 = 8 subnet",
    ],
  },
  {
    id: "sub-5",
    categoryId: "subnetting",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Urutan Network Address untuk ke-4 blok subnet hasil pemecahan 192.168.10.0/26 adalah...",
    contextIp: "192.168.10.0/26",
    options: [
      ".0, .32, .64, .96",
      ".0, .64, .128, .192",
      ".0, .128, .192, .224",
      ".1, .65, .129, .193",
    ],
    correctIndex: 1,
    explanation:
      "Karena ukuran blok /26 adalah 64, maka Network Address dimulai dari 0 dan bertambah 64 setiap blok: .0, .64, .128, dan .192.",
    steps: [
      "Ukuran blok /26 = 64",
      "Blok 1 = 192.168.10.0",
      "Blok 2 = 192.168.10.64",
      "Blok 3 = 192.168.10.128",
      "Blok 4 = 192.168.10.192",
    ],
  },
  {
    id: "sub-6",
    categoryId: "subnetting",
    difficulty: "Menengah",
    type: "multiple_choice",
    prompt: "Sebuah gedung kampus memiliki 6 lantai dan setiap lantai membutuhkan 1 subnet terpisah dari blok 192.168.50.0/24. Prefix apakah yang harus dipilih?",
    options: [
      "/25 (2 subnet, @126 host)",
      "/26 (4 subnet, @62 host)",
      "/27 (8 subnet, @30 host)",
      "/24 (1 subnet, @254 host)",
    ],
    correctIndex: 2,
    explanation:
      "Untuk menyediakan minimal 6 subnet, kita memerlukan 2^s >= 6. Nilai terdekat adalah s = 3 (2^3 = 8 subnet), yaitu prefix 24 + 3 = /27.",
    steps: [
      "Kebutuhan = 6 subnet",
      "2^2 = 4 subnet (kurang); 2^3 = 8 subnet (cukup untuk 6 lantai + 2 cadangan)",
      "Prefix = 24 + 3 = /27",
    ],
  },
  {
    id: "sub-7",
    categoryId: "subnetting",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Pada jaringan 192.168.1.0/27, berapakah nilai oktet keempat untuk Network Address pada blok subnet ke-3 (dihitung mulai dari blok ke-1 = .0)?",
    acceptedAnswers: ["64", "192.168.1.64"],
    placeholder: "Contoh: 64",
    answerHint: "Ukuran blok /27 adalah 32: Blok 1 = 0, Blok 2 = 32, Blok 3 = ...",
    explanation:
      "Ukuran blok /27 adalah 32. Blok ke-1 = .0, Blok ke-2 = .32, dan Blok ke-3 = .64 (192.168.1.64).",
    steps: [
      "Ukuran blok /27 = 32",
      "Blok 1 = 0",
      "Blok 2 = 32",
      "Blok 3 = 64 (192.168.1.64)",
    ],
  },
  {
    id: "sub-8",
    categoryId: "subnetting",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Perusahaan membagi jaringan 192.168.100.0/24 menjadi /28. Berapa banyak subnet dan berapa usable host per subnet yang dihasilkan?",
    options: [
      "8 subnet dan 30 usable host per subnet",
      "16 subnet dan 14 usable host per subnet",
      "16 subnet dan 16 usable host per subnet",
      "32 subnet dan 6 usable host per subnet",
    ],
    correctIndex: 1,
    explanation:
      "Pada /28, bit pinjaman s = 28 - 24 = 4 bit (2^4 = 16 subnet), dan sisa bit host h = 32 - 28 = 4 bit (2^4 - 2 = 14 usable host).",
    steps: [
      "s = 28 - 24 = 4 -> Jumlah Subnet = 2^4 = 16 subnet",
      "h = 32 - 28 = 4 -> Usable Host = 2^4 - 2 = 14 host/subnet",
    ],
  },
  {
    id: "sub-9",
    categoryId: "subnetting",
    difficulty: "Sulit",
    type: "short_answer",
    prompt: "Jika blok 192.168.1.0/24 dipecah menjadi /29, berapa total blok subnet yang terbentuk?",
    acceptedAnswers: ["32"],
    placeholder: "Ketik angka",
    answerHint: "s = 29 - 24 = 5 bit -> hitung 2^5.",
    explanation:
      "Meminjam s = 5 bit (29 - 24) menghasilkan 2^5 = 32 blok subnet yang masing-masing berukuran 8 alamat (6 usable host).",
    steps: [
      "s = 29 - 24 = 5 bit",
      "Jumlah Subnet = 2^5 = 32 subnet",
    ],
  },
  {
    id: "sub-10",
    categoryId: "subnetting",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Pada skema subnetting 192.168.1.0/26, host dengan alamat IP 192.168.1.200 berada pada blok subnet ke-...",
    contextIp: "192.168.1.200/26",
    options: [
      "Subnet ke-1 (192.168.1.0/26)",
      "Subnet ke-2 (192.168.1.64/26)",
      "Subnet ke-3 (192.168.1.128/26)",
      "Subnet ke-4 (192.168.1.192/26)",
    ],
    correctIndex: 3,
    explanation:
      "Keempat blok /26 dimulai pada .0, .64, .128, dan .192. Karena 200 berada di antara 192 dan 255, maka ia terletak di Subnet ke-4 (192.168.1.192/26).",
    steps: [
      "Subnet 1: .0 – .63",
      "Subnet 2: .64 – .127",
      "Subnet 3: .128 – .191",
      "Subnet 4: .192 – .255 -> 192.168.1.200 berada di sini",
    ],
  },
  {
    id: "sub-11",
    categoryId: "subnetting",
    difficulty: "Sulit",
    type: "multiple_choice",
    prompt: "Apa manfaat teknis utama dari dilakukannya subnetting pada jaringan lokal berskala besar?",
    options: [
      "Mengubah alamat IPv4 32-bit menjadi IPv6 128-bit secara otomatis",
      "Memperkecil ukuran Broadcast Domain sehingga lalu lintas broadcast tidak membanjiri seluruh jaringan",
      "Menghilangkan kebutuhan akan perangkat router maupun switch",
      "Membuat semua komputer memiliki alamat IP yang sama",
    ],
    correctIndex: 1,
    explanation:
      "Subnetting memecah satu Broadcast Domain besar menjadi beberapa Broadcast Domain yang lebih kecil, meningkatkan efisiensi trafik dan keamanan antar-divisi.",
    steps: [
      "Tanpa subnetting (/24): 1 broadcast diterima oleh 254 host sekaligus",
      "Dengan subnetting: trafik broadcast terisolasi hanya di dalam sub-jaringan masing-masing",
    ],
  },
  {
    id: "sub-12",
    categoryId: "subnetting",
    difficulty: "Menengah",
    type: "short_answer",
    prompt: "Berapakah ukuran blok (Block Size) untuk subnet berprefix /27?",
    acceptedAnswers: ["32"],
    placeholder: "Ketik angka",
    answerHint: "256 dikurangi 224 (atau 2^5).",
    explanation:
      "Subnet Mask /27 memiliki oktet keempat 224. Ukuran blok = 256 - 224 = 32 alamat per blok.",
    steps: [
      "Oktet ke-4 Mask /27 = 224",
      "Block Size = 256 - 224 = 32",
    ],
  },
]

export const PRACTICE_QUESTIONS_BANK: PracticeQuestion[] = [
  ...IDENTIFIKASI_QUESTIONS,
  ...KONVERSI_BINER_QUESTIONS,
  ...SUBNET_MASK_QUESTIONS,
  ...CIDR_QUESTIONS,
  ...NETWORK_ADDRESS_QUESTIONS,
  ...BROADCAST_ADDRESS_QUESTIONS,
  ...HOST_ADDRESS_QUESTIONS,
  ...JUMLAH_HOST_QUESTIONS,
  ...SUBNETTING_QUESTIONS,
]

export const PRACTICE_SESSION_SIZE = 10
export const PRACTICE_PASSING_SCORE = 70
export const PRACTICE_MAX_ATTEMPTS = 3

/**
 * Mengambil 10 soal untuk sesi latihan berdasarkan filter kategori, kesulitan, dan nomor percobaan (attempt).
 * Soal diacak secara deterministik/dinamis berdasarkan seed agar setiap percobaan (1, 2, 3) mendapat kombinasi soal yang segar.
 */
export function selectPracticeSessionQuestions(
  categoryId: PracticeCategoryId | "semua",
  difficulty: PracticeDifficulty | "Semua",
  attemptSeed: number
): PracticeQuestion[] {
  let pool = PRACTICE_QUESTIONS_BANK.filter((q) => {
    const matchCategory = categoryId === "semua" ? true : q.categoryId === categoryId
    const matchDifficulty = difficulty === "Semua" ? true : q.difficulty === difficulty
    return matchCategory && matchDifficulty
  })

  // Jika filter kombinasi (misal Kategori X + Level Sulit) jumlahnya < 10 soal,
  // lengkapi dari kategori yang sama (semua level) agar selalu tepat 10 butir soal.
  if (pool.length < PRACTICE_SESSION_SIZE && categoryId !== "semua") {
    const fallbackCategoryPool = PRACTICE_QUESTIONS_BANK.filter(
      (q) => q.categoryId === categoryId && !pool.some((p) => p.id === q.id)
    )
    pool = [...pool, ...fallbackCategoryPool]
  }

  // Jika masih kurang dari 10 (misal filter ekstrem), lengkapi dari bank umum
  if (pool.length < PRACTICE_SESSION_SIZE) {
    const fallbackAll = PRACTICE_QUESTIONS_BANK.filter(
      (q) => !pool.some((p) => p.id === q.id)
    )
    pool = [...pool, ...fallbackAll]
  }

  // Pengacakan deterministik berbasis attemptSeed menggunakan algoritma Fisher-Yates dengan LCG sederhana
  const shuffled = [...pool]
  let seed = (attemptSeed * 9301 + 49297) % 233280
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280
    const j = seed % (i + 1)
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }

  return shuffled.slice(0, PRACTICE_SESSION_SIZE)
}

/**
 * Memeriksa apakah jawaban siswa pada suatu butir soal bernilai benar.
 */
export function checkPracticeAnswer(
  question: PracticeQuestion,
  userAnswer: string | number | undefined
): boolean {
  if (userAnswer === undefined || userAnswer === null || userAnswer === "") {
    return false
  }

  if (question.type === "multiple_choice") {
    return Number(userAnswer) === question.correctIndex
  }

  // short_answer: normalisasi spasi dan huruf kecil
  const normalizedUser = String(userAnswer).trim().toLowerCase()
  if (!normalizedUser) return false

  return (question.acceptedAnswers ?? []).some(
    (ans) => ans.trim().toLowerCase() === normalizedUser
  )
}

