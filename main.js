/**
 * Fungsi Debounce untuk membatasi frekuensi pemanggilan sebuah fungsi.
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// --- Variabel Global untuk Aturan dan Cache ---
let judolRules = null;
const spammerAuthors = new Set();
const commentCache = new Map();

/**
 * Memindai halaman untuk komentar baru, sekarang menggunakan aturan yang sudah dimuat.
 */
async function scanComments() {
  // Jangan jalankan pemindaian jika aturan belum dimuat
  if (!judolRules) {
    console.warn("[Judol Detector] Waiting for rules to be loaded...");
    return;
  }

  const commentsToScan = Array.from(document.querySelectorAll("ytd-comment-thread-renderer #content-text:not([data-scanned='true'])"));
  if (commentsToScan.length === 0) return;

  console.log(`[Judol Detector] Scanning ${commentsToScan.length} new comments...`);
  showScanningUI(true);

  let spamFoundInScan = 0;

  for (const el of commentsToScan) {
    el.dataset.scanned = "true";
    stats.scanned++;

    const rawText = el.textContent?.trim();
    const authorElement = el.closest("#comment")?.querySelector("#author-text");
    const author = authorElement?.textContent?.trim();
    if (!rawText || !author) continue;

    // Gunakan fungsi calculateSpamScore dengan mengoper aturan
    const spamScore = calculateSpamScore(rawText, author, judolRules.config);
    const isSpam = spamScore >= 60;

    if (isSpam) {
      stats.spam++;
      spamFoundInScan++;
      blurComment(el, spamScore);
      spammerAuthors.add(author);
    }
  }

  showScanningUI(false);
  console.log(`[Judol Detector] Scan completed. Found ${spamFoundInScan} new spam comments.`);

  if (chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({
      action: "updateStats",
      spamCount: stats.spam,
    });
  }
}

const debouncedScan = debounce(scanComments, 500);

/**
 * Menginisialisasi pemantau dan memulai pemindaian setelah aturan dimuat.
 */
function initializeObserver() {
  console.log("🛡️ Judol Detector is now active and observing for new comments.");
  const observer = new MutationObserver(() => debouncedScan());

  const commentsSection = document.querySelector("#comments");
  if (commentsSection) {
    observer.observe(commentsSection, { childList: true, subtree: true });
  } else {
    observer.observe(document.body, { childList: true, subtree: true });
  }

  setTimeout(debouncedScan, 1000);
}

/**
 * Fungsi utama: Memuat aturan dari storage, lalu menginisialisasi sisanya.
 */
function main() {
  console.log("🛡️ Judol Detector Initializing...");
  chrome.storage.local.get("judol_rules", (data) => {
    if (data.judol_rules && data.judol_rules.config) {
      judolRules = data.judol_rules;
      console.log(`[Judol Detector] Rules loaded (Version: ${judolRules.version}). Starting observer.`);
      initializeObserver();
    } else {
      console.warn("[Judol Detector] No rules found in local storage. The detector will be idle until rules are fetched.");
      // Anda bisa menambahkan fallback atau menunggu pembaruan dari background script
    }
  });
}

// Jalankan fungsi utama
main();
