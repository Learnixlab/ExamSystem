// =========================================================
//   EXAM FUNCTIONS
// =========================================================

const examState = {
  questions: [],
  totalQuestions: 0,
  currentIndex: 0,
  userAnswers: [],
  timeLeft: 0,
  totalTime: 0,
  timerInterval: null,
  examId: null
};

function renderExamList(filter) {
  const grid = document.getElementById('examsGrid');
  if (!grid) return;
  
  const user = getCurrentUser();
  const exams = ALL_EXAMS;
  
  if (exams.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-secondary);">No exams available.</div>`;
    return;
  }
  
  grid.innerHTML = exams.map(exam => {
    // Check if user has already taken this exam
    const isCompleted = user && hasUserTakenExam(user.id, exam.id);
    
    return `
      <div class="exam-card">
        <div class="exam-icon">${exam.icon || '📝'}</div>
        <h3>${exam.title}</h3>
        <div class="exam-meta">
          <span>⏱️ ${exam.duration} min</span>
          <span>📋 ${exam.totalQuestions} questions</span>
          <span>📊 ${exam.difficulty || 'Medium'}</span>
        </div>
        <p class="exam-desc">${exam.description || 'Practice and test your knowledge.'}</p>
        ${isCompleted ? `
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-success" onclick="viewExamResult('${exam.id}')" style="flex:1;">📊 View Result</button>
            <button class="btn btn-secondary" disabled style="flex:1;opacity:0.6;">✅ Completed</button>
          </div>
        ` : `
          <button class="btn btn-primary" onclick="startExam('${exam.id}')">🚀 Start Exam</button>
        `}
      </div>
    `;
  }).join('');
}

// ===== NEW: View Exam Result without taking exam again =====
function viewExamResult(examId) {
  const user = getCurrentUser();
  if (!user) {
    showToast('Please login first', 'warning');
    return;
  }
  
  const history = getExamHistory(user.id);
  const record = history.find(h => h.examId === examId);
  
  if (!record) {
    showToast('No result found for this exam', 'warning');
    return;
  }
  
  // Redirect to result page with the record
  sessionStorage.setItem('examResult', JSON.stringify({
    examId: examId,
    score: record.score,
    // We need to reconstruct the result data
  }));
  window.location.href = 'result.html?view=true';
}

function startExam(examId) {
  const user = getCurrentUser();
  if (!user) {
    showToast('Please login to start the exam.', 'warning');
    document.getElementById('loginModal').style.display = 'flex';
    return;
  }
  
  // Check if user has already taken this exam
  if (hasUserTakenExam(user.id, examId)) {
    showToast('⚠️ You have already completed this exam!', 'warning');
    return;
  }
  
  sessionStorage.setItem('currentExamId', examId);
  sessionStorage.setItem('examStartTime', Date.now().toString());
  window.location.href = 'exam.html';
}

function loadExam() {
  const examId = sessionStorage.getItem('currentExamId');
  if (!examId) {
    window.location.href = 'index.html';
    return;
  }
  
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  
  // Double-check: user hasn't taken this exam already
  if (hasUserTakenExam(user.id, examId)) {
    showToast('⚠️ You have already completed this exam!', 'warning');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return;
  }
  
  const exam = getExamById(examId);
  if (!exam) {
    showToast('Exam not found!', 'error');
    return;
  }
  
  document.getElementById('examTitle').textContent = exam.title;
  document.getElementById('examTotal').textContent = exam.totalQuestions;
  
  const questions = shuffleArray(exam.questions);
  examState.questions = questions;
  examState.totalQuestions = questions.length;
  examState.currentIndex = 0;
  examState.userAnswers = new Array(questions.length).fill(null);
  examState.timeLeft = exam.duration * 60;
  examState.totalTime = exam.duration * 60;
  examState.examId = examId;
  
  renderQuestion(0);
  startTimer();
  buildQuestionGrid();
}

function renderQuestion(index) {
  const q = examState.questions[index];
  if (!q) return;
  
  examState.currentIndex = index;
  
  document.getElementById('qNumber').textContent = `Question ${index + 1}`;
  document.getElementById('qTotal').textContent = `of ${examState.totalQuestions}`;
  document.getElementById('qText').textContent = q.question;
  
  const pct = ((index + 1) / examState.totalQuestions) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  
  const container = document.getElementById('optionsContainer');
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
}

function navigate(direction) {
  const newIndex = examState.currentIndex + direction;
  if (newIndex < 0 || newIndex >= examState.totalQuestions) return;
  renderQuestion(newIndex);
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
      if (!confirm('Are you sure you want to submit the exam?')) return;
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
    total,
    correct,
    wrong,
    unanswered,
    score,
    percentage,
    userAnswers: examState.userAnswers,
    timeTaken: examState.totalTime - examState.timeLeft
  };
  
  const user = getCurrentUser();
  if (user) {
    updateUserStats(user.id, score, examState.examId);
    // NEW: Mark exam as completed
    markExamCompleted(user.id, examState.examId);
  }
  
  sessionStorage.setItem('examResult', JSON.stringify(result));
  window.location.href = 'result.html';
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('examTitle')) {
    if (!getCurrentUser()) {
      window.location.href = 'index.html';
      return;
    }
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
  }
});