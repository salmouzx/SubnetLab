# **PRODUCT REQUIREMENTS DOCUMENT (PRD)**

# **SubnetLab IPv4**

### **Interactive IPv4 Learning & Simulation Platform**

**Product Name:** SubnetLab IPv4
**Product Category:** Educational Technology / Networking Learning Platform
**Product Type:** Responsive Full-Stack Web Application
**Target Institution:** Universitas Negeri Semarang (UNNES)
**Primary Users:** Mahasiswa Pendidikan Teknik Informatika dan Komputer (PTIK) UNNES yang menempuh mata kuliah Jaringan Komputer.
**Platform:** Web Application
**Development Approach:** Modular Full-Stack Architecture
**Status:** Product Specification

---

# **1\. PRODUCT OVERVIEW**

## **1.1. Background**

Jaringan Komputer merupakan salah satu mata kuliah fundamental dalam Program Studi Pendidikan Teknik Informatika dan Komputer (PTIK), Universitas Negeri Semarang.

Salah satu kompetensi yang perlu dipahami mahasiswa adalah pengalamatan Internet Protocol Version 4 (IPv4), termasuk struktur alamat IP, subnet mask, CIDR, network address, broadcast address, host address, dan subnetting.

Pemahaman IPv4 tidak cukup hanya melalui hafalan konsep. Mahasiswa perlu memahami proses perhitungan, konversi desimal ke biner, pembagian network dan host bits, serta hubungan antara subnet mask dengan jumlah alamat yang tersedia.

SubnetLab IPv4 dikembangkan sebagai media pembelajaran interaktif untuk mendukung mahasiswa dalam memahami konsep IPv4 melalui materi terstruktur, simulasi perhitungan, latihan, dan evaluasi pembelajaran.

Platform ini dirancang sebagai pendamping pembelajaran mata kuliah Jaringan Komputer, bukan sebagai pengganti perkuliahan, modul, atau sumber pembelajaran resmi dosen.

## **1.2. Product Vision**

Menghadirkan media pembelajaran IPv4 yang akurat, interaktif, dan mudah dipahami sehingga mahasiswa dapat mempelajari konsep pengalamatan IP serta subnetting melalui proses belajar yang sistematis.

## **1.3. Product Objectives**

1. Membantu mahasiswa memahami konsep pengalamatan IPv4.
2. Menjelaskan hubungan antara IP Address, Subnet Mask, Network ID, dan Host ID.
3. Menyediakan simulator perhitungan IPv4 yang akurat.
4. Memvisualisasikan representasi biner 32-bit.
5. Menjelaskan proses perhitungan subnetting secara bertahap.
6. Menyediakan latihan dan evaluasi untuk mengukur pemahaman mahasiswa.
7. Memberikan feedback yang informatif terhadap kesalahan input dan jawaban.
8. Menyediakan pengalaman belajar responsif di berbagai perangkat.

## **1.4. Product Scope**

SubnetLab IPv4 memiliki dua cakupan utama.

| Modul             | Cakupan                         |
| ----------------- | ------------------------------- |
| Beranda           | Informasi dan navigasi platform |
| Materi            | IPv4 Kelas C                    |
| Simulator         | IPv4 Kelas A, B, C, D, dan E    |
| Latihan           | IPv4 Kelas C                    |
| Kuis              | IPv4 Kelas C                    |
| Authentication    | Guest dan akun pengguna         |
| Learning Progress | Progres pembelajaran            |
| Learning History  | Riwayat latihan dan kuis        |
| Simulator History | Riwayat simulasi opsional       |

**Scope distinction:**

* Simulator mendukung identifikasi seluruh kelas IPv4 A–E.
* Perhitungan subnetting unicast tersedia untuk alamat yang sesuai dengan ketentuan teknisnya.
* Kelas D dan E mendapatkan informasi serta penanganan khusus.
* Materi, latihan, dan kuis difokuskan pada IPv4 Kelas C.

---

# **2\. TARGET USERS & USER REQUIREMENTS**

## **2.1. Primary Target User**

Mahasiswa Pendidikan Teknik Informatika dan Komputer (PTIK) Universitas Negeri Semarang yang sedang menempuh mata kuliah Jaringan Komputer.

### **User Characteristics**

* Sedang mempelajari konsep jaringan komputer.
* Membutuhkan pemahaman tentang pengalamatan IPv4.
* Mempelajari subnet mask, CIDR, dan subnetting.
* Menggunakan laptop maupun smartphone untuk pembelajaran.
* Membutuhkan media latihan dan simulasi mandiri.
* Ingin mengetahui proses perhitungan, bukan hanya hasil akhirnya.

## **2.2. User Problems**

| Permasalahan                                  | Kebutuhan Solusi                         |
| --------------------------------------------- | ---------------------------------------- |
| Kesulitan mengonversi IP ke biner             | Visualisasi biner 32-bit                 |
| Bingung membedakan network dan host           | Visualisasi pembagian network-host       |
| Sulit menghitung network address              | Kalkulator dengan penjelasan operasi AND |
| Tertukar antara broadcast dan network address | Contoh dan pembahasan terstruktur        |
| Sulit memahami subnet mask                    | Visualisasi subnet mask dan prefix       |
| Tidak mengetahui kesalahan perhitungan        | Feedback dan pembahasan jawaban          |
| Membutuhkan evaluasi mandiri                  | Latihan dan kuis                         |

## **2.3. User Journey**

Alur pembelajaran utama:

1. Pengguna membuka halaman beranda.
2. Pengguna memilih materi IPv4.
3. Pengguna mempelajari konsep dan contoh.
4. Pengguna mencoba simulasi.
5. Pengguna mengerjakan latihan.
6. Pengguna mengikuti kuis.
7. Pengguna melihat hasil evaluasi.

Learning Flow:

**Learn → Understand → Simulate → Practice → Evaluate**

---

# **3\. INFORMATION ARCHITECTURE**

## **3.1. Sitemap**

```
SubnetLab IPv4
│
├── Beranda (/)
│
├── Materi (/materi)
│   ├── Pengenalan IPv4
│   ├── Struktur IPv4
│   ├── Konversi Biner
│   ├── Network ID & Host ID
│   ├── Subnet Mask
│   ├── CIDR
│   ├── Network Address
│   ├── Broadcast Address
│   └── Subnetting Kelas C
│
├── Simulator (/simulator)
│   ├── Input IPv4
│   ├── Identifikasi Kelas
│   ├── Perhitungan Subnet
│   ├── Visualisasi Biner
│   └── Hasil Perhitungan
│
├── Latihan (/latihan)
│   ├── Kategori Soal
│   ├── Tingkat Kesulitan
│   └── Pembahasan
│
├── Kuis (/kuis)
│   ├── Informasi Kuis
│   ├── Pengerjaan
│   └── Hasil Kuis
│
├── Login (/login)
├── Register (/register)
└── Profil (/profil)
```

---

# **4\. FUNCTIONAL REQUIREMENTS**

## **4.1. Beranda**

Route: /

Tujuan:
Memperkenalkan SubnetLab IPv4 dan mengarahkan pengguna ke fitur utama.

Komponen:

* Global navigation.
* Hero section.
* Product introduction.
* Feature overview.
* IPv4 class overview.
* Learning path.
* Learning progress untuk pengguna login.
* Footer.

Hero copy:

**"Pahami IPv4, Kuasai Subnetting."**

Deskripsi:

"Pelajari pengalamatan IPv4 melalui materi terstruktur, simulasi perhitungan interaktif, serta latihan yang membantu memahami setiap proses subnetting."

CTA:

* Mulai Belajar.
* Coba Simulator.

## **4.2. Materi**

Route: /materi

Fokus: IPv4 Kelas C.

Daftar materi:

1. Pengenalan IPv4.
2. Struktur dan format alamat IPv4.
3. Oktet dan representasi biner.
4. Network ID dan Host ID.
5. Subnet Mask.
6. CIDR dan Prefix.
7. Network Address.
8. Broadcast Address.
9. First Host dan Last Host.
10. Total Address dan Usable Host.
11. Konsep Subnetting.
12. Contoh perhitungan subnetting Kelas C.

Setiap materi mencakup:

* Learning objectives.
* Penjelasan konsep.
* Diagram atau ilustrasi.
* Contoh soal.
* Pembahasan langkah demi langkah.
* Ringkasan.
* Navigasi materi.
* Akses langsung ke simulator.
* Indikator progres.

## **4.3. Simulator**

Route: /simulator

Fokus: Identifikasi dan simulasi IPv4 kelas A–E.

Input:

* IPv4 Address.
* Subnet Mask.
* CIDR Prefix.

Fitur:

* Validasi alamat.
* Identifikasi kelas IP.
* Konversi desimal ke biner.
* Perhitungan subnet.
* Visualisasi network dan host.
* Hasil perhitungan.
* Penjelasan langkah.
* Copy result.
* Reset.

Output subnet unicast:

* IP Address.
* IP Class.
* Subnet Mask.
* CIDR.
* Network Address.
* Broadcast Address.
* First Usable Host.
* Last Usable Host.
* Total Address.
* Usable Host.
* Network Bits.
* Host Bits.
* Binary Representation.

Penanganan kelas:

* A, B, dan C: identifikasi kelas dan perhitungan subnet sesuai prefix.
* D: informasi multicast, bukan subnet unicast biasa.
* E: informasi reserved/experimental, bukan subnet host unicast biasa.

## **4.4. Latihan**

Route: /latihan

Fokus: IPv4 Kelas C.

Kategori:

* Identifikasi IPv4.
* Konversi Biner.
* Subnet Mask.
* CIDR.
* Network Address.
* Broadcast Address.
* Host Address.
* Jumlah Host.
* Subnetting.

Tingkat kesulitan:

* Mudah.
* Menengah.
* Sulit.

Jenis soal:

* Pilihan ganda.
* Isian singkat.

Fitur:

* Pemeriksaan jawaban.
* Feedback langsung.
* Pembahasan.
* Indikator tingkat kesulitan.
* Pengulangan soal.

## **4.5. Kuis**

Route: /kuis

Fitur:

* Informasi kuis.
* Jumlah soal.
* Durasi opsional.
* Navigasi nomor soal.
* Status soal.
* Penyimpanan jawaban sementara.
* Konfirmasi penyelesaian.
* Penilaian otomatis.
* Hasil evaluasi.
* Pembahasan.
* Riwayat nilai.

Jawaban benar tidak boleh ditampilkan sebelum kuis selesai.

---

# **5\. DESIGN SYSTEM & UI/UX**

## **5.1. Design Direction**

**Design Concept: Modern Academic Technology**

Karakter:

* Professional.
* Clean.
* Minimal.
* Structured.
* Technical.
* Educational.
* User-centered.

Antarmuka harus mengutamakan keterbacaan, hierarki informasi, dan kemudahan interaksi.

Jangan menggunakan tampilan dashboard admin generik.

## **5.2. Color Palette**

### **Brand**

| Token         | Hex      | Fungsi               |
| ------------- | -------- | -------------------- |
| Primary       | \#059669 | CTA dan elemen utama |
| Primary Hover | \#047857 | Hover                |
| Navy          | \#0F172A | Heading              |
| Teal          | \#0F766E | Aksen teknis         |
| White         | \#FFFFFF | Background           |

### **Neutral**

| Token             | Hex      |
| ----------------- | -------- |
| Background        | \#F8FAFC |
| Surface           | \#FFFFFF |
| Secondary Surface | \#F1F5F9 |
| Border            | \#E2E8F0 |
| Primary Text      | \#0F172A |
| Secondary Text    | \#64748B |
| Muted Text        | \#94A3B8 |

### **Semantic Status**

**SUCCESS — Benar / Berhasil**

* Background: \#DCFCE7
* Text: \#166534
* Border: \#86EFAC
* Icon: Check Circle

**WARNING — Peringatan**

* Background: \#FEF3C7
* Text: \#92400E
* Border: \#FCD34D
* Icon: Alert Triangle

**ERROR — Salah / Gagal**

* Background: \#FEE2E2
* Text: \#991B1B
* Border: \#FCA5A5
* Icon: X Circle

Aturan:

* Hijau untuk jawaban benar dan proses berhasil.
* Kuning untuk peringatan atau informasi yang membutuhkan perhatian.
* Merah untuk jawaban salah, input invalid, dan kegagalan.
* Setiap status harus memiliki teks dan ikon.
* Jangan menggunakan warna sebagai satu-satunya indikator.

## **5.3. Typography**

* Inter: font utama.
* JetBrains Mono: alamat IP, subnet mask, CIDR, dan biner.

Gunakan hierarki heading yang jelas, ukuran teks konsisten, dan line-height yang nyaman.

## **5.4. Component System**

Reusable components:

* Navbar.
* Mobile Navigation.
* Footer.
* Page Header.
* Breadcrumb.
* Section Heading.
* Button.
* Input.
* Select.
* Status Alert.
* Progress Indicator.
* Material Navigation.
* Binary Visualization.
* Calculation Result.
* Question Component.
* Quiz Navigation.
* Result Summary.
* Empty State.
* Loading State.
* Error State.

Gunakan Lucide React untuk ikon.

## **5.5. Visual Quality Rules**

Hindari:

* Gradient berlebihan.
* Glassmorphism berlebihan.
* Shadow terlalu tebal.
* Terlalu banyak card.
* Ikon emoji sebagai pengganti ikon antarmuka.
* Animasi tidak fungsional.
* Elemen dekoratif tanpa tujuan.
* Typography terlalu banyak variasi.
* Komponen yang hanya terlihat bagus di desktop.

---

# **6\. DETAILED UI/UX PER PAGE**

## **6.1. Global Navigation**

Desktop:

* Logo SubnetLab IPv4.
* Beranda.
* Materi.
* Simulator.
* Latihan.
* Kuis.
* Login atau profil.

Mobile:

* Logo.
* Hamburger menu.
* Navigation drawer.

Navigasi aktif harus mempunyai indikator visual.

## **6.2. Beranda**

Urutan:

1. Navbar.
2. Hero section.
3. Feature introduction.
4. IPv4 class overview.
5. Learning path.
6. CTA.
7. Footer.

Visual utama dapat menampilkan diagram jaringan sederhana, representasi IP Address, serta visualisasi network dan host.

Jangan menampilkan statistik pengguna atau jumlah materi yang tidak didukung data sebenarnya.

## **6.3. Materi**

Desktop:

* Sidebar daftar materi.
* Konten utama.
* Navigasi materi.

Mobile:

* Drawer atau dropdown daftar materi.
* Konten satu kolom.
* Navigasi sebelumnya dan berikutnya.

Materi menggunakan diagram, tabel, dan contoh jika lebih efektif daripada paragraf panjang.

## **6.4. Simulator**

Layout desktop:

* Input di sisi kiri.
* Hasil di sisi kanan.
* Visualisasi biner di bagian bawah.
* Penjelasan perhitungan setelah hasil.

Layout mobile:

* Input.
* Hasil.
* Visualisasi.
* Penjelasan.
* Tombol aksi.

Binary visualization:

* Empat oktet.
* Network bits.
* Host bits.
* Prefix boundary.
* Decimal representation.
* Binary representation.

Contoh:

192.168.1.10/24

11000000.10101000.00000001.00001010

Berikan label Network dan Host serta penjelasan yang dapat dipahami tanpa bergantung pada warna.

## **6.5. Latihan**

Tampilkan:

* Kategori.
* Tingkat kesulitan.
* Soal.
* Pilihan atau input jawaban.
* Tombol periksa.
* Feedback.
* Pembahasan.

## **6.6. Kuis**

Sebelum mulai:

* Judul.
* Deskripsi.
* Jumlah soal.
* Durasi.
* Ketentuan.

Saat berlangsung:

* Soal.
* Navigasi.
* Status pengerjaan.
* Tombol sebelumnya dan berikutnya.
* Akhiri kuis.

Setelah selesai:

* Skor.
* Persentase.
* Jawaban benar.
* Jawaban salah.
* Pembahasan.
* Ulangi kuis.

---

# **7\. IPV4 DOMAIN ENGINE**

## **7.1. Class Identification**

| Kelas | Rentang Oktet Pertama | Default Prefix | Fungsi                |
| ----- | --------------------- | -------------- | --------------------- |
| A     | 1–126                | /8             | Unicast               |
| B     | 128–191              | /16            | Unicast               |
| C     | 192–223              | /24            | Unicast               |
| D     | 224–239              | \-             | Multicast             |
| E     | 240–255              | \-             | Reserved/Experimental |

Catatan:

* 127.0.0.0/8 adalah loopback.
* 0.0.0.0 memiliki penggunaan khusus.
* Classful addressing adalah konsep historis.
* CIDR merupakan mekanisme pengalamatan modern.
* Identifikasi kelas tidak otomatis berarti alamat dapat digunakan sebagai host.

## **7.2. Calculation Rules**

Total Address:

2^(32 \- prefix)

Usable Host:

* /0 sampai /30: 2^(32 \- prefix) \- 2\.
* /31: dua alamat dapat digunakan untuk point-to-point sesuai RFC 3021\.
* /32: satu alamat tunggal.

Network Address:

IP AND Subnet Mask.

Broadcast Address:

Network Address OR Wildcard Mask.

First dan Last Host:

* Untuk subnet konvensional /0 sampai /30: network \+ 1 dan broadcast \- 1\.
* Untuk /31 dan /32, gunakan aturan khusus.

## **7.3. Validation**

* Empat oktet.
* Nilai setiap oktet 0–255.
* Prefix /0 sampai /32.
* Subnet mask harus kontigu.
* Input tidak valid menghasilkan error yang informatif.
* Kelas D dan E ditangani secara khusus.
* Alamat khusus harus diberi keterangan yang benar.

## **7.4. Testing Cases**

* 192.168.1.10/24.
* 192.168.1.10/25.
* 192.168.1.130/25.
* 172.16.10.20/16.
* 10.10.10.10/8.
* 192.168.1.10/30.
* Prefix /31.
* Prefix /32.
* Loopback.
* Multicast.
* Class E.
* Invalid IP.
* Invalid subnet mask.

---

# **8\. FULL-STACK TECHNOLOGY STACK**

## **8.1. Frontend**

**Next.js App Router**

* Routing.
* Server Components.
* Client Components.
* Rendering.
* Route Handlers.
* SEO metadata.

**TypeScript**

* Type safety.
* Consistent data structures.
* Maintainability.

**Tailwind CSS**

* Responsive styling.
* Design tokens.
* Consistent spacing.

**shadcn/ui**

* Button.
* Input.
* Select.
* Dialog.
* Tabs.
* Dropdown.
* Alert.
* Progress.
* Tooltip.

**Lucide React**

* Icon system.

**Zod**

* Schema validation.

## **8.2. Backend**

Next.js Route Handlers dan Server Actions.

Tanggung jawab:

* Request validation.
* Database operations.
* User data.
* Learning progress.
* Quiz submission.
* Quiz scoring.
* History management.

Perhitungan IPv4 berada di domain logic TypeScript yang terpisah dan tidak memerlukan request database.

## **8.3. Database**

**Firebase Cloud Firestore**

Collection:

users/{uid}

* displayName
* email
* photoURL
* role
* createdAt
* updatedAt

materials/{materialId}

* title
* slug
* description
* content
* order
* category
* estimatedDuration
* isPublished
* createdAt
* updatedAt

user\_progress/{progressId}

* userId
* materialId
* isCompleted
* completedAt
* lastAccessedAt

practice\_questions/{questionId}

* category
* difficulty
* question
* questionType
* options
* correctAnswer
* explanation
* isPublished

quizzes/{quizId}

* title
* description
* duration
* totalQuestions
* difficulty
* isPublished

quiz\_questions/{questionId}

* quizId
* question
* options
* correctAnswer
* explanation
* order

quiz\_attempts/{attemptId}

* userId
* quizId
* score
* totalQuestions
* correctAnswers
* wrongAnswers
* answers
* startedAt
* completedAt

simulator\_history/{historyId}

* userId
* ipAddress
* subnetMask
* prefix
* ipClass
* result
* createdAt

Relasi menggunakan document ID. Hindari duplikasi data yang tidak diperlukan.

## **8.4. Authentication**

Firebase Authentication:

* Google Sign-In.
* Email and Password.

Fitur:

* Register.
* Login.
* Logout.
* Profile.
* Session management.

Guest mode:

* Mengakses materi.
* Menggunakan simulator.
* Mengerjakan latihan.
* Mengikuti kuis.

Penyimpanan progres permanen membutuhkan akun.

## **8.5. Hosting**

Vercel:

* Next.js hosting.
* GitHub integration.
* Preview deployment.
* Production deployment.
* Environment variables.

Firebase:

* Authentication.
* Firestore.

## **8.6. Testing**

* Vitest.
* React Testing Library.
* Playwright.

---

# **9\. PROJECT ARCHITECTURE**

```
subnetlab-ipv4/
├── public/
│   ├── images/
│   ├── icons/
│   └── illustrations/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── materi/
│   │   ├── simulator/
│   │   ├── latihan/
│   │   ├── kuis/
│   │   ├── login/
│   │   ├── register/
│   │   └── profil/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── home/
│   │   ├── materi/
│   │   ├── simulator/
│   │   ├── latihan/
│   │   ├── kuis/
│   │   └── ui/
│   │
│   ├── features/
│   │   ├── ipv4/
│   │   ├── learning/
│   │   ├── practice/
│   │   ├── quiz/
│   │   └── authentication/
│   │
│   ├── services/
│   │   ├── material-service.ts
│   │   ├── progress-service.ts
│   │   ├── quiz-service.ts
│   │   └── history-service.ts
│   │
│   ├── lib/
│   │   ├── firebase/
│   │   ├── utils.ts
│   │   └── constants.ts
│   │
│   ├── hooks/
│   ├── types/
│   └── data/
│
├── tests/
│   ├── unit/
│   ├── components/
│   └── e2e/
│
├── .env.example
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## **9.1. Architecture Principles**

Gunakan pemisahan:

1. Presentation Layer.
2. Application Layer.
3. Domain Layer.
4. Data Access Layer.

Prinsip:

* Separation of Concerns.
* Single Responsibility.
* Reusable Components.
* Modular Architecture.
* Type Safety.
* Testability.
* Maintainability.

Hindari overengineering dan abstraksi yang tidak memberikan manfaat nyata.

---

# **10\. SECURITY REQUIREMENTS**

1. Firebase Admin SDK hanya boleh digunakan di server.
2. Jangan mengekspos private credentials.
3. Gunakan environment variables.
4. Jangan mengunggah .env.local.
5. Terapkan Firestore Security Rules.
6. Pengguna hanya dapat mengubah data pribadinya.
7. Pengguna biasa tidak boleh mengubah materi dan soal.
8. Jawaban benar tidak boleh dikirim sebelum kuis selesai.
9. Penilaian kuis dilakukan di server.
10. Jangan mempercayai skor yang dikirim oleh client.
11. Validasi request yang mengubah database.
12. Terapkan otorisasi untuk fitur administrasi.

---

# **11\. RESPONSIVE DESIGN**

Mobile-first.

| Breakpoint    | Lebar       | Layout            |
| ------------- | ----------- | ----------------- |
| Small Mobile  | 320–374px  | Satu kolom        |
| Mobile        | 375–767px  | Satu kolom        |
| Tablet        | 768–1023px | Adaptif           |
| Desktop       | 1024px+     | Layout lengkap    |
| Large Desktop | 1440px+     | Max-width content |

Ketentuan:

* Tidak ada horizontal page overflow.
* Navigasi adaptif.
* Form nyaman digunakan.
* Tabel memiliki scroll container.
* Visualisasi biner tetap terbaca.
* Modal tidak melebihi viewport.
* Konten memiliki spacing konsisten.

---

# **12\. ACCESSIBILITY**

Target: WCAG 2.2 AA sejauh memungkinkan.

* Semantic HTML.
* Label pada seluruh input.
* Keyboard navigation.
* Visible focus indicator.
* Kontras warna memadai.
* Status memiliki teks dan ikon.
* Aria-label jika dibutuhkan.
* Tidak bergantung pada warna saja.
* Teks dapat diperbesar tanpa kehilangan fungsi.

---

# **13\. NON-FUNCTIONAL REQUIREMENTS**

## **Performance**

* Optimalkan loading.
* Minimalkan client-side JavaScript.
* Gunakan Server Components untuk konten statis.
* Hindari dependency yang tidak perlu.
* Optimalkan gambar.
* Hindari request database yang tidak diperlukan.

## **Reliability**

* Perhitungan harus deterministik.
* Validasi input harus konsisten.
* Simulator tetap berjalan tanpa Firebase.
* Kegagalan database tidak merusak fungsi inti.

## **Maintainability**

* Kode modular.
* Dokumentasi.
* Struktur konsisten.
* Unit test.
* Type safety.

## **Usability**

* Navigasi mudah dipahami.
* Feedback informatif.
* Perhitungan transparan.
* Tidak ada tombol tanpa fungsi.
* Tidak ada placeholder yang diklaim selesai.

---

# **14\. TESTING STRATEGY**

## **Unit Testing — Vitest**

Uji:

* Parser.
* Validator.
* Classifier.
* Binary converter.
* Subnet calculator.
* Network address.
* Broadcast address.
* Host calculation.
* Special address handling.

## **Component Testing — React Testing Library**

Uji:

* Input.
* Button.
* Select.
* Status alert.
* Binary visualization.
* Result panel.
* Practice question.
* Quiz navigation.

## **E2E Testing — Playwright**

Skenario:

1. Membuka beranda.
2. Membuka materi.
3. Membaca materi.
4. Membuka simulator.
5. Memasukkan IPv4.
6. Menghitung hasil.
7. Memeriksa visualisasi.
8. Mengerjakan latihan.
9. Mengikuti kuis.
10. Melihat hasil.
11. Login.
12. Memeriksa progres.

## **Responsive Testing**

320px, 375px, 390px, 768px, 1024px, 1280px, dan 1440px.

---

# **15\. ACCEPTANCE CRITERIA**

Produk dinyatakan selesai apabila:

1. Memiliki lima halaman utama.
2. Target pembelajaran sesuai mahasiswa PTIK UNNES.
3. Simulator mendukung identifikasi kelas A–E.
4. Materi, latihan, dan kuis berfokus pada Kelas C.
5. Perhitungan IPv4 akurat.
6. Kelas D dan E ditangani secara khusus.
7. Input CIDR dan subnet mask berfungsi.
8. Visualisasi biner 32-bit akurat.
9. Langkah perhitungan dapat dipahami.
10. Latihan memiliki feedback.
11. Kuis menghasilkan penilaian otomatis.
12. Warna status konsisten.
13. Guest mode berjalan.
14. Autentikasi dan progres tersimpan.
15. Database memiliki security rules.
16. Website responsif.
17. Tidak ada tombol mati.
18. Tidak ada placeholder yang diklaim selesai.
19. Tidak ada error kritis.
20. Unit test inti lulus.
21. Dokumentasi instalasi tersedia.

---

# **16\. DEVELOPMENT ROADMAP**

**Phase 1 — Product Planning**

* Analisis kebutuhan.
* Sitemap.
* User flow.
* Wireframe.
* Design system.
* Database schema.
* Architecture planning.

**Phase 2 — Project Foundation**

* Next.js.
* TypeScript.
* Tailwind CSS.
* shadcn/ui.
* ESLint.
* Prettier.
* GitHub.

**Phase 3 — Design Implementation**

* Navbar.
* Footer.
* Layout.
* Typography.
* Buttons.
* Inputs.
* Status components.
* Responsive navigation.

**Phase 4 — IPv4 Engine**

* Parser.
* Validator.
* Classifier.
* Binary converter.
* Subnet calculator.
* Special address handling.
* Unit tests.

**Phase 5 — Main Features**

* Beranda.
* Materi.
* Simulator.
* Latihan.
* Kuis.

**Phase 6 — Backend Integration**

* Firebase.
* Authentication.
* Firestore.
* Progress.
* Quiz attempts.
* Simulator history.

**Phase 7 — Quality Assurance**

* Unit testing.
* Component testing.
* E2E testing.
* Responsive audit.
* Accessibility audit.
* Performance audit.
* Security review.

**Phase 8 — Deployment**

* GitHub.
* Vercel.
* Firebase production configuration.
* Environment variables.
* Production verification.

---

# **17\. ANTI-AI-SLOP QUALITY STANDARD**

## **Visual Quality**

* Jangan membuat dashboard generik.
* Jangan menggunakan gradient berlebihan.
* Jangan membuat seluruh elemen menjadi card.
* Jangan menggunakan emoji sebagai ikon utama.
* Jangan membuat setiap section memiliki komposisi yang sama.
* Jangan menggunakan dekorasi tanpa fungsi.
* Jangan menambahkan animasi berlebihan.
* Jangan menampilkan statistik fiktif.
* Jangan menggunakan placeholder sebagai konten final.

## **UX Quality**

* Setiap halaman harus memiliki tujuan jelas.
* Setiap tombol harus berfungsi.
* Setiap form memiliki validasi.
* Setiap error memiliki penjelasan.
* Setiap hasil perhitungan memiliki konteks.
* Setiap interaksi memiliki feedback.
* Simulator tidak memerlukan login.
* Informasi penting tidak boleh disembunyikan.

## **Engineering Quality**

* Jangan membuat seluruh aplikasi dalam satu file.
* Jangan mencampurkan business logic dan UI.
* Jangan menggunakan hasil hardcoded untuk simulator.
* Jangan menggunakan any tanpa alasan.
* Jangan menduplikasi fungsi.
* Jangan menambah dependency tanpa kebutuhan.
* Jangan mengabaikan error handling.
* Jangan mengabaikan testing.
* Jangan mengklaim fitur selesai sebelum diuji.

## **Final Quality Gate**

Sebelum fitur dinyatakan selesai:

* UI sesuai design system.
* Responsive.
* Tidak ada horizontal overflow.
* Tidak ada tombol mati.
* Tidak ada placeholder.
* Tidak ada error kritis.
* Validasi berjalan.
* Data akurat.
* Unit test terkait lulus.
* Interaksi telah diuji.

---

# **18\. FINAL PRODUCT DEFINITION**

SubnetLab IPv4 merupakan platform pembelajaran berbasis web yang dikembangkan untuk mendukung mahasiswa Pendidikan Teknik Informatika dan Komputer Universitas Negeri Semarang dalam memahami pengalamatan IPv4 pada mata kuliah Jaringan Komputer.

Platform menggabungkan:

* Materi IPv4 Kelas C.
* Simulator IPv4 kelas A–E.
* Visualisasi biner 32-bit.
* Penjelasan perhitungan subnet.
* Latihan Kelas C.
* Kuis Kelas C.
* Autentikasi pengguna.
* Penyimpanan progres.
* Riwayat evaluasi.
* Responsive UI/UX.
* Full-stack modular architecture.

**Product Principle:**

SubnetLab IPv4 tidak sekadar menampilkan hasil perhitungan, tetapi membantu mahasiswa memahami proses, konsep, dan alasan teknis di balik setiap hasil perhitungan IPv4.

**Final Technology Stack:**

Next.js App Router \+ TypeScript \+ Tailwind CSS \+ shadcn/ui \+ Firebase Authentication \+ Cloud Firestore \+ Vercel \+ Vitest \+ React Testing Library \+ Playwright.
