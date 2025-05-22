function startTest() {
  const fileSizeInBytes = 1000000; // 1 MB
  const fileUrl = "https://ipv4.download.thinkbroadband.com/5MB.zip";
  
  document.getElementById("status").textContent = "Mengukur kecepatan...";
  document.getElementById("speed").textContent = "--";
  
  const startTime = new Date().getTime();
  
  fetch(fileUrl + "?cache=" + Math.random())
    .then(response => response.blob())
    .then(() => {
      const endTime = new Date().getTime();
      const duration = (endTime - startTime) / 1000;
      const bitsLoaded = fileSizeInBytes * 8;
      const speedMbps = (bitsLoaded / duration / 1024 / 1024).toFixed(2);
      
      document.getElementById("speed").textContent = speedMbps;
      document.getElementById("status").textContent = "Tes selesai.";
    })
    .catch(() => {
      document.getElementById("status").textContent = "Tes gagal. Periksa koneksi internet.";
    });
}

// Deteksi perangkat/browser
function detectDevice() {
  const ua = navigator.userAgent;
  let browser = "Tidak Dikenal";
  
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Edg")) browser = "Edge";
  
  document.getElementById("device").textContent = browser;
}

// Ambil data ISP dari ipinfo.io (gratis untuk IP dasar)
fetch("https://ipinfo.io/json?token=db955ecd23c16c") // Ganti token dengan milikmu jika rate-limit
  .then(res => res.json())
  .then(data => {
    document.getElementById("isp").textContent = data.org || "Tidak diketahui";
  })
  .catch(() => {
    document.getElementById("isp").textContent = "Tidak dapat memuat ISP";
  });

detectDevice();
