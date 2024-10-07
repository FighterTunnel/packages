const os = require('os');
const { exec, execSync, spawn } = require('child_process');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware untuk memeriksa kata sandi
const checkPassword = (req, res, next) => {
  const { auth } = req.query;
  const correctPassword = fs.readFileSync('/root/.key', 'utf8').trim(); // Membaca kata sandi dari /root/.key
  
  if (auth !== correctPassword) {
    return res.status(401).send('<html><body><h1 style="text-align: center;">Akses Ditolak</h1><p style="text-align: center;">Anda tidak memiliki izin untuk mengakses halaman ini.</p></body></html>');
  }
  
  next();
};

// Terapkan middleware checkPassword ke semua rute
app.use(checkPassword);

// Create ssh user
app.get("/createssh", (req, res) => {
  const { user, password, exp, iplimit } = req.query;
  if (!user || !password || !exp || !iplimit) {
    return res.status(400).json({ error: 'Username, expiry, iplimit, dan password diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk membuat akun SSH dengan user: ${user}, exp: ${exp}, iplimit: ${iplimit}, password: ${password}`);
  
  const child = spawn("/bin/bash", ["-c", `apicreate ssh ${user} ${password} ${exp} ${iplimit}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pembuatan akun SSH gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat membuat akun', detail: output });
    }
    console.log(`Akun SSH berhasil dibuat untuk user: ${user}`);
    
    try {
      const jsonResponse = JSON.parse(output);
      if (jsonResponse.status === "success") {
        res.json({
          status: "success",
          message: "SSH account successfully created",
          data: {
            username: jsonResponse.data.username,
            password: jsonResponse.data.password,
            expired: jsonResponse.data.expired,            
            ip_limit: jsonResponse.data.ip_limit,
            domain: jsonResponse.data.domain,
            ns_domain: jsonResponse.data.ns_domain,
            city: jsonResponse.data.city,
            pubkey: jsonResponse.data.pubkey
          }
        });
      } else {
        res.status(500).json({ error: "Gagal membuat akun SSH", detail: jsonResponse.message });
      }
    } catch (err) {
      console.error(`Kesalahan parsing JSON: ${err}`);
      res.status(500).json({ error: "Terjadi kesalahan saat memproses hasil", detail: err.message });
    }
  });
});

// Create vmess user
app.get("/createvmess", (req, res) => {
  const { user, exp, quota, iplimit } = req.query;
  if (!user || !exp || !quota || !iplimit) {
    return res.status(400).json({ error: 'Username, expiry, quota, dan iplimit diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk membuat akun VMess dengan user: ${user}, exp: ${exp}, quota: ${quota}, iplimit: ${iplimit}`);
  
  const child = spawn("/bin/bash", ["-c", `apicreate vmess ${user} ${exp} ${quota} ${iplimit}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pembuatan akun VMess gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat membuat akun', detail: output });
    }
    console.log(`Akun VMess berhasil dibuat untuk user: ${user}`);
    
    try {
      const jsonResponse = JSON.parse(output);
      if (jsonResponse.status === "success") {
        res.json({
          status: "success",
          message: "Vmess account successfully created",
          data: {
            username: jsonResponse.data.username,
            expired: jsonResponse.data.expired,
            uuid: jsonResponse.data.uuid,
            quota: jsonResponse.data.quota,
            ip_limit: jsonResponse.data.ip_limit,
            domain: jsonResponse.data.domain,
            ns_domain: jsonResponse.data.ns_domain,
            city: jsonResponse.data.city,
            pubkey: jsonResponse.data.pubkey,
            vmess_tls_link: jsonResponse.data.vmess_tls_link,
            vmess_nontls_link: jsonResponse.data.vmess_nontls_link,
            vmess_grpc_link: jsonResponse.data.vmess_grpc_link
          }
        });
      } else {
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat akun', detail: jsonResponse.message });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});


// Create vless user
app.get("/createvless", (req, res) => {
  const { user, exp, quota, iplimit } = req.query;
  if (!user || !exp || !quota || !iplimit) {
    return res.status(400).json({ error: 'Username, expiry, quota, dan iplimit diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk membuat akun VLESS dengan user: ${user}, exp: ${exp}, quota: ${quota}, iplimit: ${iplimit}`);
  
  const child = spawn("/bin/bash", ["-c", `apicreate vless ${user} ${exp} ${quota} ${iplimit}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pembuatan akun VLESS gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat membuat akun', detail: output });
    }
    console.log(`Akun VLESS berhasil dibuat untuk user: ${user}`);
    
    try {
      const jsonResponse = JSON.parse(output);
      if (jsonResponse.status === "success") {
        res.json({
          status: "success",
          message: "VLESS account successfully created",
          data: {
            username: jsonResponse.data.username,
            expired: jsonResponse.data.expired,
            uuid: jsonResponse.data.uuid,
            quota: jsonResponse.data.quota,
            ip_limit: jsonResponse.data.ip_limit,
            domain: jsonResponse.data.domain,
            ns_domain: jsonResponse.data.ns_domain,
            city: jsonResponse.data.city,
            pubkey: jsonResponse.data.pubkey,
            vless_tls_link: jsonResponse.data.vless_tls_link,
            vless_nontls_link: jsonResponse.data.vless_nontls_link,
            vless_grpc_link: jsonResponse.data.vless_grpc_link
          }
        });
      } else {
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat akun', detail: jsonResponse.message });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});

// Create trojan user
app.get("/createtrojan", (req, res) => {
  const { user, exp, quota, iplimit } = req.query;
  if (!user || !exp || !quota || !iplimit) {
    return res.status(400).json({ error: 'Username, expiry, quota, dan iplimit diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk membuat akun Trojan dengan user: ${user}, exp: ${exp}, quota: ${quota}, iplimit: ${iplimit}`);
  
  const child = spawn("/bin/bash", ["-c", `apicreate trojan ${user} ${exp} ${quota} ${iplimit}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pembuatan akun Trojan gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat membuat akun', detail: output });
    }
    console.log(`Akun Trojan berhasil dibuat untuk user: ${user}`);
    
    try {
      const jsonResponse = JSON.parse(output);
      if (jsonResponse.status === "success") {
        res.json({
          status: "success",
          message: "Trojan account successfully created",
          data: {
            username: jsonResponse.data.username,
            expired: jsonResponse.data.expired,
            uuid: jsonResponse.data.uuid,
            quota: jsonResponse.data.quota,
            ip_limit: jsonResponse.data.ip_limit,
            domain: jsonResponse.data.domain,
            ns_domain: jsonResponse.data.ns_domain,
            city: jsonResponse.data.city,
            pubkey: jsonResponse.data.pubkey,
            trojan_tls_link: jsonResponse.data.trojan_tls_link,
            trojan_grpc_link: jsonResponse.data.trojan_grpc_link
          }
        });
      } else {
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat akun', detail: jsonResponse.message });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});


// Create shadowsocks user
app.get("/createshadowsocks", (req, res) => {
  const { user, exp, quota, iplimit } = req.query;
  if (!user || !exp || !quota || !iplimit) {
    return res.status(400).json({ error: 'Username, expiry, quota, dan iplimit diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk membuat akun Shadowsocks dengan user: ${user}, exp: ${exp}, quota: ${quota}, iplimit: ${iplimit}`);
  
  const child = spawn("/bin/bash", ["-c", `apicreate shadowsocks ${user} ${exp} ${quota} ${iplimit}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pembuatan akun Shadowsocks gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat membuat akun', detail: output });
    }
    console.log(`Akun Shadowsocks berhasil dibuat untuk user: ${user}`);
    
    try {
      const jsonResponse = JSON.parse(output);
      if (jsonResponse.status === "success") {
        res.json({
          status: "success",
          message: "Shadowsocks account successfully created",
          data: {
            username: jsonResponse.data.username,
            expired: jsonResponse.data.expired,
            password: jsonResponse.data.password,
            method: jsonResponse.data.method,
            quota: jsonResponse.data.quota,
            ip_limit: jsonResponse.data.ip_limit,
            domain: jsonResponse.data.domain,
            ns_domain: jsonResponse.data.ns_domain,
            city: jsonResponse.data.city,
            pubkey: jsonResponse.data.pubkey,
            ss_link_ws: jsonResponse.data.ss_link_ws,
            ss_link_grpc: jsonResponse.data.ss_link_grpc
          }
        });
      } else {
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat akun', detail: jsonResponse.message });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});
// Check SSH user
app.get("/checkssh", (req, res) => { 
  
  const child = spawn("/bin/bash", ["-c", `apicheck ssh`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pemeriksaan akun SSH gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat memeriksa akun', detail: output });
    }
    console.log(`Akun SSH berhasil diperiksa`);
    try {
      // Menghapus koma ekstra sebelum mem-parsing JSON
      const cleanedOutput = output.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      const jsonResponse = JSON.parse(cleanedOutput);
      if (jsonResponse.status === "success" && jsonResponse.data) {
        res.json({
          status: "success",
          message: jsonResponse.data.message,
          data: jsonResponse.data
        });
      } else {
        res.status(404).json({ error: 'Akun SSH tidak ditemukan' });
      }
    } catch (error) {
      console.error(`Error parsing JSON: ${error}`);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});

app.get("/checkvmess", (req, res) => { 

  console.log(`Menerima permintaan untuk memeriksa akun VMess dengan user: `);
  
  const child = spawn("/bin/bash", ["-c", `apicheck vmess`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pemeriksaan akun VMess gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat memeriksa akun', detail: output });
    }
    console.log(`Akun VMess berhasil diperiksa`);
    
    try {
      // Menghapus koma ekstra sebelum mem-parsing JSON
      const cleanedOutput = output.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      const jsonResponse = JSON.parse(cleanedOutput);
      if (jsonResponse.status === "success" && jsonResponse.data) {
        res.json({
          status: "success",
          message: jsonResponse.data.message,
          data: jsonResponse.data
        });
      } else {
        res.status(404).json({ error: 'Akun VMess tidak ditemukan' });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});
app.get("/checkvless", (req, res) => { 

  console.log(`Menerima permintaan untuk memeriksa akun VLESS dengan user: `);
  
  const child = spawn("/bin/bash", ["-c", `apicheck vless`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pemeriksaan akun VLESS gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat memeriksa akun', detail: output });
    }
    console.log(`Akun VLESS berhasil diperiksa`);
    
    try {
      // Menghapus koma ekstra sebelum mem-parsing JSON
      const cleanedOutput = output.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      const jsonResponse = JSON.parse(cleanedOutput);
      if (jsonResponse.status === "success" && jsonResponse.data) {
        res.json({
          status: "success",
          message: jsonResponse.data.message,
          data: jsonResponse.data
        });
      } else {
        res.status(404).json({ error: 'Akun VLESS tidak ditemukan' });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});

app.get("/checktrojan", (req, res) => { 

  console.log(`Menerima permintaan untuk memeriksa akun Trojan dengan user: `);
  
  const child = spawn("/bin/bash", ["-c", `apicheck trojan`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pemeriksaan akun Trojan gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat memeriksa akun', detail: output });
    }
    console.log(`Akun Trojan berhasil diperiksa`);
    
    try {
      // Menghapus koma ekstra sebelum mem-parsing JSON
      const cleanedOutput = output.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      const jsonResponse = JSON.parse(cleanedOutput);
      if (jsonResponse.status === "success" && jsonResponse.data) {
        res.json({
          status: "success",
          message: jsonResponse.data.message,
          data: jsonResponse.data
        });
      } else {
        res.status(404).json({ error: 'Akun Trojan tidak ditemukan' });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});

app.get("/checkshadowsocks", (req, res) => { 

  console.log(`Menerima permintaan untuk memeriksa akun Shadowsocks dengan user: `);
  
  const child = spawn("/bin/bash", ["-c", `apicheck shadowsocks`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pemeriksaan akun Shadowsocks gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat memeriksa akun', detail: output });
    }
    console.log(`Akun Shadowsocks berhasil diperiksa`);
    
    try {
      // Menghapus koma ekstra sebelum mem-parsing JSON
      const cleanedOutput = output.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      const jsonResponse = JSON.parse(cleanedOutput);
      if (jsonResponse.status === "success" && jsonResponse.data) {
        res.json({
          status: "success",
          message: jsonResponse.data.message,
          data: jsonResponse.data
        });
      } else {
        res.status(404).json({ error: 'Akun Shadowsocks tidak ditemukan' });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});

// delete user ssh
app.get("/deletessh", (req, res) => {
  const { user } = req.query;
  if (!user) {
    return res.status(400).json({ error: 'Username diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk menghapus akun SSH dengan user: ${user}`);
  
  const child = spawn("/bin/bash", ["-c", `apidelete ssh ${user}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses penghapusan akun SSH gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat menghapus akun', detail: output });
    }
    console.log(`Akun SSH berhasil dihapus untuk user: ${user}`);
    
    try {
      // Menghapus koma ekstra sebelum mem-parsing JSON
      const cleanedOutput = output.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      const jsonResponse = JSON.parse(cleanedOutput);
      if (jsonResponse.status === "success" && jsonResponse.data) {
        res.json({
          status: "success",
          message: jsonResponse.data.message,
          data: jsonResponse.data
        });
      } else {
        res.status(404).json({ error: 'Akun SSH tidak ditemukan' });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});
// delete user vmess
app.get("/deletevmess", (req, res) => {
  const { user } = req.query;
  if (!user) {
    return res.status(400).json({ error: 'Username diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk menghapus akun VMess dengan user: ${user}`);
  
  const child = spawn("/bin/bash", ["-c", `apidelete vmess ${user}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses penghapusan akun VMess gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat menghapus akun', detail: output });
    }
    console.log(`Akun VMess berhasil dihapus untuk user: ${user}`);
    
      // Menghapus koma ekstra sebelum mem-parsing JSON
      try {
        const cleanedOutput = output.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        const jsonResponse = JSON.parse(cleanedOutput);
        if (jsonResponse.status === "success" && jsonResponse.data) {
          res.json({
            status: "success",
            message: jsonResponse.data.message,
            data: jsonResponse.data
          });
        } else {
          res.status(404).json({ error: 'Akun VMess tidak ditemukan' });
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
      }
    });
});

// delete user vless
app.get("/deletevless", (req, res) => {
  const { user } = req.query;
  if (!user) {
    return res.status(400).json({ error: 'Username diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk menghapus akun VLess dengan user: ${user}`);
  
  const child = spawn("/bin/bash", ["-c", `apidelete vless ${user}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses penghapusan akun VLess gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat menghapus akun', detail: output });
    }
    console.log(`Akun VLess berhasil dihapus untuk user: ${user}`);
    
    
    try {
      const cleanedOutput = output.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      const jsonResponse = JSON.parse(cleanedOutput);
      if (jsonResponse.status === "success" && jsonResponse.data) {
        res.json({
          status: "success",
          message: jsonResponse.data.message,
          data: jsonResponse.data
        });
      } else {
        res.status(404).json({ error: 'Akun VLess tidak ditemukan' });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});
// delete user trojan
app.get("/deletetrojan", (req, res) => {
  const { user } = req.query;
  if (!user) {
    return res.status(400).json({ error: 'Username diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk menghapus akun Trojan dengan user: ${user}`);
  
  const child = spawn("/bin/bash", ["-c", `apidelete trojan ${user}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses penghapusan akun Trojan gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat menghapus akun', detail: output });
    }
    console.log(`Akun Trojan berhasil dihapus untuk user: ${user}`);
    
    
    try {
      const cleanedOutput = output.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      const jsonResponse = JSON.parse(cleanedOutput);
      if (jsonResponse.status === "success" && jsonResponse.data) {
        res.json({
          status: "success",
          message: jsonResponse.data.message,
          data: jsonResponse.data
        });
      } else {
        res.status(404).json({ error: 'Akun Trojan tidak ditemukan' });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});
// delete user shadowsocks
app.get("/deleteshadowsocks", (req, res) => {
  const { user } = req.query;
  if (!user) {
    return res.status(400).json({ error: 'Username diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk menghapus akun Shadowsocks dengan user: ${user}`);
  
  const child = spawn("/bin/bash", ["-c", `apidelete shadowsocks ${user}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses penghapusan akun Shadowsocks gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat menghapus akun', detail: output });
    }
    console.log(`Akun Shadowsocks berhasil dihapus untuk user: ${user}`);
    
    try {
      const cleanedOutput = output.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      const jsonResponse = JSON.parse(cleanedOutput);
      if (jsonResponse.status === "success" && jsonResponse.data) {
        res.json({
          status: "success",
          message: jsonResponse.data.message,
          data: jsonResponse.data
        });
      } else {
        res.status(404).json({ error: 'Akun Shadowsocks tidak ditemukan' });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});
// Renew ssh user
app.get("/renewssh", (req, res) => {
  const { user, exp, iplimit } = req.query;
  if (!user || !exp || !iplimit) {
    return res.status(400).json({ error: 'Username, expiry, dan iplimit diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk memperbarui akun SSH dengan user: ${user}, exp: ${exp}, iplimit: ${iplimit}`);
  
  const child = spawn("/bin/bash", ["-c", `apirenew ssh ${user} ${exp} ${iplimit}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pembaruan akun SSH gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui akun', detail: output });
    }
    console.log(`Akun SSH berhasil diperbarui untuk user: ${user}`);
    try {
      const jsonResponse = JSON.parse(output);
      if (jsonResponse.status === "success") {
        res.json({
          status: "success",
          message: "Akun Vmess test berhasil diperbarui",
          data: {
            username: jsonResponse.data.username,
            exp: jsonResponse.data.exp,
            limitip: jsonResponse.data.limitip
          }
        });
      } else {
        res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui akun', detail: jsonResponse.message });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});
// Renew vmess user
app.get("/renewvmess", (req, res) => {
  const { user, exp, quota, iplimit } = req.query;
  if (!user || !exp || !quota || !iplimit) {
    return res.status(400).json({ error: 'Username, expiry, quota, dan iplimit diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk memperbarui akun VMess dengan user: ${user}, exp: ${exp}, quota: ${quota}, iplimit: ${iplimit}`);
  
  const child = spawn("/bin/bash", ["-c", `apirenew vmess ${user} ${exp} ${quota} ${iplimit}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pembaruan akun VMess gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui akun', detail: output });
    }
    console.log(`Akun VMess berhasil diperbarui untuk user: ${user}`);
    try {
      const jsonResponse = JSON.parse(output);
      if (jsonResponse.status === "success") {
        res.json({
          status: "success",
          message: "Akun Vmess test berhasil diperbarui",
          data: {
            username: jsonResponse.data.username,
            exp: jsonResponse.data.exp,
            quota: jsonResponse.data.quota,
            limitip: jsonResponse.data.limitip
          }
        });
      } else {
        res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui akun', detail: jsonResponse.message });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});

// Renew vless user
app.get("/renewvless", (req, res) => {
  const { user, exp, quota, iplimit } = req.query;
  if (!user || !exp || !quota || !iplimit) {
    return res.status(400).json({ error: 'Username, expiry, quota, dan iplimit diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk memperbarui akun VLess dengan user: ${user}, exp: ${exp}, quota: ${quota}, iplimit: ${iplimit}`);
  
  const child = spawn("/bin/bash", ["-c", `apirenew vless ${user} ${exp} ${quota} ${iplimit}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pembaruan akun VLess gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui akun', detail: output });
    }
    console.log(`Akun VLess berhasil diperbarui untuk user: ${user}`);
    
    try {
      const jsonResponse = JSON.parse(output);
      if (jsonResponse.status === "success") {
        res.json({
          status: "success",
          message: "Akun Vmess test berhasil diperbarui",
          data: {
            username: jsonResponse.data.username,
            exp: jsonResponse.data.exp,
            quota: jsonResponse.data.quota,
            limitip: jsonResponse.data.limitip
          }
        });
      } else {
        res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui akun', detail: jsonResponse.message });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});

// Renew trojan user
app.get("/renewtrojan", (req, res) => {
  const { user, exp, quota, iplimit } = req.query;
  if (!user || !exp || !quota || !iplimit) {
    return res.status(400).json({ error: 'Username, expiry, quota, dan iplimit diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk memperbarui akun Trojan dengan user: ${user}, exp: ${exp}, quota: ${quota}, iplimit: ${iplimit}`);
  
  const child = spawn("/bin/bash", ["-c", `apirenew trojan ${user} ${exp} ${quota} ${iplimit}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pembaruan akun Trojan gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui akun', detail: output });
    }
    console.log(`Akun Trojan berhasil diperbarui untuk user: ${user}`);
    
    try {
      const jsonResponse = JSON.parse(output);
      if (jsonResponse.status === "success") {
        res.json({
          status: "success",
          message: "Akun Vmess test berhasil diperbarui",
          data: {
            username: jsonResponse.data.username,
            exp: jsonResponse.data.exp,
            quota: jsonResponse.data.quota,
            limitip: jsonResponse.data.limitip
          }
        });
      } else {
        res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui akun', detail: jsonResponse.message });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});

// Renew shadowsocks user
app.get("/renewshadowsocks", (req, res) => {
  const { user, exp, quota, iplimit } = req.query;
  if (!user || !exp || !quota || !iplimit) {
    return res.status(400).json({ error: 'Username, expiry, quota, dan iplimit diperlukan' });
  }
  
  console.log(`Menerima permintaan untuk memperbarui akun Shadowsocks dengan user: ${user}, exp: ${exp}, quota: ${quota}, iplimit: ${iplimit}`);
  
  const child = spawn("/bin/bash", ["-c", `apirenew shadowsocks ${user} ${exp} ${quota} ${iplimit}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  child.stdin.end();
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    console.error(`Kesalahan: ${data}`);
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Proses pembaruan akun Shadowsocks gagal dengan kode: ${code}`);
      return res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui akun', detail: output });
    }
    console.log(`Akun Shadowsocks berhasil diperbarui untuk user: ${user}`);
    
    try {
      const jsonResponse = JSON.parse(output);
      if (jsonResponse.status === "success") {
        res.json({
          status: "success",
          message: "Akun Vmess test berhasil diperbarui",
          data: {
            username: jsonResponse.data.username,
            exp: jsonResponse.data.exp,
            quota: jsonResponse.data.quota,
            limitip: jsonResponse.data.limitip
          }
        });
      } else {
        res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui akun', detail: jsonResponse.message });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memproses output JSON' });
    }
  });
});


const PORT = process.env.PORT || 5888;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
