document.addEventListener("DOMContentLoaded", function() {
    AOS.init();
    
    const loginPage = document.getElementById('loginPage');
    const birthdayPage = document.getElementById('birthdayPage');
    const secondPage = document.getElementById('secondPage');
    const giftModal = document.getElementById('giftModal');
    
    // Login Form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        
        if (user === "user" && pass === "user") {
            loginPage.classList.remove('active');
            birthdayPage.classList.add('active');
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#ff69b4', '#ffffff']
            });
        } else {
            alert("Username atau password salah!");
        }
    });
    
    // Navigasi ke halaman 2
    document.getElementById('giftBtn').addEventListener('click', function() {
        birthdayPage.classList.remove('active');
        secondPage.classList.add('active');
        confetti({
            particleCount: 100,
            angle: 60,
            spread: 120,
            origin: { x: 0 },
            colors: ['#ff69b4', '#ffffff']
        });
        confetti({
            particleCount: 100,
            angle: 120,
            spread: 120,
            origin: { x: 1 },
            colors: ['#ff69b4', '#ffffff']
        });
    });
    
    // Navigasi ke modal hadiah
    document.getElementById('nextToGift').addEventListener('click', function() {
        secondPage.classList.remove('active');
        giftModal.style.display = 'flex';
        confetti({
            particleCount: 200,
            spread: 150,
            origin: { y: 0.7 },
            colors: ['#ff69b4', '#ffffff']
        });
    });
    
    // Close Modal
    document.getElementById('closeModal').addEventListener('click', function() {
        giftModal.style.display = 'none';
    });
    
    // Show QR Code
    window.showQRCode = function() {
        QRCode.toCanvas('https://www.instagram.com/mayfaaaaa_ ', { size: 8 }, function(err, canvas) {
            if (err) throw err;
            const qrcodeDiv = document.getElementById('qrcode');
            qrcodeDiv.innerHTML = '';
            canvas.style.marginTop = '20px';
            qrcodeDiv.appendChild(canvas);
        });
    };
});