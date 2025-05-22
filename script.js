const downloadCtx = document.getElementById("downloadGauge").getContext("2d");
const uploadCtx = document.getElementById("uploadGauge").getContext("2d");

function drawFullGauge(ctx, percent, color) {
  const centerX = 110;
  const centerY = 110;
  const radius = 90;

  ctx.clearRect(0, 0, 220, 220);

  // Background circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 16;
  ctx.stroke();

  // Progress arc
  const angle = (percent / 100) * 2 * Math.PI;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, -Math.PI / 2, angle - Math.PI / 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  ctx.stroke();
}

function simulateTest(duration, updateFn, finishFn) {
  let value = 0;
  let direction = 1;
  const start = Date.now();
  const interval = setInterval(() => {
    const now = Date.now();
    const elapsed = now - start;
    if (elapsed >= duration) {
      clearInterval(interval);
      finishFn(value);
      return;
    }
    value += direction * Math.random() * 5;
    if (value >= 100) direction = -1;
    if (value <= 5) direction = 1;
    updateFn(value);
  }, 100);
}

function startTest() {
  document.getElementById("restartBtn").style.display = "none";
  document.getElementById("finalResult").classList.remove("show");

  simulateTest(4000, (val) => {
    drawFullGauge(downloadCtx, val, "#3b82f6");
    document.getElementById("downloadSpeed").textContent = val.toFixed(1);
  }, (finalVal) => {
    document.getElementById("downloadResult").textContent = finalVal.toFixed(1);
    simulateTest(4000, (val) => {
      drawFullGauge(uploadCtx, val, "#facc15");
      document.getElementById("uploadSpeed").textContent = val.toFixed(1);
    }, (finalVal) => {
      document.getElementById("uploadResult").textContent = finalVal.toFixed(1);
      document.getElementById("finalResult").classList.add("show");
      document.getElementById("restartBtn").style.display = "inline-block";
    });
  });
}

function detectDevice() {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return "iPhone";
  if (/Android/.test(ua)) return "Android";
  if (/Windows/.test(ua)) return "Windows PC";
  if (/Mac/.test(ua)) return "Mac";
  return "Tidak Dikenal";
}

document.getElementById("ping").textContent = Math.floor(Math.random() * 20 + 10);
document.getElementById("jitter").textContent = Math.floor(Math.random() * 10 + 1);
document.getElementById("device").textContent = `Perangkat: ${detectDevice()}`;

fetch("https://ipinfo.io/json?token=db955ecd23c16c")
  .then(res => res.json())
  .then(data => {
    document.getElementById("isp").textContent = `ISP: ${data.org} - ${data.city}`;
  })
  .catch(() => {
    document.getElementById("isp").textContent = "ISP: Tidak Terdeteksi";
  });

document.getElementById("restartBtn").addEventListener("click", startTest);
startTest();