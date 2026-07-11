// =========================================================
//   EXAM FUNCTIONS (no login — browser-based, one attempt each)
// =========================================================

const RESULTS_KEY_PREFIX = 'exam_result_';   // exam_result_<examId> -> stored result
const PROGRESS_KEY_PREFIX = 'exam_progress_'; // exam_progress_<examId> -> in-progress autosave draft
const examState = {
  questions: [],
  totalQuestions: 0,
  currentIndex: 0,
  userAnswers: [],
  flags: [],
  timeLeft: 0,
  totalTime: 0,
  timerInterval: null,
  examId: null
};

// ===== Auto-save progress (so a closed tab / refresh doesn't lose answers) =====
function saveProgress() {
  try {
    localStorage.setItem(PROGRESS_KEY_PREFIX + examState.examId, JSON.stringify({
      questions: examState.questions,      // freeze the shuffled order so resuming matches
      currentIndex: examState.currentIndex,
      userAnswers: examState.userAnswers,
      flags: examState.flags,
      timeLeft: examState.timeLeft,
      totalTime: examState.totalTime
    }));
  } catch { /* storage full or unavailable — ignore, autosave is best-effort */ }
}

function loadProgress(examId) {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY_PREFIX + examId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearProgress(examId) {
  localStorage.removeItem(PROGRESS_KEY_PREFIX + examId);
}

// ===== Has this browser already completed this exam? =====
function getStoredResult(examId) {
  try {
    const raw = localStorage.getItem(RESULTS_KEY_PREFIX + examId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeResult(examId, result) {
  localStorage.setItem(RESULTS_KEY_PREFIX + examId, JSON.stringify(result));
}

// ===== Category color helper (stable hash -> one of 6 palette classes) =====
function categoryColorClass(category) {
  const str = String(category || 'general');
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return 'cat-color-' + (hash % 6);
}

function difficultyClass(difficulty) {
  const d = String(difficulty || 'Medium').toLowerCase();
  if (d === 'easy') return 'easy';
  if (d === 'hard') return 'hard';
  return 'medium';
}

let activeCategoryFilter = 'all';

// ===== Render Exam List (index.html) =====
function renderExamList() {
  const grid = document.getElementById('examsGrid');
  if (!grid) return;

  if (ALL_EXAMS.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-secondary);">No exams available.</div>`;
    return;
  }

  renderCategoryFilters();

  const visibleExams = activeCategoryFilter === 'all'
    ? ALL_EXAMS
    : ALL_EXAMS.filter(e => (e.category || 'general') === activeCategoryFilter);

  if (visibleExams.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-secondary);">😕 No exams in this category.</div>`;
    return;
  }

  grid.innerHTML = visibleExams.map(exam => {
    const done = getStoredResult(exam.id);
    const matCount = (typeof STUDY_MATERIALS !== 'undefined')
      ? STUDY_MATERIALS.filter(m => m.examId === exam.id).length
      : 0;
    return `
      <div class="exam-card">
        <div class="exam-icon">${exam.icon || '📝'}</div>
        <h3>${exam.title}</h3>
        <div style="margin:6px 0 10px;">
          <span class="badge-category ${categoryColorClass(exam.category)}">${exam.category || 'general'}</span>
          <span class="badge-diff ${difficultyClass(exam.difficulty)}">${exam.difficulty || 'Medium'}</span>
        </div>
        <div class="exam-meta">
          <span>⏱️ ${exam.duration} min</span>
          <span>📋 ${exam.totalQuestions} questions</span>
        </div>
        <p class="exam-desc">${exam.description || 'Practice and test your knowledge.'}</p>
        ${matCount > 0 ? `<a href="materials.html?examId=${exam.id}" style="display:block;text-align:center;font-size:0.85rem;color:var(--primary);font-weight:600;margin-bottom:10px;">📎 ${matCount} Study Material(s)</a>` : ''}
        ${done
          ? `<button class="btn btn-secondary" style="width:100%;" onclick="viewStoredResult('${exam.id}')">✅ Completed — View Result</button>`
          : `<button class="btn btn-primary" style="width:100%;" onclick="startExam('${exam.id}')">🚀 Start Exam</button>`
        }
      </div>
    `;
  }).join('');
}

function renderCategoryFilters() {
  const container = document.getElementById('categoryFilters');
  if (!container) return;
  const categories = Array.from(new Set(ALL_EXAMS.map(e => e.category || 'general')));
  if (categories.length <= 1) { container.innerHTML = ''; return; }

  const chips = ['all', ...categories];
  container.innerHTML = chips.map(cat => `
    <button class="cat-chip ${cat === activeCategoryFilter ? 'active' : ''}" data-cat="${cat}">
      ${cat === 'all' ? '🗂️ সব' : cat}
    </button>
  `).join('');

  container.querySelectorAll('.cat-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategoryFilter = btn.dataset.cat;
      renderExamList();
    });
  });
}

// ===== Gather every completed result stored in this browser (for My Results page) =====
function getAllStoredResults() {
  const results = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(RESULTS_KEY_PREFIX)) {
      try {
        results.push(JSON.parse(localStorage.getItem(key)));
      } catch { /* skip corrupted entry */ }
    }
  }
  results.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
  return results;
}

function viewStoredResult(examId) {
  const result = getStoredResult(examId);
  if (!result) return;
  sessionStorage.setItem('examResult', JSON.stringify(result));
  window.location.href = 'result.html';
}

// ===== Start Exam =====
function startExam(examId) {
  if (getStoredResult(examId)) {
    showToast('⚠️ You have already completed this exam. You can only view your result.', 'warning');
    return;
  }
  sessionStorage.setItem('currentExamId', examId);
  window.location.href = 'exam.html';
}

function loadExam() {
  const examId = sessionStorage.getItem('currentExamId');
  if (!examId) {
    window.location.href = 'index.html';
    return;
  }

  // Guard: don't allow retaking via direct URL access either
  if (getStoredResult(examId)) {
    window.location.href = 'index.html';
    return;
  }

  const exam = getExamById(examId);
  if (!exam) {
    showToast('Exam not found!', 'error');
    return;
  }

  document.getElementById('examTitle').textContent = exam.title;
  document.getElementById('examTotal').textContent = exam.totalQuestions;

  const saved = loadProgress(examId);
  if (saved && saved.questions && saved.questions.length === exam.questions.length) {
    // Resume a previously auto-saved attempt (same shuffled order, same timer)
    examState.questions = saved.questions;
    examState.totalQuestions = saved.questions.length;
    examState.currentIndex = saved.currentIndex || 0;
    examState.userAnswers = saved.userAnswers;
    examState.flags = saved.flags || new Array(saved.questions.length).fill(false);
    examState.timeLeft = saved.timeLeft;
    examState.totalTime = saved.totalTime;
    examState.examId = examId;
    document.getElementById('resumeBanner').style.display = 'flex';
  } else {
    const questions = shuffleArray(exam.questions);
    examState.questions = questions;
    examState.totalQuestions = questions.length;
    examState.currentIndex = 0;
    examState.userAnswers = new Array(questions.length).fill(null);
    examState.flags = new Array(questions.length).fill(false);
    examState.timeLeft = exam.duration * 60;
    examState.totalTime = exam.duration * 60;
    examState.examId = examId;
  }

  renderQuestion(examState.currentIndex);
  startTimer();
  buildQuestionGrid();
  saveProgress();
}

function renderQuestion(index) {
  const q = examState.questions[index];
  if (!q) return;

  examState.currentIndex = index;

  document.getElementById('qNumber').textContent = `Question ${index + 1}`;
  document.getElementById('qTotal').textContent = `of ${examState.totalQuestions}`;
  document.getElementById('qText').textContent = q.question;
  document.getElementById('qText').classList.remove('q-fade');
  void document.getElementById('qText').offsetWidth; // restart animation
  document.getElementById('qText').classList.add('q-fade');

  const flagBtn = document.getElementById('flagBtn');
  if (flagBtn) {
    flagBtn.classList.toggle('flagged', !!examState.flags[index]);
    flagBtn.textContent = examState.flags[index] ? '🚩 Flagged' : '🚩 Flag';
  }

  const pct = ((index + 1) / examState.totalQuestions) * 100;
  document.getElementById('progressBar').style.width = pct + '%';

  const container = document.getElementById('optionsContainer');
  container.classList.remove('q-fade');
  void container.offsetWidth;
  container.classList.add('q-fade');
  container.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  const userChoice = examState.userAnswers[index];

  q.options.forEach((opt, optIndex) => {
    const div = document.createElement('div');
    div.className = 'option';
    if (userChoice !== null) {
      div.classList.add('locked');
      if (optIndex === userChoice) div.classList.add('selected');
    }
    div.innerHTML = `<span class="opt-label">${letters[optIndex]}</span><span>${opt}</span>`;
    div.addEventListener('click', () => selectOption(index, optIndex));
    container.appendChild(div);
  });

  document.getElementById('prevBtn').disabled = index === 0;
  document.getElementById('nextBtn').textContent = index === examState.totalQuestions - 1 ? '📤 Submit' : 'Next →';

  updateGrid();
}

function selectOption(qIndex, optIndex) {
  if (examState.userAnswers[qIndex] !== null) return;
  examState.userAnswers[qIndex] = optIndex;
  renderQuestion(qIndex);
  saveProgress();
}

function toggleFlag(qIndex) {
  examState.flags[qIndex] = !examState.flags[qIndex];
  renderQuestion(qIndex);
  saveProgress();
}

function navigate(direction) {
  const newIndex = examState.currentIndex + direction;
  if (newIndex < 0 || newIndex >= examState.totalQuestions) return;
  renderQuestion(newIndex);
  saveProgress();
}

function buildQuestionGrid() {
  const grid = document.getElementById('questionGrid');
  grid.innerHTML = '';
  for (let i = 0; i < examState.totalQuestions; i++) {
    const btn = document.createElement('button');
    btn.className = 'q-nav-btn';
    btn.textContent = i + 1;
    btn.dataset.index = i;
    btn.addEventListener('click', () => renderQuestion(i));
    grid.appendChild(btn);
  }
}

function updateGrid() {
  document.querySelectorAll('.q-nav-btn').forEach((btn, i) => {
    btn.classList.toggle('answered', examState.userAnswers[i] !== null);
    btn.classList.toggle('current', i === examState.currentIndex);
    btn.classList.toggle('flagged', !!examState.flags[i]);
  });
}

function startTimer() {
  updateTimerDisplay();
  examState.timerInterval = setInterval(() => {
    examState.timeLeft--;
    updateTimerDisplay();
    if (examState.timeLeft <= 60) {
      document.querySelector('.timer-box')?.classList.add('low-time');
    }
    if (examState.timeLeft % 10 === 0) saveProgress(); // periodic autosave, no need to spam every second
    if (examState.timeLeft <= 0) {
      clearInterval(examState.timerInterval);
      submitExam(true);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const mins = Math.floor(examState.timeLeft / 60);
  const secs = examState.timeLeft % 60;
  const el = document.getElementById('timerDisplay');
  if (el) el.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function submitExam(auto) {
  if (!auto) {
    const unanswered = examState.userAnswers.filter(a => a === null).length;
    if (unanswered > 0) {
      if (!confirm(`⚠️ You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
    } else {
      if (!confirm('Are you sure you want to submit the exam? You will not be able to retake this exam.')) return;
    }
  }

  clearInterval(examState.timerInterval);

  let correct = 0, wrong = 0, unanswered = 0;
  examState.questions.forEach((q, i) => {
    const ans = examState.userAnswers[i];
    if (ans === null) unanswered++;
    else if (ans === q.answer) correct++;
    else wrong++;
  });

  const total = examState.totalQuestions;
  const score = correct * 1 - wrong * 0.5;
  const percentage = ((score / total) * 100).toFixed(1);

  const result = {
    examId: examState.examId,
    examTitle: document.getElementById('examTitle').textContent,
    questions: examState.questions,   // saved so the review screen works even after reload
    total,
    correct,
    wrong,
    unanswered,
    score,
    percentage,
    userAnswers: examState.userAnswers,
    timeTaken: examState.totalTime - examState.timeLeft,
    completedAt: new Date().toISOString()
  };

  storeResult(examState.examId, result);         // permanent record — blocks retakes
  clearProgress(examState.examId);                // no more in-progress draft to resume
  sessionStorage.setItem('examResult', JSON.stringify(result));
  window.location.href = 'result.html';
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('examTitle')) {
    loadExam();

    document.getElementById('prevBtn').addEventListener('click', () => navigate(-1));
    document.getElementById('nextBtn').addEventListener('click', () => {
      if (examState.currentIndex === examState.totalQuestions - 1) {
        submitExam(false);
      } else {
        navigate(1);
      }
    });
    document.getElementById('submitBtn').addEventListener('click', () => submitExam(false));
    document.getElementById('flagBtn').addEventListener('click', () => toggleFlag(examState.currentIndex));
  }
});
