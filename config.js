// --- Cache & Author Sets ---
const spammerAuthors = new Set();
const whitelistedAuthors = new Set();
const commentCache = new Map();

// --- Keywords & Word Lists ---
const hardJudolKeywords = new Set([
  "mamajitu", "topas808", "visi4d", "mona4d", "zeus77", "slot88", "dana4d",
  "weton88", "ligajp", "dewaslot", "gacorx", "slotku", "maxcuan", "jpkali",
  "autojp", "scatternet", "modalreceh", "wdgacor", "batre4d", "probet855",
  "kyt4d", "pstoto99", "indokasino",
]);

const legitimateWords = new Set([
  "bagus", "keren", "mantap", "seru", "lucu", "sedih", "menangis", "tertawa",
  "video", "musik", "lagu", "film", "game", "tutorial", "review", "reaction",
  "pertama", "kedua", "ketiga", "terakhir", "awal", "akhir", "tengah",
  "thanks", "terimakasih", "makasih", "good", "nice", "wow", "amazing",
  "subscribe", "like", "share", "comment", "notification", "bell", "makan",
  "makanan", "masak", "resep", "enak", "lezat", "gurih", "manis", "ambil",
  "sendok", "piring", "loyang", "habis", "habiskan", "sikat", "belok",
  "nyendok", "satu", "semuanya", "padahal", "cuma", "malah", "bebas",
  "minus", "diabetes", "boleh", "banyak", "harus", "karena", "luar", "sana",
  "masih", "belum", "mampu", "hargai", "hargailah", "jangan", "sia",
  "siakan", "diangkat", "dulu", "gak", "langsung", "ada", "bawah", "bawahnya",
  "adil", "itumah", "yah", "asal", "diabisin", "ajah", "ya", "buat", "bahan",
  "mainan", "cara", "ngambil", "ngambilnya", "estetik", "kalo", "sisanya",
  "kayak", "gitu", "emang", "orang", "lain", "mau", "ini", "adalah",
  "gambaran", "betapa", "serakah", "serakahnya", "manusia", "dan", "lagi",
  "inspiratif", "terharu", "kaget", "gokil", "ngakak", "wkwk", "haha",
  "hehe", "sakit perut", "baper", "setuju", "betul", "bener", "asli",
  "sumpah", "keren banget", "mantap jiwa", "gila", "parah", "keren parah",
  "bang", "kak", "bro", "sist", "gan", "min", "om", "tante", "guys", "gaes",
  "btw", "otw", "mantul", "gas", "skuy", "vlog", "podcast", "streaming",
  "shorts", "reels", "unboxing", "gadget", "hp", "komputer", "laptop",
  "kamera", "mobil", "motor", "modifikasi", "makeup", "skincare", "outfit",
  "ootd", "liburan", "jalan-jalan", "healing", "pantai", "gunung", "wisata",
  "kuliner", "nongkrong", "cafe", "banget", "sekali", "sangat", "lumayan",
  "cukup", "selalu", "sering", "jarang", "juga", "sih", "dong", "kok", "kan",
  "aja", "hanya", "memang", "akhirnya", "pasti", "mungkin", "semoga", "nonton",
  "lihat", "dengar", "coba", "belajar", "tanya", "jawab", "kasih", "tunggu",
  "ikut", "datang", "pulang", "beli", "jual", "punya",
]);

const personalWords = new Set([
  "aku", "saya", "gue", "gw", "kita", "kamu", "kalian", "dia", "mereka", "mama",
  "papa", "ibu", "bapak", "ayah", "adik", "kakak", "keluarga", "teman",
  "sahabat", "pacar", "suami", "istri", "anak", "orang tua", "rumah", "sekolah",
  "kantor", "kampus", "kelas", "guru", "dosen", "pernah", "ingat", "cerita",
  "pengalaman", "kisah", "masa", "waktu", "dulu", "sekarang", "kemarin",
  "besok", "hari", "jam", "menit", "senang", "sedih", "marah", "takut",
  "khawatir", "bahagia", "kecewa", "malam", "pagi", "siang", "sore", "subuh",
  "maghrib", "isya", "ane", "doi", "gebetan", "nenek", "kakek", "cucu",
  "sepupu", "ponakan", "paman", "bibi", "mertua", "ipar", "tetangga",
  "pasangan", "kangen", "rindu", "capek", "lelah", "pegal", "bingung",
  "penasaran", "semangat", "bangga", "bersyukur", "sakit", "sehat", "lapar",
  "haus", "kerja", "liburan", "belanja", "pasar", "warung", "kosan",
  "kontrakan", "kamar", "dapur", "garasi", "halaman", "kampung", "kota",
  "desa", "nanti", "lusa", "minggu", "bulan", "tahun", "lebaran", "natal",
  "ulang tahun", "nikahan", "acara", "momen", "kenangan",
]);

// --- Regex Lists ---
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

// --- Replacements for Normalization ---
const replacements = {
  0: "o", 1: "i", 2: "z", 3: "e", 4: "a", 5: "s", 6: "g", 7: "t", 8: "b", 9: "g", "@": "a", "&": "n", "$": "s", "£": "e", "€": "e", "¥": "y", "!": "i", "¡": "i", "|": "l", "(": "c", "{": "c", "[": "c", "/\\": "a", "\\/": "v", "\\^/": "m", "|V|": "m", "[]D": "b", "|3": "b", "|>": "d", "|*": "d", "|#": "h", "|X|": "h", "[]_[]": "h", "\\_\\": "u", "\\_|_/": "u",
  "0️⃣": "0", "1️⃣": "1", "2️⃣": "2", "3️⃣": "3", "4️⃣": "4", "5️⃣": "5", "6️⃣": "6", "7️⃣": "7", "8️⃣": "8", "9️⃣": "9", "🔟": "10",
  "０": "0", "１": "1", "２": "2", "３": "3", "４": "4", "５": "5", "６": "6", "７": "7", "８": "8", "９": "9", "𝟎": "0", "𝟏": "1", "𝟐": "2", "𝟑": "3", "𝟒": "4", "𝟓": "5", "𝟔": "6", "𝟕": "7", "𝟖": "8", "𝟗": "9", "𝟶": "0", "𝟷": "1", "𝟸": "2", "𝟹": "3", "𝟺": "4", "𝟻": "5", "𝟼": "6", "𝟽": "7", "𝟾": "8", "𝟿": "9", "𝟬": "0", "𝟭": "1", "𝟮": "2", "𝟯": "3", "𝟰": "4", "𝟱": "5", "𝟲": "6", "𝟳": "7", "𝟴": "8", "𝟵": "9", "𝟢": "0", "𝟣": "1", "𝟤": "2", "𝟥": "3", "𝟦": "4", "𝟧": "5", "𝟨": "6", "𝟩": "7", "𝟪": "8", "𝟫": "9", "𝟙": "1", "𝟚": "2", "𝟛": "3", "𝟜": "4", "𝟝": "5", "𝟞": "6", "𝟟": "7", "𝟠": "8", "𝟡": "9", "𝟘": "0", "🄋": "0",
  "➀": "1", "➁": "2", "➂": "3", "➃": "4", "➄": "5", "➅": "6", "➆": "7", "➇": "8", "➈": "9", "🅰️": "a", "🅱️": "b", "🅾️": "o", "🆎": "ab", "🆑": "cl", "🆒": "cool", "🆓": "free", "🆔": "id", "🆕": "new", "🆖": "ng", "🆘": "sos", "🆙": "up", "🆚": "vs",
  Ａ: "a", Ｂ: "b", Ｃ: "c", Ｄ: "d", Ｅ: "e", Ｆ: "f", Ｇ: "g", Ｈ: "h", Ｉ: "i", Ｊ: "j", Ｋ: "k", Ｌ: "l", Ｍ: "m", Ｎ: "n", Ｏ: "o", Ｐ: "p", Ｑ: "q", Ｒ: "r", Ｓ: "s", Ｔ: "t", Ｕ: "u", Ｖ: "v", Ｗ: "w", Ｘ: "x", Ｙ: "y", Ｚ: "z",
  ａ: "a", ｂ: "b", ｃ: "c", ｄ: "d", ｅ: "e", ｆ: "f", ｇ: "g", ｈ: "h", ｉ: "i", ｊ: "j", ｋ: "k", ｌ: "l", ｍ: "m", ｎ: "n", ｏ: "o", ｐ: "p", ｑ: "q", ｒ: "r", ｓ: "s", ｔ: "t", ｕ: "u", ｖ: "v", ｗ: "w", ｘ: "x", ｙ: "y", ｚ: "z",
  "⒜": "a", "⒝": "b", "⒞": "c", "⒟": "d", "⒠": "e", "⒡": "f", "⒢": "g", "⒣": "h", "⒤": "i", "⒥": "j", "⒦": "k", "⒧": "l", "⒨": "m", "⒩": "n", "⒪": "o", "⒫": "p", "⒬": "q", "⒭": "r", "⒮": "s", "⒯": "t", "⒰": "u", "⒱": "v", "⒲": "w", "⒳": "x", "⒴": "y", "⒵": "z",
  "Ⓐ": "a", "Ⓑ": "b", "Ⓒ": "c", "Ⓓ": "d", "Ⓔ": "e", "Ⓕ": "f", "Ⓖ": "g", "Ⓗ": "h", "Ⓘ": "i", "Ⓙ": "j", "Ⓚ": "k", "Ⓛ": "l", "Ⓜ️": "m", "Ⓝ": "n", "Ⓞ": "o", "Ⓟ": "p", "Ⓠ": "q", "Ⓡ": "r", "Ⓢ": "s", "Ⓣ": "t", "Ⓤ": "u", "Ⓥ": "v", "Ⓦ": "w", "Ⓧ": "x", "Ⓨ": "y", "Ⓩ": "z",
  "𝐕": "v", "𝐈": "i", "𝐒": "s", "𝐃": "d", "𝑷": "p", "𝑶": "o", "🅘": "i", "🅝": "n", "🅓": "d", "🅞": "o", "🅚": "k", "🅐": "a", "🅢": "s", "🅒": "c", "🅔": "e", "🅕": "f", "🅖": "g", "🅗": "h", "🅙": "j", "🅛": "l", "🅜": "m", "🅟": "p", "🅠": "q", "🅡": "r", "🅣": "t", "🅤": "u", "🅥": "v", "🅦": "w", "🅧": "x", "🅨": "y", "🅩": "z",
  "𝓐": "a", "𝓑": "b", "𝓒": "c", "𝓓": "d", "𝓔": "e", "𝓕": "f", "𝓖": "g", "𝓗": "h", "𝓘": "i", "𝓙": "j", "𝓚": "k", "𝓛": "l", "𝓜": "m", "𝓝": "n", "𝓞": "o", "𝓟": "p", "𝓠": "q", "𝓡": "r", "𝓢": "s", "𝓣": "t", "𝓤": "u", "𝓥": "v", "𝓦": "w", "𝓧": "x", "𝓨": "y", "𝓩": "z",
  "・": ".", "•": ".", "·": ".", "․": ".", "‧": ".", "∙": ".", "｡": ".", "…": "...", "‘": "'", "’": "'", "`": "'", "´": "'", "“": '"', "”": '"', "„": '"', "«": '"', "»": '"', "–": "-", "—": "-", "―": "-", _: " ", "　": " ",
};

// --- Emojis ---
const gamblingEmojis = ["💰", "🎰", "💎", "🌟", "🎯", "⚡", "💵"];