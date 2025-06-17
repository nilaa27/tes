document.addEventListener('DOMContentLoaded', () => { // Gunakan 'document' bukan 'Document'
    // --- Konfigurasi & Elemen DOM ---
    const WA_NUMBER = '62881036683241'; // Nomor WhatsApp tujuan
    const registrationForm = document.getElementById('registrationForm');
    const successPopup = document.getElementById('success-popup');
    const closePopupButton = document.getElementById('close-popup');
    const loadingScreen = document.getElementById('loading-screen');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const loadingTextElement = document.querySelector('.loading-text');
    const bodyElement = document.body;
    const logoMiniSoccer = document.querySelector('.logo-mini-soccer'); // Ambil elemen logo mini soccer

    // Daftar status loading
    const loadingStatuses = [
        "Sedang memuat...",
        "Memuat...",
        "Selesai!"
    ];
    let currentStatusIndex = 0;
    let loadingInterval;


    // --- Fungsi Bantuan ---

    /**
     * Mengatur ulang posisi label pada elemen <select>.
     * Fungsi ini sekarang lebih umum untuk semua elemen select (RW dan RT).
     */
    const updateSelectLabel = () => {
        // Menggunakan querySelectorAll untuk mendapatkan semua elemen select
        const selects = document.querySelectorAll('.input-group select');
        selects.forEach(select => {
            const label = document.querySelector(`label[for="${select.id}"]`);
            if (label) { // Pastikan label ada
                if (select.value !== "") {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            }
        });
    };

    /**
     * Memvalidasi input formulir, sekarang termasuk Asal RT.
     * @param {string} namaKetua - Nama Captain.
     * @param {string} noKetua - Nomor WhatsApp Captain.
     * @param {string} namaTeam - Nama Tim.
     * @param {string} asalRw - Pilihan Asal RW.
     * @param {string} string} asalRt - Pilihan Asal RT.
     * @returns {boolean} True jika validasi berhasil, false jika tidak.
     */
    const validateForm = (namaKetua, noKetua, namaTeam, asalRw, asalRt) => {
        if (!namaKetua) {
            alert('Nama Captain tidak boleh kosong!');
            document.getElementById('namaKetua').focus();
            return false;
        }
        if (!namaTeam) {
            alert('Nama Tim tidak boleh kosong!');
            document.getElementById('namaTeam').focus();
            return false;
        }
        // Validasi untuk Asal RT dan Asal RW
        if (asalRt === "") {
            alert('Mohon pilih Asal RT!');
            document.getElementById('asalRt').focus();
            return false;
        }
        if (asalRw === "") {
            alert('Mohon pilih Asal RW!');
            document.getElementById('asalRw').focus();
            return false;
        }
        if (!noKetua) {
            alert('Nomor WhatsApp Captain tidak boleh kosong!');
            document.getElementById('noKetua').focus();
            return false;
        }
        // Validasi format nomor telepon sederhana (hanya angka)
        if (!/^\d+$/.test(noKetua)) {
            alert('Nomor WhatsApp harus berupa angka!');
            document.getElementById('noKetua').focus();
            return false;
        }
        return true;
    };

    /**
     * Menampilkan pop-up keberhasilan pendaftaran.
     */
    const showSuccessPopup = () => {
        successPopup.style.display = 'flex'; // Set display ke flex agar bisa transisi
        // Sedikit delay sebelum menambah kelas 'show' agar transisi CSS terpicu
        setTimeout(() => successPopup.classList.add('show'), 10); 
    };

    /**
     * Menyembunyikan pop-up keberhasilan pendaftaran.
     */
    const hideSuccessPopup = () => {
        successPopup.classList.remove('show');
        // Setelah transisi selesai, sembunyikan sepenuhnya
        setTimeout(() => successPopup.style.display = 'none', 400); 
    };

    /**
     * Membangun pesan WhatsApp yang diformat dengan rapi.
     * @param {object} data - Objek berisi data pendaftaran, sekarang dengan domisiliFormatted.
     * @returns {string} Pesan WhatsApp yang sudah diformat.
     */
                const buildWhatsAppMessage = (data) => {
        const { namaKetua, noKetua, namaTeam, domisiliFormatted, registDate } = data;

        let message = `╔═════ೋೋ═════╗\n`;
        message += `  *⭐ Selamat! Tim Berhasil Terdaftar! ⭐*\n`;
        message += `╚═════ೋೋ═════╝\n\n`; // Judul dengan ornamen bingkai & bintang

        message += `*✨ Salam Sukses untuk Sang Captain ✨*\n`;
        message += `Halo ${namaKetua} yang luar biasa!\n`;
        message += `Kami sangat antusias memberitahukan bahwa tim kebanggaan Anda,\n`;
        message += `*🏆 ${namaTeam.toUpperCase()} 🏆*,\n`; // Nama tim dibesarkan dan diberi ornamen piala
        message += `dari wilayah *${domisiliFormatted.toUpperCase()}*,\n`; // Domisili dibesarkan
        message += `telah resmi terdaftar dalam turnamen Mini Soccer Kartar Dr. Sutomo!\n\n`; // Pesan pembuka meriah

        message += `╭─━━━─「 *DETAIL REGISTRASI* 」─━━━─╮\n`; // Header detail
        message += `│  Nama Captain   : ${namaKetua}\n`;
        message += `│  No. WhatsApp   : ${noKetua}\n`;
        message += `│  Nama Tim       : ${namaTeam}\n`;
        message += `│  Domisili       : ${domisiliFormatted}\n`;
        message += `│  Waktu Pendaftaran: ${registDate}\n`;
        message += `╰─━━━─「 ⚽🔥 」─━━━─╯\n\n`; // Footer detail dengan emoji bola api

        message += `_Mohon siapkan diri untuk petualangan seru di lapangan hijau!_ 💚\n`;
        message += `_Tim panitia kami akan segera menghubungi Anda untuk koordinasi lebih lanjut terkait jadwal pertandingan, regulasi turnamen, dan technical meeting._\n`;
        message += `_Nantikan update spesial dari kami dan mari berjuang meraih kemenangan!_ 🥇🎉\n\n`; // Pesan penutup semangat

        message += `~ Kartar Dr. Sutomo ~`; // Tanda tangan

        return encodeURIComponent(message);
    };



    /**
     * Mengganti teks loading dengan animasi fade-out dan fade-in.
     */
    const updateLoadingText = (isFinalStatus = false) => {
        loadingTextElement.classList.add('is-hidden');

        setTimeout(() => {
            if (isFinalStatus) {
                loadingTextElement.textContent = loadingStatuses[loadingStatuses.length - 1];
                currentStatusIndex = loadingStatuses.length - 1;
            } else {
                currentStatusIndex++;
                if (currentStatusIndex >= loadingStatuses.length - 1) { // Perbaikan: Batasi hingga indeks sebelum terakhir
                    currentStatusIndex = 0; // Reset ke awal jika ingin loop terus
                }
                loadingTextElement.textContent = loadingStatuses[currentStatusIndex];
            }
            loadingTextElement.classList.remove('is-hidden');

            if (isFinalStatus) {
                clearInterval(loadingInterval);
            }
        }, 300);
    };


    // --- Inisialisasi dan Event Listeners ---

    // Sembunyikan loading screen setelah halaman dan semua aset dimuat
    window.addEventListener('load', () => {
        loadingTextElement.textContent = loadingStatuses[0];
        loadingTextElement.classList.add('is-visible');

        progressBarFill.style.width = '100%';
        progressBarContainer.classList.add('loaded');

        const totalProgressBarDuration = 4000;
        const statusChangeTiming = totalProgressBarDuration / (loadingStatuses.length - 1); 

        let statusUpdateCount = 0;
        loadingInterval = setInterval(() => {
            if (statusUpdateCount < loadingStatuses.length - 1) { 
                updateLoadingText();
                statusUpdateCount++;
            }
        }, statusChangeTiming);

        setTimeout(() => {
            clearInterval(loadingInterval);
            updateLoadingText(true);

            setTimeout(() => {
                loadingScreen.classList.add('hidden');

                setTimeout(() => {
                    bodyElement.classList.add('content-loaded');
                    logoMiniSoccer.classList.add('animate-logo'); 
                }, 800);
            }, 500);

        }, totalProgressBarDuration);
    });

    // Event listener untuk submit formulir
    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const namaKetua = document.getElementById('namaKetua').value.trim();
        const noKetua = document.getElementById('noKetua').value.trim();
        const namaTeam = document.getElementById('namaTeam').value.trim();
        const asalRw = document.getElementById('asalRw').value;
        const asalRt = document.getElementById('asalRt').value; // Ambil nilai Asal RT

        // Lakukan validasi termasuk Asal RT
        if (!validateForm(namaKetua, noKetua, namaTeam, asalRw, asalRt)) {
            return;
        }

        // Format string domisili menjadi "rt [nomor RT]/rw [nomor RW]"
        const domisiliFormatted = `${asalRt.replace('RT ', 'rt ')}/${asalRw.replace('RW ', 'rw')}`;


        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
            timeZone: 'Asia/Jakarta'
        };
        const registDate = now.toLocaleDateString('id-ID', options);

        const registrationData = {
            namaKetua,
            noKetua,
            namaTeam,
            domisiliFormatted, // Gunakan domisili yang sudah diformat
            registDate
        };

        const encodedMessage = buildWhatsAppMessage(registrationData);
        const whatsappLink = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;

        window.open(whatsappLink, '_blank');

        showSuccessPopup();

        registrationForm.reset();
        updateSelectLabel(); // Panggil ulang untuk mereset label setelah reset form
    });

    closePopupButton.addEventListener('click', hideSuccessPopup);

    successPopup.addEventListener('click', (event) => {
        if (event.target === successPopup) {
            hideSuccessPopup();
        }
    });

    // Inisialisasi placeholder untuk input text
    document.querySelectorAll('.input-group input').forEach(input => {
        if (!input.placeholder) {
            input.placeholder = ' ';
        }
    });

    // Event listeners untuk setiap elemen select (RW dan RT)
    document.querySelectorAll('.input-group select').forEach(select => {
        select.addEventListener('change', updateSelectLabel);
        select.addEventListener('focus', () => {
            const label = document.querySelector(`label[for="${select.id}"]`);
            if (label) label.classList.add('active');
        });
        select.addEventListener('blur', updateSelectLabel);
    });

    // Panggil sekali saat DOM dimuat untuk mengatur status label awal
    updateSelectLabel();
});
