const pingEl = document.getElementById('ping');
const downloadEl = document.getElementById('download');
const uploadEl = document.getElementById('upload');
const ispEl = document.getElementById('isp');
const ipEl = document.getElementById('ip');
const deviceEl = document.getElementById('device');
const startBtn = document.getElementById('startBtn');

function simulateSpeed(target, el, duration) {
  return new Promise(resolve => {
    let start = 0;
    const interval = 30;
    const steps = duration / interval;
    const increment = target / steps;

    const step = () => {
      start += increment;
      if (start >= target) {
        el.textContent = target.toFixed(2);
        resolve();
      } else {
        el.textContent = start.toFixed(2);
        setTimeout(step, interval);
      }
    };
    step();
  });
}

async function startTest() {
  startBtn.disabled = true;
  pingEl.textContent = '...';
  downloadEl.textContent = '...';
  uploadEl.textContent = '...';

  // Ping simulation
  const ping = Math.floor(Math.random() * 40) + 10;
  await new Promise(r => setTimeout(r, 1000));
  pingEl.textContent = ping;

  // Download speed simulation
  const downloadSpeed = Math.random() * 400 + 50;
  await simulateSpeed(downloadSpeed, downloadEl, 2000);

  // Upload speed simulation
  const uploadSpeed = Math.random() * 100 + 10;
  await simulateSpeed(uploadSpeed, uploadEl, 2000);

  startBtn.disabled = false;
  startBtn.textContent = 'Tes Lagi';
}

// Get IP & ISP
fetch('https://ipinfo.io/json?token=db955ecd23c16c')
  .then(res => res.json())
  .then(data => {
    ispEl.textContent = data.org || 'Tidak diketahui';
    ipEl.textContent = data.ip;
  });

deviceEl.textContent = navigator.userAgent;

startBtn.addEventListener('click', startTest);