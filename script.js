// Mengambil referensi elemen HTML
const downloadSpeedElement = document.getElementById('downloadSpeed');
const gaugeNeedle = document.getElementById('gaugeNeedle');
const gaugeColoredArc = document.getElementById('gaugeColoredArc'); // Elemen busur warna
const startButton = document.getElementById('startButton');
const pingValueElement = document.getElementById('pingValue');
const jitterValueElement = document.getElementById('jitterValue');
const downloadValueElement = document.getElementById('downloadValue'); // Untuk metrik Unduh di bawah
const uploadValueElement = document.getElementById('uploadValue');     // Untuk metrik Unggah di bawah
const downloadGraph = document.getElementById('downloadGraph'); // Untuk grafik batang unduh
const uploadGraph = document.getElementById('uploadGraph');     // Untuk grafik batang unggah


// Fungsi untuk memperbarui posisi jarum meteran dan busur warna berdasarkan kecepatan
function updateGauge(speedMbps) {
    // Meteran ini dari 0 hingga 1000 (1g)
    const minSpeed = 0;
    const maxSpeed = 1000;
    // Rotasi jarum dari -130 derajat (0 Mbps) hingga +130 derajat (1000 Mbps)
    const minAngle = -130; 
    const maxAngle = 130;  

    // Hitung sudut rotasi
    let angle = minAngle + (speedMbps / (maxSpeed - minSpeed)) * (maxAngle - minAngle);
    // Batasi sudut agar tidak melebihi batas
    angle = Math.max(minAngle, Math.min(maxAngle, angle));

    // Terapkan rotasi pada jarum
    gaugeNeedle.style.transform = `translateY(70px) rotate(${angle}deg)`; // Sesuaikan translateY jika perlu

    // Hitung persentase untuk mengisi busur berwarna
    let arcPercentage = (speedMbps / maxSpeed) * 100;
    arcPercentage = Math.max(0, Math.min(100, arcPercentage)); // Batasi antara 0-100%

    // Sudut untuk busur berwarna harus berlawanan dengan jarum agar mengisi dari kiri ke kanan
    // Busur dimulai dari -225 derajat (arah jam 7), total 270 derajat
    // Kita akan memutar clip-path atau mask untuk mengisi
    // Lebih sederhana, kita bisa menyesuaikan properti CSS yang ada (misalnya border-image-slice atau multiple gradients)
    // Untuk tujuan ini, kita akan simulasi dengan rotasi pada elemen gauge-colored-arc
    // Awalnya -225 deg (0%), akhir 45 deg (100%) jika busur penuh 270 deg
    // 270 derajat = 100%
    // 1 derajat = 100/270 %
    // arcFillAngle = (arcPercentage / 100) * 270;
    // gaugeColoredArc.style.transform = `translate(-50%, -50%) rotate(${minAngle + arcFillAngle}deg)`; 
    // Pendekatan ini lebih kompleks untuk border. Kita akan menggunakan clipping path atau width.
    // Karena kita memakai border untuk arc, kita akan putar arc tersebut sesuai kecepatan.
    // Sudut awal busur adalah 225 derajat (posisi 7.5 di jam) dari 0 derajat.
    // Jika speed 0, rotasi 225. Jika speed 1000, rotasi 225 + 270 = 495.
    // Tapi karena kita mau mengisi dari kiri ke kanan, kita atur transform-origin dan rotasi berbeda.
    // Kita akan biarkan busur awal tetap dan bermain dengan transform needle dan text.

    // Untuk mengisi busur berwarna, kita bisa menyesuaikan width dan clip-path atau 
    // menggunakan properti CSS gradient atau SVG. Untuk meniru gambar, 
    // cukup gunakan rotasi jarum dan angka. Busur biru di gambar adalah bagian dari background statis.
    // Jika Anda ingin mengisi busur biru secara dinamis, itu membutuhkan teknik CSS yang lebih lanjut (misalnya conic-gradient atau SVG).
    // Untuk saat ini, kita akan biarkan gauge-colored-arc tetap statis sebagai "fill" total,
    // dan hanya jarum serta angka yang bergerak.
}


// Fungsi simulasi tes kecepatan
async function runSpeedTest() {
    // Menonaktifkan tombol dan mengubah teks
    startButton.disabled = true;
    startButton.textContent = 'Mengukur...';
    
    // Reset nilai yang ditampilkan
    downloadSpeedElement.textContent = '0.0';
    pingValueElement.textContent = '--';
    jitterValueElement.textContent = '--';
    downloadValueElement.textContent = '--';
    uploadValueElement.textContent = '--';
    downloadGraph.style.width = '0%';
    uploadGraph.style.width = '0%';
    updateGauge(0); // Set jarum ke nol

    // --- Simulasi Pengukuran Ping dan Jitter ---
    // Menghasilkan nilai ping acak antara 30-50ms
    const ping = (Math.random() * 20 + 30).toFixed(0); 
    // Menghasilkan nilai jitter acak antara 1-10ms
    const jitter = (Math.random() * 9 + 1).toFixed(0); 
    pingValueElement.textContent = ping;
    jitterValueElement.textContent = jitter;

    // --- Simulasi Tes Unduh ---
    startButton.textContent = 'Unduh...';
    let currentDownloadSpeed = 0;
    // Menentukan kecepatan unduh target acak antara 50-100 Mbps, mirip gambar
    const downloadTargetSpeed = (Math.random() * 50 + 50); 
    let downloadElapsedTime = 0;
    const downloadDuration = 5000; // 5 detik simulasi

    const downloadSimInterval = setInterval(() => {
        downloadElapsedTime += 100; // Setiap 100ms
        let progress = downloadElapsedTime / downloadDuration;
        if (progress > 1) progress = 1;

        // Simulasi kecepatan berfluktuasi mendekati target
        let fluctuation = (Math.random() - 0.5) * 20; // -10 hingga +10
        currentDownloadSpeed = (downloadTargetSpeed * progress) + fluctuation;
        currentDownloadSpeed = Math.max(0, Math.min(maxSpeed, currentDownloadSpeed)); // Batasi dalam rentang meteran

        downloadSpeedElement.textContent = currentDownloadSpeed.toFixed(1);
        downloadValueElement.textContent = currentDownloadSpeed.toFixed(1);
        downloadGraph.style.width = `${progress * 100}%`; // Update grafik batang
        updateGauge(currentDownloadSpeed); // Memperbarui posisi jarum

        if (downloadElapsedTime >= downloadDuration) {
            clearInterval(downloadSimInterval);
            // Nilai akhir unduh bisa sedikit berbeda dari target
            const finalDownloadSpeed = (downloadTargetSpeed + (Math.random() * 5 - 2.5)).toFixed(1); // +/- 2.5 Mbps
            downloadSpeedElement.textContent = finalDownloadSpeed;
            downloadValueElement.textContent = finalDownloadSpeed;
            downloadGraph.style.width = '100%';
            updateGauge(parseFloat(finalDownloadSpeed));
        }
    }, 100);

    await new Promise(resolve => setTimeout(resolve, downloadDuration + 200)); // Tambah sedikit waktu untuk transisi akhir


    // --- Simulasi Tes Unggah ---
    startButton.textContent = 'Unggah...';
    let currentUploadSpeed = 0;
    // Menentukan kecepatan unggah target acak antara 10-30 Mbps
    const uploadTargetSpeed = (Math.random() * 20 + 10); 
    let uploadElapsedTime = 0;
    const uploadDuration = 3000; // 3 detik simulasi

    const uploadSimInterval = setInterval(() => {
        uploadElapsedTime += 100;
        let progress = uploadElapsedTime / uploadDuration;
        if (progress > 1) progress = 1;

        let fluctuation = (Math.random() - 0.5) * 5; // -2.5 hingga +2.5
        currentUploadSpeed = (uploadTargetSpeed * progress) + fluctuation;
        currentUploadSpeed = Math.max(0, currentUploadSpeed); // Pastikan tidak negatif

        uploadValueElement.textContent = currentUploadSpeed.toFixed(1);
        uploadGraph.style.width = `${progress * 100}%`;

        if (uploadElapsedTime >= uploadDuration) {
            clearInterval(uploadSimInterval);
            const finalUploadSpeed = (uploadTargetSpeed + (Math.random() * 2 - 1)).toFixed(1); // +/- 1 Mbps
            uploadValueElement.textContent = finalUploadSpeed;
            uploadGraph.style.width = '100%';
        }
    }, 100);

    await new Promise(resolve => setTimeout(resolve, uploadDuration + 200)); 


    // --- Selesai Tes ---
    startButton.textContent = 'Mulai Tes Lagi!';
    startButton.disabled = false;
}

// Menambahkan event listener ke tombol "Mulai Tes!"
startButton.addEventListener('click', runSpeedTest);

// Mengatur tampilan awal saat halaman dimuat
updateGauge(0); 
