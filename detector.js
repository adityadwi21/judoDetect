function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Create replacement regex after replacements object is defined
let replacementRegex;

function initializeReplacementRegex() {
  if (typeof replacements !== 'undefined') {
    replacementRegex = new RegExp(Object.keys(replacements).map(escapeRegExp).join("|"), "g");
  }
}

function normalizeText(str) {
  if (!str) return "";
  
  // Initialize regex if not already done
  if (!replacementRegex) {
    initializeReplacementRegex();
  }
  
  let normalized = str.replace(/[\uFE0F\u20E3]/g, "");
  normalized = normalized.toLowerCase();
  
  // Only apply replacements if regex is available
  if (replacementRegex) {
    normalized = normalized.replace(replacementRegex, (match) => replacements[match]);
  }
  
  normalized = normalized
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "");
  return normalized;
}

function isNaturalConversation(text) {
  if (!text) return false;
  
  const normalizedText = text.toLowerCase();
  
  // Check if personalWords is defined
  if (typeof personalWords === 'undefined') {
    console.warn('personalWords not defined');
    return false;
  }
  
  const personalWordCount = Array.from(personalWords).filter((word) => 
    normalizedText.includes(word)
  ).length;
  
  const connectiveWords = [
    "karena", "sebab", "jadi", "tapi", "tetapi", "namun", "meskipun", 
    "walaupun", "kalau", "jika", "bila", "supaya", "agar", "untuk", 
    "dengan", "tanpa", "seperti", "bagaikan", "ibarat"
  ];
  
  const connectiveCount = connectiveWords.filter((word) => 
    normalizedText.includes(word)
  ).length;
  
  return personalWordCount >= 2 || connectiveCount >= 2;
}

function isJudolByRegex(normalizedText) {
  if (!normalizedText) return false;
  
  // Check if regex arrays are defined
  if (typeof antiJudolRegex === 'undefined' || typeof judolRegexList === 'undefined') {
    console.warn('Regex arrays not defined');
    return false;
  }
  
  // Check anti-judol patterns first
  if (antiJudolRegex.some((regex) => regex.test(normalizedText))) {
    return false;
  }
  
  // Check judol patterns
  return judolRegexList.some((regex) => regex.test(normalizedText));
}

function calculateSpamScore(rawText, author) {
  if (!rawText) return 0;
  
  let score = 0;
  const normalized = normalizeText(rawText);
  const words = new Set(normalized.split(/\s+/).filter(word => word.length > 0));

  // Check hard keywords
  if (typeof hardJudolKeywords !== 'undefined') {
    for (const hardKeyword of hardJudolKeywords) {
      if (words.has(hardKeyword)) {
        console.log(`Hard keyword VETO: "${hardKeyword}"`);
        return 95;
      }
    }
  }

  // Check regex patterns
  if (isJudolByRegex(normalized)) {
    score += 80;
  }

  // Apply reductions only if score is below threshold
  if (score < 80) {
    // Natural conversation check
    if (isNaturalConversation(rawText)) {
      score -= 20;
    }
    
    // Legitimate words check
    if (typeof legitimateWords !== 'undefined') {
      const legitimateCount = Array.from(words).filter((word) => 
        legitimateWords.has(word)
      ).length;
      
      if (words.size > 0 && legitimateCount / words.size > 0.4) {
        score -= 25;
      }
    }
  }

  // Check gambling emojis
  if (typeof gamblingEmojis !== 'undefined') {
    if (gamblingEmojis.some((emoji) => rawText.includes(emoji))) {
      score += 25;
    }
  }

  // Check suspicious author pattern
  if (author && /-[a-zA-Z0-9]{3,}/.test(author)) {
    score += 10;
  }

  return Math.max(0, Math.min(score, 100));
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeReplacementRegex);
} else {
  initializeReplacementRegex();
}