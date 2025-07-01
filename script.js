<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Happy Birthday</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-database-compat.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        /* Modern Glassmorphism Background */
        body {
            background: linear-gradient(135deg, #141E30 0%, #243B55 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            overflow-x: hidden;
            color: #fff;
        }
        
        /* Floating Glass Container - LEBIH KECIL DI DESKTOP */
        .container {
            width: 100%;
            /* DIUBAH: Lebar maksimal dikurangi agar tidak terlalu besar */
            max-width: 800px; 
            perspective: 1000px;
        }
        
        #auth-container {
            position: relative;
            /* DIUBAH: Tinggi dibuat otomatis agar menyesuaikan konten */
            height: auto;
        }
        
        /* Glass Panel with Depth */
        .box {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 24px;
            /* DIUBAH: Padding sedikit dikurangi */
            padding: 35px; 
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), 
                        opacity 0.6s ease;
            backface-visibility: hidden;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4),
                        0 0 0 1px rgba(255, 255, 255, 0.05),
                        inset 0 0 15px rgba(255, 255, 255, 0.1);
            /* TAMBAHAN: Menetapkan tinggi minimum agar tidak terlalu pendek */
            min-height: 650px;
        }
        
        /* Login Box Styling */
        #adminLoginBox {
            transform: rotateY(0deg);
            opacity: 1;
            z-index: 2;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        #auth-container.is-active #adminLoginBox {
            transform: rotateY(180deg);
            opacity: 0;
            z-index: 1;
        }
        
        /* Admin Panel Styling */
        #adminPanelBox {
            transform: rotateY(-180deg);
            opacity: 0;
            z-index: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }
        
        #auth-container.is-active #adminPanelBox {
            transform: rotateY(0deg);
            opacity: 1;
            z-index: 2;
        }
        
        /* Header Styles */
        .login-header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
        }
        
        .login-icon {
            width: 100px;
            height: 100px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            animation: float 4s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        .login-icon i {
            font-size: 48px;
            color: #4facfe;
            text-shadow: 0 0 15px rgba(79, 172, 254, 0.5);
        }
        
        h1 {
            font-size: 2.2rem;
            font-weight: 600;
            background: linear-gradient(45deg, #4facfe, #00f2fe);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 10px;
        }
        
        /* Input Group Styles */
        .input-group {
            margin-bottom: 30px;
            position: relative;
        }
        
        .input-group-header {
            display: flex;
            align-items: center;
            color: rgba(255, 255, 255, 0.8);
            font-size: 1rem;
            margin-bottom: 10px;
        }
        
        .input-group-header i {
            margin-right: 12px;
            width: 20px;
            text-align: center;
            color: #4facfe;
        }
        
        .input-field {
            width: 100%;
            padding: 16px 20px 16px 50px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.15);
            border-radius: 15px;
            color: #fff;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        }
        
        .input-field:focus {
            outline: none;
            border-color: #4facfe;
            box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
        }
        
        .input-field::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }
        
        .password-wrapper {
            position: relative;
        }
        
        #togglePassword {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 18px;
        }
        
        #togglePassword:hover {
            color: #fff;
            transform: translateY(-50%) scale(1.1);
        }
        
        /* Button Styles */
        .btn {
            width: 100%;
            padding: 18px;
            background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
            border: none;
            border-radius: 15px;
            color: #141E30;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            letter-spacing: 0.5px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
            position: relative;
            overflow: hidden;
        }
        
        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: 0.5s;
        }
        
        .btn:hover::before {
            left: 100%;
        }
        
        .btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
        }
        
        .btn:active {
            transform: translateY(-2px);
        }
        
        /* Admin Panel Specific Styles */
        .box-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .logout-btn {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: rgba(255,255,255,0.8);
            font-size: 1.1rem;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .logout-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
            transform: rotate(10deg);
        }
        
        .panel-section {
            margin-bottom: 30px;
        }
        
        .section-title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.2rem;
            font-weight: 500;
            color: #4facfe;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .section-title i {
            font-size: 1.4rem;
        }
        
        .input-group-panel {
            position: relative;
            margin-bottom: 20px;
        }
        
        .input-group-panel i {
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
            color: #4facfe;
            font-size: 18px;
        }
        
        .input-field-panel {
            width: 100%;
            padding: 16px 20px 16px 50px;
            background: rgba(255, 255, 255, 0.08);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            color: #fff;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        /* Perbaikan khusus untuk input tanggal */
        .input-field-panel[type="date"] {
            appearance: none;
            padding-top: 15px;
            padding-bottom: 15px;
            color-scheme: dark;
        }
        
        .input-field-panel[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(0.8);
            cursor: pointer;
            margin-left: 5px;
        }
        
        .input-field-panel:focus {
            outline: none;
            border-color: #4facfe;
            box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
        }
        
        /* Gaya khusus untuk QR Code URL */
        .qr-url-container {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .qr-preview-container {
            display: none;
            margin-top: 20px;
            text-align: center;
            padding: 20px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 15px;
        }
        
        .qr-preview-title {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 10px;
        }
        
        .qr-preview-image {
            max-width: 200px;
            max-height: 200px;
            border-radius: 10px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            margin: 0 auto;
        }
        
        .url-instructions {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 15px;
            margin-top: 15px;
            font-size: 0.9rem;
        }
        
        .url-instructions ol {
            padding-left: 20px;
            margin: 10px 0;
        }
        
        .url-instructions li {
            margin-bottom: 8px;
        }
        
        .btn-save {
            background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
            border: none;
            border-radius: 15px;
            color: #141E30;
            font-size: 18px;
            font-weight: 600;
            padding: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            margin-top: 10px;
            box-shadow: 0 5px 15px rgba(79, 172, 254, 0.3);
        }
        
        .btn-save:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(79, 172, 254, 0.4);
        }
        
        .back-link {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 25px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 1rem;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .back-link:hover {
            color: #4facfe;
            transform: translateX(-5px);
        }
        
        /* Feedback Modal */
        .feedback-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            z-index: 3000;
            justify-content: center;
            align-items: center;
        }
        
        .feedback-content {
            background: rgba(30, 40, 60, 0.95);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .icon-container {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .icon-container .icon {
            font-size: 60px;
        }
        
        .icon-container .icon.success {
            color: #4ade80;
        }
        
        .icon-container .icon.failure {
            color: #f87171;
        }
        
        .feedback-content h2 {
            font-size: 1.8rem;
            margin-bottom: 15px;
            background: linear-gradient(45deg, #4facfe, #00f2fe);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .feedback-content p {
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 25px;
        }
        
        @keyframes popIn {
            0% { transform: scale(0); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); }
        }
        
        .feedback-content .icon {
            animation: popIn 0.5s ease-out forwards;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loader {
            border: 6px solid rgba(255, 255, 255, 0.1);
            border-top: 6px solid #4facfe;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
        }
        
        .hidden {
            display: none;
        }
        
        /* Floating particles effect */
        .particle {
            position: absolute;
            border-radius: 50%;
            background: rgba(79, 172, 254, 0.3);
            pointer-events: none;
            z-index: -1;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                max-width: 95%;
            }
            
            .box {
                padding: 30px;
            }
            
            .login-icon {
                width: 80px;
                height: 80px;
            }
            
            .login-icon i {
                font-size: 36px;
            }
            
            h1 {
                font-size: 1.8rem;
            }
            
            .input-field, .input-field-panel {
                padding: 14px 16px 14px 45px;
                font-size: 1rem;
            }
            
            .btn, .btn-save {
                padding: 16px;
                font-size: 16px;
            }
        }
        
        @media (max-width: 480px) {
            .box {
                padding: 25px 20px;
            }
            
            .login-header {
                margin-bottom: 30px;
            }
            
            .login-icon {
                width: 70px;
                height: 70px;
            }
            
            h1 {
                font-size: 1.6rem;
            }
            
            .input-group {
                margin-bottom: 25px;
            }
            
            .section-title {
                font-size: 1.1rem;
            }
        }
    </style>
</head>
<body>
    <div id="particles"></div>
    
    <div class="container">
        <div id="auth-container">
            <div class="box" id="adminLoginBox">
                <div class="login-header">
                    <div class="login-icon">
                        <i class="fas fa-user-lock"></i>
                    </div>
                    <h1>Admin Login</h1>
                    <p style="color: rgba(255, 255, 255, 0.7);">Masukkan kredensial untuk mengakses panel admin</p>
                </div>
                
                <div class="input-group">
                    <div class="input-group-header">
                        <i class="fas fa-user"></i>
                        <span>Username</span>
                    </div>
                    <input type="text" id="adminUser" class="input-field" placeholder="admin">
                </div>
                
                <div class="input-group">
                    <div class="input-group-header">
                        <i class="fas fa-key"></i>
                        <span>Password</span>
                    </div>
                    <div class="password-wrapper">
                        <input type="password" id="adminPass" class="input-field" placeholder="••••••••">
                        <i class="fas fa-eye" id="togglePassword"></i>
                    </div>
                </div>
                
                <button class="btn" onclick="adminLogin()">
                    <i class="fas fa-sign-in-alt"></i> Masuk
                </button>
            </div>
            
            <div class="box" id="adminPanelBox">
                <div class="box-header">
                    <h1><i class="fas fa-cogs"></i> panel admin</h1>
                    <button class="logout-btn" onclick="logout()" title="Logout">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
                
                <form id="editForm" onsubmit="event.preventDefault(); saveData();">
                    <div class="panel-section">
                        <div class="section-title">
                            <i class="fas fa-birthday-cake"></i>
                            <span>Info Pribadi</span>
                        </div>
                        
                        <div class="input-group-panel">
                            <i class="fas fa-user-edit"></i>
                            <input type="text" id="birthdayNameInput" class="input-field-panel" placeholder="Nama yang berulang tahun" required>
                        </div>
                        
                        <div class="input-group-panel">
                            <i class="fas fa-calendar-alt"></i>
                            <input type="date" id="birthDateInput" class="input-field-panel" placeholder="Tanggal Lahir" required>
                        </div>
                    </div>
                    
                    <div class="panel-section">
                        <div class="section-title">
                            <i class="fas fa-qrcode"></i>
                            <span>QR Code Hadiah</span>
                        </div>
                        
                        <div class="qr-url-container">
                            <div class="input-group-panel">
                                <i class="fas fa-link"></i>
                                <input type="url" id="qrImageUrlInput" class="input-field-panel" placeholder="https://i.ibb.co/.../qr-code.png" required>
                            </div>
                            
                            <div class="url-instructions">
                                <p><strong>Cara mendapatkan URL gambar:</strong></p>
                                <ol>
                                    <li>Unggah gambar QR Code ke layanan hosting seperti <a href="https://postimages.org" target="_blank" style="color: #4facfe;">postimages</a></li>
                                    <li>Salin URL gambar langsung (direct link)</li>
                                    <li>Tempel URL tersebut di input di atas</li>
                                </ol>
                            </div>
                        </div>
                        
                        <div class="qr-preview-container" id="qrPreviewContainer">
                            <div class="qr-preview-title">Preview QR Code:</div>
                            <img id="qrPreviewImage" class="qr-preview-image" src="" alt="Preview QR Code">
                        </div>
                    </div>
                    
                    <div class="panel-section">
                        <div class="section-title">
                            <i class="fas fa-users"></i>
                            <span>Login Tamu</span>
                        </div>
                        
                        <div class="input-group-panel">
                            <i class="fas fa-user"></i>
                            <input type="text" id="guestUserInput" class="input-field-panel" placeholder="Username tamu" required>
                        </div>
                        
                        <div class="input-group-panel">
                            <i class="fas fa-lock"></i>
                            <input type="text" id="guestPassInput" class="input-field-panel" placeholder="Password tamu" required>
                        </div>
                    </div>
                    
                    <div class="panel-section">
                        <div class="section-title">
                            <i class="fas fa-user-shield"></i>
                            <span>Login Admin</span>
                        </div>
                        
                        <div class="input-group-panel">
                            <i class="fas fa-user"></i>
                            <input type="text" id="adminUserInput" class="input-field-panel" placeholder="Username admin" required>
                        </div>
                        
                        <div class="input-group-panel">
                            <i class="fas fa-lock"></i>
                            <input type="text" id="adminPassInput" class="input-field-panel" placeholder="Password admin" required>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn-save">
                        <i class="fas fa-save"></i> Simpan Perubahan
                    </button>
                </form>
                
                <a href="index.html" class="back-link">
                    <i class="fas fa-arrow-left"></i> Kembali ke Halaman Utama
                </a>
            </div>
        </div>
    </div>
    
    <div class="feedback-modal" id="feedbackModal">
        <div class="feedback-content">
            <div class="icon-container">
                <div class="loader" id="feedbackLoader"></div>
                <i class="fas fa-check-circle icon success hidden" id="successIcon"></i>
                <i class="fas fa-times-circle icon failure hidden" id="failureIcon"></i>
            </div>
            <h2 id="feedbackTitle">Mengecek...</h2>
            <p id="feedbackMessage"></p>
        </div>
    </div>

    <script>
        // Firebase Configuration
        const firebaseConfig = {
            apiKey: "AIzaSyCWl2CJqIr-u8lSHu8s4tgZ25UQIK2ivt0",
            authDomain: "mayfa-fa284.firebaseapp.com",
            databaseURL: "https://mayfa-fa284-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "mayfa-fa284",
            storageBucket: "mayfa-fa284.appspot.com",
            messagingSenderId: "523290705179",
            appId: "1:523290705179:web:b06ae4d8e6b08cf07b27be"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();

        // Variabel global
        const DEFAULT_ADMIN_USER = 'admin';
        const DEFAULT_ADMIN_PASS = 'admin123';
        const authContainer = document.getElementById('auth-container');
        const feedbackModal = document.getElementById('feedbackModal');
        const feedbackTitle = document.getElementById('feedbackTitle');
        const feedbackMessage = document.getElementById('feedbackMessage');
        const feedbackLoader = document.getElementById('feedbackLoader');
        const successIcon = document.getElementById('successIcon');
        const failureIcon = document.getElementById('failureIcon');
        const togglePasswordBtn = document.getElementById('togglePassword');
        const adminPassInput = document.getElementById('adminPass');
        const qrImageUrlInput = document.getElementById('qrImageUrlInput');
        const qrPreviewContainer = document.getElementById('qrPreviewContainer');
        const qrPreviewImage = document.getElementById('qrPreviewImage');
        
        // Floating particles effect
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 20;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random size and position
                const size = Math.random() * 10 + 5;
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                const animationDuration = Math.random() * 20 + 10;
                
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${posX}%`;
                particle.style.top = `${posY}%`;
                particle.style.opacity = Math.random() * 0.5 + 0.1;
                particle.style.animation = `floatParticle ${animationDuration}s infinite ease-in-out`;
                particle.style.animationDelay = `${Math.random() * 5}s`;
                
                particlesContainer.appendChild(particle);
            }
        }
        
        // Toggle password visibility
        togglePasswordBtn.addEventListener('click', function() {
            const type = adminPassInput.getAttribute('type') === 'password' ? 'text' : 'password';
            adminPassInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
            
            // Animation effect
            this.style.transform = 'translateY(-50%) scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'translateY(-50%) scale(1)';
            }, 300);
        });
        
        // Show feedback modal
        function showFeedback(state, title, message = '') {
            // Reset icons
            feedbackLoader.classList.add('hidden');
            successIcon.classList.add('hidden');
            failureIcon.classList.add('hidden');
            
            // Show modal
            feedbackModal.style.display = 'flex';
            feedbackTitle.textContent = title;
            feedbackMessage.textContent = message;
            
            // Set state
            if (state === 'loading') {
                feedbackLoader.classList.remove('hidden');
            } else if (state === 'success') {
                successIcon.classList.remove('hidden');
            } else if (state === 'failure') {
                failureIcon.classList.remove('hidden');
            }
        }
        
        // Hide feedback modal
        function hideFeedback() {
            feedbackModal.style.display = 'none';
        }
        
        // Admin login function
        function adminLogin() {
            const user = document.getElementById('adminUser').value;
            const pass = adminPassInput.value;
            
            showFeedback('loading', 'Mengecek...');
            
            const settingsRef = database.ref('settings');
            settingsRef.once('value').then((snapshot) => {
                const settings = snapshot.val();
                const storedAdminUser = settings?.adminUser || DEFAULT_ADMIN_USER;
                const storedAdminPass = settings?.adminPass || DEFAULT_ADMIN_PASS;
                
                if (user === storedAdminUser && pass === storedAdminPass) {
                    showFeedback('success', 'Login Berhasil!', 'Mengalihkan ke panel admin...');
                    
                    setTimeout(() => {
                        hideFeedback();
                        authContainer.classList.add('is-active');
                        loadDataToForm();
                    }, 1500);
                } else {
                    showFeedback('failure', 'Login Gagal!', 'Username atau Password salah.');
                    
                    // Shake animation for login failure
                    authContainer.animate([
                        { transform: 'translateX(0)' },
                        { transform: 'translateX(-15px)' },
                        { transform: 'translateX(15px)' },
                        { transform: 'translateX(-10px)' },
                        { transform: 'translateX(10px)' },
                        { transform: 'translateX(0)' }
                    ], {
                        duration: 600,
                        iterations: 1
                    });
                    
                    setTimeout(hideFeedback, 2500);
                }
            }).catch((error) => {
                showFeedback('failure', 'Gagal memeriksa login', error.message);
                setTimeout(hideFeedback, 3000);
            });
        }
        
        // Logout function
        function logout() {
            authContainer.classList.remove('is-active');
            
            // Reset form
            document.getElementById('adminUser').value = '';
            adminPassInput.value = '';
        }
        
        // Load data from Firebase to form
        function loadDataToForm() {
            showFeedback('loading', 'Memuat data...');
            
            const settingsRef = database.ref('settings');
            settingsRef.once('value').then((snapshot) => {
                const settings = snapshot.val();
                
                if (settings) {
                    // Data ulang tahun
                    document.getElementById('birthdayNameInput').value = settings.birthdayName || 'Mayfa';
                    document.getElementById('birthDateInput').value = settings.birthDate || '2005-09-28';
                    document.getElementById('qrImageUrlInput').value = settings.qrImageUrl || '';
                    
                    // Data login tamu
                    document.getElementById('guestUserInput').value = settings.guestUser || 'user';
                    document.getElementById('guestPassInput').value = settings.guestPass || 'user';
                    
                    // Data login admin
                    document.getElementById('adminUserInput').value = settings.adminUser || DEFAULT_ADMIN_USER;
                    document.getElementById('adminPassInput').value = settings.adminPass || DEFAULT_ADMIN_PASS;
                    
                    // Load QR preview if URL exists
                    updateQrPreview();
                }
                
                hideFeedback();
            }).catch((error) => {
                showFeedback('failure', 'Gagal memuat data', error.message);
                setTimeout(hideFeedback, 3000);
            });
        }
        
        // Update QR preview image
        function updateQrPreview() {
            const qrImageUrl = qrImageUrlInput.value;
            if (qrImageUrl) {
                qrPreviewImage.src = qrImageUrl;
                qrPreviewContainer.style.display = 'block';
            } else {
                qrPreviewContainer.style.display = 'none';
            }
        }
        
        // Save data to Firebase
        function saveData() {
            showFeedback('loading', 'Menyimpan data...');
            
            const settings = {
                birthdayName: document.getElementById('birthdayNameInput').value,
                birthDate: document.getElementById('birthDateInput').value,
                qrImageUrl: document.getElementById('qrImageUrlInput').value,
                guestUser: document.getElementById('guestUserInput').value,
                guestPass: document.getElementById('guestPassInput').value,
                adminUser: document.getElementById('adminUserInput').value,
                adminPass: document.getElementById('adminPassInput').value
            };
            
            database.ref('settings').set(settings)
                .then(() => {
                    showFeedback('success', 'Tersimpan!', 'Data telah berhasil disimpan di Firebase.');
                    
                    setTimeout(() => {
                        hideFeedback();
                        
                        // Confirmation animation
                        const saveBtn = document.querySelector('.btn-save');
                        saveBtn.innerHTML = '<i class="fas fa-check"></i> Tersimpan!';
                        saveBtn.style.background = 'linear-gradient(to right, #4ade80, #22d3ee)';
                        
                        setTimeout(() => {
                            saveBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Perubahan';
                            saveBtn.style.background = 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)';
                        }, 2000);
                    }, 1500);
                })
                .catch((error) => {
                    showFeedback('failure', 'Gagal menyimpan', error.message);
                    setTimeout(hideFeedback, 3000);
                });
        }
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            authContainer.classList.remove('is-active');
            createParticles();
            
            // Add keyframes for particle animation
            const styleSheet = document.styleSheets[0];
            styleSheet.insertRule(`
                @keyframes floatParticle {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(20px, -30px) rotate(90deg); }
                    50% { transform: translate(40px, 10px) rotate(180deg); }
                    75% { transform: translate(-20px, 30px) rotate(270deg); }
                    100% { transform: translate(0, 0) rotate(360deg); }
                }
            `, styleSheet.cssRules.length);
            
            // Update QR preview when URL changes
            qrImageUrlInput.addEventListener('input', updateQrPreview);
        });
    </script>
</body>
</html>
