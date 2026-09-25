# Portofolio 3D alfachridzy

Portofolio interaktif berbasis Three.js milik alfachridzy, siswa kelas XI TKJ. Jelajahi ruang 3D, proyek, mesin arcade, papan tulis, kubus Rubik, dan panel kontak.

## Menjalankan secara lokal

Gunakan Node.js, lalu jalankan:

```sh
npm install
npm run dev
```

Untuk membuat hasil produksi:

```sh
npm run build
```

## Formulir kontak

Formulir mengirim data dengan metode `POST` ke Web3Forms. Buat access key pada akun Web3Forms, lalu salin `.env.example` menjadi `.env` dan isi nilainya:

```text
VITE_WEB3FORMS_ACCESS_KEY=access_key_dari_web3forms
```

Anda juga dapat mengatur variabel lingkungan `VITE_WEB3FORMS_ACCESS_KEY` sebelum menjalankan perintah build. `.env` diabaikan oleh Git. Web3Forms mengaitkan access key dengan alamat tujuan yang dikonfigurasi di akun Web3Forms.

Formulir berjalan pada browser, jadi key yang disertakan ke hasil build dapat dibaca dari bundle oleh pengunjung. Jangan gunakan key server rahasia; batasi dan rotasi access key melalui akun Web3Forms jika diperlukan.

## Navigasi

- **Tentang Saya** — informasi yang disediakan: nama, kelas, minat, dan email.
- **Proyek** — tempat menampilkan proyek ketika sudah tersedia.
- **Mesin Arcade**, **Papan Tulis**, dan **Kubus Rubik** — interaksi 3D bawaan.
- **Kontak** — formulir Web3Forms, email langsung, dan tombol salin email.

## Lisensi

Kode dan aset turunan proyek sumber mengikuti lisensi MIT yang disertakan. Aset pihak ketiga tetap mengikuti ketentuan masing-masing pemilik.
