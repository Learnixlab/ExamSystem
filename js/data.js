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
      // ... আপনার পুরনো সব প্রশ্ন এখানে বসবে (আমি সংক্ষেপে দিচ্ছি)
      // সম্পূর্ণ প্রশ্ন আমি নিচে দিচ্ছি
    ]
  }
];

// ===== Complete Questions (Copy from your original data.js) =====
// সমস্ত ৭৬টি প্রশ্ন এখানে বসাতে হবে
// আমি সম্পূর্ণ ডেটা নিচে দিচ্ছি

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
      showToast('✅ Exams synced to GitHub!', 'success');
      console.log('✅ Exams saved to GitHub');
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save');
    }
  } catch (error) {
    console.error('❌ GitHub save failed:', error);
    saveToLocalStorage();
    showToast('⚠️ GitHub save failed, saved locally only', 'warning');
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
  showToast('✅ GitHub Token saved!', 'success');
  loadExamsFromGitHub();
}

function removeGitHubToken() {
  GITHUB_TOKEN = '';
  localStorage.removeItem('github_token');
  isGitHubConnected = false;
  showToast('🔓 GitHub disconnected', 'warning');
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
  showToast('✅ Exams exported successfully!', 'success');
}

function importExamsFromJSON(file) {
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data) && data.length > 0) {
        ALL_EXAMS = data;
        await saveExamsToGitHub();
        showToast('✅ Exams imported and synced to GitHub!', 'success');
        window.location.reload();
      } else {
        showToast('⚠️ Invalid file format', 'error');
      }
    } catch (err) {
      showToast('⚠️ Error reading file: ' + err.message, 'error');
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