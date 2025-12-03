## Jawaban Pertanyaan

1. **Apa itu REST API?**  
   REST API itu gaya bikin API yang pakai HTTP (GET, POST, PUT, DELETE, dll) dan resource diwakili lewat URL. Data biasanya dikirim dalam format JSON, dan server gak simpan state session di memory (stateless), jadi tiap request harus bawa semua informasi yang dibutuhkan (misalnya token).

2. **Apa itu CORS dan bagaimana menanganinya di backend?**  
   CORS (Cross Origin Resource Sharing) itu aturan browser soal boleh atau tidaknya sebuah website mengakses resource dari domain asal lain. Di backend, kita biasa atur CORS dengan men set header seperti `Access Control Allow Origin`, `Access Control Allow Methods`, dan `Access Control Allow Headers`, atau lebih praktis lagi pakai middleware CORS (misalnya di Next.js sudah ada built-in CORS support) dan whitelist origin yang diizinkan.

3. **Perbedaan SQL dan NoSQL database**  
   SQL (misal: MySQL, PostgreSQL) pakai schema yang terstruktur (tabel, kolom, relasi) dan cocok untuk data yang rapi dan konsisten, plus punya ACID properties yang bagus untuk transaksi penting. NoSQL (misal: MongoDB) schema nya lebih longgar (dokumen/collection), cocok untuk data yang bentuknya bisa berubah atau butuh scaling yang besar, tapi dari sisi konsisten terhadap datanya (misalnya Trade Off) lebih lemah dibanding SQL.

4. **Apa yang diketahui tentang middleware?**  
   Middleware itu fungsi yang dijalankan di antara request masuk dan response keluar. Di backend (misalnya Next.js API routes), middleware dipakai buat hal-hal seperti: logging, parsing body request, validasi, autentikasi (cek JWT), handle error, dan sebagainya, sebelum request diteruskan ke handler utama.


## Project

Project ini pakai Next.js + PostgreSQL. Ada 2 tabel: `users` (id, email, password_hash) dan `todos` (id, title, description, is_done, user_id).

Endpoint yang tersedia:
- `POST /api/auth/register` - register user baru
- `POST /api/auth/login` - login, dapat token JWT
- `GET /api/todos` - ambil semua todo user yang login
- `POST /api/todos` - tambah todo baru
- `GET /api/todos/:id` - ambil detail todo
- `PUT /api/todos/:id` - update todo
- `DELETE /api/todos/:id` - hapus todo

Untuk endpoint todos, perlu header `Authorization: Bearer <token>`. User cuma bisa akses todo miliknya sendiri.



