# Portofolio 3D alfachridzy

Portofolio interaktif berbasis Three.js milik alfachridzy, siswa kelas XI TKJ. Jelajahi ruang 3D, proyek, mesin arcade, papan tulis, kubus Rubik, dan panel kontak.

## Menjalankan secara lokal

Gunakan Node.js, lalu jalankan untuk antarmuka lokal:

```sh
npm install
npm run dev
```

Untuk menguji formulir beserta fungsi server Vercel, hubungkan folder ini ke proyek Vercel dengan `vercel link`, lalu jalankan `npm run dev:vercel`.

Untuk membuat hasil produksi:

```sh
npm run build
```

## Formulir kontak

Formulir mengirim data ke fungsi server `/api/contact`, lalu fungsi meneruskan permintaan `POST` ke Web3Forms. Buat access key pada akun Web3Forms, lalu salin `.env.example` menjadi `.env.local` untuk pengembangan lokal dan isi nilainya:

```text
WEB3FORMS_ACCESS_KEY=access_key_dari_web3forms
```

Untuk produksi, atur `WEB3FORMS_ACCESS_KEY` di pengaturan Environment Variables proyek Vercel sebagai nilai sensitif. Jangan awali nama variabel dengan `VITE_` atau `NEXT_PUBLIC_`; fungsi server membaca key saat dijalankan dan tidak memasukkannya ke bundle browser. File `.env` dan `.env.local` diabaikan oleh Git. Web3Forms mengaitkan access key dengan alamat tujuan yang dikonfigurasi di akun Web3Forms.

Alamat email kontak pada panel tetap ditampilkan secara publik sesuai tujuan portofolio dan tautan `mailto:`.

## Navigasi

- **Tentang Saya** — informasi yang disediakan: nama, kelas, minat, dan email.
- **Proyek** — tempat menampilkan proyek ketika sudah tersedia.
- **Mesin Arcade**, **Papan Tulis**, dan **Kubus Rubik** — interaksi 3D bawaan.
- **Kontak** — formulir Web3Forms, email langsung, dan tombol salin email.

## Lisensi

Kode dan aset turunan proyek sumber mengikuti lisensi MIT yang disertakan. Aset pihak ketiga tetap mengikuti ketentuan masing-masing pemilik.
