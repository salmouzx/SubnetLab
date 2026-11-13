export type MaterialCategory =
  | "Fondasi & Biner"
  | "Struktur & Masking"
  | "Identitas & Subnetting"

export interface MaterialConceptSection {
  heading: string
  paragraphs: string[]
  formulaCallout?: {
    label: string
    formula: string
    note: string
  }
  table?: {
    caption?: string
    headers: string[]
    rows: string[][]
  }
}

export interface MaterialWorkedExample {
  question: string
  givenIp: string
  givenPrefix: number
  steps: {
    title: string
    detail: string
  }[]
  finalAnswer: string
}

export interface MaterialCheckQuestion {
  id: string
  question: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
  steps: string[]
}

export interface MaterialTopic {
  id: string
  order: number
  slug: string
  title: string
  category: MaterialCategory
  estimatedMinutes: number
  shortDescription: string
  objectives: string[]
  conceptSections: MaterialConceptSection[]
  simulatorPreset: {
    ip: string
    prefix: number
    caption: string
  }
  workedExample: MaterialWorkedExample
  checkQuestions: [MaterialCheckQuestion, MaterialCheckQuestion]
  keyTakeaways: string[]
}

export const MATERIALS_DATA: MaterialTopic[] = [
  {
    id: "mat-01",
    order: 1,
    slug: "pengenalan-ipv4",
    title: "Pengenalan IPv4",
    category: "Fondasi & Biner",
    estimatedMinutes: 6,
    shortDescription:
      "Memahami peran Internet Protocol version 4 (IPv4), karakteristik pengalamatan logis 32-bit, serta pembagian kelas alamat A hingga E dengan fokus Kelas C.",
    objectives: [
      "Menjelaskan fungsi utama alamat IPv4 pada lapisan Network (Layer 3 OSI / Internet Layer TCP/IP).",
      "Membedakan karakteristik kelas alamat IPv4 (Kelas A, B, C, D, dan E) berdasarkan rentang oktet pertama.",
      "Mengidentifikasi rentang alamat IPv4 Kelas C (192–223) serta alamat Private RFC 1918 (192.168.0.0/16).",
    ],
    conceptSections: [
      {
        heading: "Apa itu Pengalamatan IPv4?",
        paragraphs: [
          "Internet Protocol version 4 (IPv4) adalah skema pengalamatan logis berukuran 32-bit yang digunakan untuk mengidentifikasi setiap perangkat (host, router, server) di dalam jaringan berbasis TCP/IP. Berbeda dengan alamat fisik (MAC Address) yang bekerja di lapisan Data Link, alamat IPv4 bersifat hierarkis sehingga memungkinkan perutean paket lintas jaringan.",
          "Karena panjangnya 32 bit biner, ruang alamat IPv4 secara teoretis memiliki total 2^32 atau 4.294.967.296 alamat unik. Untuk memudahkan manajemen skala jaringan, arsitektur classful membagi ruang tersebut ke dalam lima kelas utama: Kelas A, B, C, D, dan E.",
        ],
        formulaCallout: {
          label: "Total Ruang Alamat IPv4 (32-Bit)",
          formula: "2^32 = 4.294.967.296 Alamat",
          note: "Setiap posisi bit hanya bernilai 0 atau 1, sehingga 32 bit menghasilkan lebih dari 4,29 miliar kombinasi.",
        },
        table: {
          caption: "Tabel Klasifikasi Kelas Alamat IPv4 (Classful Addressing)",
          headers: ["Kelas", "Bit Awal", "Rentang Oktet Pertama", "Default Prefix", "Peruntukan Utama"],
          rows: [
            ["Kelas A", "0...", "1 – 126", "/8 (255.0.0.0)", "Unicast jaringan sangat besar (Enterprise/ISP)"],
            ["Loopback", "01111111", "127 (127.0.0.0/8)", "/8", "Pengujian internal perangkat (localhost)"],
            ["Kelas B", "10..", "128 – 191", "/16 (255.255.0.0)", "Unicast jaringan skala menengah–besar"],
            ["Kelas C", "110.", "192 – 223", "/24 (255.255.255.0)", "Unicast jaringan lokal (LAN) skala kecil"],
            ["Kelas D", "1110", "224 – 239", "Tidak ada", "Multicast (pengiriman satu-ke-banyak grup)"],
            ["Kelas E", "1111", "240 – 255", "Tidak ada", "Dicadangkan untuk riset / eksperimental"],
          ],
        },
      },
      {
        heading: "Fokus Pembelajaran: Mengapa IPv4 Kelas C?",
        paragraphs: [
          "Dalam praktik administrasi jaringan lokal (LAN) di laboratorium, sekolah, kantor, maupun jaringan rumah, IPv4 Kelas C (oktet pertama 192 hingga 223) adalah kelas yang paling sering diimplementasikan. Secara khusus, blok Private IP Kelas C sesuai standar RFC 1918 berada pada rentang 192.168.0.0 hingga 192.168.255.255.",
          "Agar pembelajaran runtut dan tidak membingungkan, seluruh 12 bagian materi ini menggunakan satu alamat studi kasus yang sama yaitu 192.168.10.130/26. Kita akan membedah alamat tersebut langkah demi langkah mulai dari pengenalan kelasnya hingga tabel subnetting lengkap di Bagian 12.",
        ],
      },
    ],
    simulatorPreset: {
      ip: "192.168.10.130",
      prefix: 26,
      caption: "Studi kasus terpadu 192.168.10.130/26: alamat Kelas C Private (oktet pertama 192) yang akan kita bedah di sepanjang 12 materi.",
    },
    workedExample: {
      question:
        "Pada studi kasus utama kita, sebuah perangkat memiliki alamat IP 192.168.10.130/26, serta sedang menguji koneksi ke 127.0.0.1 dan grup streaming 224.0.0.5. Tentukan kelas dan fungsi dari alamat 192.168.10.130 tersebut!",
      givenIp: "192.168.10.130",
      givenPrefix: 26,
      steps: [
        {
          title: "Periksa oktet pertama dari 192.168.10.130",
          detail:
            "Oktet pertama bernilai 192. Karena 192 berada di rentang 192–223 dan diawali 192.168.x.x, alamat 192.168.10.130 adalah Kelas C Unicast (Private IP RFC 1918).",
        },
        {
          title: "Periksa oktet pertama dari 127.0.0.1 (sebagai pembanding)",
          detail:
            "Oktet pertama bernilai 127. Rentang 127.0.0.0/8 dicadangkan khusus sebagai alamat Loopback (localhost) untuk diagnostik tumpukan protokol TCP/IP internal.",
        },
        {
          title: "Periksa oktet pertama dari 224.0.0.5 (sebagai pembanding)",
          detail:
            "Oktet pertama bernilai 224. Rentang 224–239 merupakan Kelas D yang digunakan untuk komunikasi Multicast, bukan untuk alamat host unicast biasa.",
        },
      ],
      finalAnswer:
        "192.168.10.130/26 = Kelas C Unicast (Private IP RFC 1918); 127.0.0.1 = Loopback; 224.0.0.5 = Kelas D Multicast.",
    },
    checkQuestions: [
      {
        id: "mat-01-q1",
        question:
          "Manakah di antara alamat IPv4 berikut yang termasuk ke dalam kategori Kelas C Unicast?",
        options: [
          "172.16.10.5",
          "192.168.20.15",
          "224.0.0.1",
          "127.0.0.1",
        ],
        correctIndex: 1,
        explanation:
          "Alamat Kelas C memiliki rentang nilai oktet pertama antara 192 hingga 223. Alamat 192.168.20.15 memiliki oktet pertama 192 sehingga termasuk Kelas C Unicast (sekaligus Private IP RFC 1918).",
        steps: [
          "Cek oktet pertama tiap pilihan: 172 (Kelas B: 128–191), 192 (Kelas C: 192–223), 224 (Kelas D Multicast: 224–239), 127 (Loopback).",
          "Karena 192 berada di rentang 192–223, maka jawaban yang benar adalah 192.168.20.15.",
        ],
      },
      {
        id: "mat-01-q2",
        question:
          "Berapa panjang bit total dari sebuah alamat IPv4 dan berapa default prefix untuk alamat Kelas C?",
        options: [
          "32-bit dengan default prefix /16",
          "64-bit dengan default prefix /24",
          "32-bit dengan default prefix /24",
          "128-bit dengan default prefix /8",
        ],
        correctIndex: 2,
        explanation:
          "Setiap alamat IPv4 memiliki panjang total 32-bit (4 oktet × 8 bit). Untuk Kelas C, 3 oktet pertama (24 bit) merupakan porsi Network sehingga default prefix-nya adalah /24 (255.255.255.0).",
        steps: [
          "Panjang alamat IPv4 selalu 32-bit (2^32 kemungkinan alamat).",
          "Kelas C menggunakan 24 bit pertama untuk Network dan 8 bit sisanya untuk Host -> Default Prefix /24.",
        ],
      },
    ],
    keyTakeaways: [
      "IPv4 adalah alamat logis 32-bit yang dibagi menjadi Kelas A, B, C (Unicast), Kelas D (Multicast), dan Kelas E (Experimental).",
      "Kelas alamat ditentukan oleh nilai desimal oktet pertama (atau pola bit terdepan oktet pertama).",
      "Kelas C memiliki rentang oktet pertama 192–223 dengan default prefix /24 dan blok Private IP 192.168.0.0/16.",
    ],
  },
  {
    id: "mat-02",
    order: 2,
    slug: "struktur-dan-format-alamat-ipv4",
    title: "Struktur dan Format Alamat IPv4",
    category: "Fondasi & Biner",
    estimatedMinutes: 7,
    shortDescription:
      "Mempelajari notasi Dotted-Decimal (Desimal Bertitik), pembagian 32-bit menjadi 4 bagian masing-masing 8-bit, serta aturan validitas penulisan alamat IPv4.",
    objectives: [
      "Menguraikan struktur 32-bit IPv4 ke dalam 4 segmen 8-bit yang dipisahkan tanda titik (Dotted-Decimal Notation).",
      "Menjelaskan mengapa setiap segmen alamat IPv4 memiliki batas nilai minimum 0 dan maksimum 255.",
      "Mengidentifikasi kesalahan format penulisan alamat IPv4 (jumlah segmen salah, nilai > 255, atau leading zero).",
    ],
    conceptSections: [
      {
        heading: "Notasi Desimal Bertitik (Dotted-Decimal Notation)",
        paragraphs: [
          "Perangkat jaringan memproses alamat IPv4 sebagai deretan 32 angka biner (0 dan 1) tanpa henti, misalnya 11000000101010000000101010000010. Karena manusia sulit membaca dan mengingat 32 digit biner sekaligus, digunakanlah format Dotted-Decimal Notation.",
          "Pada format ini, 32 bit dibagi menjadi 4 kelompok yang masing-masing terdiri atas 8 bit (disebut oktet). Setiap kelompok 8 bit dikonversi ke bilangan desimal (basis 10) dan dipisahkan oleh tanda titik (.), seperti pada alamat studi kasus kita: 192.168.10.130.",
        ],
        formulaCallout: {
          label: "Rentang Nilai Setiap Oktet (8-Bit)",
          formula: "00000000 (0) s.d. 11111111 (2^8 - 1 = 255)",
          note: "Jika seluruh 8 bit bernilai 0 hasilnya 0; jika seluruh 8 bit bernilai 1 hasilnya 128+64+32+16+8+4+2+1 = 255.",
        },
      },
      {
        heading: "Aturan Validitas Format IPv4",
        paragraphs: [
          "Sebuah string teks hanya dinyatakan sah sebagai alamat IPv4 apabila memenuhi seluruh syarat sintaksis berikut: terdiri dari tepat 4 oktet yang dipisahkan 3 tanda titik, setiap oktet berisi bilangan bulat desimal antara 0 hingga 255, dan tidak menggunakan angka nol di depan (leading zero) seperti 192.168.010.130 karena pada beberapa sistem operasi dapat disalahartikan sebagai bilangan oktal (basis 8).",
        ],
        table: {
          caption: "Contoh Evaluasi Validitas Penulisan Alamat IPv4",
          headers: ["Contoh Penulisan", "Status", "Alasan Teknis"],
          rows: [
            ["192.168.10.130", "Valid", "Terdiri dari 4 oktet dan seluruh nilai (192, 168, 10, 130) berada pada rentang 0–255."],
            ["192.168.10.256", "Tidak Valid", "Oktet ke-4 bernilai 256 (melebihi nilai maksimum 8-bit yaitu 255)."],
            ["192.168.10", "Tidak Valid", "Hanya memiliki 3 oktet (kurang dari 32 bit)."],
            ["192.168.010.130", "Tidak Valid", "Oktet ke-3 menggunakan leading zero ('010') yang ambigu."],
          ],
        },
      },
    ],
    simulatorPreset: {
      ip: "192.168.10.130",
      prefix: 26,
      caption: "Struktur 4 oktet pada studi kasus 192.168.10.130/26: Oktet 1 (192), Oktet 2 (168), Oktet 3 (10), Oktet 4 (130).",
    },
    workedExample: {
      question:
        "Periksa validitas format penulisan alamat studi kasus kita (A) 192.168.10.130 dibandingkan dengan (B) 192.168.260.130 dan (C) 192.168.10.130.1!",
      givenIp: "192.168.10.130",
      givenPrefix: 26,
      steps: [
        {
          title: "Evaluasi opsi (A) 192.168.10.130",
          detail:
            "Memiliki tepat 4 oktet (192, 168, 10, 130). Seluruh angka berada di antara 0 dan 255 serta tanpa leading zero. Maka format 192.168.10.130 VALID.",
        },
        {
          title: "Evaluasi opsi (B) 192.168.260.130",
          detail:
            "Oktet ketiga bernilai 260. Nilai maksimum 8 bit biner adalah 255, sehingga opsi B TIDAK VALID.",
        },
        {
          title: "Evaluasi opsi (C) 192.168.10.130.1",
          detail:
            "Memiliki 5 oktet (40 bit), sedangkan IPv4 wajib terdiri atas 4 oktet (32 bit). Opsi C TIDAK VALID.",
        },
      ],
      finalAnswer:
        "Hanya (A) 192.168.10.130 yang memenuhi aturan struktur 4 oktet Dotted-Decimal dengan nilai 0–255.",
    },
    checkQuestions: [
      {
        id: "mat-02-q1",
        question:
          "Mengapa penulisan alamat IPv4 '192.168.1.256' dinyatakan TIDAK VALID oleh sistem operasi jaringan?",
        options: [
          "Karena menggunakan alamat Private Kelas C",
          "Karena nilai oktet ke-4 (256) melebihi nilai maksimum 8-bit biner yaitu 255",
          "Karena jumlah oktetnya kurang dari empat",
          "Karena oktet pertama tidak boleh bernilai genap",
        ],
        correctIndex: 1,
        explanation:
          "Satu oktet terdiri dari 8 bit biner. Nilai maksimum ketika seluruh 8 bit bernilai 1 (11111111) adalah 2^8 - 1 = 255. Angka 256 membutuhkan 9 bit (100000000) sehingga tidak muat dalam satu oktet.",
        steps: [
          "Periksa setiap oktet: 192 (valid), 168 (valid), 1 (valid), 256 (melebihi batas 0–255).",
          "Nilai tertinggi dalam 8-bit adalah 128+64+32+16+8+4+2+1 = 255.",
        ],
      },
      {
        id: "mat-02-q2",
        question:
          "Manakah di antara penulisan alamat IPv4 berikut yang sepenuhnya VALID sesuai aturan Dotted-Decimal Notation?",
        options: [
          "192.168.01.10",
          "192.168.10.250",
          "192.168.10",
          "192.168.10.255.1",
        ],
        correctIndex: 1,
        explanation:
          "192.168.10.250 terdiri dari tepat 4 oktet, seluruh nilainya berada di rentang 0–255, dan tidak mengandung leading zero (angka 0 di depan seperti '01').",
        steps: [
          "192.168.01.10 tidak valid karena oktet ke-3 memiliki leading zero ('01').",
          "192.168.10 tidak valid karena hanya 3 oktet; 192.168.10.255.1 tidak valid karena 5 oktet.",
          "192.168.10.250 memenuhi seluruh kriteria validitas IPv4.",
        ],
      },
    ],
    keyTakeaways: [
      "Alamat IPv4 sepanjang 32-bit ditulis dalam format Dotted-Decimal: W.X.Y.Z (4 oktet × 8 bit).",
      "Setiap oktet wajib bernilai antara 0 (00000000) hingga 255 (11111111).",
      "Hindari penulisan leading zero (seperti 010) dan pastikan jumlah oktet selalu tepat empat.",
    ],
  },
  {
    id: "mat-03",
    order: 3,
    slug: "oktet-dan-representasi-biner",
    title: "Oktet dan Representasi Biner",
    category: "Fondasi & Biner",
    estimatedMinutes: 8,
    shortDescription:
      "Menguasai tabel bobot posisi bit 8-bit (128, 64, 32, 16, 8, 4, 2, 1) untuk mengonversi angka desimal ke biner dan sebaliknya dengan cepat.",
    objectives: [
      "Menghafal dan menerapkan bobot posisi 8-bit dari kiri ke kanan (2^7 = 128 hingga 2^0 = 1).",
      "Mengonversi nilai oktet desimal (0–255) menjadi deretan biner 8-bit secara akurat.",
      "Mengonversi deretan biner 8-bit kembali menjadi angka desimal termasuk pola angka khusus subnet mask.",
    ],
    conceptSections: [
      {
        heading: "Tabel Bobot Posisi 8-Bit (Positional Value)",
        paragraphs: [
          "Kunci utama untuk menguasai subnetting tanpa kalkulator adalah memahami bobot nilai tempat pada satu oktet (8 bit). Dimulai dari bit paling kiri (Most Significant Bit / MSB) yang bernilai 2^7 = 128 hingga bit paling kanan (Least Significant Bit / LSB) yang bernilai 2^0 = 1.",
          "Untuk mengubah angka desimal menjadi biner 8-bit, kita cukup mengurangkan angka tersebut dari bobot terbesar yang muat (dari kiri ke kanan: 128, 64, 32, 16, 8, 4, 2, 1). Jika bobot tersebut digunakan, tulis bit '1'; jika tidak, tulis bit '0'.",
        ],
        formulaCallout: {
          label: "Deret Bobot 8-Bit (Wajib Dihafal)",
          formula: "128 | 64 | 32 | 16 | 8 | 4 | 2 | 1",
          note: "Jumlahkan bobot pada posisi yang bernilai bit '1' untuk mendapatkan nilai desimalnya.",
        },
        table: {
          caption: "Tabel Bobot Bit dalam Satu Oktet (8-Bit)",
          headers: ["Pangkat Dua", "2^7", "2^6", "2^5", "2^4", "2^3", "2^2", "2^1", "2^0"],
          rows: [
            ["Bobot Desimal", "128", "64", "32", "16", "8", "4", "2", "1"],
            ["Contoh: 192", "1", "1", "0", "0", "0", "0", "0", "0"],
            ["Contoh: 168", "1", "0", "1", "0", "1", "0", "0", "0"],
            ["Contoh: 130", "1", "0", "0", "0", "0", "0", "1", "0"],
          ],
        },
      },
      {
        heading: "Pola Biner Kontigu untuk Subnetting",
        paragraphs: [
          "Selain mengonversi oktet alamat IP, kamu akan sangat sering menjumpai penjumlahan bit '1' berurutan dari kiri pada Subnet Mask. Mengenali 9 nilai desimal hasil deretan bit '1' dari kiri akan mempercepat perhitungan subnetting hingga berkali-kali lipat.",
        ],
        table: {
          caption: "Tabel Referensi Cepat Deretan Bit '1' dari Kiri (Nilai Oktet Subnet Mask)",
          headers: ["Jumlah Bit '1'", "Representasi Biner", "Penjumlahan Bobot", "Nilai Desimal"],
          rows: [
            ["0 bit", "00000000", "0", "0"],
            ["1 bit", "10000000", "128", "128"],
            ["2 bit", "11000000", "128 + 64", "192"],
            ["3 bit", "11100000", "128 + 64 + 32", "224"],
            ["4 bit", "11110000", "128 + 64 + 32 + 16", "240"],
            ["5 bit", "11111000", "240 + 8", "252 - 4 = 248"],
            ["6 bit", "11111100", "248 + 4", "252"],
            ["7 bit", "11111110", "252 + 2", "254"],
            ["8 bit", "11111111", "254 + 1", "255"],
          ],
        },
      },
    ],
    simulatorPreset: {
      ip: "192.168.10.130",
      prefix: 26,
      caption: "Perhatikan konversi biner 8-bit tiap oktet: 192 (11000000), 168 (10101000), 10 (00001010), dan 130 (10000010).",
    },
    workedExample: {
      question:
        "Konversikan oktet keempat dari alamat IP 192.168.10.130 (yaitu angka desimal 130) ke dalam bentuk biner 8-bit!",
      givenIp: "192.168.10.130",
      givenPrefix: 26,
      steps: [
        {
          title: "Bandingkan 130 dengan bobot bit pertama (128)",
          detail: "130 >= 128 -> Bit ke-1 bernilai '1'. Sisa nilai = 130 - 128 = 2.",
        },
        {
          title: "Uji sisa nilai (2) terhadap bobot 64, 32, 16, 8, dan 4",
          detail:
            "Karena 2 lebih kecil dari 64, 32, 16, 8, dan 4, maka kelima posisi bit tersebut semuanya bernilai '0'.",
        },
        {
          title: "Uji sisa nilai (2) terhadap bobot 2 dan 1",
          detail:
            "2 >= 2 -> Posisi bobot 2 bernilai '1', sisa = 2 - 2 = 0. Posisi terakhir (bobot 1) bernilai '0'.",
        },
      ],
      finalAnswer: "130 dalam biner 8-bit adalah 10000010 (128 + 2 = 130).",
    },
    checkQuestions: [
      {
        id: "mat-03-q1",
        question:
          "Berapakah representasi biner 8-bit yang tepat untuk angka desimal 168 (oktet kedua dari 192.168.10.130)?",
        options: [
          "11000000",
          "10101000",
          "10000010",
          "11100000",
        ],
        correctIndex: 1,
        explanation:
          "Angka 168 tersusun dari penjumlahan bobot 128 + 32 + 8 = 168. Jika dipetakan ke deret bobot (128, 64, 32, 16, 8, 4, 2, 1), posisi yang bernilai 1 adalah bobot 128, 32, dan 8 sehingga menghasilkan 10101000.",
        steps: [
          "168 - 128 = 40 (Bit ke-1 [128] = 1, Bit ke-2 [64] = 0).",
          "40 - 32 = 8 (Bit ke-3 [32] = 1, Bit ke-4 [16] = 0).",
          "8 - 8 = 0 (Bit ke-5 [8] = 1, Bit ke-6,7,8 [4,2,1] = 0) -> 10101000.",
        ],
      },
      {
        id: "mat-03-q2",
        question:
          "Jika sebuah oktet pada Subnet Mask memiliki deretan biner '11100000' (3 bit bernilai 1 dari kiri), berapakah nilai desimalnya?",
        options: [
          "192",
          "224",
          "240",
          "248",
        ],
        correctIndex: 1,
        explanation:
          "Tiga bit pertama dari kiri memiliki bobot 128, 64, dan 32. Penjumlahannya adalah 128 + 64 + 32 = 224.",
        steps: [
          "Identifikasi bobot untuk 3 bit '1' paling kiri: bit ke-1 = 128, bit ke-2 = 64, bit ke-3 = 32.",
          "Jumlahkan: 128 + 64 + 32 = 224.",
        ],
      },
    ],
    keyTakeaways: [
      "Deret bobot 8-bit dari kiri ke kanan adalah: 128, 64, 32, 16, 8, 4, 2, 1.",
      "Selalu tuliskan biner oktet lengkap sebanyak 8 digit (tambahkan leading zero di kiri bila nilainya < 128, misal 10 = 00001010).",
      "Hafalkan nilai desimal deretan bit '1' kontigu: 0, 128, 192, 224, 240, 248, 252, 254, 255.",
    ],
  },
  {
    id: "mat-04",
    order: 4,
    slug: "network-id-dan-host-id",
    title: "Network ID dan Host ID",
    category: "Struktur & Masking",
    estimatedMinutes: 7,
    shortDescription:
      "Memahami filosofi pembagian alamat IPv4 menjadi dua bagian: porsi pengenal jaringan (Network Portion) dan porsi pengenal perangkat (Host Portion).",
    objectives: [
      "Membedakan fungsi porsi Network (Network ID) dan porsi Host (Host ID) di dalam satu alamat IPv4.",
      "Menjelaskan struktur default Kelas C: 24 bit pertama sebagai Network ID dan 8 bit terakhir sebagai Host ID.",
      "Menganalisis apakah dua perangkat berada di segmen jaringan lokal yang sama berdasarkan porsi Network-nya.",
    ],
    conceptSections: [
      {
        heading: "Analogi Jalan dan Nomor Rumah",
        paragraphs: [
          "Setiap alamat IPv4 unikast selalu terdiri atas dua komponen hierarkis: porsi Network (Network Portion) di sebelah kiri dan porsi Host (Host Portion) di sebelah kanan. Analogi paling sederhana adalah alamat pos: Network ID ibarat 'Nama Jalan & Kode Pos', sedangkan Host ID ibarat 'Nomor Rumah' di jalan tersebut.",
          "Seluruh perangkat yang terhubung pada satu segmen jaringan lokal (LAN) yang sama WAJIB memiliki porsi Network yang identik, namun WAJIB memiliki porsi Host yang berbeda-beda agar tidak terjadi konflik alamat (IP Conflict).",
        ],
        formulaCallout: {
          label: "Struktur Default IPv4 Kelas C (/24)",
          formula: "[ 24 Bit Network (Oktet 1, 2, 3) ] . [ 8 Bit Host (Oktet 4) ]",
          note: "Pada 192.168.10.130/24: porsi Network adalah 192.168.10 dan porsi Host adalah .130.",
        },
        table: {
          caption: "Perbandingan Porsi Default Network vs Host Antar Kelas Unicast",
          headers: ["Kelas", "Porsi Network Default", "Porsi Host Default", "Contoh Alamat", "Identitas Jaringan"],
          rows: [
            ["Kelas A (/8)", "Oktet 1 (8 bit)", "Oktet 2, 3, 4 (24 bit)", "10.50.1.20/8", "10.0.0.0"],
            ["Kelas B (/16)", "Oktet 1 & 2 (16 bit)", "Oktet 3 & 4 (16 bit)", "172.16.5.12/16", "172.16.0.0"],
            ["Kelas C (/24)", "Oktet 1, 2, 3 (24 bit)", "Oktet 4 (8 bit)", "192.168.10.130/24", "192.168.10.0"],
          ],
        },
      },
      {
        heading: "Syarat Komunikasi Langsung dalam Satu LAN",
        paragraphs: [
          "Ketika Komputer A ingin mengirim paket ke Komputer B, sistem operasi akan membandingkan porsi Network keduanya. Apabila porsi Network sama, paket dikirim langsung melalui Switch tanpa perlu melewati Router. Sebaliknya, jika porsi Network berbeda, paket harus diteruskan ke Default Gateway (Router).",
          "Pada studi kasus 192.168.10.130/26, batas porsi Network diperluas dari 24 bit menjadi 26 bit pertama (3 oktet pertama 192.168.10 ditambah 2 bit pertama oktet ke-4), sedangkan 6 bit terakhir menjadi porsi Host.",
        ],
      },
    ],
    simulatorPreset: {
      ip: "192.168.10.130",
      prefix: 26,
      caption: "Pada studi kasus 192.168.10.130/26: 24 bit pertama adalah Network Kelas C, 2 bit berikutnya bit Subnet, dan 6 bit terakhir adalah Host Bits.",
    },
    workedExample: {
      question:
        "Bedahlah pembagian porsi bit Network/Subnet dan porsi bit Host pada alamat studi kasus 192.168.10.130/26 dibandingkan dengan kondisi default Kelas C (/24)!",
      givenIp: "192.168.10.130",
      givenPrefix: 26,
      steps: [
        {
          title: "Identifikasi porsi default Kelas C (/24) pada 192.168.10.130",
          detail:
            "Secara default (/24), 3 oktet pertama (192.168.10 = 24 bit) adalah Network ID dan oktet ke-4 (.130 = 8 bit) adalah Host ID.",
        },
        {
          title: "Identifikasi perluasan porsi Network pada prefix /26",
          detail:
            "Karena menggunakan /26, porsi pengenal jaringan/subnet mencakup 26 bit pertama (24 bit di tiga oktet pertama + 2 bit paling kiri di oktet keempat).",
        },
        {
          title: "Hitung sisa porsi bit Host pada 192.168.10.130/26",
          detail:
            "Dari total 32 bit IPv4, tersisa 32 - 26 = 6 bit paling kanan pada oktet ke-4 yang berfungsi sebagai porsi Host.",
        },
      ],
      finalAnswer:
        "Pada 192.168.10.130/26: 26 bit pertama adalah porsi Network/Subnet (24 bit Network + 2 bit Subnet) dan 6 bit terakhir adalah porsi Host.",
    },
    checkQuestions: [
      {
        id: "mat-04-q1",
        question:
          "Pada alamat IPv4 Kelas C standar '192.168.25.88/24', manakah yang merupakan porsi Network dan porsi Host secara berurutan?",
        options: [
          "Network = 192.168 | Host = 25.88",
          "Network = 192 | Host = 168.25.88",
          "Network = 192.168.25 | Host = 88",
          "Network = 192.168.25.88 | Host = 24",
        ],
        correctIndex: 2,
        explanation:
          "Dengan prefix default Kelas C (/24), 24 bit pertama (3 oktet pertama: 192.168.25) menjadi porsi pengenal jaringan (Network), sedangkan 8 bit terakhir (oktet ke-4: 88) menjadi pengenal perangkat (Host).",
        steps: [
          "Prefix /24 mencakup 24 bit = 3 oktet pertama -> 192.168.25 adalah porsi Network.",
          "Sisa 8 bit terakhir = oktet ke-4 -> 88 adalah porsi Host.",
        ],
      },
      {
        id: "mat-04-q2",
        question:
          "Apa syarat utama agar dua komputer di dalam satu jaringan lokal (LAN) ber-prefix /24 dapat saling berkomunikasi tanpa mengalami IP Conflict?",
        options: [
          "Porsi Network harus berbeda dan porsi Host harus sama",
          "Porsi Network harus sama dan porsi Host harus berbeda (unik)",
          "Kedua komputer harus memiliki alamat IP yang persis sama",
          "Oktet keempat kedua komputer harus bernilai 0 atau 255",
        ],
        correctIndex: 1,
        explanation:
          "Perangkat dalam satu LAN wajib memiliki Network ID yang sama (ibarat berada di jalan yang sama) dan Host ID yang berbeda/unik (ibarat nomor rumah yang berbeda).",
        steps: [
          "Jika Network ID berbeda, paket tidak bisa dikirim langsung melainkan harus lewat Router.",
          "Jika Host ID sama persis, akan terjadi tabrakan alamat (IP Address Conflict).",
        ],
      },
    ],
    keyTakeaways: [
      "Porsi Network mengidentifikasi kelompok jaringan; porsi Host mengidentifikasi perangkat spesifik di dalam jaringan tersebut.",
      "Pada Kelas C default (/24), 3 oktet pertama (24 bit) adalah Network dan oktet ke-4 (8 bit) adalah Host.",
      "Perangkat dalam satu jaringan lokal harus memiliki Network ID yang sama dan Host ID yang berbeda.",
    ],
  },
  {
    id: "mat-05",
    order: 5,
    slug: "subnet-mask",
    title: "Subnet Mask",
    category: "Struktur & Masking",
    estimatedMinutes: 8,
    shortDescription:
      "Memahami peran Subnet Mask sebagai penentu batas bit Network dan Host, aturan bit '1' kontigu, serta konsep Wildcard Mask.",
    objectives: [
      "Menjelaskan fungsi Subnet Mask dalam memisahkan bit Network/Subnet (bit '1') dari bit Host (bit '0').",
      "Memvalidasi apakah sebuah Subnet Mask sah berdasarkan aturan deretan bit '1' kontigu dari kiri.",
      "Menghitung Wildcard Mask (kebalikan Subnet Mask) menggunakan rumus 255.255.255.255 dikurangi Subnet Mask.",
    ],
    conceptSections: [
      {
        heading: "Cara Kerja Subnet Mask",
        paragraphs: [
          "Alamat IPv4 saja tidak pernah cukup untuk memberi tahu komputer di mana batas porsi Network berakhir dan di mana porsi Host dimulai. Oleh sebab itu, setiap konfigurasi IPv4 selalu berpasangan dengan Subnet Mask berukuran 32-bit.",
          "Aturan emas Subnet Mask sangat sederhana: setiap bit bernilai '1' pada Subnet Mask mengunci posisi bit IP yang bersesuaian sebagai bagian dari Network/Subnet, sedangkan setiap bit bernilai '0' menandakan posisi tersebut adalah milik Host.",
        ],
        formulaCallout: {
          label: "Aturan Kontiguitas Subnet Mask",
          formula: "11111111.11111111.11111111.11000000 (Valid) vs 11111111...10100000 (Invalid)",
          note: "Deretan bit '1' wajib berurutan tanpa putus dari kiri, diikuti deretan bit '0' hingga bit ke-32.",
        },
        table: {
          caption: "Daftar Subnet Mask Valid pada IPv4 Kelas C (/24 s.d. /32)",
          headers: ["Prefix", "Subnet Mask Desimal", "Oktet Ke-4 (Biner)", "Bit Pinjam (n)", "Bit Host (h)"],
          rows: [
            ["/24", "255.255.255.0", "00000000", "0 bit", "8 bit"],
            ["/25", "255.255.255.128", "10000000", "1 bit", "7 bit"],
            ["/26", "255.255.255.192", "11000000", "2 bit", "6 bit"],
            ["/27", "255.255.255.224", "11100000", "3 bit", "5 bit"],
            ["/28", "255.255.255.240", "11110000", "4 bit", "4 bit"],
            ["/29", "255.255.255.248", "11111000", "5 bit", "3 bit"],
            ["/30", "255.255.255.252", "11111100", "6 bit", "2 bit"],
            ["/31", "255.255.255.254", "11111110", "7 bit", "1 bit"],
            ["/32", "255.255.255.255", "11111111", "8 bit", "0 bit"],
          ],
        },
      },
      {
        heading: "Mengenal Wildcard Mask",
        paragraphs: [
          "Wildcard Mask adalah kebalikan (invers bitwise NOT) dari Subnet Mask. Bit '0' pada Wildcard berarti bit harus cocok persis, sedangkan bit '1' berarti bit boleh bernilai apa saja (bagian host). Dalam perhitungan cepat, setiap oktet Wildcard Mask diperoleh dari 255 dikurangi oktet Subnet Mask.",
        ],
      },
    ],
    simulatorPreset: {
      ip: "192.168.10.130",
      prefix: 26,
      caption: "Pada studi kasus 192.168.10.130/26, Subnet Mask 255.255.255.192 memiliki 26 bit '1' kontigu dari kiri dan 6 bit '0' di kanan.",
    },
    workedExample: {
      question:
        "Pada studi kasus 192.168.10.130/26, tentukan Subnet Mask desimalnya, buktikan validitas kontiguitas binernya dibandingkan mask tidak sah 255.255.255.160, serta hitung Wildcard Mask-nya!",
      givenIp: "192.168.10.130",
      givenPrefix: 26,
      steps: [
        {
          title: "Ubah 26 bit '1' pada prefix /26 menjadi Subnet Mask desimal",
          detail:
            "24 bit pertama adalah 255.255.255. Sisa 2 bit '1' di oktet ke-4 adalah 11000000 = 128 + 64 = 192. Seluruh bit '1' berurutan tanpa putus (kontigu), sehingga 255.255.255.192 VALID.",
        },
        {
          title: "Bandingkan dengan 255.255.255.160",
          detail:
            "160 = 128 + 32 = 10100000. Terlihat adanya bit '0' yang menyela di antara dua bit '1' (tidak kontigu), sehingga 255.255.255.160 TIDAK VALID.",
        },
        {
          title: "Hitung Wildcard Mask untuk 255.255.255.192",
          detail:
            "Kurangkan dari 255.255.255.255 -> (255-255).(255-255).(255-255).(255-192) = 0.0.0.63.",
        },
      ],
      finalAnswer:
        "Untuk 192.168.10.130/26: Subnet Mask = 255.255.255.192 (biner oktet ke-4: 11000000 kontigu) dan Wildcard Mask = 0.0.0.63.",
    },
    checkQuestions: [
      {
        id: "mat-05-q1",
        question:
          "Manakah di antara nilai berikut yang BUKAN merupakan Subnet Mask yang valid karena melanggar aturan bit '1' kontigu?",
        options: [
          "255.255.255.192",
          "255.255.255.200",
          "255.255.255.240",
          "255.255.255.252",
        ],
        correctIndex: 1,
        explanation:
          "Angka 200 dalam biner 8-bit adalah 11001000 (128 + 64 + 8). Terdapat bit '0' yang menyela di antara bit '1' sehingga tidak kontigu dan tidak sah sebagai Subnet Mask.",
        steps: [
          "Nilai oktet Subnet Mask yang sah hanyalah: 0, 128, 192, 224, 240, 248, 252, 254, dan 255.",
          "Angka 200 (11001000) memiliki bit '1' yang terputus oleh dua bit '0'.",
        ],
      },
      {
        id: "mat-05-q2",
        question:
          "Jika sebuah jaringan menggunakan Subnet Mask 255.255.255.192, berapakah nilai Wildcard Mask-nya?",
        options: [
          "0.0.0.255",
          "0.0.0.192",
          "0.0.0.63",
          "0.0.0.64",
        ],
        correctIndex: 2,
        explanation:
          "Wildcard Mask dihitung dengan mengurangkan setiap oktet Subnet Mask dari 255.255.255.255. Pada oktet ke-4: 255 - 192 = 63, sehingga Wildcard Mask-nya adalah 0.0.0.63.",
        steps: [
          "Kurangkan per oktet: (255-255).(255-255).(255-255).(255-192).",
          "Hasilnya adalah 0.0.0.63.",
        ],
      },
    ],
    keyTakeaways: [
      "Bit '1' pada Subnet Mask merepresentasikan porsi Network/Subnet; bit '0' merepresentasikan porsi Host.",
      "Subnet Mask yang sah wajib memiliki bit '1' yang kontigu (menyambung terus dari kiri tanpa diselingi '0').",
      "Wildcard Mask = 255.255.255.255 dikurangi Subnet Mask (contoh: mask 255.255.255.192 memiliki wildcard 0.0.0.63).",
    ],
  },
  {
    id: "mat-06",
    order: 6,
    slug: "cidr-dan-prefix",
    title: "CIDR dan Prefix",
    category: "Struktur & Masking",
    estimatedMinutes: 7,
    shortDescription:
      "Mempelajari Classless Inter-Domain Routing (CIDR), notasi garis miring (/prefix), serta konversi bolak-balik antara Prefix Length dan Subnet Mask.",
    objectives: [
      "Menjelaskan tujuan CIDR (Classless Inter-Domain Routing) dalam mengatasi pemborosan alamat IPv4 classful.",
      "Mengartikan notasi prefix '/n' sebagai jumlah total bit '1' di dalam Subnet Mask 32-bit.",
      "Mengonversi notasi CIDR (misal /27) menjadi Subnet Mask desimal (255.255.255.224) dan sebaliknya secara cepat.",
    ],
    conceptSections: [
      {
        heading: "Apa itu CIDR dan Notasi Prefix (/n)?",
        paragraphs: [
          "Pada awal perkembangan internet, pengalamatan terikat kaku pada batas kelas (/8 untuk Kelas A, /16 untuk Kelas B, dan /24 untuk Kelas C). Sistem classful tersebut tidak fleksibel: jika sebuah organisasi hanya membutuhkan 50 host, memberi satu blok Kelas C (/24 = 254 host) masih menyisakan ratusan alamat terbuang.",
          "IETF memperkenalkan Classless Inter-Domain Routing (CIDR) pada RFC 4632 yang memungkinkan batas jaringan diletakkan pada posisi bit mana pun dari /0 hingga /32. Notasi CIDR ditulis dengan menambahkan garis miring diikuti angka jumlah bit '1' pada Subnet Mask, misalnya 192.168.10.130/26.",
        ],
        formulaCallout: {
          label: "Hubungan Prefix (/p), Bit Pinjam Kelas C (n), dan Bit Host (h)",
          formula: "Bit Pinjam (n) = Prefix - 24   |   Bit Host (h) = 32 - Prefix",
          note: "Contoh pada Kelas C /26: Bit pinjam n = 26 - 24 = 2 bit; Bit host h = 32 - 26 = 6 bit.",
        },
        table: {
          caption: "Tabel Konversi Cepat CIDR Prefix Kelas C ke Subnet Mask",
          headers: ["Notasi CIDR", "Total Bit '1'", "Susunan Oktet Biner Mask", "Subnet Mask Desimal"],
          rows: [
            ["/24", "24 bit", "11111111.11111111.11111111.00000000", "255.255.255.0"],
            ["/25", "25 bit", "11111111.11111111.11111111.10000000", "255.255.255.128"],
            ["/26", "26 bit", "11111111.11111111.11111111.11000000", "255.255.255.192"],
            ["/27", "27 bit", "11111111.11111111.11111111.11100000", "255.255.255.224"],
            ["/28", "28 bit", "11111111.11111111.11111111.11110000", "255.255.255.240"],
            ["/29", "29 bit", "11111111.11111111.11111111.11111000", "255.255.255.248"],
            ["/30", "30 bit", "11111111.11111111.11111111.11111100", "255.255.255.252"],
          ],
        },
      },
    ],
    simulatorPreset: {
      ip: "192.168.10.130",
      prefix: 26,
      caption: "Pada studi kasus 192.168.10.130/26, garis batas prefix berada tepat setelah bit ke-26 (2 bit pinjam pada oktet ke-4).",
    },
    workedExample: {
      question:
        "Tentukan Subnet Mask desimal, jumlah bit pinjam (n) dari default Kelas C, dan jumlah bit host (h) untuk alamat studi kasus 192.168.10.130/26!",
      givenIp: "192.168.10.130",
      givenPrefix: 26,
      steps: [
        {
          title: "Hitung bit pinjam (n) pada oktet ke-4 dari default Kelas C (/24)",
          detail: "Tiga oktet pertama sudah mencakup 24 bit. Sisa bit '1' di oktet ke-4 adalah n = 26 - 24 = 2 bit.",
        },
        {
          title: "Ubah 2 bit '1' di oktet ke-4 menjadi desimal",
          detail: "Biner 11000000 = 128 + 64 = 192. Maka Subnet Mask-nya adalah 255.255.255.192.",
        },
        {
          title: "Hitung jumlah bit host (h)",
          detail: "h = 32 - 26 = 6 bit nol tersisa di sebelah kanan.",
        },
      ],
      finalAnswer: "Untuk 192.168.10.130/26: Subnet Mask = 255.255.255.192, Bit Pinjam (n) = 2 bit, Bit Host (h) = 6 bit.",
    },
    checkQuestions: [
      {
        id: "mat-06-q1",
        question:
          "Subnet Mask desimal manakah yang setara dengan notasi CIDR prefix /27?",
        options: [
          "255.255.255.192",
          "255.255.255.224",
          "255.255.255.240",
          "255.255.255.248",
        ],
        correctIndex: 1,
        explanation:
          "Prefix /27 memiliki 27 bit '1', yaitu 24 bit di tiga oktet pertama (255.255.255) ditambah 3 bit '1' di oktet keempat (11100000 = 128 + 64 + 32 = 224). Maka Subnet Mask-nya adalah 255.255.255.224.",
        steps: [
          "Bit pinjam di oktet ke-4: n = 27 - 24 = 3 bit.",
          "3 bit '1' dari kiri = 11100000 = 128 + 64 + 32 = 224 -> 255.255.255.224.",
        ],
      },
      {
        id: "mat-06-q2",
        question:
          "Jika sebuah jaringan Kelas C menggunakan Subnet Mask 255.255.255.248, berapakah notasi CIDR prefix dan jumlah sisa bit host (h)-nya?",
        options: [
          "Prefix /28 dengan 4 bit host",
          "Prefix /29 dengan 3 bit host",
          "Prefix /30 dengan 2 bit host",
          "Prefix /27 dengan 5 bit host",
        ],
        correctIndex: 1,
        explanation:
          "Angka 248 dalam biner adalah 11111000 (5 bit '1' dan 3 bit '0'). Total bit '1' adalah 24 + 5 = /29, dan sisa bit '0' (bit host h) adalah 32 - 29 = 3 bit.",
        steps: [
          "Ubah 248 ke biner: 128 + 64 + 32 + 16 + 8 = 248 -> 11111000 (5 bit '1').",
          "Prefix = 24 + 5 = /29; Bit Host (h) = 32 - 29 = 3 bit.",
        ],
      },
    ],
    keyTakeaways: [
      "Angka di belakang garis miring (/prefix) menunjukkan jumlah bit '1' berurutan dari kiri pada Subnet Mask.",
      "Semakin besar angka prefix (misal dari /24 ke /28), ukuran tiap subnet semakin kecil tetapi jumlah blok subnet semakin banyak.",
      "Rumus cepat sisa bit host selalu: h = 32 - prefix.",
    ],
  },
  {
    id: "mat-07",
    order: 7,
    slug: "network-address",
    title: "Network Address",
    category: "Identitas & Subnetting",
    estimatedMinutes: 8,
    shortDescription:
      "Memahami peran Network Address (Network ID) sebagai alamat pertama di setiap blok subnet serta cara menghitungnya menggunakan operasi Bitwise AND maupun kelipatan ukuran blok.",
    objectives: [
      "Menjelaskan mengapa Network Address tidak boleh dipasang pada perangkat host (PC/Server).",
      "Menentukan Network Address melalui operasi logika Bitwise AND antara biner IPv4 dan Subnet Mask.",
      "Menghitung Network Address dengan metode cepat kelipatan Ukuran Blok (Block Size = 256 - Mask).",
    ],
    conceptSections: [
      {
        heading: "Apa itu Network Address?",
        paragraphs: [
          "Network Address (sering disebut Network ID) adalah alamat paling pertama di dalam sebuah blok subnet yang memiliki ciri khas: seluruh bit pada porsi Host bernilai '0'. Alamat ini berfungsi sebagai identitas resmi jaringan tersebut di dalam tabel routing (Routing Table) milik router.",
          "Karena berfungsi mewakili keseluruhan subnet, Network Address dicadangkan dan TIDAK BISA diberikan kepada komputer/host (kecuali pada kasus khusus tautan point-to-point /31 RFC 3021).",
        ],
        formulaCallout: {
          label: "Rumus Logika Bitwise Network Address",
          formula: "Network Address = IP Address AND Subnet Mask",
          note: "Pada gerbang logika AND: 1 AND 1 = 1; selain itu (1 AND 0, 0 AND 1, 0 AND 0) hasilnya adalah 0.",
        },
      },
      {
        heading: "Metode Cepat: Kelipatan Ukuran Blok (Block Size)",
        paragraphs: [
          "Selain mengonversi ke biner dan melakukan operasi AND, kamu bisa mencari Network Address pada Kelas C secara cepat dengan menghitung Ukuran Blok (Block Size) di oktet ke-4: Block Size = 256 - Nilai Oktet ke-4 Subnet Mask. Network Address adalah kelipatan Block Size terbesar yang nilainya kurang dari atau sama dengan oktet ke-4 IP tersebut.",
        ],
        table: {
          caption: "Contoh Penentuan Network Address dengan Operasi AND pada 192.168.10.130/26",
          headers: ["Komponen", "Desimal", "Oktet ke-4 (Biner)", "Keterangan"],
          rows: [
            ["IP Address", "192.168.10.130", "10000010", "130 = 128 + 2"],
            ["Subnet Mask (/26)", "255.255.255.192", "11000000", "192 = 128 + 64 (Block Size = 64)"],
            ["Hasil Bitwise AND", "192.168.10.128", "10000000", "6 bit host di-nol-kan -> 128"],
          ],
        },
      },
    ],
    simulatorPreset: {
      ip: "192.168.10.130",
      prefix: 26,
      caption: "Operasi AND antara 192.168.10.130 dan 255.255.255.192 menghasilkan Network ID 192.168.10.128.",
    },
    workedExample: {
      question:
        "Tentukan Network Address dari alamat studi kasus 192.168.10.130/26 baik menggunakan metode kelipatan Ukuran Blok (Block Size) maupun operasi Bitwise AND!",
      givenIp: "192.168.10.130",
      givenPrefix: 26,
      steps: [
        {
          title: "Tentukan Subnet Mask dan Block Size untuk /26",
          detail:
            "Prefix /26 memiliki 2 bit pinjam di oktet ke-4 -> Mask = 255.255.255.192. Ukuran blok (Block Size) = 256 - 192 = 64.",
        },
        {
          title: "Cari kelipatan 64 yang <= 130",
          detail:
            "Kelipatan 64 adalah: 0, 64, 128, 192. Kelipatan terbesar yang tidak melebihi 130 adalah 128.",
        },
        {
          title: "Verifikasi dengan Bitwise AND pada oktet ke-4",
          detail:
            "130 dalam biner = 10000010. Mask 192 dalam biner = 11000000. Hasil AND = 10000000 (desimal 128).",
        },
      ],
      finalAnswer: "Network Address untuk studi kasus 192.168.10.130/26 adalah 192.168.10.128.",
    },
    checkQuestions: [
      {
        id: "mat-07-q1",
        question:
          "Operasi logika bitwise apakah yang digunakan oleh router/komputer antara IP Address dan Subnet Mask untuk menemukan Network Address?",
        options: [
          "Operasi Bitwise OR",
          "Operasi Bitwise AND",
          "Operasi Bitwise XOR",
          "Operasi Bitwise NOT",
        ],
        correctIndex: 1,
        explanation:
          "Network Address dihitung menggunakan operasi Bitwise AND antara IP Address dan Subnet Mask. Karena bit host pada Subnet Mask bernilai 0, operasi AND otomatis membuat seluruh bit host menjadi 0.",
        steps: [
          "Ingat sifat logika AND: X AND 1 = X (mempertahankan bit Network), sedangkan X AND 0 = 0 (meng-nol-kan bit Host).",
          "Hasilnya adalah alamat dasar jaringan (Network Address).",
        ],
      },
      {
        id: "mat-07-q2",
        question:
          "Berapakah Network Address dari sebuah perangkat yang memiliki alamat IP 192.168.10.75/26?",
        options: [
          "192.168.10.0",
          "192.168.10.64",
          "192.168.10.74",
          "192.168.10.128",
        ],
        correctIndex: 1,
        explanation:
          "Prefix /26 memiliki Subnet Mask 255.255.255.192 sehingga Ukuran Blok (Block Size) = 256 - 192 = 64. Kelipatan 64 adalah 0, 64, 128, 192. Karena oktet ke-4 adalah 75 (berada di antara 64 dan 127), maka Network Address-nya adalah 192.168.10.64.",
        steps: [
          "Cari Block Size /26: 256 - 192 = 64.",
          "Deret kelipatan blok: 0, 64, 128, 192.",
          "Kelipatan terbesar yang <= 75 adalah 64 -> Network Address = 192.168.10.64.",
        ],
      },
    ],
    keyTakeaways: [
      "Network Address adalah alamat pertama di setiap subnet di mana seluruh bit host bernilai 0.",
      "Rumus fundamental: Network Address = IP Address AND Subnet Mask.",
      "Cara cepat Kelas C: hitung Block Size = 256 - mask oktet ke-4, lalu cari kelipatan Block Size terbesar yang <= oktet ke-4 IP.",
    ],
  },
  {
    id: "mat-08",
    order: 8,
    slug: "broadcast-address",
    title: "Broadcast Address",
    category: "Identitas & Subnetting",
    estimatedMinutes: 7,
    shortDescription:
      "Memahami fungsi Directed Broadcast Address sebagai alamat paling akhir di dalam blok subnet untuk mengirim paket ke seluruh host secara serentak.",
    objectives: [
      "Menjelaskan fungsi Broadcast Address dalam komunikasi satu-ke-semua (one-to-all) di dalam satu subnet.",
      "Menghitung Broadcast Address dengan mengubah seluruh bit Host menjadi '1' (Network OR Wildcard Mask).",
      "Menentukan Broadcast Address secara cepat dari alamat Network Subnet berikutnya dikurangi 1.",
    ],
    conceptSections: [
      {
        heading: "Apa itu Broadcast Address?",
        paragraphs: [
          "Broadcast Address adalah alamat paling terakhir di setiap blok subnet yang terbentuk ketika seluruh bit pada porsi Host diset menjadi bernilai '1'. Ketika sebuah perangkat mengirimkan paket ke alamat Broadcast subnet tersebut, seluruh host di dalam subnet yang sama akan menerima dan memproses paket itu.",
          "Sama seperti Network Address, alamat Broadcast dicadangkan untuk fungsi protokol jaringan (seperti ARP Request atau DHCP) sehingga tidak boleh diberikan sebagai alamat IP statis perangkat host.",
        ],
        formulaCallout: {
          label: "Dua Cara Menghitung Broadcast Address",
          formula: "Broadcast = Network Address OR Wildcard Mask  =  (Network Subnet Berikutnya) - 1",
          note: "Jika Network saat ini 192.168.10.128 dan ukuran blok 64, maka Network berikutnya 192.168.10.192 -> Broadcast = 192.168.10.191.",
        },
        table: {
          caption: "Perbandingan Biner Network Address vs Broadcast Address pada 192.168.10.130/26",
          headers: ["Jenis Alamat", "Desimal", "26 Bit Network/Subnet", "6 Bit Host", "Keterangan"],
          rows: [
            ["Network Address", "192.168.10.128", "11000000.10101000.00001010.10", "000000", "Semua bit host = 0 (Alamat awal)"],
            ["IP Host Contoh", "192.168.10.130", "11000000.10101000.00001010.10", "000010", "Kombinasi bit host campuran"],
            ["Broadcast Address", "192.168.10.191", "11000000.10101000.00001010.10", "111111", "Semua bit host = 1 (128 + 63 = 191)"],
          ],
        },
      },
    ],
    simulatorPreset: {
      ip: "192.168.10.130",
      prefix: 26,
      caption: "Pada studi kasus 192.168.10.130/26 (blok Network .128 dengan ukuran blok 64), Broadcast ID berada di ujung blok yaitu 192.168.10.191.",
    },
    workedExample: {
      question:
        "Pada studi kasus 192.168.10.130/26, kita telah menemukan bahwa Network Address-nya adalah 192.168.10.128. Berapakah Broadcast Address dari blok subnet tersebut?",
      givenIp: "192.168.10.130",
      givenPrefix: 26,
      steps: [
        {
          title: "Hitung ukuran blok (Block Size) untuk prefix /26",
          detail: "Prefix /26 = Subnet Mask 255.255.255.192. Ukuran blok = 256 - 192 = 64.",
        },
        {
          title: "Tentukan Network Address untuk blok berikutnya",
          detail: "Network saat ini = .128. Network blok berikutnya = 128 + 64 = .192 (192.168.10.192).",
        },
        {
          title: "Kurangi 1 dari Network berikutnya (atau set 6 bit host menjadi 1)",
          detail: "Broadcast Address adalah 1 angka sebelum 192, yaitu 192 - 1 = 191 (biner oktet ke-4: 10111111 = 128 + 63 = 191).",
        },
      ],
      finalAnswer: "Broadcast Address untuk studi kasus 192.168.10.130/26 adalah 192.168.10.191.",
    },
    checkQuestions: [
      {
        id: "mat-08-q1",
        question:
          "Bagaimanakah susunan nilai biner pada porsi bit Host dari sebuah Broadcast Address?",
        options: [
          "Seluruh bit Host bernilai 0",
          "Seluruh bit Host bernilai 1",
          "Bit Host paling kanan bernilai 1 dan sisanya 0",
          "Bit Host berselang-seling antara 1 dan 0",
        ],
        correctIndex: 1,
        explanation:
          "Broadcast Address adalah alamat tertinggi/terakhir di dalam suatu subnet, yang diperoleh ketika seluruh bit pada porsi Host diset menjadi bernilai '1'.",
        steps: [
          "Semua bit host = 0 -> Network Address.",
          "Semua bit host = 1 -> Broadcast Address.",
        ],
      },
      {
        id: "mat-08-q2",
        question:
          "Berapakah Broadcast Address untuk alamat IP 192.168.1.20/27?",
        options: [
          "192.168.1.31",
          "192.168.1.32",
          "192.168.1.63",
          "192.168.1.255",
        ],
        correctIndex: 0,
        explanation:
          "Prefix /27 memiliki Subnet Mask 255.255.255.224 dan Ukuran Blok = 256 - 224 = 32. Kelipatan blok adalah 0, 32, 64... IP .20 berada di blok pertama (Network = 192.168.1.0), sedangkan Network blok kedua adalah .32. Maka Broadcast blok pertama adalah 32 - 1 = 192.168.1.31.",
        steps: [
          "Hitung Block Size /27: 256 - 224 = 32.",
          "IP 192.168.1.20 berada di blok Network 192.168.1.0 (karena 0 <= 20 < 32).",
          "Broadcast Address = Network + Block Size - 1 = 0 + 32 - 1 = 31 -> 192.168.1.31.",
        ],
      },
    ],
    keyTakeaways: [
      "Broadcast Address adalah alamat paling akhir pada suatu subnet di mana seluruh bit host bernilai 1.",
      "Rumus cepat: Oktet Broadcast = Oktet Network + Block Size - 1.",
      "Alamat Broadcast selalu bernilai ganjil pada oktet keempat untuk subnet Kelas C (/24 s.d. /30).",
    ],
  },
  {
    id: "mat-09",
    order: 9,
    slug: "first-host-dan-last-host",
    title: "First Host dan Last Host",
    category: "Identitas & Subnetting",
    estimatedMinutes: 7,
    shortDescription:
      "Menentukan rentang alamat IP yang sah untuk dikonfigurasi pada perangkat (Rentang Host Valid: First Usable Host hingga Last Usable Host).",
    objectives: [
      "Menghitung First Usable Host (Host Pertama) dari Network Address ditambah 1.",
      "Menghitung Last Usable Host (Host Terakhir) dari Broadcast Address dikurangi 1.",
      "Memahami pengecualian khusus pada prefix /31 (RFC 3021) dan /32 (Single Host Route).",
    ],
    conceptSections: [
      {
        heading: "Menentukan Rentang Host Valid (Usable Host Range)",
        paragraphs: [
          "Setelah kamu menemukan batas awal blok (Network Address) dan batas akhir blok (Broadcast Address), seluruh alamat yang berada di antara keduanya adalah Rentang Host Valid (Usable Host Range). Alamat-alamat inilah yang boleh dipasang pada kartu jaringan komputer, laptop, printer, server, maupun interface router (Default Gateway).",
          "Pada subnet konvensional (/0 hingga /30), Host Pertama selalu tepat satu angka setelah Network Address, sedangkan Host Terakhir selalu tepat satu angka sebelum Broadcast Address.",
        ],
        formulaCallout: {
          label: "Rumus First Host & Last Host (/0 s.d. /30)",
          formula: "First Usable Host = Network + 1   |   Last Usable Host = Broadcast - 1",
          note: "Contoh pada blok 192.168.10.128 s.d. 192.168.10.191: Rentang host validnya adalah .129 s.d. .190.",
        },
        table: {
          caption: "Anatomi Lengkap Satu Blok Subnet (Contoh: 192.168.10.128/26)",
          headers: ["Jenis Alamat", "Alamat IPv4", "Nilai Biner 6-Bit Host", "Status Penggunaan Perangkat"],
          rows: [
            ["Network ID", "192.168.10.128", "000000", "Dicadangkan (Identitas Jaringan)"],
            ["First Usable Host", "192.168.10.129", "000001", "Dapat digunakan (Biasa untuk Gateway/Host 1)"],
            ["...", "192.168.10.130 – .189", "000010 – 111101", "Dapat digunakan untuk PC/Server"],
            ["Last Usable Host", "192.168.10.190", "111110", "Dapat digunakan (Host terakhir)"],
            ["Broadcast ID", "192.168.10.191", "111111", "Dicadangkan (Broadcast Jaringan)"],
          ],
        },
      },
    ],
    simulatorPreset: {
      ip: "192.168.10.130",
      prefix: 26,
      caption: "Pada studi kasus 192.168.10.130/26, Rentang Host Valid berada di antara Network ID (.128) dan Broadcast ID (.191), yaitu .129 s.d. .190.",
    },
    workedExample: {
      question:
        "Pada studi kasus 192.168.10.130/26, kita telah mendapatkan Network ID 192.168.10.128 dan Broadcast ID 192.168.10.191. Tentukan First Usable Host, Last Usable Host, dan buktikan apakah 192.168.10.130 sah dipasang pada PC!",
      givenIp: "192.168.10.130",
      givenPrefix: 26,
      steps: [
        {
          title: "Hitung First Usable Host (Network ID + 1)",
          detail: "First Usable Host = 192.168.10.128 + 1 = 192.168.10.129.",
        },
        {
          title: "Hitung Last Usable Host (Broadcast ID - 1)",
          detail:
            "Last Usable Host = 192.168.10.191 - 1 = 192.168.10.190.",
        },
        {
          title: "Periksa posisi 192.168.10.130 di dalam rentang host",
          detail:
            "Karena .130 berada di dalam rentang .129 s.d. .190 (tepatnya alamat host valid ke-2), maka 192.168.10.130 SAH dikonfigurasi pada PC.",
        },
      ],
      finalAnswer:
        "First Host: 192.168.10.129 | Last Host: 192.168.10.190 | Status 192.168.10.130: Valid Usable Host.",
    },
    checkQuestions: [
      {
        id: "mat-09-q1",
        question:
          "Diketahui sebuah blok subnet memiliki Network ID 192.168.10.64 dan Broadcast ID 192.168.10.127. Berapakah Rentang Host Valid (First Host s.d. Last Host) pada subnet tersebut?",
        options: [
          "192.168.10.64 s.d. 192.168.10.127",
          "192.168.10.65 s.d. 192.168.10.126",
          "192.168.10.65 s.d. 192.168.10.128",
          "192.168.10.63 s.d. 192.168.10.126",
        ],
        correctIndex: 1,
        explanation:
          "First Usable Host adalah Network ID + 1 (64 + 1 = 65), sedangkan Last Usable Host adalah Broadcast ID - 1 (127 - 1 = 126). Maka rentang host validnya adalah 192.168.10.65 s.d. 192.168.10.126.",
        steps: [
          "First Host = 192.168.10.64 + 1 = 192.168.10.65.",
          "Last Host = 192.168.10.127 - 1 = 192.168.10.126.",
        ],
      },
      {
        id: "mat-09-q2",
        question:
          "Manakah di antara alamat IP berikut yang BOLEH dipasang pada komputer client di dalam jaringan 192.168.1.0/29 (Ukuran Blok = 8)?",
        options: [
          "192.168.1.0",
          "192.168.1.6",
          "192.168.1.7",
          "192.168.1.8",
        ],
        correctIndex: 1,
        explanation:
          "Untuk jaringan 192.168.1.0/29 (Block Size = 8), Network ID adalah .0 dan Broadcast ID adalah .7 (sedangkan .8 sudah masuk ke subnet berikutnya). Rentang host valid untuk subnet pertama ini adalah .1 s.d. .6, sehingga 192.168.1.6 adalah alamat yang valid.",
        steps: [
          "Blok 192.168.1.0/29 memiliki ukuran blok 256 - 248 = 8.",
          "Network = 192.168.1.0 (tidak boleh untuk host); Broadcast = 192.168.1.7 (tidak boleh untuk host).",
          "Rentang Host Valid = 192.168.1.1 s.d. 192.168.1.6 -> 192.168.1.6 sah digunakan.",
        ],
      },
    ],
    keyTakeaways: [
      "First Usable Host = Network Address + 1 (bit host paling kanan bernilai 1, sisanya 0).",
      "Last Usable Host = Broadcast Address - 1 (bit host paling kanan bernilai 0, sisanya 1).",
      "Pada prefix /31 (point-to-point RFC 3021), kedua alamat dapat dipakai tanpa dikurangi Network/Broadcast; pada /32 hanya ada 1 alamat tunggal.",
    ],
  },
  {
    id: "mat-10",
    order: 10,
    slug: "total-address-dan-usable-host",
    title: "Total Address dan Usable Host",
    category: "Identitas & Subnetting",
    estimatedMinutes: 7,
    shortDescription:
      "Menghitung kapasitas total alamat (2^h) dan jumlah perangkat maksimal yang dapat ditampung (2^h - 2) pada setiap ukuran prefix.",
    objectives: [
      "Menghitung Total Address per subnet menggunakan rumus 2^h (dengan h = 32 - prefix).",
      "Menghitung Usable Host per subnet menggunakan rumus 2^h - 2 serta menjelaskan alasan pengurangan 2 alamat.",
      "Memilih prefix CIDR yang paling efisien berdasarkan kebutuhan jumlah perangkat di suatu ruangan/divisi.",
    ],
    conceptSections: [
      {
        heading: "Rumus Kapasitas Alamat per Subnet",
        paragraphs: [
          "Banyaknya alamat IP di dalam satu blok subnet ditentukan sepenuhnya oleh jumlah bit Host (h = 32 - prefix). Karena setiap bit memiliki 2 kemungkinan nilai (0 atau 1), maka h bit host menghasilkan total 2^h alamat.",
          "Namun, pada jaringan standar (/0 s.d. /30), dua alamat selalu dikurangi: 1 untuk Network Address dan 1 untuk Broadcast Address. Dengan demikian, jumlah host bersih yang dapat digunakan oleh perangkat adalah 2^h - 2.",
        ],
        formulaCallout: {
          label: "Rumus Total Address vs Usable Host",
          formula: "Total Address = 2^(32 - prefix)   |   Usable Host = 2^(32 - prefix) - 2",
          note: "Untuk prefix /26 (h = 6 bit): Total = 2^6 = 64 alamat; Usable Host = 64 - 2 = 62 perangkat.",
        },
        table: {
          caption: "Tabel Kapasitas Alamat dan Usable Host pada Kelas C (/24 s.d. /30)",
          headers: ["Prefix", "Bit Host (h)", "Total Address (2^h)", "Usable Host (2^h - 2)", "Kegunaan Umum"],
          rows: [
            ["/24", "8 bit", "256", "254 host", "LAN gedung / laboratorium besar"],
            ["/25", "7 bit", "128", "126 host", "Divisi menengah (~100 perangkat)"],
            ["/26", "6 bit", "64", "62 host", "Ruang kelas / lab komputer (~50 PC)"],
            ["/27", "5 bit", "32", "30 host", "Ruang kerja kecil (~25 perangkat)"],
            ["/28", "4 bit", "16", "14 host", "Segmen server / ruang rapat"],
            ["/29", "3 bit", "8", "6 host", "Segmen DMZ / perangkat terbatas"],
            ["/30", "2 bit", "4", "2 host", "Koneksi kabel Point-to-Point antar 2 router"],
          ],
        },
      },
    ],
    simulatorPreset: {
      ip: "192.168.10.130",
      prefix: 26,
      caption: "Pada studi kasus 192.168.10.130/26 (h = 6 bit host), terdapat Total 64 alamat dan 62 Usable Host (.129 s.d. .190).",
    },
    workedExample: {
      question:
        "Hitunglah jumlah Total Address (2^h) dan jumlah Usable Host (2^h - 2) untuk blok subnet pada studi kasus 192.168.10.130/26!",
      givenIp: "192.168.10.130",
      givenPrefix: 26,
      steps: [
        {
          title: "Hitung jumlah bit host (h) dari prefix /26",
          detail:
            "Panjang alamat IPv4 adalah 32 bit. Maka sisa bit host h = 32 - 26 = 6 bit.",
        },
        {
          title: "Hitung Total Address (2^h) dan Usable Host (2^h - 2)",
          detail: "Total Address = 2^6 = 64 alamat (.128 s.d. .191). Usable Host = 64 - 2 = 62 perangkat (.129 s.d. .190), karena dikurangi 1 Network ID (.128) dan 1 Broadcast ID (.191).",
        },
      ],
      finalAnswer:
        "Pada 192.168.10.130/26: Bit Host (h) = 6 bit | Total Address = 64 alamat | Usable Host = 62 perangkat.",
    },
    checkQuestions: [
      {
        id: "mat-10-q1",
        question:
          "Berapakah jumlah Total Address dan Usable Host pada sebuah subnet dengan prefix /28?",
        options: [
          "Total 32 alamat, Usable 30 host",
          "Total 16 alamat, Usable 14 host",
          "Total 16 alamat, Usable 16 host",
          "Total 8 alamat, Usable 6 host",
        ],
        correctIndex: 1,
        explanation:
          "Pada prefix /28, sisa bit host adalah h = 32 - 28 = 4 bit. Total Address = 2^4 = 16 alamat, dan Usable Host = 16 - 2 = 14 host.",
        steps: [
          "Hitung bit host: h = 32 - 28 = 4 bit.",
          "Total Address = 2^4 = 16 alamat.",
          "Usable Host = 2^4 - 2 = 14 host (dikurangi 1 Network ID dan 1 Broadcast ID).",
        ],
      },
      {
        id: "mat-10-q2",
        question:
          "Untuk menghubungkan 2 router secara langsung (Point-to-Point link) yang hanya membutuhkan tepat 2 alamat host valid dengan metode subnetting konvensional, prefix manakah yang paling hemat?",
        options: [
          "/28",
          "/29",
          "/30",
          "/24",
        ],
        correctIndex: 2,
        explanation:
          "Prefix /30 menyisakan h = 32 - 30 = 2 bit host. Rumus Usable Host menghasilkan 2^2 - 2 = 4 - 2 = 2 alamat host valid, sangat pas untuk 2 ujung antarmuka router tanpa membuang alamat IP.",
        steps: [
          "Kebutuhan = 2 usable host -> cari 2^h - 2 >= 2.",
          "Dengan h = 2 bit: 2^2 - 2 = 2 host -> Prefix = 32 - 2 = /30.",
        ],
      },
    ],
    keyTakeaways: [
      "Total alamat dalam satu blok subnet (2^h) selalu sama dengan nilai Ukuran Blok (Block Size) pada oktet ke-4 Kelas C.",
      "Selalu kurangi 2 dari total alamat (2^h - 2) untuk mendapatkan jumlah host yang dapat dipasang pada PC/router.",
      "Untuk koneksi point-to-point antar 2 router, gunakan /30 (2 usable host) atau /31 (RFC 3021).",
    ],
  },
  {
    id: "mat-11",
    order: 11,
    slug: "konsep-subnetting",
    title: "Konsep Subnetting",
    category: "Identitas & Subnetting",
    estimatedMinutes: 8,
    shortDescription:
      "Memahami alasan teknis dilakukannya subnetting (efisiensi alamat, pembatasan broadcast domain, keamanan) serta mekanisme peminjaman bit host (Borrowing Bits).",
    objectives: [
      "Menjelaskan 3 manfaat utama subnetting: efisiensi alamat IP, pemecahan Broadcast Domain, dan isolasi keamanan antar-divisi.",
      "Memahami mekanisme peminjaman bit (Borrowed Bits / n) dari porsi Host untuk memperluas porsi Network.",
      "Menghitung jumlah subnet yang terbentuk menggunakan rumus 2^n.",
    ],
    conceptSections: [
      {
        heading: "Mengapa Jaringan Perlu Di-Subnet?",
        paragraphs: [
          "Subnetting adalah teknik memecah satu jaringan besar (misalnya satu jaringan Kelas C /24 berisi 254 host) menjadi beberapa jaringan kecil yang disebut sub-network (subnet). Tanpa subnetting, seluruh 254 komputer berada di dalam satu Broadcast Domain besar sehingga lalu lintas broadcast membebani semua perangkat.",
          "Secara teknis, proses subnetting dilakukan dengan meminjam sejumlah bit (n bit) dari sisi paling kiri porsi Host untuk dijadikan bit tambahan pengenal Subnet.",
        ],
        formulaCallout: {
          label: "Rumus Jumlah Subnet Hasil Peminjaman Bit (n)",
          formula: "Jumlah Subnet = 2^n   (dengan n = Prefix Baru - Default Prefix)",
          note: "Pada Kelas C (default /24) yang diubah ke /26: bit pinjam n = 26 - 24 = 2 bit -> Jumlah Subnet = 2^2 = 4 subnet.",
        },
        table: {
          caption: "Trade-off (Pertukaran) antara Jumlah Subnet dan Kapasitas Host per Subnet di Kelas C",
          headers: ["Prefix", "Bit Pinjam (n)", "Jumlah Subnet (2^n)", "Bit Host (h)", "Host Valid / Subnet (2^h - 2)", "Ukuran Blok"],
          rows: [
            ["/24", "0 bit", "1 subnet", "8 bit", "254 host", "256"],
            ["/25", "1 bit", "2 subnet", "7 bit", "126 host", "128"],
            ["/26", "2 bit", "4 subnet", "6 bit", "62 host", "64"],
            ["/27", "3 bit", "8 subnet", "5 bit", "30 host", "32"],
            ["/28", "4 bit", "16 subnet", "4 bit", "14 host", "16"],
            ["/29", "5 bit", "32 subnet", "3 bit", "6 host", "8"],
            ["/30", "6 bit", "64 subnet", "2 bit", "2 host", "4"],
          ],
        },
      },
    ],
    simulatorPreset: {
      ip: "192.168.10.130",
      prefix: 26,
      caption: "Perhatikan 2 kotak biru pada Struktur 32-Bit Linear: itulah 2 bit yang dipinjam dari oktet ke-4 untuk membentuk 4 subnet pada 192.168.10.130/26.",
    },
    workedExample: {
      question:
        "Pada studi kasus 192.168.10.130/26, jaringan induk Kelas C 192.168.10.0/24 telah di-subnet menjadi prefix /26. Berapa bit yang dipinjam (n), berapa jumlah subnet yang terbentuk (2^n), dan di kombinasi biner subnet manakah IP 192.168.10.130 berada?",
      givenIp: "192.168.10.130",
      givenPrefix: 26,
      steps: [
        {
          title: "Hitung jumlah bit pinjam (n) dan jumlah blok subnet (2^n)",
          detail:
            "Dari default Kelas C (/24) ke /26 terdapat peminjaman n = 26 - 24 = 2 bit host paling kiri di oktet ke-4. Jumlah subnet yang terbentuk adalah 2^2 = 4 blok subnet (kombinasi bit pinjam: 00, 01, 10, dan 11).",
        },
        {
          title: "Identifikasi kombinasi 2 bit pinjam pada 192.168.10.130",
          detail:
            "Oktet ke-4 bernilai 130 (biner: 10000010). Dua bit paling kirinya bernilai '10' (Subnet ke-3 yang dimulai dari .128), sedangkan 6 bit sisanya ('000010') adalah nomor host di dalam subnet tersebut.",
        },
      ],
      finalAnswer: "Pinjam 2 bit (n = 2) -> terbentuk 4 subnet (2^2 = 4), dan 192.168.10.130 berada pada kombinasi bit subnet '10' (Subnet ke-3).",
    },
    checkQuestions: [
      {
        id: "mat-11-q1",
        question:
          "Jika satu blok jaringan Kelas C (/24) di-subnet menjadi prefix /28, berapakah jumlah bit yang dipinjam (n) dan berapa total blok subnet yang terbentuk?",
        options: [
          "Pinjam 3 bit -> 8 Subnet",
          "Pinjam 4 bit -> 16 Subnet",
          "Pinjam 4 bit -> 8 Subnet",
          "Pinjam 2 bit -> 4 Subnet",
        ],
        correctIndex: 1,
        explanation:
          "Dari default Kelas C (/24) ke /28 terdapat peminjaman n = 28 - 24 = 4 bit. Jumlah blok subnet yang terbentuk adalah 2^n = 2^4 = 16 subnet.",
        steps: [
          "Hitung bit pinjam (n): n = Prefix Baru - Default Prefix = 28 - 24 = 4 bit.",
          "Hitung jumlah subnet: 2^n = 2^4 = 16 subnet.",
        ],
      },
      {
        id: "mat-11-q2",
        question:
          "Manakah pernyataan yang BENAR mengenai efek penambahan bit pinjam subnet (misal dari /25 menjadi /26)?",
        options: [
          "Jumlah subnet bertambah 2 kali lipat, dan kapasitas host per subnet berkurang menjadi separuhnya",
          "Jumlah subnet dan kapasitas host per subnet sama-sama bertambah 2 kali lipat",
          "Broadcast domain menjadi semakin besar dan menyatu",
          "Ukuran blok (Block Size) menjadi 2 kali lebih besar",
        ],
        correctIndex: 0,
        explanation:
          "Setiap meminjam 1 bit tambahan dari porsi Host, jumlah subnet menjadi 2 kali lipat (dari 2^1=2 menjadi 2^2=4), sedangkan ukuran blok dan total alamat per subnet terbagi dua (dari 128 menjadi 64).",
        steps: [
          "Pada /25: 2 subnet, ukuran blok 128 (126 usable host).",
          "Pada /26: 4 subnet (×2), ukuran blok 64 (÷2, yaitu 62 usable host).",
        ],
      },
    ],
    keyTakeaways: [
      "Subnetting bekerja dengan meminjam bit dari porsi Host (kiri ke kanan) menjadi bit Subnet.",
      "Rumus jumlah blok subnet yang terbentuk dari satu jaringan induk adalah 2^n (n = jumlah bit pinjam).",
      "Setiap penambahan 1 bit pinjam akan menggandakan jumlah subnet (×2) dan membagi dua ukuran blok (÷2).",
    ],
  },
  {
    id: "mat-12",
    order: 12,
    slug: "contoh-perhitungan-subnetting-kelas-c",
    title: "Contoh Perhitungan Subnetting Kelas C",
    category: "Identitas & Subnetting",
    estimatedMinutes: 10,
    shortDescription:
      "Studi kasus komprehensif langkah demi langkah menghitung seluruh parameter subnetting Kelas C beserta penyusunan tabel daftar blok subnet lengkap.",
    objectives: [
      "Melakukan perhitungan lengkap 5 langkah untuk sebuah alamat IPv4 Kelas C dengan prefix subnetting.",
      "Menyusun tabel seluruh blok subnet (Network ID, Host Pertama, Host Terakhir, Broadcast ID).",
      "Menentukan secara tepat di blok subnet ke-berapa sebuah alamat IP host berada.",
    ],
    conceptSections: [
      {
        heading: "Metode 5 Langkah Sistematis Subnetting Kelas C",
        paragraphs: [
          "Pada topik pamungkas ini, kita menggabungkan seluruh konsep dari Topik 1 hingga Topik 11 ke dalam satu prosedur 5 langkah yang sistematis. Sebagai studi kasus utama, mari kita bedah alamat 192.168.10.130/26.",
        ],
        formulaCallout: {
          label: "Ringkasan Kasus 192.168.10.130/26",
          formula: "Mask = 255.255.255.192 | Subnet = 2^2 = 4 | Host/Subnet = 2^6 - 2 = 62 | Ukuran Blok = 64",
          note: "Karena oktet ke-4 bernilai 130, maka IP ini berada di Subnet ke-3 (rentang blok 128 s.d. 191).",
        },
        table: {
          caption: "Tabel Lengkap 4 Blok Subnet untuk Jaringan 192.168.10.0/26 (Ukuran Blok = 64)",
          headers: ["Subnet #", "Kombinasi Bit Pinjam", "Network ID", "Rentang Host Valid", "Broadcast ID", "Status 192.168.10.130"],
          rows: [
            ["Subnet 1", "00", "192.168.10.0", "192.168.10.1 – 192.168.10.62", "192.168.10.63", "-"],
            ["Subnet 2", "01", "192.168.10.64", "192.168.10.65 – 192.168.10.126", "192.168.10.127", "-"],
            ["Subnet 3", "10", "192.168.10.128", "192.168.10.129 – 192.168.10.190", "192.168.10.191", "IP Berada di Sini (.130)"],
            ["Subnet 4", "11", "192.168.10.192", "192.168.10.193 – 192.168.10.254", "192.168.10.255", "-"],
          ],
        },
      },
    ],
    simulatorPreset: {
      ip: "192.168.10.130",
      prefix: 26,
      caption: "Studi kasus lengkap 192.168.10.130/26: berada pada Subnet ke-3 dengan Network ID 192.168.10.128 dan Broadcast ID 192.168.10.191.",
    },
    workedExample: {
      question:
        "Diketahui alamat IP 192.168.10.130/26. Hitunglah: (1) Subnet Mask, (2) Jumlah Subnet, (3) Jumlah Host Valid per Subnet, (4) Ukuran Blok, serta (5) Network ID, Rentang Host, dan Broadcast ID tempat IP tersebut berada!",
      givenIp: "192.168.10.130",
      givenPrefix: 26,
      steps: [
        {
          title: "Langkah 1 - Konversi Prefix /26 ke Subnet Mask",
          detail:
            "Prefix /26 berarti meminjam n = 26 - 24 = 2 bit di oktet ke-4 (11000000 = 128 + 64 = 192). Subnet Mask = 255.255.255.192.",
        },
        {
          title: "Langkah 2 - Hitung Jumlah Subnet (2^n)",
          detail: "Dengan n = 2 bit pinjam, Jumlah Subnet = 2^2 = 4 blok subnet.",
        },
        {
          title: "Langkah 3 - Hitung Jumlah Host Valid per Subnet (2^h - 2)",
          detail: "Sisa bit host h = 32 - 26 = 6 bit. Usable Host = 2^6 - 2 = 64 - 2 = 62 host per subnet.",
        },
        {
          title: "Langkah 4 - Hitung Ukuran Blok (Block Size) & Daftar Kelipatan Network",
          detail:
            "Ukuran Blok = 256 - 192 = 64. Maka kelipatan Network ID di oktet ke-4 adalah: 0, 64, 128, dan 192.",
        },
        {
          title: "Langkah 5 - Tentukan Blok Tempat IP 192.168.10.130 Berada",
          detail:
            "Angka 130 terletak di antara kelipatan 128 dan 191 (Subnet ke-3). Maka Network ID = 192.168.10.128, Host Pertama = 192.168.10.129, Host Terakhir = 192.168.10.190, dan Broadcast ID = 192.168.10.191.",
        },
      ],
      finalAnswer:
        "Mask: 255.255.255.192 | 4 Subnet | 62 Host/Subnet | Blok: 64 | Network: 192.168.10.128 | Host: .129–.190 | Broadcast: 192.168.10.191.",
    },
    checkQuestions: [
      {
        id: "mat-12-q1",
        question:
          "Sebuah PC memiliki konfigurasi IP 192.168.10.200/26. Berada pada blok subnet ke-berapakah PC tersebut dan apakah Network ID serta Broadcast ID-nya?",
        options: [
          "Subnet ke-3 (Network: 192.168.10.128, Broadcast: 192.168.10.191)",
          "Subnet ke-4 (Network: 192.168.10.192, Broadcast: 192.168.10.255)",
          "Subnet ke-2 (Network: 192.168.10.64, Broadcast: 192.168.10.127)",
          "Subnet ke-4 (Network: 192.168.10.192, Broadcast: 192.168.10.254)",
        ],
        correctIndex: 1,
        explanation:
          "Pada prefix /26 (Ukuran Blok = 64), 4 blok subnet dimulai pada kelipatan: .0 (Subnet 1), .64 (Subnet 2), .128 (Subnet 3), dan .192 (Subnet 4). Karena oktet ke-4 adalah 200 (192 <= 200 <= 255), maka PC berada di Subnet ke-4 dengan Network ID 192.168.10.192 dan Broadcast ID 192.168.10.255.",
        steps: [
          "Ukuran blok /26 = 256 - 192 = 64. Kelipatan Network: 0, 64, 128, 192.",
          "Angka 200 berada di blok ke-4 yang dimulai dari 192.168.10.192 hingga Broadcast 192.168.10.255.",
        ],
      },
      {
        id: "mat-12-q2",
        question:
          "Diketahui alamat IP 192.168.50.45/27. Manakah pasangan parameter hasil perhitungan subnetting yang BENAR untuk alamat tersebut?",
        options: [
          "Mask: 255.255.255.224 | Network: 192.168.50.32 | Broadcast: 192.168.50.63 | Usable: 30 Host",
          "Mask: 255.255.255.224 | Network: 192.168.50.0 | Broadcast: 192.168.50.63 | Usable: 62 Host",
          "Mask: 255.255.255.240 | Network: 192.168.50.32 | Broadcast: 192.168.50.47 | Usable: 14 Host",
          "Mask: 255.255.255.192 | Network: 192.168.50.32 | Broadcast: 192.168.50.64 | Usable: 30 Host",
        ],
        correctIndex: 0,
        explanation:
          "Prefix /27 memiliki Subnet Mask 255.255.255.224, Ukuran Blok = 256 - 224 = 32, dan Usable Host = 2^5 - 2 = 30 host. Kelipatan blok 32 adalah 0, 32, 64... sehingga IP .45 berada di blok Network 192.168.50.32 dengan Broadcast 192.168.50.63.",
        steps: [
          "Prefix /27 -> Mask = 255.255.255.224, Block Size = 32, Usable Host = 2^5 - 2 = 30.",
          "Karena 32 <= 45 < 64, maka Network ID = 192.168.50.32 dan Broadcast ID = 192.168.50.63.",
        ],
      },
    ],
    keyTakeaways: [
      "Urutan 5 langkah cepat: (1) Cari Subnet Mask, (2) Hitung 2^n subnet, (3) Hitung 2^h - 2 host, (4) Hitung Block Size = 256 - mask, (5) Petakan blok tempat IP berada.",
      "Gunakan Simulator SubnetLab IPv4 untuk memverifikasi hasil hitungan manualmu pada alamat Kelas C lainnya.",
      "Setelah menyelesaikan ke-12 topik materi ini, kamu siap mengerjakan modul Latihan dan Kuis Evaluasi!",
    ],
  },
]

export function getMaterialBySlug(slug: string): MaterialTopic | undefined {
  return MATERIALS_DATA.find((item) => item.slug === slug)
}

export function getAdjacentMaterials(slug: string): {
  prev: MaterialTopic | null
  next: MaterialTopic | null
} {
  const index = MATERIALS_DATA.findIndex((item) => item.slug === slug)
  if (index === -1) {
    return { prev: null, next: null }
  }
  return {
    prev: index > 0 ? MATERIALS_DATA[index - 1] : null,
    next: index < MATERIALS_DATA.length - 1 ? MATERIALS_DATA[index + 1] : null,
  }
}
