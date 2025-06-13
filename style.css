/* Global & Reset */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Press Start 2P', cursive; /* Menggunakan Google Font */
    background-color: #000000; /* Latar belakang hitam pekat */
    color: #d4e7d4; /* Warna teks hijau retro */
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow: hidden;
    flex-direction: column;
    gap: 20px; /* Jarak antara container utama dan info panel */
    text-rendering: optimizeLegibility; /* Memperbaiki rendering font pixel */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Class umum untuk efek pixelated border dan shadow */
.pixel-border {
    border: 4px solid #3c3c3c; /* Border abu-abu gelap */
    box-shadow: 6px 6px 0px 0px #1a1a1a; /* Shadow lebih gelap untuk efek 3D */
    border-radius: 4px; /* Sudut sedikit membulat untuk blok pixel */
}

/* Container Utama */
.container {
    background-color: #2c2c2c; /* Latar belakang lebih gelap untuk container utama */
    padding: 30px;
    text-align: center;
    position: relative;
    transform-style: preserve-3d;
    animation: fadeIn 1s ease-out; /* Animasi fade-in saat dimuat */
    max-width: 600px;
    width: 95%;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-30px) rotateX(10deg); }
    to { opacity: 1; transform: translateY(0) rotateX(0deg); }
}

h1 {
    font-size: 1.8em;
    color: #7aff7a; /* Hijau cerah untuk judul */
    margin-bottom: 25px;
    text-shadow: 3px 3px 0px #3c8f3c; /* Shadow teks pixelated yang lebih kuat */
}

/* --- Bagian Header Metrics (Unduh/Unggah) --- */
.header-metrics {
    display: flex;
    justify-content: space-around;
    margin-bottom: 30px;
    gap: 10px;
}

.metric-box {
    background-color: #3c3c3c;
    padding: 10px 15px;
    min-width: 150px;
    text-align: center;
    border: 2px solid #5a5a5a;
    box-shadow: 3px 3px 0px 0px #1a1a1a;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.metric-box.download { border-color: #00b0ff; box-shadow: 3px 3px 0px 0px #005f88; } /* Warna khusus untuk unduh */
.metric-box.upload { border-color: #ff6e00; box-shadow: 3px 3px 0px 0px #883a00; } /* Warna khusus untuk unggah */

.metric-box .label {
    font-size: 0.8em;
    color: #d4e7d4;
    margin-bottom: 5px;
    text-shadow: 1px 1px 0px #000;
}
.metric-box .value {
    font-size: 1.2em;
    font-weight: bold;
    color: #e0e0e0;
    text-shadow: 1px 1px 0px #000;
}
.metric-box .unit {
    font-size: 0.7em;
    color: #a0a0a0;
    text-shadow: 1px 1px 0px #000;
}

/* Baris Ikon untuk Ping, Jitter, dll. */
.icon-row {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}
.icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.7em;
    color: #a0a0a0;
    text-shadow: 1px 1px 0px #000;
}
.icon-item .icon {
    font-size: 1.5em; /* Ukuran font untuk ikon placeholder */
    margin-bottom: 5px;
    color: #7aff7a;
}
.icon-item .value {
    font-weight: bold;
    color: #e0e0e0;
    text-shadow: 1px 1px 0px #000;
}

/* --- Speed Gauge (Meter Kecepatan) --- */
.speed-gauge {
    width: 280px; /* Ukuran meteran */
    height: 280px;
    background-color: #1a1a1a; /* Latar belakang gelap untuk meteran */
    border: 4px solid #5a5a5a; /* Border luar meteran */
    border-radius: 50%;
    margin: 0 auto 30px;
    position: relative;
    overflow: hidden;
    box-shadow: inset 0 0 15px rgba(0,0,0,0.8), 6px 6px 0px 0px #0d0d0d; /* Inner shadow & pixelated outer */
}

.gauge-background {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border-radius: 50%;
    background: linear-gradient(to bottom right, #3a3a3a, #1a1a1a); /* Gradien internal */
    z-index: 1;
}

.gauge-gradient-arc {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 180%; /* Untuk menutupi busur */
    height: 180%;
    transform: translate(-50%, -50%) rotate(225deg); /* Sudut awal busur */
    border-radius: 50%;
    /* Gradien radial untuk segmen warna pixelated pada busur */
    background: 
        radial-gradient(circle at 50% 100%, rgba(0,255,0,0.4) 0%, transparent 40%) 0% 0% / 100% 100%,
        radial-gradient(circle at 50% 100%, rgba(255,255,0,0.4) 0%, transparent 40%) 0% 0% / 100% 100%,
        radial-gradient(circle at 50% 100%, rgba(255,0,0,0.4) 0%, transparent 40%) 0% 0% / 100% 100%;
    background-blend-mode: screen; /* Menggabungkan gradien */
    clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%); /* Mask untuk membuat busur */
    opacity: 0.7;
    z-index: 2;
}

.gauge-markings {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    z-index: 3;
    /* Garis putus-putus pada meteran menggunakan background-image */
    background-image: 
        radial-gradient(circle, #5a5a5a 2px, transparent 2px), /* Titik kecil */
        radial-gradient(circle at 50% 100%, #5a5a5a 2px, transparent 2px); /* Garis besar */
    background-size: 2px 2px, 10px 10px;
    background-repeat: repeat;
    background-position: center;
}

.gauge-needle {
    position: absolute;
    width: 8px; /* Lebar jarum */
    height: 120px; /* Panjang jarum */
    background-color: #ff0000; /* Warna merah untuk jarum */
    transform-origin: bottom center; /* Rotasi dari bawah tengah */
    bottom: 50%;
    left: calc(50% - 4px); /* Pusat jarum */
    border-radius: 4px 4px 0 0;
    transition: transform 0.5s ease-out; /* Transisi halus saat berputar */
    z-index: 10;
    box-shadow: 3px 3px 0px #880000; /* Shadow pixelated jarum */
    border: 1px solid #ff5555;
}

.gauge-center-cap {
    position: absolute;
    width: 30px; /* Ukuran pusat meteran */
    height: 30px;
    background-color: #ff0000; /* Warna merah pusat */
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 11;
    border: 3px solid #e0e0e0; /* Border putih untuk kontras */
    box-shadow: 0 0 5px rgba(255,0,0,0.7), 2px 2px 0px #880000; /* Glow dan shadow pixel */
}

.gauge-value-display {
    position: absolute;
    bottom: 40px; /* Posisi angka kecepatan di dalam meteran */
    left: 0;
    right: 0;
    text-align: center;
    z-index: 12;
}

.speed-value {
    font-size: 2.8em; /* Ukuran angka kecepatan */
    font-weight: bold;
    color: #00ff00; /* Hijau cerah */
    text-shadow: 4px 4px 0px #00aa00;
}

.unit {
    font-size: 1.1em;
    color: #00ff00;
    text-shadow: 2px 2px 0px #00aa00;
}

.gauge-numbers {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    pointer-events: none; /* Agar tidak menghalangi klik pada meteran */
    z-index: 5;
}

.gauge-numbers span {
    position: absolute;
    font-size: 0.6em;
    color: #a0a0a0;
    text-shadow: 1px 1px 0px #000;
    width: 50px; /* Sesuaikan lebar agar tidak tumpang tindih */
    height: 20px;
    line-height: 20px;
    text-align: center;
    transform-origin: 50% 140px; /* Radius meteran untuk rotasi */
    top: calc(50% - 140px); /* Posisi di tepi atas meteran */
    left: calc(50% - 25px); /* Pusat horizontal */
}

/* Rotasi yang dihitung untuk setiap angka pada meteran */
.gauge-numbers .m-0   { transform: rotate(-135deg) translateY(-110px); }
.gauge-numbers .m-5   { transform: rotate(-100deg) translateY(-110px); }
.gauge-numbers .m-10  { transform: rotate(-80deg) translateY(-110px); }
.gauge-numbers .m-50  { transform: rotate(-40deg) translateY(-110px); } 
.gauge-numbers .m-100 { transform: rotate(0deg) translateY(-110px); } 
.gauge-numbers .m-250 { transform: rotate(40deg) translateY(-110px); }
.gauge-numbers .m-500 { transform: rotate(80deg) translateY(-110px); }
.gauge-numbers .m-750 { transform: rotate(110deg) translateY(-110px); } 
.gauge-numbers .m-1000 { transform: rotate(135deg) translateY(-110px); } 


/* --- Tombol --- */
.buttons {
    margin-top: 35px;
}

button {
    background-color: #0077ff; /* Warna biru tombol */
    color: white;
    border: 3px solid #004488; /* Border pixel biru gelap */
    padding: 15px 30px;
    font-family: 'Press Start 2P', cursive;
    font-size: 1.1em;
    cursor: pointer;
    border-radius: 4px;
    box-shadow: 5px 5px 0px 0px #003366; /* Shadow pixelated */
    transition: all 0.1s ease; /* Transisi halus pada hover/active */
    text-shadow: 2px 2px 0px #000;
}

button:hover {
    background-color: #0088ff;
    box-shadow: 3px 3px 0px 0px #003366;
    transform: translateY(2px) translateX(2px);
}

button:active {
    background-color: #0055aa;
    box-shadow: 0px 0px 0px 0px #003366;
    transform: translateY(5px) translateX(5px);
}

/* --- Info Panel --- */
.info-panel {
    background-color: #2c2c2c;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); /* Kolom responsif */
    gap: 20px;
    text-align: left;
    width: 95%; /* Sesuaikan lebar dengan container utama */
    max-width: 600px;
}

.info-item {
    display: flex;
    align-items: center;
    background-color: #1a1a1a; /* Latar belakang lebih gelap untuk setiap item */
    padding: 10px 15px;
    border: 2px solid #4a4a4a;
    box-shadow: 3px 3px 0px 0px #0d0d0d;
}

.info-item .label {
    font-weight: bold;
    color: #7aff7a; /* Label hijau cerah */
    margin-right: 8px;
    font-size: 0.8em;
    text-shadow: 1px 1px 0px #000;
}

.info-item .value {
    font-size: 0.9em;
    color: #e0e0e0;
    text-shadow: 1px 1px 0px #000;
}

/* Ikon Pixel Placeholder */
.icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: #00ff00; /* Warna placeholder untuk ikon */
    margin-right: 5px;
    vertical-align: middle;
    border: 1px solid #00aa00; /* Outline pixel */
    box-shadow: 1px 1px 0px #006600; /* Shadow pixel kecil */
}
.icon.ping { background-color: #ffcc00; } /* Kuning untuk ping */
.icon.game { background-color: #ff00ff; } /* Magenta untuk game */
.icon.stream { background-color: #00aaff; } /* Biru muda untuk stream */
.icon.user { background-color: #ff5500; } /* Oranye untuk user */

/* Ikon Pixel Kustom - menggunakan pseudoelement untuk bentuk sederhana */
.icon.ping::before { content: "P"; font-size: 10px; line-height: 16px; text-align: center; display: block; color: #000; }
.icon.game::before { content: "G"; font-size: 10px; line-height: 16px; text-align: center; display: block; color: #000; }
.icon.stream::before { content: "S"; font-size: 10px; line-height: 16px; text-align: center; display: block; color: #000; }
.icon.user::before { content: "U"; font-size: 10px; line-height: 16px; text-align: center; display: block; color: #000; }

