// Ambil info IP dan ISP dari ipinfo.io
fetch("https://ipinfo.io/json?token=db955ecd23c16c")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("isp").innerText = "ISP: " + data.org;
    document.getElementById("ip").innerText = "IP: " + data.ip;
  })
  .catch((error) => {
    console.error("Gagal mengambil data IPInfo:", error);
  });

// Tampilkan user agent (perangkat)
document.getElementById("device").innerText = "Perangkat: " + navigator.userAgent;

// Fungsi acak nilai dengan jeda (biar terlihat seperti proses nyata)
function animateValue(id, start, end, duration, unit = "") {
  const obj = document.getElementById(id);
  const range = end - start;
  const increment = range / (duration / 30);
  let current = start;
  const step = () => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      obj.innerText = end.toFixed(2) + " " + unit;
    } else {
      obj.innerText = current.toFixed(2) + " " + unit;
      requestAnimationFrame(step);
    }
  };
  step();
}

// Fungsi untuk simulasi tes kecepatan
function startTest() {
  document.getElementById("ping").innerText = "...";
  document.getElementById("download").innerText = "...";
  document.getElementById("upload").innerText = "...";

  setTimeout(() => {
    const ping = Math.random() * 80 + 10; // 10-90 ms
    const download = Math.random() * 900 + 50; // 50-950 Mbps
    const upload = Math.random() * 100 + 10; // 10-110 Mbps

    animateValue("ping", 0, ping, 1000, "ms");
    animateValue("download", 0, download, 2000, "Mbps");
    animateValue("upload", 0, upload, 2000, "Mbps");
  }, 500);
}

// Tombol Tes Lagi
document.getElementById("test-again").addEventListener("click", startTest);

// Jalankan tes saat halaman pertama kali dibuka
window.onload = startTest;