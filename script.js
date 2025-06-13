// script.js (Simulator Speedtest tanpa Backend)

// Mengambil referensi elemen HTML
const downloadSpeedElement = document.getElementById('downloadSpeed');
const gaugeNeedle = document.getElementById('gaugeNeedle');
const gaugeColoredArc = document.getElementById('gaugeColoredArc'); 
const startButton = document.getElementById('startButton');
const pingValueElement = document.getElementById('pingValue');
const jitterValueElement = document.getElementById('jitterValue');
const downloadValueElement = document.getElementById('downloadValue'); 
const uploadValueElement = document.getElementById('uploadValue');     
const downloadGraph = document.getElementById('downloadGraph'); 
const uploadGraph = document.getElementById('uploadGraph');     

// Fungsi untuk memperbarui posisi jarum meteran berdasarkan kecepatan
function updateGauge(speedMbps) {
    const minSpeed = 0;
    const maxSpeed = 1000; // Max kecepatan gauge (sesuai gambar referensi)
    const minAngle = -130; // Rotasi jarum: -130 derajat untuk 0 Mbps
    const maxAngle = 130;  // Rotasi jarum: +130 derajat untuk 1000 Mbps

    let angle = minAngle + (speedMbps / (maxSpeed - minSpeed)) * (maxAngle - minAngle);
    angle = Math.max(minAngle, Math.min(maxAngle, angle)); // Batasi sudut

    gaugeNeedle.style.transform = `translateY(70px) rotate(${angle}deg)`; 
}

// Fungsi utama untuk menjalankan seluruh simulasi tes
async function runSpeedTest() {
    startButton.disabled = true;
    startButton.textContent = 'Mulai Tes...';

    // Reset UI ke keadaan awal
    downloadSpeedElement.textContent = '0.0';
    pingValueElement.textContent = '--';
    jitterValueElement.textContent = '--';
    downloadValueElement.textContent = '--';
    uploadValueElement.textContent = '--';
    downloadGraph.style.width = '0%';
    uploadGraph.style.width = '0%';
    updateGauge(0);

    // --- Simulasi Ping & Jitter ---
    startButton.textContent = 'Menguji Ping & Jitter...';
    // Menghasilkan nilai ping acak yang realistis (misal: 20-60ms)
    const simulatedPing = (Math.random() * 40 + 20).toFixed(0); 
    // Menghasilkan nilai jitter acak yang realistis (misal: 1-15ms)
    const simulatedJitter = (Math.random() * 14 + 1).toFixed(0); 
    
    // Tampilkan hasil ping dan jitter setelah jeda singkat
    await new Promise(r => setTimeout(r, 1000)); // Simulasi waktu tes ping
    pingValueElement.textContent = simulatedPing;
    jitterValueElement.textContent = simulatedJitter;
    await new Promise(r => setTimeout(r, 500)); // Jeda sebelum mulai download

    // --- Simulasi Tes Unduh ---
    startButton.textContent = 'Menguji Unduh...';
    let currentDownloadSpeed = 0;
    // Tentukan target kecepatan unduh yang realistis (misal: 30-100 Mbps)
    const targetDownloadSpeed = (Math.random() * 70 + 30); 
    const downloadDuration = 7000; // Durasi simulasi unduh dalam ms (7 detik)
    let downloadElapsedTime = 0;

    const downloadSimInterval = setInterval(() => {
        downloadElapsedTime += 100; // Setiap 100ms update
        let progress = downloadElapsedTime / downloadDuration;
        if (progress > 1) progress = 1;

        // Fluuktuasi kecepatan: bergerak menuju target, dengan sedikit acak
        let fluctuation = (Math.random() - 0.5) * 15; // Fluktuasi antara -7.5 hingga +7.5 Mbps
        currentDownloadSpeed = (targetDownloadSpeed * progress * 0.8) + (targetDownloadSpeed * 0.2) + fluctuation;
        currentDownloadSpeed = Math.max(0, Math.min(1000, currentDownloadSpeed)); // Batasi dalam rentang meteran 0-1000

        downloadSpeedElement.textContent = currentDownloadSpeed.toFixed(1);
        downloadValueElement.textContent = currentDownloadSpeed.toFixed(1);
        downloadGraph.style.width = `${progress * 100}%`;
        updateGauge(currentDownloadSpeed); // Update jarum

        if (downloadElapsedTime >= downloadDuration) {
            clearInterval(downloadSimInterval);
            // Nilai akhir unduh bisa sedikit berbeda dari target
            const finalDownloadSpeed = (targetDownloadSpeed + (Math.random() * 5 - 2.5)).toFixed(1); // +/- 2.5 Mbps
            downloadSpeedElement.textContent = finalDownloadSpeed;
            downloadValueElement.textContent = finalDownloadSpeed;
            downloadGraph.style.width = '100%';
            updateGauge(parseFloat(finalDownloadSpeed)); // Atur jarum ke nilai akhir
        }
    }, 100);

    await new Promise(resolve => setTimeout(resolve, downloadDuration + 500)); // Tunggu hingga simulasi selesai + jeda

    // --- Simulasi Tes Unggah ---
    startButton.textContent = 'Menguji Unggah...';
    let currentUploadSpeed = 0;
    // Tentukan target kecepatan unggah yang realistis (misal: 10-30 Mbps)
    const targetUploadSpeed = (Math.random() * 20 + 10); 
    const uploadDuration = 5000; // Durasi simulasi unggah dalam ms (5 detik)
    let uploadElapsedTime = 0;

    const uploadSimInterval = setInterval(() => {
        uploadElapsedTime += 100;
        let progress = uploadElapsedTime / uploadDuration;
        if (progress > 1) progress = 1;

        let fluctuation = (Math.random() - 0.5) * 5; // Fluktuasi antara -2.5 hingga +2.5 Mbps
        currentUploadSpeed = (targetUploadSpeed * progress * 0.8) + (targetUploadSpeed * 0.2) + fluctuation;
        currentUploadSpeed = Math.max(0, currentUploadSpeed); // Pastikan tidak negatif

        uploadValueElement.textContent = currentUploadSpeed.toFixed(1);
        uploadGraph.style.width = `${progress * 100}%`;

        if (uploadElapsedTime >= uploadDuration) {
            clearInterval(uploadSimInterval);
            const finalUploadSpeed = (targetUploadSpeed + (Math.random() * 2 - 1)).toFixed(1); // +/- 1 Mbps
            uploadValueElement.textContent = finalUploadSpeed;
            uploadGraph.style.width = '100%';
        }
    }, 100);

    await new Promise(resolve => setTimeout(resolve, uploadDuration + 500)); 

    // --- Tes Selesai ---
    startButton.textContent = 'Mulai Tes Lagi!';
    startButton.disabled = false;
}

// Menambahkan event listener ke tombol "Mulai Tes!"
startButton.addEventListener('click', runSpeedTest);

// Mengatur tampilan awal saat halaman dimuat
updateGauge(0); 

// Menampilkan waktu saat ini secara realtime (opsional, untuk sentuhan realisme)
function updateTime() {
    const now = new Date();
    // Menggunakan informasi lokasi yang disimpan: Surabaya, East Java, Indonesia
    // Asumsi zona waktu WIB untuk Surabaya (UTC+7)
    const options = { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false, 
        timeZone: 'Asia/Jakarta' // WIB
    };
    const timeString = now.toLocaleTimeString('en-GB', options); // en-GB untuk format 24 jam
    document.getElementById('timeDisplay').textContent = timeString;
}

// Panggil fungsi updateTime sekali saat dimuat, lalu setiap menit
updateTime();
setInterval(updateTime, 60 * 1000); // Update setiap menit
