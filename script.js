const downloadSpeed = document.getElementById("downloadSpeed");
const pingEl = document.getElementById("ping");
const jitterEl = document.getElementById("jitter");
const ispEl = document.getElementById("isp");
const deviceEl = document.getElementById("device");
const finalResult = document.getElementById("finalResult");
const restartBtn = document.getElementById("restartBtn");

const canvas = document.getElementById("gauge");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2 + 50;
const radius = 100;
let speed = 0;
let increasing = true;

function drawGauge(angle, value) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Arc background
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
  ctx.lineWidth = 20;
  ctx.strokeStyle = "#1e40af";
  ctx.stroke();

  // Needle
  const needleLength = radius - 20;
  const rad = angle * (Math.PI / 180);
  const x = centerX + needleLength * Math.cos(rad);
  const y = centerY + needleLength * Math.sin(rad);

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(x, y);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#38bdf8";
  ctx.stroke();

  // Update speed text
  downloadSpeed.textContent = value.toFixed(2);
}

function simulateSpeed(duration = 10000) {
  let start = Date.now();
  const interval = setInterval(() => {
    const now = Date.now();
    if (now - start >= duration) {
      clearInterval(interval);

      // Tampilkan hasil akhir
      const unduhSpeed = speed.toFixed(2);
      const unggahSpeed = (Math.random() * 20 + 5).toFixed(2);

      document.getElementById("downloadResult").textContent = `Unduh: ${unduhSpeed} Mbps`;
      document.getElementById("uploadResult").textContent = `Unggah: ${unggahSpeed} Mbps`;
      finalResult.classList.add("show");
      restartBtn.style.display = "inline-block";
      return;
    }

    if (increasing) {
      speed += Math.random() * 6;
      if (speed >= 75) increasing = false;
    } else {
      speed -= Math.random() * 4;
      if (speed <= 5) increasing = true;
    }

    const maxSpeed = 100;
    const angle = (speed / maxSpeed) * 180;
    drawGauge(180 + angle, speed);
  }, 100);
}

function resetTest() {
  speed = 0;
  increasing = true;
  document.getElementById("downloadResult").textContent = 'Unduh: -- Mbps';
  document.getElementById("uploadResult").textContent = 'Unggah: -- Mbps';
  finalResult.classList.remove("show");
  restartBtn.style.display = "none";
  simulateSpeed();
}

restartBtn.addEventListener("click", resetTest);

// Dummy ping/jitter
pingEl.textContent = Math.floor(Math.random() * 20) + 20;
jitterEl.textContent = Math.floor(Math.random() * 5) + 1;

// ISP dari ipinfo.io
fetch('https://ipinfo.io/json?token=db955ecd23c16c')
  .then(res => res.json())
  .then(data => {
    ispEl.textContent = `${data.org} - ${data.city}`;
  })
  .catch(() => {
    ispEl.textContent = "Gagal memuat ISP";
  });

// Device
const userAgent = navigator.userAgent;
let device = "Tidak Dikenal";
if (/iPhone/.test(userAgent)) device = "iPhone";
else if (/iPad/.test(userAgent)) device = "iPad";
else if (/Android/.test(userAgent)) device = "Android";
else if (/Mac/.test(userAgent)) device = "Mac";
else if (/Windows/.test(userAgent)) device = "Windows PC";
deviceEl.textContent = device;

// Mulai test
simulateSpeed();