const spammerAuthors = new Set();
const whitelistedAuthors = new Set();
const commentCache = new Map();

const hardJudolKeywords = new Set([
  "mamajitu",
  "topas808",
  "visi4d",
  "mona4d",
  "zeus77",
  "slot88",
  "dana4d",
  "weton88",
  "ligajp",
  "dewaslot",
  "gacorx",
  "slotku",
  "maxcuan",
  "jpkali",
  "autojp",
  "scatternet",
  "modalreceh",
  "wdgacor",
  "batre4d",
  "probet855",
  "kyt4d",
  "pstoto99",
  "indokasino",
]);

const legitimateWords = new Set([
  "bagus",
  "keren",
  "mantap",
  "seru",
  "lucu",
  "sedih",
  "menangis",
  "tertawa",
  "video",
  "musik",
  "lagu",
  "film",
  "game",
  "tutorial",
  "review",
  "reaction",
  "pertama",
  "kedua",
  "ketiga",
  "terakhir",
  "awal",
  "akhir",
  "tengah",
  "thanks",
  "terimakasih",
  "makasih",
  "good",
  "nice",
  "wow",
  "amazing",
  "subscribe",
  "like",
  "share",
  "comment",
  "notification",
  "bell",
  "makan",
  "makanan",
  "masak",
  "resep",
  "enak",
  "lezat",
  "gurih",
  "manis",
  "ambil",
  "sendok",
  "piring",
  "loyang",
  "habis",
  "habiskan",
  "sikat",
  "belok",
  "nyendok",
  "satu",
  "semuanya",
  "padahal",
  "cuma",
  "malah",
  "bebas",
  "minus",
  "diabetes",
  "boleh",
  "banyak",
  "harus",
  "karena",
  "luar",
  "sana",
  "masih",
  "belum",
  "mampu",
  "hargai",
  "hargailah",
  "jangan",
  "sia",
  "siakan",
  "diangkat",
  "dulu",
  "gak",
  "langsung",
  "ada",
  "bawah",
  "bawahnya",
  "adil",
  "itumah",
  "yah",
  "asal",
  "diabisin",
  "ajah",
  "ya",
  "buat",
  "bahan",
  "mainan",
  "cara",
  "ngambil",
  "ngambilnya",
  "estetik",
  "kalo",
  "sisanya",
  "kayak",
  "gitu",
  "emang",
  "orang",
  "lain",
  "mau",
  "ini",
  "adalah",
  "gambaran",
  "betapa",
  "serakah",
  "serakahnya",
  "manusia",
  "dan",
  "lagi",
  "inspiratif",
  "terharu",
  "kaget",
  "gokil",
  "ngakak",
  "wkwk",
  "haha",
  "hehe",
  "sakit perut",
  "baper",
  "setuju",
  "betul",
  "bener",
  "asli",
  "sumpah",
  "keren banget",
  "mantap jiwa",
  "gila",
  "parah",
  "keren parah",
  "bang",
  "kak",
  "bro",
  "sist",
  "gan",
  "min",
  "om",
  "tante",
  "guys",
  "gaes",
  "btw",
  "otw",
  "mantul",
  "gas",
  "skuy",
  "vlog",
  "podcast",
  "streaming",
  "shorts",
  "reels",
  "unboxing",
  "gadget",
  "hp",
  "komputer",
  "laptop",
  "kamera",
  "mobil",
  "motor",
  "modifikasi",
  "makeup",
  "skincare",
  "outfit",
  "ootd",
  "liburan",
  "jalan-jalan",
  "healing",
  "pantai",
  "gunung",
  "wisata",
  "kuliner",
  "nongkrong",
  "cafe",
  "banget",
  "sekali",
  "sangat",
  "lumayan",
  "cukup",
  "selalu",
  "sering",
  "jarang",
  "juga",
  "sih",
  "dong",
  "kok",
  "kan",
  "aja",
  "hanya",
  "memang",
  "akhirnya",
  "pasti",
  "mungkin",
  "semoga",
  "nonton",
  "lihat",
  "dengar",
  "coba",
  "belajar",
  "tanya",
  "jawab",
  "kasih",
  "tunggu",
  "ikut",
  "datang",
  "pulang",
  "beli",
  "jual",
  "punya",
]);

const personalWords = new Set([
  "aku",
  "saya",
  "gue",
  "gw",
  "kita",
  "kamu",
  "kalian",
  "dia",
  "mereka",
  "mama",
  "papa",
  "ibu",
  "bapak",
  "ayah",
  "adik",
  "kakak",
  "keluarga",
  "teman",
  "sahabat",
  "pacar",
  "suami",
  "istri",
  "anak",
  "orang tua",
  "rumah",
  "sekolah",
  "kantor",
  "kampus",
  "kelas",
  "guru",
  "dosen",
  "pernah",
  "ingat",
  "cerita",
  "pengalaman",
  "kisah",
  "masa",
  "waktu",
  "dulu",
  "sekarang",
  "kemarin",
  "besok",
  "hari",
  "jam",
  "menit",
  "senang",
  "sedih",
  "marah",
  "takut",
  "khawatir",
  "bahagia",
  "kecewa",
  "malam",
  "pagi",
  "siang",
  "sore",
  "subuh",
  "maghrib",
  "isya",
  "ane",
  "doi",
  "gebetan",
  "nenek",
  "kakek",
  "cucu",
  "sepupu",
  "ponakan",
  "paman",
  "bibi",
  "mertua",
  "ipar",
  "tetangga",
  "pasangan",
  "kangen",
  "rindu",
  "capek",
  "lelah",
  "pegal",
  "bingung",
  "penasaran",
  "semangat",
  "bangga",
  "bersyukur",
  "sakit",
  "sehat",
  "lapar",
  "haus",
  "kerja",
  "liburan",
  "belanja",
  "pasar",
  "warung",
  "kosan",
  "kontrakan",
  "kamar",
  "dapur",
  "garasi",
  "halaman",
  "kampung",
  "kota",
  "desa",
  "nanti",
  "lusa",
  "minggu",
  "bulan",
  "tahun",
  "lebaran",
  "natal",
  "ulang tahun",
  "nikahan",
  "acara",
  "momen",
  "kenangan",
]);

const judolRegexList = [
  /\b(mona4d|zeus77|slot88|dana4d|weton88|mpo\d+|oy4d|rtpslot|ligajp|dewaslot|mamajitu|gacorx|slotku|maxcuan|jpkali|autojp|scatternet|modalreceh|wdgacor|slotonline|jpauto|toto\d+|pragmaticplay|pgsoft|habanero|microgaming|playtech|visi4d|garuda\d+|kakekmerah|kakekzeus|scatterhitam|indokasino)\b/i,
  /\b(daftar|login|klik|join|kunjungi|cek|cekbio|linkdibio|gabung|masuk|register|mampir|sikat|gasin|gaskeun|kuy)\s.*?\b(slot|gacor|jp|wd|maxwin|toto|situs|casino|bet|rtp|agen|bandar|jepe)\b/i,
  /\b(slot|gacor|jp|wd|maxwin|toto|situs|casino|bet|rtp|agen|bandar)\s.*?\b(ada\sdi|cek|klik|kunjungi|link\sdi)\s?(bio|profil|komen|pin)\b/i,
  /\b(bonus|cashback|deposit|depo|withdraw|wd|member\s?baru|new\s?member|welcome|freespin|freebet|promo|diskon|modal\s?receh|depo\s?\d+k?)\s.*?\b(slot|gacor|situs|resmi|judi|bet|casino)\b/i,
  /\b(rtp\s?(?:tinggi|slot|live)|pola\s?(?:gacor|slot)|scatter\s?(?:hitam|gratis|merah)|maxwin|freespin|freebet|wildcard|jackpot|bigwin|megawin|sensasional|anti\s?(?:rungkad|zonk|kalah)|pasti\s?bayar|pasti\s?wd|mahjong\s?ways|gates\s?of\s?olympus|starlight\s?princess)\b/i,
  /\b\w+\s?(\.|\[\s?\.\s?\]|\(\s?\.\s?\)|dot|dt|titik|・)\s?(com|net|org|xyz|io|link|cc|co|id|me|site|online|live|shop|asia)\s?\b/i,
  /(\w+\s\w+)\.(com|net|org|xyz|io|link|cc|co|id|me|site|online|live|shop|asia)/i,
  /\b(cek|klik|hubungi|contact|info|tanya|chat)\s.*?\b(bio|link|profil|wa|whatsapp|tele|telegram|dm|pm|admin|cs)\s.*?\b(slot|gacor|jp|bet|judi|casino)\b/i,
  /\b((?:08|628|\+62)\d{7,13})\s.*?\b(slot|gacor|jp|maxwin|wd|bet|judi|casino|daftar|agen)\b/i,
  /\b(menang|profit|untung|cuan|duit|uang|rupiah|ribu|juta|milyar|wd\s?terus|jp\s?terus|maxwin|caerr)\s.*?(mudah|gampang|cepat|langsung|pasti|dijamin)\s.*?\b(slot|bet|judi|gacor|main\s?di|hanya\s?di)\b/i,
  /\b(main|cuan|gacor|jp|wd|hoki|seru|hiburan|rekomendasi|iseng|gabut|profit|terbaik|terpercaya|aman|resmi)\s.{0,30}\b(visi4d|topas808|batre4d|probet855|mamajitu|mona4d|zeus77|slot88|kyt4d|pstoto99|indokasino)\b/i,
  /\b(visi4d|topas808|batre4d|probet855|mamajitu|mona4d|zeus77|slot88|kyt4d|pstoto99|indokasino)\s.{0,30}\b(main|cuan|gacor|jp|wd|hoki|seru|hiburan|rekomendasi|iseng|gabut|profit|terbaik|terpercaya|aman|resmi)\b/i,
];

const antiJudolRegex = [
  /\b(makan|makanan|minum|minuman|masak|resep|enak|lezat|gurih|manis|asin|pedas|pahit|asam|lapar|haus|sarapan|camilan|jajanan)\b/i,
  /\b(keluarga|mama|papa|ibu|bapak|ayah|adik|kakak|anak|orang\s?tua|kakek|nenek|suami|istri|pacar|teman|sahabat|kenalan)\b/i,
  /\b(sekolah|kampus|kelas|guru|dosen|ujian|tugas|pr|pelajaran|belajar|kerja|kantor|rapat|presentasi)\b/i,
  /\b(rumah|kamar|dapur|ruang\s?tamu|tidur|mandi|toilet|bangun|olahraga|nonton|baca|buku|novel|komik|film)\b/i,
  /\b(main|bermain|game|permainan|puzzle|teka\s?teki|mabar|mobalog|ff|valorant|genshin|minecraft|roblox|موبایل)\b/i,
  /\b(cerita|kisah|pengalaman|ingat|kenang|kenangan|masa\s?lalu|dulu|mimpi|sedih|senang|bahagia|terharu)\b/i,
  /\b(sakit|sehat|dokter|obat|rumah\s?sakit|apotek|puskesmas|capek|lelah|sembuh)\b/i,
];

const replacements = {
  0: "o",
  1: "i",
  2: "z",
  3: "e",
  4: "a",
  5: "s",
  6: "g",
  7: "t",
  8: "b",
  9: "g",
  "@": "a",
  "&": "n",
  $: "s",
  "£": "e",
  "€": "e",
  "¥": "y",
  "!": "i",
  "¡": "i",
  "|": "l",
  "(": "c",
  "{": "c",
  "[": "c",
  "/\\": "a",
  "\\/": "v",
  "\\^/": "m",
  "|V|": "m",
  "[]D": "b",
  "|3": "b",
  "|>": "d",
  "|*": "d",
  "|#": "h",
  "|X|": "h",
  "[]_[]": "h",
  "\\_\\": "u",
  "\\_|_/": "u",
  "0️⃣": "0",
  "1️⃣": "1",
  "2️⃣": "2",
  "3️⃣": "3",
  "4️⃣": "4",
  "5️⃣": "5",
  "6️⃣": "6",
  "7️⃣": "7",
  "8️⃣": "8",
  "9️⃣": "9",
  "🔟": "10",
  "０": "0",
  "１": "1",
  "２": "2",
  "３": "3",
  "４": "4",
  "５": "5",
  "６": "6",
  "７": "7",
  "８": "8",
  "９": "9",
  "𝟎": "0",
  "𝟏": "1",
  "𝟐": "2",
  "𝟑": "3",
  "𝟒": "4",
  "𝟓": "5",
  "𝟔": "6",
  "𝟕": "7",
  "𝟖": "8",
  "𝟗": "9",
  "𝟶": "0",
  "𝟷": "1",
  "𝟸": "2",
  "𝟹": "3",
  "𝟺": "4",
  "𝟻": "5",
  "𝟼": "6",
  "𝟽": "7",
  "𝟾": "8",
  "𝟿": "9",
  "𝟬": "0",
  "𝟭": "1",
  "𝟮": "2",
  "𝟯": "3",
  "𝟰": "4",
  "𝟱": "5",
  "𝟲": "6",
  "𝟳": "7",
  "𝟴": "8",
  "𝟵": "9",
  "𝟢": "0",
  "𝟣": "1",
  "𝟤": "2",
  "𝟥": "3",
  "𝟦": "4",
  "𝟧": "5",
  "𝟨": "6",
  "𝟩": "7",
  "𝟪": "8",
  "𝟫": "9",
  "𝟙": "1",
  "𝟚": "2",
  "𝟛": "3",
  "𝟜": "4",
  "𝟝": "5",
  "𝟞": "6",
  "𝟟": "7",
  "𝟠": "8",
  "𝟡": "9",
  "𝟘": "0",
  "🄋": "0",
  "➀": "1",
  "➁": "2",
  "➂": "3",
  "➃": "4",
  "➄": "5",
  "➅": "6",
  "➆": "7",
  "➇": "8",
  "➈": "9",
  "🅰️": "a",
  "🅱️": "b",
  "🅾️": "o",
  "🆎": "ab",
  "🆑": "cl",
  "🆒": "cool",
  "🆓": "free",
  "🆔": "id",
  "🆕": "new",
  "🆖": "ng",
  "🆘": "sos",
  "🆙": "up",
  "🆚": "vs",
  Ａ: "a",
  Ｂ: "b",
  Ｃ: "c",
  Ｄ: "d",
  Ｅ: "e",
  Ｆ: "f",
  Ｇ: "g",
  Ｈ: "h",
  Ｉ: "i",
  Ｊ: "j",
  Ｋ: "k",
  Ｌ: "l",
  Ｍ: "m",
  Ｎ: "n",
  Ｏ: "o",
  Ｐ: "p",
  Ｑ: "q",
  Ｒ: "r",
  Ｓ: "s",
  Ｔ: "t",
  Ｕ: "u",
  Ｖ: "v",
  Ｗ: "w",
  Ｘ: "x",
  Ｙ: "y",
  Ｚ: "z",
  ａ: "a",
  ｂ: "b",
  ｃ: "c",
  ｄ: "d",
  ｅ: "e",
  ｆ: "f",
  ｇ: "g",
  ｈ: "h",
  ｉ: "i",
  ｊ: "j",
  ｋ: "k",
  ｌ: "l",
  ｍ: "m",
  ｎ: "n",
  ｏ: "o",
  ｐ: "p",
  ｑ: "q",
  ｒ: "r",
  ｓ: "s",
  ｔ: "t",
  ｕ: "u",
  ｖ: "v",
  ｗ: "w",
  ｘ: "x",
  ｙ: "y",
  ｚ: "z",
  "⒜": "a",
  "⒝": "b",
  "⒞": "c",
  "⒟": "d",
  "⒠": "e",
  "⒡": "f",
  "⒢": "g",
  "⒣": "h",
  "⒤": "i",
  "⒥": "j",
  "⒦": "k",
  "⒧": "l",
  "⒨": "m",
  "⒩": "n",
  "⒪": "o",
  "⒫": "p",
  "⒬": "q",
  "⒭": "r",
  "⒮": "s",
  "⒯": "t",
  "⒰": "u",
  "⒱": "v",
  "⒲": "w",
  "⒳": "x",
  "⒴": "y",
  "⒵": "z",
  "Ⓐ": "a",
  "Ⓑ": "b",
  "Ⓒ": "c",
  "Ⓓ": "d",
  "Ⓔ": "e",
  "Ⓕ": "f",
  "Ⓖ": "g",
  "Ⓗ": "h",
  "Ⓘ": "i",
  "Ⓙ": "j",
  "Ⓚ": "k",
  "Ⓛ": "l",
  "Ⓜ️": "m",
  "Ⓝ": "n",
  "Ⓞ": "o",
  "Ⓟ": "p",
  "Ⓠ": "q",
  "Ⓡ": "r",
  "Ⓢ": "s",
  "Ⓣ": "t",
  "Ⓤ": "u",
  "Ⓥ": "v",
  "Ⓦ": "w",
  "Ⓧ": "x",
  "Ⓨ": "y",
  "Ⓩ": "z",
  "𝐕": "v",
  "𝐈": "i",
  "𝐒": "s",
  "𝐃": "d",
  "𝑷": "p",
  "𝑶": "o",
  "🅘": "i",
  "🅝": "n",
  "🅓": "d",
  "🅞": "o",
  "🅚": "k",
  "🅐": "a",
  "🅢": "s",
  "🅒": "c",
  "🅔": "e",
  "🅕": "f",
  "🅖": "g",
  "🅗": "h",
  "🅙": "j",
  "🅛": "l",
  "🅜": "m",
  "🅟": "p",
  "🅠": "q",
  "🅡": "r",
  "🅣": "t",
  "🅤": "u",
  "🅥": "v",
  "🅦": "w",
  "🅧": "x",
  "🅨": "y",
  "🅩": "z",
  "𝓐": "a",
  "𝓑": "b",
  "𝓒": "c",
  "𝓓": "d",
  "𝓔": "e",
  "𝓕": "f",
  "𝓖": "g",
  "𝓗": "h",
  "𝓘": "i",
  "𝓙": "j",
  "𝓚": "k",
  "𝓛": "l",
  "𝓜": "m",
  "𝓝": "n",
  "𝓞": "o",
  "𝓟": "p",
  "𝓠": "q",
  "𝓡": "r",
  "𝓢": "s",
  "𝓣": "t",
  "𝓤": "u",
  "𝓥": "v",
  "𝓦": "w",
  "𝓧": "x",
  "𝓨": "y",
  "𝓩": "z",
  "・": ".",
  "•": ".",
  "·": ".",
  "․": ".",
  "‧": ".",
  "∙": ".",
  "｡": ".",
  "…": "...",
  "‘": "'",
  "’": "'",
  "`": "'",
  "´": "'",
  "“": '"',
  "”": '"',
  "„": '"',
  "«": '"',
  "»": '"',
  "–": "-",
  "—": "-",
  "―": "-",
  _: " ",
  "　": " ",
};
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const replacementRegex = new RegExp(Object.keys(replacements).map(escapeRegExp).join("|"), "g");

function normalizeText(str) {
  if (!str) return "";
  let normalized = str.replace(/[\uFE0F\u20E3]/g, "");
  normalized = normalized.toLowerCase();
  normalized = normalized.replace(replacementRegex, (match) => replacements[match]);
  normalized = normalized
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "");
  return normalized;
}

function isNaturalConversation(text) {
  const normalizedText = text.toLowerCase();
  const personalWordCount = Array.from(personalWords).filter((word) => normalizedText.includes(word)).length;
  const connectiveWords = ["karena", "sebab", "jadi", "tapi", "tetapi", "namun", "meskipun", "walaupun", "kalau", "jika", "bila", "supaya", "agar", "untuk", "dengan", "tanpa", "seperti", "bagaikan", "ibarat"];
  const connectiveCount = connectiveWords.filter((word) => normalizedText.includes(word)).length;
  return personalWordCount >= 2 || connectiveCount >= 2;
}

function isJudolByRegex(normalizedText) {
  if (antiJudolRegex.some((regex) => regex.test(normalizedText))) {
    return false;
  }
  return judolRegexList.some((regex) => regex.test(normalizedText));
}

function calculateSpamScore(rawText, author) {
  let score = 0;
  const normalized = normalizeText(rawText);
  const words = new Set(normalized.split(/\s+/));

  for (const hardKeyword of hardJudolKeywords) {
    if (words.has(hardKeyword)) {
      console.log(`Hard keyword VETO: "${hardKeyword}"`);
      return 95;
    }
  }

  if (isJudolByRegex(normalized)) score += 80;

  if (score < 80) {
    if (isNaturalConversation(rawText)) score -= 20;
    const legitimateCount = Array.from(words).filter((word) => legitimateWords.has(word)).length;
    if (legitimateCount / words.size > 0.4) score -= 25;
  }

  if (gamblingEmojis.some((emoji) => rawText.includes(emoji))) score += 25;
  if (author && /-[a-zA-Z0-9]{3,}/.test(author)) score += 10;

  return Math.max(0, Math.min(score, 100));
}

let stats = { scanned: 0, spam: 0, whitelisted: 0 };
let uiElements = {};
const gamblingEmojis = ["💰", "🎰", "💎", "🌟", "🎯", "⚡", "💵"];

function createUIPanels() {
  const progressContainer = document.createElement("div");
  progressContainer.className = "judol-progress";
  progressContainer.style.display = "none";
  const progressBar = document.createElement("div");
  progressBar.className = "judol-progress-bar";
  progressContainer.appendChild(progressBar);
  document.body.appendChild(progressContainer);
  uiElements = { progressContainer, progressBar };
}

function showScanningUI(isScanning) {
  if (!uiElements.progressContainer) return;
  if (isScanning) {
    uiElements.progressContainer.style.display = "block";
    uiElements.progressBar.style.width = "0%";
  } else {
    uiElements.progressBar.style.width = "100%";
    setTimeout(() => {
      uiElements.progressContainer.style.display = "none";
    }, 500);
  }
}

function blurComment(el, confidence) {
  let severity, confidenceClass;
  if (confidence >= 90) {
    severity = "high-severity";
    confidenceClass = "confidence-high";
  } else if (confidence >= 75) {
    severity = "medium-severity";
    confidenceClass = "confidence-medium";
  } else {
    severity = "low-severity";
    confidenceClass = "confidence-low";
  }

  el.classList.add("judol-blur", severity);
  el.dataset.judol = "true";
  el.dataset.hidden = "true";

  const warning = document.createElement("div");
  warning.className = "judol-warning " + severity;
  warning.innerHTML = `
        <div style="display:flex; align-items:center; font-weight:bold; margin-bottom: 4px; color: black;">
            🚨 Komentar ini berisiko (${confidence}%)
            <span class="confidence-indicator ${confidenceClass}"></span>
        </div>
        <a class="toggle-comment">Tampilkan Komentar</a>
    `;
  el.after(warning);

  warning.querySelector(".toggle-comment").onclick = (e) => {
    e.preventDefault();
    const isHidden = el.dataset.hidden === "true";
    el.style.filter = isHidden ? "none" : `blur(${severity === "high-severity" ? "12px" : severity === "medium-severity" ? "8px" : "5px"})`;
    el.dataset.hidden = isHidden ? "false" : "true";
    e.target.textContent = isHidden ? "Sembunyikan Komentar" : "Tampilkan Komentar";
  };
}

async function scanComments() {
  const commentsToScan = Array.from(document.querySelectorAll("ytd-comment-thread-renderer #content-text:not([data-scanned])"));
  if (commentsToScan.length === 0) return;

  showScanningUI(true);

  for (let i = 0; i < commentsToScan.length; i++) {
    const el = commentsToScan[i];
    el.dataset.scanned = "true";
    stats.scanned++;

    const rawText = el.textContent?.trim();
    const author = el.closest("#comment")?.querySelector("#author-text")?.textContent?.trim();

    if (!rawText || !author) continue;
    if (whitelistedAuthors.has(author)) continue;
    if (spammerAuthors.has(author)) {
      blurComment(el, 95);
      stats.spam++;
      continue;
    }
    if (rawText.length < 15 && !/(slot|gacor|jp|bet|casino|judi)/.test(rawText.toLowerCase())) continue;

    const cacheKey = `${author}:${rawText.slice(0, 50)}`;
    const cachedResult = commentCache.get(cacheKey);
    if (cachedResult) {
      if (cachedResult.isSpam) {
        blurComment(el, cachedResult.confidence);
        spammerAuthors.add(author);
        stats.spam++;
      }
      continue;
    }

    const spamScore = calculateSpamScore(rawText, author);
    const isSpam = spamScore >= 65;

    commentCache.set(cacheKey, { isSpam, confidence: spamScore });

    if (isSpam) {
      stats.spam++;
      blurComment(el, spamScore);
      spammerAuthors.add(author);
    } else if (spamScore < 10) {
      whitelistedAuthors.add(author);
    }

    if (uiElements.progressBar) {
      uiElements.progressBar.style.width = `${((i + 1) / commentsToScan.length) * 100}%`;
    }
  }
  showScanningUI(false);
}

function initialize() {
  const style = document.createElement("style");
  style.textContent = `
        :root {
          --color-high: #ef4444; --color-medium: #f59e0b; --color-low: #eab308; --color-scan: #3b82f6; --color-text-dark: #f9fafb; --color-text-light: #2d3748;
          --bg-high-light: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); --bg-medium-light: linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%); --bg-low-light: linear-gradient(135deg, #fefce8 0%, #fde68a 100%); --bg-warning-dark: linear-gradient(135deg, #1f1f1f 0%, #2d1b1b 100%); --bg-toggle-light: #e2e8f0; --bg-toggle-dark: #374151;
          --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; --font-mono: "Courier New", monospace;
          --transition-fast: all 0.2s ease; --transition-normal: all 0.3s ease;
        }
        .judol-blur { opacity: 0.6; }
        .judol-blur:hover { opacity: 0.8; }
        .judol-warning { margin: 8px 0; padding: 12px; border-radius: 8px; font-family: var(--font-primary); font-size: 13px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); animation: slideIn 0.3s ease-out; position: relative; overflow: hidden; border-width: 2px; border-style: solid; }
        .toggle-comment { display: inline-block; margin-top: 6px; padding: 4px 8px; border: 1px solid #cbd5e0; border-radius: 4px; text-decoration: none; font-size: 11px; transition: var(--transition-fast); cursor: pointer; }
        .toggle-comment:hover { transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
        .judol-blur.high-severity { filter: blur(12px); } .judol-blur.medium-severity { filter: blur(8px); } .judol-blur.low-severity { filter: blur(5px); }
        .judol-warning.high-severity { background: var(--bg-high-light); border-color: var(--color-high); animation: warningPulse 1s infinite, slideIn 0.3s ease-out; }
        .judol-warning.medium-severity { background: var(--bg-medium-light); border-color: var(--color-medium); }
        .judol-warning.low-severity { background: var(--bg-low-light); border-color: var(--color-low); }
        .confidence-indicator { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-left: 8px; animation: blink 1.5s infinite; }
        .confidence-high { background: var(--color-high); } .confidence-medium { background: var(--color-medium); } .confidence-low { background: var(--color-low); }
        .judol-progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: rgba(59, 130, 246, 0.2); z-index: 10002; }
        .judol-progress-bar { height: 100%; background: linear-gradient(90deg, #3b82f6, #10b981); transition: width 0.3s ease; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
        @media (prefers-color-scheme: dark) { .judol-warning { background: var(--bg-warning-dark); border-color: var(--color-high); color: var(--color-text-dark); } .toggle-comment { background: var(--bg-toggle-dark); border-color: #4b5563; color: var(--color-text-dark); } .toggle-comment:hover { background: #4b5563; } }
        @media (max-width: 768px) { .judol-warning { margin: 6px 0; padding: 8px; font-size: 11px; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes warningPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0.3; } }
    `;
  document.head.appendChild(style);

  createUIPanels();

  const observer = new MutationObserver(() => {
    clearTimeout(window.judolScanTimeout);
    window.judolScanTimeout = setTimeout(scanComments, 500);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("load", scanComments);
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(scanComments, 1000);
  });

  console.log("🛡️ Judol Detector v15 'No Stats UI' AKTIF.");
  scanComments();
}

initialize();
