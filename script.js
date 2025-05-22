const startBtn = document.getElementById("startBtn");
const speedDisplay = document.getElementById("speed");
const statusText = document.getElementById("status");
const needle = document.getElementById("needle");
const ispSpan = document.getElementById("isp");
const ipSpan = document.getElementById("ip");
const deviceSpan = document.getElementById("device");

// Fungsi memutar jarum speedometer
function rotateNeedle(speed) {
  const angle = Math.min((speed / 1000) * 180, 180);
  needle.setAttribute("transform", `rotate(${angle}, 100, 100)`);
}

// Simulasi speedtest
function startTest() {
  statusText.textContent = "Mengukur kecepatan...";
  let fakeSpeed = 0;
  let interval = setInterval(() => {
    fakeSpeed += Math.random() * 50;

    if (fakeSpeed >= 500) {
      clearInterval(interval);
      fakeSpeed = (Math.random() * 500 + 10).toFixed(2);
      speedDisplay.textContent = fakeSpeed;
      rotateNeedle(fakeSpeed);
      statusText.textContent = "Tes selesai.";
    } else {
      speedDisplay.textContent = fakeSpeed.toFixed(2);
      rotateNeedle(fakeSpeed);
    }
  }, 200);
}

startBtn.addEventListener("click", startTest);

// Deteksi perangkat/browser
function getDevice() {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  return "Tidak Diketahui";
}
deviceSpan.textContent = getDevice();

// Deteksi ISP dan IP via ipinfo.io
fetch("https://ipinfo.io/json?token=db955ecd23c16c")
  .then(res => res.json())
  .then(data => {
    ispSpan.textContent = `${data.org || "Tidak Diketahui"} (${data.hostname || data.city || "-"})`;
    ipSpan.textContent = data.ip || "-";
  })
  .catch(() => {
    ispSpan.textContent = "Gagal mendeteksi";
    ipSpan.textContent = "-";
  });