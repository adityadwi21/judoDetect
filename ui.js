let stats = { scanned: 0, spam: 0, whitelisted: 0 };
let uiElements = {};

/**
 * Membuat dan menambahkan elemen UI awal (progress bar) ke halaman.
 */
function createUIPanels() {
  // Mencegah pembuatan UI duplikat
  if (document.querySelector(".judol-progress")) {
    return;
  }

  // Buat container progress bar
  const progressContainer = document.createElement("div");
  progressContainer.className = "judol-progress";

  const progressBar = document.createElement("div");
  progressBar.className = "judol-progress-bar";

  progressContainer.appendChild(progressBar);
  document.body.appendChild(progressContainer);

  uiElements = { progressContainer, progressBar };

  console.log("UI panels created.");
}

/**
 * Menampilkan atau menyembunyikan progress bar pemindaian.
 * @param {boolean} isScanning - Apakah akan menampilkan UI pemindaian.
 */
function showScanningUI(isScanning) {
  if (!uiElements.progressContainer) return;

  if (isScanning) {
    uiElements.progressContainer.style.display = "block";
    uiElements.progressBar.style.width = "0%";
  } else {
    // Animasikan hingga 100% lalu sembunyikan
    uiElements.progressBar.style.width = "100%";
    setTimeout(() => {
      if (uiElements.progressContainer) {
        uiElements.progressContainer.style.display = "none";
      }
    }, 500);
  }
}

/**
 * Mendapatkan kelas CSS dan info gaya berdasarkan skor kepercayaan.
 * @param {number} confidence - Skor kepercayaan spam (0-100).
 * @returns {object} Objek dengan info tingkat keparahan.
 */
function getSeverityInfo(confidence) {
  if (confidence >= 90) {
    return { severity: "high-severity", blurAmount: "12px" };
  } else if (confidence >= 75) {
    return { severity: "medium-severity", blurAmount: "8px" };
  } else {
    return { severity: "low-severity", blurAmount: "5px" };
  }
}

/**
 * Memburamkan elemen komentar dan menyisipkan panel peringatan.
 * @param {HTMLElement} el - Elemen konten komentar.
 * @param {number} confidence - Skor kepercayaan spam.
 */
function blurComment(el, confidence) {
  if (!el || el.dataset.judol === "processed") return;

  const { severity, blurAmount } = getSeverityInfo(confidence);

  // Tandai sebagai telah diproses untuk mencegah pemrosesan ulang
  el.dataset.judol = "processed";
  el.dataset.hidden = "true";

  // Terapkan blur melalui kelas CSS
  el.classList.add("judol-blur", severity);

  // Buat elemen peringatan menggunakan kelas CSS, bukan style inline
  const warning = document.createElement("div");
  warning.className = `judol-warning ${severity}`;

  warning.innerHTML = `
    <div class="judol-warning-header">
      🚨 Komentar ini berisiko (${Math.round(confidence)}%)
      <span class="confidence-indicator"></span>
    </div>
    <a class="toggle-comment">Tampilkan Komentar</a>
  `;

  // Sisipkan peringatan setelah elemen komentar
  el.parentNode.insertBefore(warning, el.nextSibling);

  // Tambahkan fungsionalitas toggle
  const toggleButton = warning.querySelector(".toggle-comment");
  toggleButton.addEventListener("click", (e) => {
    e.preventDefault();
    const isHidden = el.dataset.hidden === "true";

    el.style.filter = isHidden ? "none" : `blur(${blurAmount})`;
    el.dataset.hidden = isHidden ? "false" : "true";
    toggleButton.textContent = isHidden ? "Sembunyikan Komentar" : "Tampilkan Komentar";
  });
}

// Inisialisasi panel UI saat skrip dimuat
createUIPanels();
