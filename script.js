function startTest() {
  document.getElementById("status").textContent = "Mengukur kecepatan...";
  const speedValue = document.getElementById("speedValue");
  const needle = document.getElementById("needle");

  // Simulasi kecepatan acak (0 - 100 Mbps)
  const simulatedSpeed = (Math.random() * 100).toFixed(2);
  speedValue.innerHTML = simulatedSpeed + " <span>Mbps</span>";

  // Konversi ke sudut jarum (-120° s.d. +120°)
  const angle = (simulatedSpeed / 100) * 240 - 120;
  needle.style.transform = `rotate(${angle}deg)`;

  // Ubah status
  setTimeout(() => {
    document.getElementById("status").textContent = "Tes selesai!";
  }, 1200);
}
