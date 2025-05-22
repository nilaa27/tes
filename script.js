const downloadCanvas = document.getElementById("downloadGauge");
const uploadCanvas = document.getElementById("uploadGauge");
const downloadCtx = downloadCanvas.getContext("2d");
const uploadCtx = uploadCanvas.getContext("2d");

const downloadSpeedText = document.getElementById("downloadSpeed");
const uploadSpeedText = document.getElementById("uploadSpeed");

const pingEl = document.getElementById("ping");
const jitterEl = document.getElementById("jitter");
const ispEl = document.getElementById("isp");
const deviceEl = document.getElementById("device");
const finalResult = document.getElementById("finalResult");
const restartBtn = document.getElementById("restartBtn");

function drawGauge(ctx, speedEl, angle, value, color = "#38bdf8") {
  const centerX = 150;
  const centerY = 200;
  const radius = 100;

  ctx.clearRect(0, 0, 300, 300);

  // Background arc
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
  ctx.strokeStyle = color;
  ctx.stroke();

  speedEl.textContent = value.toFixed(2);
}

function simulateDownload(duration = 5000, callback) {
  let speed = 0;
  let increasing = true;
  let start = Date.now();

  const interval = setInterval(() => {
    const now = Date.now();
    if (now - start >= duration) {
      clearInterval(interval);
      callback(speed);
      return;
    }

    speed += (increasing ? 1 : -1) * (Math.random() * 5);
    if (speed >= 75) increasing = false;
    if (speed <= 5) increasing = true;

    const angle = (speed / 100) * 180;
    drawGauge(downloadCtx, downloadSpeedText, 180 + angle, speed, "#38bdf8");
  }, 100);
}

function simulateUpload(duration = 5000, callback) {
  let speed = 0;
  let increasing = true;
  let start = Date.now();

  const interval = setInterval(() => {
    const now = Date.now();
    if (now - start >= duration) {
      clearInterval(interval);
      callback(speed);
      return;
    }

    speed += (increasing ? 1 : -1) * (Math.random() * 3);
    if (speed >= 40) increasing = false;
    if (speed <= 3) increasing = true;

    const angle = (speed / 50) * 180;
    drawGauge(uploadCtx, uploadSpeedText, 180 + angle, speed, "#facc15");
  }, 100);
}

function startTest() {
  finalResult.classList.remove("show");
  restartBtn.style.display = "none";
  simulateDownload(5000, (downloadValue) => {
    document.getElementById("downloadResult").textContent = `Unduh: ${downloadValue.toFixed(2)} Mbps`;
    simulateUpload(5000, (uploadValue) => {
      document.getElementById("uploadResult").textContent = `Unggah: ${uploadValue.toFixed(2)} Mbps`;
      finalResult.classList.add("show");
      restartBtn.style.display = "inline-block";
    });
  });
}

function detectDevice() {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/Android/.test(ua)) return "Android";
  if (/Windows/.test(ua)) return "Windows PC";
  if (/Mac/.test(ua)) return "Mac";
  return "Tidak Dikenal";
}

// Inisialisasi
pingEl.textContent = Math.floor(Math.random() * 20) + 20;
jitterEl.textContent = Math.floor(Math.random() * 5) + 1;

fetch('https://ipinfo.io/json?token=db955ecd23c16c')
  .then(res => res.json())
  .then(data => {
    ispEl.textContent = `${data.org} - ${data.city}`;
  })
  .catch(() => {
    ispEl.textContent = "Gagal memuat ISP";
  });

deviceEl.textContent = detectDevice();
restartBtn.addEventListener("click", startTest);
startTest();