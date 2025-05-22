const downloadSpeed = document.getElementById("downloadSpeed");
const pingEl = document.getElementById("ping");
const jitterEl = document.getElementById("jitter");
const ispEl = document.getElementById("isp");
const deviceEl = document.getElementById("device");

// Simulasi speed animasi
let speed = 0;
let increasing = true;

function simulateSpeed() {
  setInterval(() => {
    if (increasing) {
      speed += Math.random() * 10;
      if (speed >= 66.44) increasing = false;
    } else {
      speed -= Math.random() * 5;
      if (speed <= 60) increasing = true;
    }
    downloadSpeed.textContent = speed.toFixed(2);
  }, 100);
}

// Simulasi ping & jitter
pingEl.textContent = Math.floor(Math.random() * 20) + 20;
jitterEl.textContent = Math.floor(Math.random() * 5) + 1;

// Ambil info ISP & kota dari ipinfo
fetch('https://ipinfo.io/json?token=db955ecd23c16c')
  .then(response => response.json())
  .then(data => {
    ispEl.textContent = `${data.org} - ${data.city}`;
  })
  .catch(() => {
    ispEl.textContent = "Gagal memuat ISP";
  });

// Deteksi perangkat dari user-agent
const userAgent = navigator.userAgent;
let device = "Tidak Dikenal";
if (/iPhone/.test(userAgent)) device = "iPhone";
else if (/iPad/.test(userAgent)) device = "iPad";
else if (/Android/.test(userAgent)) device = "Android";
else if (/Mac/.test(userAgent)) device = "Mac";
else if (/Windows/.test(userAgent)) device = "Windows PC";
deviceEl.textContent = device;

simulateSpeed();