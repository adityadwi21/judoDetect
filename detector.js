// --- Fungsi Normalisasi Teks (Tidak berubah) ---
// Catatan: 'replacements' untuk normalisasi masih bisa disimpan di sini karena jarang berubah.
const replacements = { 0: "o", 1: "i", 3: "e", 4: "a", 5: "s", "@": "a", $: "s" /* ...dan seterusnya */ };
const replacementRegex = new RegExp(
  Object.keys(replacements)
    .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "g"
);

function normalizeText(str) {
  if (!str) return "";
  let normalized = str.toLowerCase();
  normalized = normalized.replace(replacementRegex, (match) => replacements[match]);
  normalized = normalized
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "");
  return normalized;
}

// --- Fungsi Deteksi (Menerima 'rules' sebagai parameter) ---

function isNaturalConversation(text, rules) {
  if (!text || !rules.personalWords) return false;
  const normalizedText = text.toLowerCase();
  const personalWordCount = rules.personalWords.filter((word) => normalizedText.includes(word)).length;
  const connectiveWords = ["karena", "sebab", "jadi", "tapi", "namun", "meskipun", "walaupun"];
  const connectiveCount = connectiveWords.filter((word) => normalizedText.includes(word)).length;
  return personalWordCount >= 2 || connectiveCount >= 1;
}

function isJudolByRegex(normalizedText, rules) {
  if (!normalizedText || !rules.judolRegexList || !rules.antiJudolRegex) return false;

  // Membuat objek RegExp dari string di JSON
  const antiJudolPatterns = rules.antiJudolRegex.map((r) => new RegExp(r, "i"));
  const judolPatterns = rules.judolRegexList.map((r) => new RegExp(r, "i"));

  if (antiJudolPatterns.some((regex) => regex.test(normalizedText))) {
    return false;
  }
  return judolPatterns.some((regex) => regex.test(normalizedText));
}

/**
 * Menghitung skor spam, sekarang menggunakan objek 'rules' yang dioper.
 * @param {string} rawText Teks komentar asli.
 * @param {string} author Nama penulis.
 * @param {object} rules Objek berisi semua daftar kata kunci dan regex.
 * @returns {number} Skor dari 0 hingga 100.
 */
function calculateSpamScore(rawText, author, rules) {
  if (!rawText || !rules) return 0;

  let score = 0;
  const normalized = normalizeText(rawText);
  const words = new Set(normalized.split(/\s+/).filter(Boolean));

  if (rules.hardJudolKeywords) {
    for (const hardKeyword of rules.hardJudolKeywords) {
      if (words.has(hardKeyword) || normalized.includes(hardKeyword)) {
        return 95;
      }
    }
  }

  if (isJudolByRegex(normalized, rules)) {
    score += 80;
  }

  if (score < 80) {
    if (isNaturalConversation(rawText, rules)) {
      score -= 20;
    }
    if (rules.legitimateWords && words.size > 0) {
      const legitimateCount = [...words].filter((word) => rules.legitimateWords.includes(word)).length;
      if (legitimateCount / words.size > 0.4) {
        score -= 25;
      }
    }
  }

  if (rules.gamblingEmojis && rules.gamblingEmojis.some((emoji) => rawText.includes(emoji))) {
    score += 25;
  }

  if (author && /-[a-zA-Z0-9]{4,}/.test(author)) {
    score += 10;
  }

  return Math.max(0, Math.min(score, 100));
}
