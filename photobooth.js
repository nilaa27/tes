class PhotoBooth {
    constructor() {
        this.stream = null;
        this.currentFilter = 'none';
        this.currentLayout = 'single';
        this.photos = [];
        this.settings = {
            timer: 3,
            flipCamera: false,
            soundEnabled: true,
            resolution: '1280x720'
        };
        this.cameras = [];
        this.selectedCameraId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.getCameraDevices();
    }

    initializeElements() {
        // Video and canvas elements
        this.video = document.getElementById('cameraPreview');
        this.canvas = document.getElementById('photoCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Control elements
        this.toggleCameraBtn = document.getElementById('toggleCamera');
        this.captureBtn = document.getElementById('captureBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.countdown = document.getElementById('countdown');
        this.cameraStatus = document.getElementById('cameraStatus');
        
        // Filter elements
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.layoutBtns = document.querySelectorAll('.layout-btn');
        
        // Gallery and actions
        this.gallery = document.getElementById('photoGallery');
        this.printBtn = document.getElementById('printBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.clearBtn = document.getElementById('clearBtn');
        
        // Modals
        this.settingsModal = document.getElementById('settingsModal');
        this.photoModal = document.getElementById('photoModal');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        this.closePhotoBtn = document.getElementById('closePhoto');
        
        // Settings elements
        this.cameraSelect = document.getElementById('cameraSelect');
        this.resolutionSelect = document.getElementById('resolutionSelect');
        this.timerSelect = document.getElementById('timerSelect');
        this.flipCameraCheckbox = document.getElementById('flipCamera');
        this.soundEnabledCheckbox = document.getElementById('soundEnabled');
        
        // Photo preview elements
        this.photoPreview = document.getElementById('photoPreview');
        this.downloadSingleBtn = document.getElementById('downloadSingle');
        this.printSingleBtn = document.getElementById('printSingle');
        this.deleteSingleBtn = document.getElementById('deleteSingle');
        
        this.currentPhotoIndex = -1;
    }

    bindEvents() {
        // Camera controls
        this.toggleCameraBtn.addEventListener('click', () => this.toggleCamera());
        this.captureBtn.addEventListener('click', () => this.capturePhoto());
        this.settingsBtn.addEventListener('click', () => this.showSettings());
        
        // Filter controls
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.selectFilter(btn.dataset.filter));
        });
        
        // Layout controls
        this.layoutBtns.forEach(btn => {
            btn.addEventListener('click', () => this.selectLayout(btn.dataset.layout));
        });
        
        // Action buttons
        this.printBtn.addEventListener('click', () => this.printPhotos());
        this.downloadBtn.addEventListener('click', () => this.downloadPhotos());
        this.clearBtn.addEventListener('click', () => this.clearPhotos());
        
        // Modal controls
        this.closeSettingsBtn.addEventListener('click', () => this.hideSettings());
        this.closePhotoBtn.addEventListener('click', () => this.hidePhotoPreview());
        
        // Settings controls
        this.cameraSelect.addEventListener('change', () => this.switchCamera());
        this.resolutionSelect.addEventListener('change', () => this.updateResolution());
        this.timerSelect.addEventListener('change', () => this.updateTimer());
        this.flipCameraCheckbox.addEventListener('change', () => this.updateFlipCamera());
        this.soundEnabledCheckbox.addEventListener('change', () => this.updateSoundEnabled());
        
        // Photo preview controls
        this.downloadSingleBtn.addEventListener('click', () => this.downloadSinglePhoto());
        this.printSingleBtn.addEventListener('click', () => this.printSinglePhoto());
        this.deleteSingleBtn.addEventListener('click', () => this.deleteSinglePhoto());
        
        // Modal overlay clicks
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.hideSettings();
        });
        
        this.photoModal.addEventListener('click', (e) => {
            if (e.target === this.photoModal) this.hidePhotoPreview();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.target.matches('input, select, textarea')) {
                e.preventDefault();
                this.capturePhoto();
            }
        });
    }

    async getCameraDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.cameras = devices.filter(device => device.kind === 'videoinput');
            
            this.cameraSelect.innerHTML = '<option value="">Select Camera</option>';
            this.cameras.forEach((camera, index) => {
                const option = document.createElement('option');
                option.value = camera.deviceId;
                option.textContent = camera.label || `Camera ${index + 1}`;
                this.cameraSelect.appendChild(option);
            });
            
            if (this.cameras.length > 0) {
                this.selectedCameraId = this.cameras[0].deviceId;
                this.cameraSelect.value = this.selectedCameraId;
            }
        } catch (error) {
            console.error('Error getting camera devices:', error);
        }
    }

    async toggleCamera() {
        if (this.stream) {
            this.stopCamera();
        } else {
            await this.startCamera();
        }
    }

    async startCamera() {
        try {
            const [width, height] = this.settings.resolution.split('x').map(Number);
            
            const constraints = {
                video: {
                    width: { ideal: width },
                    height: { ideal: height },
                    deviceId: this.selectedCameraId ? { exact: this.selectedCameraId } : undefined
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            
            this.video.addEventListener('loadedmetadata', () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                this.updateVideoFilter();
            });
            
            this.toggleCameraBtn.querySelector('i').className = 'fas fa-video-slash';
            this.toggleCameraBtn.title = 'Stop Camera';
            this.captureBtn.disabled = false;
            this.cameraStatus.style.display = 'none';
            
            this.playSound('camera-start');
            
        } catch (error) {
            console.error('Error starting camera:', error);
            this.showError('Unable to access camera. Please check permissions.');
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            this.video.srcObject = null;
            
            this.toggleCameraBtn.querySelector('i').className = 'fas fa-video';
            this.toggleCameraBtn.title = 'Start Camera';
            this.captureBtn.disabled = true;
            this.cameraStatus.style.display = 'flex';
            
            this.playSound('camera-stop');
        }
    }

    async switchCamera() {
        if (this.stream) {
            this.stopCamera();
        }
        
        this.selectedCameraId = this.cameraSelect.value;
        
        if (this.selectedCameraId) {
            await this.startCamera();
        }
    }

    updateResolution() {
        this.settings.resolution = this.resolutionSelect.value;
        this.saveSettings();
        
        if (this.stream) {
            this.stopCamera();
            setTimeout(() => this.startCamera(), 100);
        }
    }

    updateTimer() {
        this.settings.timer = parseInt(this.timerSelect.value);
        this.saveSettings();
    }

    updateFlipCamera() {
        this.settings.flipCamera = this.flipCameraCheckbox.checked;
        this.saveSettings();
        this.updateVideoFilter();
    }

    updateSoundEnabled() {
        this.settings.soundEnabled = this.soundEnabledCheckbox.checked;
        this.saveSettings();
    }

    selectFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        this.updateVideoFilter();
    }

    selectLayout(layout) {
        this.currentLayout = layout;
        this.layoutBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-layout="${layout}"]`).classList.add('active');
        this.updateActionButtons();
    }

    updateVideoFilter() {
        let filterClass = `filter-${this.currentFilter}`;
        
        // Remove all filter classes
        this.video.className = this.video.className.replace(/filter-\w+/g, '');
        
        // Add current filter class
        this.video.classList.add(filterClass);
        
        // Apply flip transform if enabled
        if (this.settings.flipCamera) {
            this.video.style.transform = 'scaleX(-1)';
        } else {
            this.video.style.transform = 'scaleX(1)';
        }
    }

    async capturePhoto() {
        if (!this.stream) return;
        
        if (this.settings.timer > 0) {
            await this.startCountdown();
        }
        
        this.playSound('capture');
        
        // Capture the photo
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply flip transform to canvas if enabled
        if (this.settings.flipCamera) {
            this.ctx.translate(this.canvas.width, 0);
            this.ctx.scale(-1, 1);
        }
        
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        // Apply filter to canvas
        this.applyCanvasFilter();
        
        // Convert to blob and store
        this.canvas.toBlob((blob) => {
            const photo = {
                id: Date.now(),
                blob: blob,
                url: URL.createObjectURL(blob),
                timestamp: new Date(),
                filter: this.currentFilter,
                layout: this.currentLayout
            };
            
            this.photos.push(photo);
            this.updateGallery();
            this.updateActionButtons();
            
            // Reset canvas transform
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            
        }, 'image/jpeg', 0.9);
    }

    async startCountdown() {
        return new Promise((resolve) => {
            let count = this.settings.timer;
            this.countdown.textContent = count;
            this.countdown.style.display = 'block';
            this.cameraStatus.style.display = 'none';
            
            const interval = setInterval(() => {
                count--;
                this.playSound('tick');
                
                if (count > 0) {
                    this.countdown.textContent = count;
                } else {
                    clearInterval(interval);
                    this.countdown.style.display = 'none';
                    resolve();
                }
            }, 1000);
        });
    }

    applyCanvasFilter() {
        if (this.currentFilter === 'none') return;
        
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        switch (this.currentFilter) {
            case 'bw':
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg;
                    data[i + 1] = avg;
                    data[i + 2] = avg;
                }
                break;
                
            case 'sepia':
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
                    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
                    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
                }
                break;
                
            case 'vintage':
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    data[i] = Math.min(255, r * 1.2 + g * 0.1 + b * 0.1);
                    data[i + 1] = Math.min(255, r * 0.1 + g * 0.9 + b * 0.1);
                    data[i + 2] = Math.min(255, r * 0.1 + g * 0.1 + b * 0.7);
                }
                break;
                
            case 'invert':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }
                break;
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    updateGallery() {
        if (this.photos.length === 0) {
            this.gallery.innerHTML = `
                <div class="gallery-empty">
                    <i class="fas fa-image"></i>
                    <p>No photos taken yet</p>
                </div>
            `;
            return;
        }
        
        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'gallery-grid';
        
        this.photos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<img src="${photo.url}" alt="Photo ${index + 1}">`;
            item.addEventListener('click', () => this.showPhotoPreview(index));
            galleryGrid.appendChild(item);
        });
        
        this.gallery.innerHTML = '';
        this.gallery.appendChild(galleryGrid);
    }

    updateActionButtons() {
        const hasPhotos = this.photos.length > 0;
        this.printBtn.disabled = !hasPhotos;
        this.downloadBtn.disabled = !hasPhotos;
        this.clearBtn.disabled = !hasPhotos;
    }

    showSettings() {
        this.settingsModal.classList.add('active');
        
        // Update settings form
        this.resolutionSelect.value = this.settings.resolution;
        this.timerSelect.value = this.settings.timer;
        this.flipCameraCheckbox.checked = this.settings.flipCamera;
        this.soundEnabledCheckbox.checked = this.settings.soundEnabled;
        
        if (this.selectedCameraId) {
            this.cameraSelect.value = this.selectedCameraId;
        }
    }

    hideSettings() {
        this.settingsModal.classList.remove('active');
    }

    showPhotoPreview(index) {
        this.currentPhotoIndex = index;
        const photo = this.photos[index];
        this.photoPreview.src = photo.url;
        this.photoModal.classList.add('active');
    }

    hidePhotoPreview() {
        this.photoModal.classList.remove('active');
        this.currentPhotoIndex = -1;
    }

    async printPhotos() {
        if (this.photos.length === 0) return;
        
        const printContainer = document.createElement('div');
        printContainer.className = 'print-container';
        
        switch (this.currentLayout) {
            case 'single':
                this.createSinglePrint(printContainer);
                break;
            case 'strip':
                this.createStripPrint(printContainer);
                break;
            case 'grid':
                this.createGridPrint(printContainer);
                break;
        }
        
        document.body.appendChild(printContainer);
        window.print();
        document.body.removeChild(printContainer);
    }

    createSinglePrint(container) {
        const latestPhoto = this.photos[this.photos.length - 1];
        const printDiv = document.createElement('div');
        printDiv.className = 'photo-single';
        printDiv.innerHTML = `<img src="${latestPhoto.url}" style="width: 100%; height: 100%; object-fit: cover;">`;
        container.appendChild(printDiv);
    }

    createStripPrint(container) {
        const printDiv = document.createElement('div');
        printDiv.className = 'photo-strip';
        printDiv.style.display = 'flex';
        printDiv.style.flexDirection = 'column';
        printDiv.style.gap = '0.1in';
        
        const photosToUse = this.photos.slice(-4); // Last 4 photos
        
        photosToUse.forEach(photo => {
            const photoDiv = document.createElement('div');
            photoDiv.style.flex = '1';
            photoDiv.style.overflow = 'hidden';
            photoDiv.innerHTML = `<img src="${photo.url}" style="width: 100%; height: 100%; object-fit: cover;">`;
            printDiv.appendChild(photoDiv);
        });
        
        container.appendChild(printDiv);
    }

    createGridPrint(container) {
        const printDiv = document.createElement('div');
        printDiv.className = 'photo-grid';
        
        const photosToUse = this.photos.slice(-4); // Last 4 photos
        
        photosToUse.forEach(photo => {
            const photoDiv = document.createElement('div');
            photoDiv.style.overflow = 'hidden';
            photoDiv.innerHTML = `<img src="${photo.url}" style="width: 100%; height: 100%; object-fit: cover;">`;
            printDiv.appendChild(photoDiv);
        });
        
        container.appendChild(printDiv);
    }

    downloadPhotos() {
        if (this.photos.length === 0) return;
        
        if (this.currentLayout === 'single') {
            this.downloadSinglePhoto();
        } else {
            this.downloadCollage();
        }
    }

    downloadSinglePhoto() {
        const photo = this.currentPhotoIndex >= 0 
            ? this.photos[this.currentPhotoIndex] 
            : this.photos[this.photos.length - 1];
            
        const link = document.createElement('a');
        link.download = `photo-${photo.id}.jpg`;
        link.href = photo.url;
        link.click();
    }

    async downloadCollage() {
        const collageCanvas = document.createElement('canvas');
        const collageCtx = collageCanvas.getContext('2d');
        
        if (this.currentLayout === 'strip') {
            collageCanvas.width = 800;
            collageCanvas.height = 1200;
            
            const photosToUse = this.photos.slice(-4);
            const photoHeight = collageCanvas.height / photosToUse.length;
            
            for (let i = 0; i < photosToUse.length; i++) {
                const img = new Image();
                img.onload = () => {
                    collageCtx.drawImage(img, 0, i * photoHeight, collageCanvas.width, photoHeight);
                    
                    if (i === photosToUse.length - 1) {
                        this.downloadCanvas(collageCanvas, 'photo-strip');
                    }
                };
                img.src = photosToUse[i].url;
            }
        } else if (this.currentLayout === 'grid') {
            collageCanvas.width = 800;
            collageCanvas.height = 800;
            
            const photosToUse = this.photos.slice(-4);
            const photoWidth = collageCanvas.width / 2;
            const photoHeight = collageCanvas.height / 2;
            
            for (let i = 0; i < photosToUse.length && i < 4; i++) {
                const img = new Image();
                img.onload = () => {
                    const x = (i % 2) * photoWidth;
                    const y = Math.floor(i / 2) * photoHeight;
                    collageCtx.drawImage(img, x, y, photoWidth, photoHeight);
                    
                    if (i === photosToUse.length - 1) {
                        this.downloadCanvas(collageCanvas, 'photo-grid');
                    }
                };
                img.src = photosToUse[i].url;
            }
        }
    }

    downloadCanvas(canvas, filename) {
        canvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.download = `${filename}-${Date.now()}.jpg`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
        }, 'image/jpeg', 0.9);
    }

    printSinglePhoto() {
        if (this.currentPhotoIndex < 0) return;
        
        const photo = this.photos[this.currentPhotoIndex];
        const printContainer = document.createElement('div');
        printContainer.className = 'print-container';
        
        const printDiv = document.createElement('div');
        printDiv.className = 'photo-single';
        printDiv.innerHTML = `<img src="${photo.url}" style="width: 100%; height: 100%; object-fit: cover;">`;
        printContainer.appendChild(printDiv);
        
        document.body.appendChild(printContainer);
        window.print();
        document.body.removeChild(printContainer);
    }

    deleteSinglePhoto() {
        if (this.currentPhotoIndex < 0) return;
        
        const photo = this.photos[this.currentPhotoIndex];
        URL.revokeObjectURL(photo.url);
        
        this.photos.splice(this.currentPhotoIndex, 1);
        this.updateGallery();
        this.updateActionButtons();
        this.hidePhotoPreview();
    }

    clearPhotos() {
        if (this.photos.length === 0) return;
        
        if (confirm('Are you sure you want to delete all photos?')) {
            this.photos.forEach(photo => URL.revokeObjectURL(photo.url));
            this.photos = [];
            this.updateGallery();
            this.updateActionButtons();
        }
    }

    playSound(type) {
        if (!this.settings.soundEnabled) return;
        
        // Create audio context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch (type) {
            case 'capture':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
                
            case 'tick':
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    loadSettings() {
        const saved = localStorage.getItem('photobooth-settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    saveSettings() {
        localStorage.setItem('photobooth-settings', JSON.stringify(this.settings));
    }

    destroy() {
        this.stopCamera();
        this.photos.forEach(photo => URL.revokeObjectURL(photo.url));
    }
}

// Initialize the photobooth when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.photobooth = new PhotoBooth();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.photobooth) {
        window.photobooth.destroy();
    }
});