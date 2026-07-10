// =========================================================
//   DATA - GitHub API Integrated Storage
// =========================================================

// ===== GitHub Configuration =====
const GITHUB_CONFIG = {
  owner: 'Learnixlab',      // ← আপনার ইউজারনেম দিন
  repo: 'ExamSystem',             // ← আপনার রিপো নাম দিন
  path: 'data/exams.json',            
  branch: 'main'                      
};


// ===== DEFAULT EXAMS =====
const DEFAULT_EXAMS = [
  {
    id: 'bangla_exam_1',
    title: 'বাংলা বাগধারা ও শব্দার্থ',
    icon: '📖',
    description: 'বাংলা বাগধারা, বিপরীত শব্দ, সমার্থক শব্দ ও শব্দার্থ সম্পর্কিত ৭৬টি প্রশ্ন',
    duration: 30,
    totalQuestions: 76,
    category: 'bangla',
    difficulty: 'Medium',
    questions: [
      {
        "question": "'অক্ষর পরিচয়' বাগধারাটির অর্থ কী?",
        "options": ["প্রাচীন ব্যক্তি", "সামান্য বিদ্যা / বর্ণজ্ঞান", "মধু চক্রবিদ্যা", "কঠিন পরীক্ষা"],
        "answer": 1
      },
      {
        "question": "'অক্ষয় বট' বাগধারাটির অর্থ কী?",
        "options": ["কঠিন পরীক্ষা", "অক্ষয় পাত্র", "প্রাচীন ব্যক্তি", "স্ত্রীর প্রভাব"],
        "answer": 2
      },
      {
        "question": "'অগ্নিপরীক্ষা' বাগধারাটির অর্থ কী?",
        "options": ["কঠিন পরীক্ষা", "আলসেমি", "অতিশয় বৃদ্ধি", "অতি দর্পে হত লঙ্কা"],
        "answer": 0
      },
      {
        "question": "'অগস্ত্য যাত্রা' বাগধারাটির অর্থ কী?",
        "options": ["অক্ষর পরিচয়", "মৃত্যু, চিরবিদায়", "স্ত্রীর প্রভাব", "অর্থে জল"],
        "answer": 1
      },
      {
        "question": "'কড়ি কড়ি টাকা' বাগধারাটির অর্থ কী?",
        "options": ["সামান্য বিদ্যা", "প্রচুর টাকা", "বোকা ব্যক্তি", "কঠিন পরীক্ষা"],
        "answer": 1
      },
      {
        "question": "'কর্পূরের মতো উবে যাওয়া' বাগধারাটির অর্থ কী?",
        "options": ["দ্রুত অদৃশ্য হওয়া", "অল্প বিদ্যা", "খুব আনন্দ", "অতিশয় বৃদ্ধি"],
        "answer": 0
      },
      {
        "question": "'কানকাটা' বাগধারাটির অর্থ কী?",
        "options": ["নির্লজ্জ ব্যক্তি", "গোপন কথা", "বড়লোক ব্যক্তি", "প্রচুর টাকা"],
        "answer": 0
      },
      {
        "question": "'কেঁচো খুঁড়তে সাপ বের হওয়া' বাগধারাটির অর্থ কী?",
        "options": ["সামান্য ব্যাপারে বড় কিছু প্রকাশ পাওয়া", "কঠিন পরীক্ষা", "চিরবিদায়", "বর্ণজ্ঞান"],
        "answer": 0
      },
      {
        "question": "'গোঁফ খেজুরে' বাগধারাটির অর্থ কী?",
        "options": ["অত্যন্ত কুড়ে, নিতান্তই অলস", "নষ্ট হওয়া", "অতি বৃদ্ধ", "চুরি করা"],
        "answer": 0
      },
      {
        "question": "'গোল্লায় যাওয়া' বাগধারাটির অর্থ কী?",
        "options": ["চিরবিদায়", "নষ্ট হওয়া / অধঃপাতে যাওয়া", "অক্ষমতা", "অতি বৃদ্ধ"],
        "answer": 1
      },
      {
        "question": "'ঘরের শত্রু বিভীষণ' বাগধারাটির অর্থ কী?",
        "options": ["আত্মীয়স্বজন", "গোপন শত্রু", "অন্তরঙ্গ শত্রু", "নিরাশ্রয় অবস্থা"],
        "answer": 2
      },
      {
        "question": "'চক্ষুদান করা' বাগধারাটির অর্থ কী?",
        "options": ["চুরি করা", "দৃষ্টি দান করা", "ঠকানো", "অত্যন্ত অলস"],
        "answer": 1
      },
      {
        "question": "'ঘরের খাঁই' বাগধারাটির অর্থ কী?",
        "options": ["ছাইফাঁকা", "চাটুকার", "চাটুকারী / তোষামোদকারী", "হিসাব-নিকাশ"],
        "answer": 2
      },
      {
        "question": "'গড্ডলিকা প্রবাহ / ভেড়ার পাল' বাগধারাটির অর্থ কী?",
        "options": ["অন্ধ অনুকরণ", "অতি চালাক", "মেচ্ছাচারী", "অনভিপ্রেত বোঝা"],
        "answer": 0
      },
      {
        "question": "'গভীর জলের মাছ / অগাধ জলের মাছ' বাগধারাটির অর্থ কী?",
        "options": ["হিসাব-নিকাশ", "অতি চালাক / ধূর্ত / অত্যন্ত কৌশলী", "বড়ো ক্ষতি", "ইচ্ছাচারী"],
        "answer": 1
      },
      {
        "question": "'গলগ্রহ' বাগধারাটির অর্থ কী?",
        "options": ["অনভিপ্রেত বোঝা বা দায়িত্ব", "অন্ধ অনুকরণ", "কুড়ে, অলস", "চাটুকার"],
        "answer": 0
      },
      {
        "question": "'অর্বাচীন' শব্দের বিপরীত শব্দ কোনটি?",
        "options": ["প্রাচীন", "গরল", "সুধা", "মধুর"],
        "answer": 0
      },
      {
        "question": "'অমৃত' শব্দের বিপরীত শব্দ কোনটি?",
        "options": ["মধুর", "বিষ", "মিষ্টি", "সুধা"],
        "answer": 1
      },
      {
        "question": "'অধিত্যকা' শব্দের বিপরীত শব্দ কোনটি?",
        "options": ["উপত্যকা", "শিরোদেশ", "অর্বাচীন", "অনন্ত"],
        "answer": 0
      },
      {
        "question": "'আকর্ষণ' শব্দের বিপরীত শব্দ কোনটি?",
        "options": ["চিরন্তন", "প্রসারণ / বিকর্ষণ", "কালেভদ্রে", "অনবরত"],
        "answer": 1
      },
      {
        "question": "'আকাশ' শব্দের বিপরীত শব্দ কোনটি?",
        "options": ["নির্গম", "আগমন", "পাতাল", "অবতরণ"],
        "answer": 2
      },
      {
        "question": "'আবশ্যক' শব্দের বিপরীত শব্দ কোনটি?",
        "options": ["অনাবশ্যক", "ঐচ্ছিক", "আগ্রহ", "বিরাগ"],
        "answer": 0
      },
      {
        "question": "'আস্তিক' শব্দের বিপরীত শব্দ কোনটি?",
        "options": ["ঔদাসীন্য", "বৈরাগ্য", "নাস্তিক", "অনুরাগ"],
        "answer": 2
      },
      {
        "question": "'উৎকর্ষ' শব্দের বিপরীত শব্দ কোনটি?",
        "options": ["প্রকর্ষ", "অপকর্ষ", "প্রশান্ত", "প্রবল"],
        "answer": 1
      },
      {
        "question": "'প্রবল' শব্দের বিপরীত শব্দ কোনটি?",
        "options": ["দুর্বল", "উত্তম", "তীব্র", "মৃদু"],
        "answer": 0
      },
      {
        "question": "'উদার' শব্দের বিপরীত শব্দ কোনটি?",
        "options": ["বিরত", "সংকীর্ণ", "বিনীত", "নির্দিষ্ট"],
        "answer": 1
      },
      {
        "question": "'অনিষ্ট' শব্দের অর্থ কোনটি?",
        "options": ["ক্ষতিহীন", "অপকার", "চর্চা", "নিকট"],
        "answer": 1
      },
      {
        "question": "'অভ্যাস' শব্দের অর্থ কোনটি?",
        "options": ["চর্চা, শিক্ষা", "ভয়", "মূল্য", "কৌশল"],
        "answer": 0
      },
      {
        "question": "'অংশ' শব্দের অর্থ কোনটি?",
        "options": ["ভয়", "ভাগ", "পাথর", "পুষ্প"],
        "answer": 1
      },
      {
        "question": "'অর্ঘ্য' শব্দের অর্থ কোনটি?",
        "options": ["মূল্য", "পুজার উপকরণ", "কৃপণ", "সুন্দর"],
        "answer": 0
      },
      {
        "question": "'অসিলতা' শব্দের অর্থ কোনটি?",
        "options": ["তরবারি", "অজ্ঞতা", "কোকিল", "খাদ্য"],
        "answer": 0
      },
      {
        "question": "'অলীক' শব্দের অর্থ কোনটি?",
        "options": ["কপাল", "মিথ্যা", "দয়া", "মৃত্যু"],
        "answer": 1
      },
      {
        "question": "'অবদান' শব্দের অর্থ কোনটি?",
        "options": ["মহৎ কাজ", "মনোযোগ", "ভোজন", "নিকট"],
        "answer": 0
      },
      {
        "question": "'অনল' শব্দের অর্থ কোনটি?",
        "options": ["যা নীল নয়", "বাতাস", "আগুন", "কৌশল"],
        "answer": 2
      },
      {
        "question": "'অভিরাম' শব্দের অর্থ কোনটি?",
        "options": ["বিশ্রাম", "সুন্দর", "আকাশ", "অসুর"],
        "answer": 1
      },
      {
        "question": "'আঁধার' শব্দের অর্থ কোনটি?",
        "options": ["পাত্র", "অন্ধকার", "আচ্ছাদন", "আবরণ"],
        "answer": 0
      },
      {
        "question": "'আগুন' এর সমার্থক শব্দ কোনটি?",
        "options": ["বারি", "বহ্নি", "পবন", "হস্তী"],
        "answer": 1
      },
      {
        "question": "'বাতাস' এর সমার্থক শব্দ কোনটি?",
        "options": ["বায়ু", "কুমুদ", "কেশব", "করী"],
        "answer": 0
      },
      {
        "question": "'বাতাস' এর সমার্থক শব্দ কোনটি?",
        "options": ["অনিল", "পঙ্কজ", "নলিনী", "দন্তী"],
        "answer": 0
      },
      {
        "question": "'পদ্ম' এর সমার্থক শব্দ কোনটি?",
        "options": ["কুমুদ", "দ্বিপ", "বারণ", "গজ"],
        "answer": 0
      },
      {
        "question": "'হাতি' এর সমার্থক শব্দ কোনটি?",
        "options": ["গজ", "সরোজ", "পবন", "কোকনদ"],
        "answer": 0
      },
      {
        "question": "'হাতি' এর সমার্থক শব্দ কোনটি?",
        "options": ["দন্তী", "জলন", "পুষ্কর", "কুমুদিনী"],
        "answer": 0
      },
      {
        "question": "'পানি' এর সমার্থক শব্দ কোনটি?",
        "options": ["খগ", "পয়োধর", "বারি", "পল্লবী"],
        "answer": 2
      },
      {
        "question": "'পাখি' এর সমার্থক শব্দ কোনটি?",
        "options": ["পল্লবী", "পক্ষী", "পঙ্কজ", "খেচর"],
        "answer": 1
      },
      {
        "question": "'কোকিল' এর সমার্থক শব্দ কোনটি?",
        "options": ["বসন্তদূত", "পরভৃত", "পিক", "কলরব"],
        "answer": 0
      },
      {
        "question": "'কোকিল' এর সমার্থক শব্দ কোনটি?",
        "options": ["কলধ্বনি", "কলঘোষ", "কলরব", "কলোকণ্ঠ"],
        "answer": 3
      },
      {
        "question": "'পানি' এর সমার্থক শব্দ কোনটি?",
        "options": ["অনপুষ্ট", "খেচর", "পয়ঃ", "কাকপুষ্ট"],
        "answer": 2
      },
      {
        "question": "'ফ্রা' শব্দের অর্থ কোনটি?",
        "options": ["রাজকীয় প্রসাদ", "ফরাসি মুদ্রার নাম", "মসৃণ বস্তু", "স্বর্ণ"],
        "answer": 1
      },
      {
        "question": "'স্যাটিন' শব্দের অর্থ কোনটি?",
        "options": ["মসৃণ ও চকচকে রেশমি বস্ত্র", "ঘন কুয়াশা", "হিমালয়ের অধিবাসী", "সমদর্শিতা"],
        "answer": 0
      },
      {
        "question": "'হেম' শব্দের অর্থ কোনটি?",
        "options": ["হেমন্ত কাল", "স্বর্ণ / সোনা", "প্রাচীন জনগণ", "পর্বতের গুহা"],
        "answer": 1
      },
      {
        "question": "'গণমানব' শব্দের অর্থ কোনটি?",
        "options": ["আবর্তিত জলরাশি", "প্রান্তিক জনগণ", "মন্দির", "মিথ্যা"],
        "answer": 1
      },
      {
        "question": "'ঘূর্ণি' শব্দের অর্থ কোনটি?",
        "options": ["ঘূর্ণমান / আবর্তিত জলরাশি", "শিখর", "সমতা", "হিমালয়"],
        "answer": 0
      },
      {
        "question": "'সাম্য' শব্দের অর্থ কোনটি?",
        "options": ["পরসেবা", "সমদর্শিতা / সমতা", "মিথ্যা", "গুহা"],
        "answer": 1
      },
      {
        "question": "'পার্সি' শব্দের অর্থ কোনটি?",
        "options": ["ইরানের নাগরিক", "প্রাচীন হিব্রু জাতি", "ক্ষুদ্র নৃগোষ্ঠী", "মহাপুরুষ"],
        "answer": 0
      },
      {
        "question": "'গারো' শব্দের অর্থ কোনটি?",
        "options": ["দেবালয়", "গারো পর্বত অঞ্চলের অধিবাসী / ক্ষুদ্র নৃগোষ্ঠী বিশেষ", "মিথ্যা", "গোপন স্থান"],
        "answer": 1
      },
      {
        "question": "'মুণিঋষির' শব্দের অর্থ কোনটি?",
        "options": ["বিভিন্ন যুগে অবতীর্ণ মহাপুরুষ", "শূন্য", "মিথ্যা", "শাক বনে জন্মায়"],
        "answer": 0
      },
      {
        "question": "'চেলা' শব্দের অর্থ কোনটি?",
        "options": ["পর্বতের গুহা", "শিষ্য / শাগরেদ / অনুচর", "মন্দির", "সমতা"],
        "answer": 1
      },
      {
        "question": "'অক্ষির সমক্ষে বর্তমান / অক্ষির অভিমুখে' — এক কথায় কী?",
        "options": ["পরোক্ষ", "প্রত্যক্ষ", "সমক্ষ", "চক্ষুষ্মান"],
        "answer": 1
      },
      {
        "question": "'চোখে দেখা যায় এমন' — এক কথায় কী?",
        "options": ["গোচর / চক্ষুগোচর", "অনিমেষ", "চাক্ষুষ", "পরোক্ষ"],
        "answer": 0
      },
      {
        "question": "'চোখের নিমেষ নেই যে/যার' — এক কথায় কী?",
        "options": ["চক্ষুষ্মান", "অনিমেষ", "প্রত্যক্ষ", "চাক্ষুষ"],
        "answer": 1
      },
      {
        "question": "'অতি বৃদ্ধ নারী' — এক কথায় কী?",
        "options": ["বৃদ্ধাঙ্গী", "বড়ীয়সী", "নরাধম", "ওঙ্কার"],
        "answer": 1
      },
      {
        "question": "'অন্য দিকে মন যায় যার' — এক কথায় কী?",
        "options": ["অনন্যমনা", "অন্যমনস্ক", "গতান্তর", "কালান্তর"],
        "answer": 1
      },
      {
        "question": "'অগ্রে গমন করে যে' — এক কথায় কী?",
        "options": ["অগ্রজ", "অগ্রগামী", "আনুপূর্বিক", "প্রত্যুৎগমন"],
        "answer": 1
      },
      {
        "question": "'অনেকের মধ্যে প্রধান' — এক কথায় কী?",
        "options": ["অভিজ্ঞ", "বহুদর্শী", "শ্রেষ্ঠ", "অন্যতর"],
        "answer": 2
      },
      {
        "question": "'আকাশে যে বিচরণ করে' — এক কথায় কী?",
        "options": ["ক্রন্দসী", "রোদসী", "নভচর", "আকাশী"],
        "answer": 2
      },
      {
        "question": "'আত্মার সম্বন্ধীয়' — এক কথায় কী?",
        "options": ["আত্মীয়", "আধ্যাত্মিক", "আত্মসর্বস্ব", "আকাশী"],
        "answer": 1
      },
      {
        "question": "'আপনাকে যে পণ্ডিত মনে করে' — এক কথায় কী?",
        "options": ["পতিতমানা", "কৃতার্থমান্য", "আত্মীয়", "শ্রেষ্ঠ"],
        "answer": 0
      },
      {
        "question": "'Amendment' এর বাংলা পরিভাষা কোনটি?",
        "options": ["সংযোজন", "সংশোধনী", "বরাদ্দ", "বিশ্লেষণ"],
        "answer": 1
      },
      {
        "question": "'Ancestor' এর বাংলা পরিভাষা কোনটি?",
        "options": ["পূর্বপুরুষ", "বিদেশী", "প্রতিনিধি", "প্রশাসক"],
        "answer": 0
      },
      {
        "question": "'Annex' এর বাংলা পরিভাষা কোনটি?",
        "options": ["টীকা", "পরিশিষ্ট", "অনুমান", "কৃত্রিম"],
        "answer": 1
      },
      {
        "question": "'Annotation' এর বাংলা পরিভাষা কোনটি?",
        "options": ["টীকা", "অক্ষ", "সুগন্ধ", "সভা"],
        "answer": 0
      },
      {
        "question": "'Anticipation' এর বাংলা পরিভাষা কোনটি?",
        "options": ["অনুমান / প্রাকচিন্তন", "অপনিহিত", "নিলাম", "বায়ুমণ্ডল"],
        "answer": 0
      },
      {
        "question": "'Artisan' এর বাংলা পরিভাষা কোনটি?",
        "options": ["কারিগর", "স্থপতি", "লেখক", "বাহক"],
        "answer": 0
      },
      {
        "question": "'Atlas' এর বাংলা পরিভাষা কোনটি?",
        "options": ["মানচিত্র / ভূচিত্রাবলি", "পরমাণু", "পরীক্ষা", "পরিষদ"],
        "answer": 0
      },
      {
        "question": "'Ballad' এর বাংলা পরিভাষা কোনটি?",
        "options": ["জীবাণু", "গীতিকা", "ভোট", "জামিন"],
        "answer": 1
      },
      {
        "question": "'Banquet' এর বাংলা পরিভাষা কোনটি?",
        "options": ["বিনিময়", "ভোজসভা", "প্রচারপত্র", "অবরোধ"],
        "answer": 1
      },
      {
        "question": "'Bidder' এর বাংলা পরিভাষা কোনটি?",
        "options": ["নিলাম ডাকিয়ে", "দ্বিভাষিক", "জীবনী", "সংরক্ষণ"],
        "answer": 0
      }
    ]
  }
];

// ===== Global State =====
let ALL_EXAMS = [];
let GITHUB_TOKEN = localStorage.getItem('github_token') || '';
let isGitHubConnected = false;

// ===== Load exams from GitHub =====
async function loadExamsFromGitHub() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : ''
      }
    });

    if (response.status === 404) {
      console.log('📝 exams.json not found, creating default...');
      await createDefaultExamsFile();
      return;
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const content = atob(data.content);
    const exams = JSON.parse(content);
    
    if (Array.isArray(exams) && exams.length > 0) {
      ALL_EXAMS = exams;
      isGitHubConnected = true;
      localStorage.setItem('exam_all_exams', JSON.stringify(exams));
      console.log('✅ Exams loaded from GitHub');
    } else {
      loadFromLocalStorage();
    }
  } catch (error) {
    console.warn('⚠️ GitHub load failed, using localStorage:', error);
    loadFromLocalStorage();
  }
}

// ===== Create default exams file on GitHub =====
async function createDefaultExamsFile() {
  try {
    const content = btoa(JSON.stringify(DEFAULT_EXAMS, null, 2));
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Initial exams data',
        content: content,
        branch: GITHUB_CONFIG.branch
      })
    });

    if (response.ok) {
      ALL_EXAMS = JSON.parse(JSON.stringify(DEFAULT_EXAMS));
      isGitHubConnected = true;
      localStorage.setItem('exam_all_exams', JSON.stringify(ALL_EXAMS));
      console.log('✅ Default exams created on GitHub');
    }
  } catch (error) {
    console.error('❌ Failed to create default exams:', error);
    loadFromLocalStorage();
  }
}

// ===== Save exams to GitHub =====
async function saveExamsToGitHub() {
  if (!GITHUB_TOKEN) {
    console.warn('⚠️ No GitHub token, saving to localStorage only');
    saveToLocalStorage();
    return;
  }

  try {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
    let sha = '';
    
    const getResponse = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${GITHUB_TOKEN}`
      }
    });

    if (getResponse.ok) {
      const data = await getResponse.json();
      sha = data.sha;
    }

    const content = btoa(JSON.stringify(ALL_EXAMS, null, 2));
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Update exams data - ${new Date().toISOString()}`,
        content: content,
        sha: sha || undefined,
        branch: GITHUB_CONFIG.branch
      })
    });

    if (response.ok) {
      isGitHubConnected = true;
      saveToLocalStorage();
      console.log('✅ Exams saved to GitHub');
      if (typeof showToast === 'function') {
        showToast('✅ Exams synced to GitHub!', 'success');
      }
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save');
    }
  } catch (error) {
    console.error('❌ GitHub save failed:', error);
    saveToLocalStorage();
    if (typeof showToast === 'function') {
      showToast('⚠️ GitHub save failed, saved locally only', 'warning');
    }
  }
}

// ===== Local Storage Functions =====
function saveToLocalStorage() {
  try {
    localStorage.setItem('exam_all_exams', JSON.stringify(ALL_EXAMS));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

function loadFromLocalStorage() {
  try {
    const stored = localStorage.getItem('exam_all_exams');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        ALL_EXAMS = parsed;
        console.log('📦 Loaded from localStorage');
        return;
      }
    }
    ALL_EXAMS = JSON.parse(JSON.stringify(DEFAULT_EXAMS));
    saveToLocalStorage();
  } catch (e) {
    ALL_EXAMS = JSON.parse(JSON.stringify(DEFAULT_EXAMS));
    saveToLocalStorage();
  }
}

// ===== GitHub Token Functions =====
function setGitHubToken(token) {
  GITHUB_TOKEN = token;
  localStorage.setItem('github_token', token);
  isGitHubConnected = true;
  if (typeof showToast === 'function') {
    showToast('✅ GitHub Token saved!', 'success');
  }
  loadExamsFromGitHub();
}

function removeGitHubToken() {
  GITHUB_TOKEN = '';
  localStorage.removeItem('github_token');
  isGitHubConnected = false;
  if (typeof showToast === 'function') {
    showToast('🔓 GitHub disconnected', 'warning');
  }
}

function getGitHubStatus() {
  return {
    connected: !!GITHUB_TOKEN,
    token: GITHUB_TOKEN ? '✅ Set' : '❌ Not set',
    repo: `${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`,
    file: GITHUB_CONFIG.path
  };
}

// ===== Export/Import Functions =====
function exportExamsToJSON() {
  const dataStr = JSON.stringify(ALL_EXAMS, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'exams_data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  if (typeof showToast === 'function') {
    showToast('✅ Exams exported successfully!', 'success');
  }
}

function importExamsFromJSON(file) {
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data) && data.length > 0) {
        ALL_EXAMS = data;
        await saveExamsToGitHub();
        if (typeof showToast === 'function') {
          showToast('✅ Exams imported and synced to GitHub!', 'success');
        }
        window.location.reload();
      } else {
        if (typeof showToast === 'function') {
          showToast('⚠️ Invalid file format', 'error');
        }
      }
    } catch (err) {
      if (typeof showToast === 'function') {
        showToast('⚠️ Error reading file: ' + err.message, 'error');
      }
    }
  };
  reader.readAsText(file);
}

// ===== Helper Functions =====
function getExamById(id) {
  return ALL_EXAMS.find(exam => exam.id === id);
}

function getExamQuestions(examId) {
  const exam = getExamById(examId);
  return exam ? exam.questions : [];
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ===== Override save function =====
window.saveExamsToStorage = function() {
  saveToLocalStorage();
  if (GITHUB_TOKEN) {
    saveExamsToGitHub();
  }
};

// ===== Initialize =====
async function init() {
  const token = localStorage.getItem('github_token');
  if (token) {
    GITHUB_TOKEN = token;
    await loadExamsFromGitHub();
  } else {
    loadFromLocalStorage();
  }
}

init();

// ===== Expose functions globally =====
window.ALL_EXAMS = ALL_EXAMS;
window.getExamById = getExamById;
window.getExamQuestions = getExamQuestions;
window.shuffleArray = shuffleArray;
window.saveExamsToStorage = window.saveExamsToStorage;
window.exportExamsToJSON = exportExamsToJSON;
window.importExamsFromJSON = importExamsFromJSON;
window.setGitHubToken = setGitHubToken;
window.removeGitHubToken = removeGitHubToken;
window.getGitHubStatus = getGitHubStatus;
window.saveExamsToGitHub = saveExamsToGitHub;
window.DEFAULT_EXAMS = DEFAULT_EXAMS;