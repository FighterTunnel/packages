# Dokumentasi Lengkap API FighterTunnel Script

## Deskripsi

API FighterTunnel Script adalah aplikasi server berbasis Node.js yang menggunakan framework Express.js. Aplikasi ini dirancang untuk membuat, mengelola, dan menghapus akun untuk berbagai protokol seperti SSH, VMess, VLESS, dan Shadowsocks. Untuk keamanan, aplikasi ini memerlukan autentikasi dengan kata sandi yang disimpan di file `/root/.key`.

## Rute API

### Middleware

#### `checkPassword`
Middleware ini bertugas untuk memverifikasi kata sandi yang dikirimkan melalui query parameter `auth`. Jika kata sandi yang diberikan tidak sesuai dengan yang disimpan di file `/root/.key`, maka akses ke rute akan ditolak dengan mengembalikan pesan kesalahan.

### Rute

#### `GET /createssh`
Rute ini digunakan untuk membuat akun SSH baru. Pengguna harus menyediakan parameter yang diperlukan untuk membuat akun.

**Query Parameters:**
- `user` (string): Nama pengguna untuk akun SSH.
- `password` (string): Kata sandi untuk akun SSH.
- `exp` (string): Tanggal kedaluwarsa akun SSH dalam format YYYY-MM-DD.
- `iplimit` (string): Batasan jumlah IP yang dapat menggunakan akun SSH.
- `auth` (string): Kata sandi autentikasi untuk mengakses rute ini.

**Contoh Permintaan:**
```http
GET /createssh?user=testuser&password=testpass&exp=2023-12-31&iplimit=1&auth=yourpassword
```

**Contoh Respons:**
```json
{
  "message": "Akun SSH berhasil dibuat untuk user: testuser"
}
```

#### `DELETE /deletessh`
Rute ini digunakan untuk menghapus akun SSH yang ada. Pengguna harus menyediakan nama pengguna dan kata sandi autentikasi.

**Query Parameters:**
- `user` (string): Nama pengguna untuk akun SSH yang akan dihapus.
- `auth` (string): Kata sandi autentikasi untuk mengakses rute ini.

**Contoh Permintaan:**
```http
DELETE /deletessh?user=testuser&auth=yourpassword
```

**Contoh Respons:**
```json
{
  "message": "Akun SSH berhasil dihapus untuk user: testuser"
}
```

#### `GET /createvmess`
Rute ini digunakan untuk membuat akun VMess baru. Parameter yang diperlukan harus disediakan oleh pengguna.

**Query Parameters:**
- `user` (string): Nama pengguna untuk akun VMess.
- `password` (string): Kata sandi untuk akun VMess.
- `exp` (string): Tanggal kedaluwarsa akun VMess.
- `auth` (string): Kata sandi autentikasi untuk mengakses rute ini.

**Contoh Permintaan:**
```http
GET /createvmess?user=testuser&password=testpass&exp=2023-12-31&auth=yourpassword
```

**Contoh Respons:**
```json
{
  "message": "Akun VMess berhasil dibuat untuk user: testuser"
}
```

#### `DELETE /deletevmess`
Rute ini digunakan untuk menghapus akun VMess yang ada. Pengguna harus menyediakan nama pengguna dan kata sandi autentikasi.

**Query Parameters:**
- `user` (string): Nama pengguna untuk akun VMess yang akan dihapus.
- `auth` (string): Kata sandi autentikasi untuk mengakses rute ini.

**Contoh Permintaan:**
```http
DELETE /deletevmess?user=testuser&auth=yourpassword
```

**Contoh Respons:**
```json
{
  "message": "Akun VMess berhasil dihapus untuk user: testuser"
}
```

#### `GET /createvless`
Rute ini digunakan untuk membuat akun VLESS baru. Pengguna harus menyediakan parameter yang diperlukan.

**Query Parameters:**
- `user` (string): Nama pengguna untuk akun VLESS.
- `password` (string): Kata sandi untuk akun VLESS.
- `exp` (string): Tanggal kedaluwarsa akun VLESS.
- `auth` (string): Kata sandi autentikasi untuk mengakses rute ini.

**Contoh Permintaan:**
```http
GET /createvless?user=testuser&password=testpass&exp=2023-12-31&auth=yourpassword
```

**Contoh Respons:**
```json
{
  "message": "Akun VLESS berhasil dibuat untuk user: testuser"
}
```

#### `DELETE /deletevless`
Rute ini digunakan untuk menghapus akun VLESS yang ada. Pengguna harus menyediakan nama pengguna dan kata sandi autentikasi.

**Query Parameters:**
- `user` (string): Nama pengguna untuk akun VLESS yang akan dihapus.
- `auth` (string): Kata sandi autentikasi untuk mengakses rute ini.

**Contoh Permintaan:**
```http
DELETE /deletevless?user=testuser&auth=yourpassword
```

**Contoh Respons:**
```json
{
  "message": "Akun VLESS berhasil dihapus untuk user: testuser"
}
```

#### `GET /createshadowsocks`
Rute ini digunakan untuk membuat akun Shadowsocks baru. Parameter yang diperlukan harus disediakan oleh pengguna.

**Query Parameters:**
- `user` (string): Nama pengguna untuk akun Shadowsocks.
- `password` (string): Kata sandi untuk akun Shadowsocks.
- `exp` (string): Tanggal kedaluwarsa akun Shadowsocks.
- `auth` (string): Kata sandi autentikasi untuk mengakses rute ini.

**Contoh Permintaan:**
```http
GET /createshadowsocks?user=testuser&password=testpass&exp=2023-12-31&auth=yourpassword
```

**Contoh Respons:**
```json
{
  "message": "Akun Shadowsocks berhasil dibuat untuk user: testuser"
}
```

#### `DELETE /deleteshadowsocks`
Rute ini digunakan untuk menghapus akun Shadowsocks yang ada. Pengguna harus menyediakan nama pengguna dan kata sandi autentikasi.

**Query Parameters:**
- `user` (string): Nama pengguna untuk akun Shadowsocks yang akan dihapus.
- `auth` (string): Kata sandi autentikasi untuk mengakses rute ini.

**Contoh Permintaan:**
```http
DELETE /deleteshadowsocks?user=testuser&auth=yourpassword
```

**Contoh Respons:**
```json
{
  "message": "Akun Shadowsocks berhasil dihapus untuk user: testuser"
}
```

### Kesalahan
- Jika parameter `user`, `password`, `exp`, atau `iplimit` tidak disediakan, respons akan berupa:
```json
{
  "error": "Username, expiry, iplimit, dan password diperlukan"
}
```
- Jika kata sandi autentikasi salah, respons akan berupa:
```html
<html>
<body>
<h1 style="text-align: center;">Akses Ditolak</h1>
<p style="text-align: center;">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
</body>
</html>
```
- Jika terjadi kesalahan saat membuat akun, respons akan berupa:
```json
{
  "error": "Terjadi kesalahan saat membuat akun",
  "detail": "Detail kesalahan"
}
```

## Cara Menggunakan

1. Gunakan rute `GET /createssh`, `DELETE /deletessh`, `GET /createvmess`, `DELETE /deletevmess`, `GET /createvless`, `DELETE /deletevless`, `GET /createshadowsocks`, atau `DELETE /deleteshadowsocks` untuk mengelola akun dengan menyertakan parameter yang diperlukan.

## Catatan Tambahan
- Pastikan server memiliki izin untuk membaca file `/root/.key`.
- Selalu perbarui kata sandi autentikasi secara berkala untuk menjaga keamanan.
- Periksa log server untuk informasi lebih lanjut jika terjadi kesalahan.
