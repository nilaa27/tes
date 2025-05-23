function getDeviceInfo() {
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  return "Tidak diketahui";
}

fetch("https://ipinfo.io/json?token=db955ecd23c16c")
  .then(res => res.json())
  .then(data => {
    document.getElementById("isp").innerText = data.org;
    document.getElementById("lokasi").innerText = data.city;
    document.getElementById("ip").innerText = data.ip;
    document.getElementById("perangkat").innerText = getDeviceInfo();
  });

const canvas = document.getElementById("speedometer");
const ctx = canvas.getContext("2d");

function drawMeter(speed) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = 120;

  // Arc background
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0.75 * Math.PI, 2.25 * Math.PI);
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#444";
  ctx.stroke();

  // Arc progress
  const angle = (speed / 100) * Math.PI * 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0.75 * Math.PI, 0.75 * Math.PI + angle);
  ctx.strokeStyle = "#aa00ff";
  ctx.stroke();

  // Needle
  const a = 0.75 * Math.PI + angle;
  const x = cx + (r - 30) * Math.cos(a);
  const y = cy + (r - 30) * Math.sin(a);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x, y);
  ctx.strokeStyle = "#ff0033";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Text
  ctx.fillStyle = "#fff";
  ctx.font = "14px 'PressStart2P'";
  ctx.fillText(speed.toFixed(1), cx - 30, cy + 10);
}

let speed = 0;
function animateSpeed(target) {
  const interval = setInterval(() => {
    speed += (target - speed) * 0.1;
    if (Math.abs(target - speed) < 0.5) {
      speed = target;
      clearInterval(interval);
    }
    drawMeter(speed);
    document.getElementById("speedValue").innerText = speed.toFixed(1) + " Mbps";
  }, 30);
}

function startTest() {
  const down = Math.random() * 100 + 5;
  const up = Math.random() * 50 + 5;
  const ping = Math.floor(Math.random() * 30);
  const jitter = Math.floor(Math.random() * 10);
  animateSpeed(down);
  document.getElementById("download").innerText = down.toFixed(1);
  document.getElementById("upload").innerText = up.toFixed(1);
  document.getElementById("ping").innerText = ping;
  document.getElementById("jitter").innerText = jitter;
}