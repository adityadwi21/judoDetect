// Ganti dengan URL Raw dari GitHub Gist Anda
const RULES_URL = "URL_RAW_GIST_ANDA";

/**
 * Mengambil aturan dari URL, membandingkan versi, dan menyimpannya jika baru.
 */
async function fetchAndUpdateRules() {
  console.log("[Judol Detector] Checking for new rules...");
  try {
    const response = await fetch(RULES_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch rules: ${response.statusText}`);
    }
    const newRules = await response.json();

    // Ambil aturan yang tersimpan saat ini untuk perbandingan versi
    chrome.storage.local.get("judol_rules", (data) => {
      const currentVersion = data.judol_rules?.version || 0;

      if (newRules.version > currentVersion) {
        console.log(`[Judol Detector] New rules found! Version ${newRules.version}. Updating...`);
        // Simpan aturan baru ke storage
        chrome.storage.local.set({ judol_rules: newRules }, () => {
          console.log("[Judol Detector] Rules updated successfully.");
        });
      } else {
        console.log("[Judol Detector] Rules are already up to date.");
      }
    });
  } catch (error) {
    console.error("[Judol Detector] Could not update rules:", error);
  }
}

// Saat ekstensi diinstal atau diperbarui
chrome.runtime.onInstalled.addListener((details) => {
  console.log("[Judol Detector] Extension installed or updated.");

  // Langsung perbarui aturan saat pertama kali
  fetchAndUpdateRules();

  // Buat alarm untuk memeriksa pembaruan setiap 12 jam
  chrome.alarms.create("updateRulesAlarm", {
    delayInMinutes: 1, // Jalankan pertama kali setelah 1 menit
    periodInMinutes: 12 * 60, // Ulangi setiap 12 jam
  });
});

// Saat alarm berbunyi
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateRulesAlarm") {
    fetchAndUpdateRules();
  }
});

// Menangani pesan dari skrip konten (tetap sama)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateStats") {
    const count = request.spamCount;
    const tabId = sender.tab?.id;
    if (tabId) {
      chrome.action.setBadgeText({
        text: count > 0 ? count.toString() : "",
        tabId: tabId,
      });
      chrome.action.setBadgeBackgroundColor({
        color: "#ef4444",
        tabId: tabId,
      });
    }
  }
});
