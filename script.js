// Ambil elemen HTML
const pingEl = document.getElementById("ping");
const downloadEl = document.getElementById("download");
const uploadEl = document.getElementById("upload");
const startBtn = document.getElementById("startTest");

// Fungsi delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi animasi angka
async function animateValue(element, start, end, duration) {
  let range = end - start;
  let current = start;
  let increment = range / (duration / 50);
  let timer = setInterval(() => {
    current += increment;
    element.textContent = current.toFixed(2);
    if (current >= end) {
      clearInterval(timer);
      element.textContent = end.toFixed(2);
    }
  }, 50);
}

// Fungsi untuk mengukur ping (simulasi ping ke server luar)
async function measurePing() {
  const start = performance.now();
  try {
    await fetch("https://www.google.com", { mode: "no-cors" });
  } catch (e) {
    // error expected due to no-cors, still measure time
  }
  const end = performance.now();
  return Math.round(end - start) || Math.floor(Math.random() * 60) + 20;
}

// Fungsi utama menjalankan tes
async function startTest() {
  startBtn.disabled = true;
  startBtn.textContent = "Tes Berlangsung...";

  pingEl.textContent = "...";
  downloadEl.textContent = "...";
  uploadEl.textContent = "...";

  // Ukur ping
  const ping = await measurePing();
  pingEl.textContent = `${ping} ms`;

  // Simulasi unduh dan unggah
  const downloadSpeed = Math.random() * 90 + 10;  // 10 - 100 Mbps
  const uploadSpeed = Math.random() * 45 + 5;     // 5 - 50 Mbps

  await animateValue(downloadEl, 0, downloadSpeed, 3000);
  await animateValue(uploadEl, 0, uploadSpeed, 3000);

  startBtn.disabled = false;
  startBtn.textContent = "Tes Lagi";
}
