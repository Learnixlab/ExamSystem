// =========================================================
//   ADMIN PANEL - COMPLETE FUNCTIONALITY
// =========================================================

function checkAdminAccess() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return false;
  }
  if (!user.isAdmin) {
    showToast('⛔ You do not have permission to access the Admin Panel.', 'error');
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
    return false;
  }
  return true;
}

function loadAdmin() {
  if (!checkAdminAccess()) return;
  console.log('🔄 Loading admin panel...');
  updateAdminStats();
  renderExamList();
  renderAllQuestions();
  setupAdminEvents();
  populateExamSelects();
  updateGitHubStatus();
  console.log('✅ Admin panel loaded');
}

function updateAdminStats() {
  const totalExams = ALL_EXAMS ? ALL_EXAMS.length : 0;
  const totalQuestions = ALL_EXAMS ? ALL_EXAMS.reduce((sum, e) => sum + (e.questions ? e.questions.length : 0), 0) : 0;
  const totalUsers = getUsers().length;
  
  const examsEl = document.getElementById('adminTotalExams');
  const questionsEl = document.getElementById('adminTotalQuestions');
  const usersEl = document.getElementById('adminTotalUsers');
  
  if (examsEl) examsEl.textContent = totalExams;
  if (questionsEl) questionsEl.textContent = totalQuestions;
  if (usersEl) usersEl.textContent = totalUsers;
}

function renderExamList() {
  const container = document.getElementById('adminExamList');
  if (!container) return;
  
  if (!ALL_EXAMS || ALL_EXAMS.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>📭 No exams created yet.</p>
        <button class="btn btn-primary" id="createFirstExamBtn">➕ Create First Exam</button>
      </div>
    `;
    const btn = document.getElementById('createFirstExamBtn');
    if (btn) btn.addEventListener('click', () => openAddExamModal());
    return;
  }
  
  container.innerHTML = ALL_EXAMS.map((exam) => `
    <div class="admin-exam-card">
      <div class="exam-info">
        <div class="exam-icon">${exam.icon || '📝'}</div>
        <div>
          <h4>${exam.title}</h4>
          <div class="exam-meta">
            <span>📋 ${exam.questions ? exam.questions.length : 0} questions</span>
            <span>⏱️ ${exam.duration || 30} min</span>
            <span>📊 ${exam.difficulty || 'Medium'}</span>
          </div>
        </div>
      </div>
      <div class="exam-actions">
        <button class="btn-edit" onclick="openEditExamModal('${exam.id}')">✏️ Edit</button>
        <button class="btn-delete" onclick="deleteExam('${exam.id}')">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

function renderAllQuestions(filterExamId = 'all') {
  const tbody = document.getElementById('adminQuestionList');
  if (!tbody) return;
  
  const letters = ['A', 'B', 'C', 'D'];
  let html = '';
  let count = 0;
  
  const exams = filterExamId === 'all' 
    ? ALL_EXAMS 
    : ALL_EXAMS.filter(e => e.id === filterExamId);
  
  exams.forEach((exam) => {
    if (!exam.questions || exam.questions.length === 0) return;
    
    exam.questions.forEach((q, qIndex) => {
      count++;
      html += `
        <tr>
          <td>${count}</td>
          <td style="max-width:300px;">
            <span class="badge-exam">${exam.icon || '📝'} ${exam.title}</span>
            <br>
            <span style="font-size:0.95rem;">${q.question}</span>
          </td>
          <td style="font-size:0.85rem;">
            ${q.options.map((o, i) => 
              `${letters[i]}. ${o}${i === q.answer ? ' ✅' : ''}`
            ).join('<br>')}
          </td>
          <td><strong style="color:var(--success);">${letters[q.answer]}</strong></td>
          <td>
            <div class="admin-actions">
              <button class="btn-edit" onclick="openEditQuestionModal('${exam.id}', ${qIndex})">✏️</button>
              <button class="btn-delete" onclick="deleteQuestion('${exam.id}', ${qIndex})">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    });
  });
  
  if (!html) {
    html = `<tr><td colspan="5" style="text-align:center;padding:40px;color:var(--text-muted);">
      📭 No questions found. ${ALL_EXAMS && ALL_EXAMS.length > 0 ? 'Add your first question!' : 'Create an exam first!'}
    </td></tr>`;
  }
  
  tbody.innerHTML = html;
}

function createExam(examData) {
  const newExam = {
    id: 'exam_' + Date.now(),
    title: examData.title.trim(),
    icon: examData.icon || '📝',
    description: examData.description || 'Practice exam',
    duration: parseInt(examData.duration) || 30,
    totalQuestions: 0,
    category: examData.category || 'general',
    difficulty: examData.difficulty || 'Medium',
    questions: []
  };
  
  ALL_EXAMS.push(newExam);
  saveExamsToStorage();
  updateAdminStats();
  renderExamList();
  renderAllQuestions();
  populateExamSelects();
  showToast('✅ Exam created successfully!', 'success');
}

function updateExam(examId, examData) {
  const exam = getExamById(examId);
  if (!exam) {
    showToast('Exam not found!', 'error');
    return;
  }
  
  exam.title = examData.title.trim() || exam.title;
  exam.icon = examData.icon || exam.icon;
  exam.description = examData.description || exam.description;
  exam.duration = parseInt(examData.duration) || exam.duration;
  exam.difficulty = examData.difficulty || exam.difficulty;
  
  saveExamsToStorage();
  renderExamList();
  renderAllQuestions();
  populateExamSelects();
  showToast('✅ Exam updated successfully!', 'success');
}

function deleteExam(examId) {
  if (!confirm('⚠️ Are you sure you want to delete this exam and ALL its questions?')) return;
  
  const index = ALL_EXAMS.findIndex(e => e.id === examId);
  if (index === -1) {
    showToast('Exam not found!', 'error');
    return;
  }
  
  ALL_EXAMS.splice(index, 1);
  saveExamsToStorage();
  updateAdminStats();
  renderExamList();
  renderAllQuestions();
  populateExamSelects();
  showToast('✅ Exam deleted successfully!', 'success');
}

function addNewQuestion() {
  const examId = document.getElementById('addQuestionExam').value;
  const question = document.getElementById('addQuestionText').value.trim();
  const options = [
    document.getElementById('addOptionA').value.trim(),
    document.getElementById('addOptionB').value.trim(),
    document.getElementById('addOptionC').value.trim(),
    document.getElementById('addOptionD').value.trim()
  ];
  const answer = parseInt(document.getElementById('addCorrectAnswer').value);
  
  if (!question) {
    showToast('Please enter a question.', 'error');
    return;
  }
  if (options.some(o => !o)) {
    showToast('Please fill all options.', 'error');
    return;
  }
  
  const exam = getExamById(examId);
  if (!exam) {
    showToast('Exam not found!', 'error');
    return;
  }
  
  if (!exam.questions) exam.questions = [];
  exam.questions.push({ question, options, answer });
  exam.totalQuestions = exam.questions.length;
  
  saveExamsToStorage();
  showToast('✅ Question added successfully!', 'success');
  document.getElementById('addQuestionModal').style.display = 'none';
  document.getElementById('addQuestionForm').reset();
  renderAllQuestions();
  updateAdminStats();
  renderExamList();
}

function openEditQuestionModal(examId, qIndex) {
  const exam = getExamById(examId);
  if (!exam || !exam.questions || !exam.questions[qIndex]) {
    showToast('Question not found!', 'error');
    return;
  }
  
  const q = exam.questions[qIndex];
  
  document.getElementById('editQuestionExamId').value = examId;
  document.getElementById('editQuestionIndex').value = qIndex;
  document.getElementById('editQuestionText').value = q.question;
  document.getElementById('editOptionA').value = q.options[0] || '';
  document.getElementById('editOptionB').value = q.options[1] || '';
  document.getElementById('editOptionC').value = q.options[2] || '';
  document.getElementById('editOptionD').value = q.options[3] || '';
  document.getElementById('editCorrectAnswer').value = q.answer;
  
  document.getElementById('editQuestionModal').style.display = 'flex';
}

function saveEditedQuestion() {
  const examId = document.getElementById('editQuestionExamId').value;
  const qIndex = parseInt(document.getElementById('editQuestionIndex').value);
  const question = document.getElementById('editQuestionText').value.trim();
  const options = [
    document.getElementById('editOptionA').value.trim(),
    document.getElementById('editOptionB').value.trim(),
    document.getElementById('editOptionC').value.trim(),
    document.getElementById('editOptionD').value.trim()
  ];
  const answer = parseInt(document.getElementById('editCorrectAnswer').value);
  
  if (!question || options.some(o => !o)) {
    showToast('Please fill all fields.', 'error');
    return;
  }
  
  const exam = getExamById(examId);
  if (!exam || !exam.questions || !exam.questions[qIndex]) {
    showToast('Question not found!', 'error');
    return;
  }
  
  exam.questions[qIndex] = { question, options, answer };
  saveExamsToStorage();
  
  showToast('✅ Question updated successfully!', 'success');
  document.getElementById('editQuestionModal').style.display = 'none';
  renderAllQuestions();
}

function deleteQuestion(examId, qIndex) {
  if (!confirm('⚠️ Are you sure you want to delete this question?')) return;
  
  const exam = getExamById(examId);
  if (!exam || !exam.questions) {
    showToast('Question not found!', 'error');
    return;
  }
  
  exam.questions.splice(qIndex, 1);
  exam.totalQuestions = exam.questions.length;
  saveExamsToStorage();
  
  showToast('✅ Question deleted successfully!', 'success');
  renderAllQuestions();
  updateAdminStats();
  renderExamList();
}

function openAddExamModal() {
  document.getElementById('addExamModal').style.display = 'flex';
  document.getElementById('addExamForm').reset();
}

function openEditExamModal(examId) {
  const exam = getExamById(examId);
  if (!exam) {
    showToast('Exam not found!', 'error');
    return;
  }
  
  document.getElementById('editExamId').value = exam.id;
  document.getElementById('editExamTitle').value = exam.title;
  document.getElementById('editExamIcon').value = exam.icon || '📝';
  document.getElementById('editExamDescription').value = exam.description || '';
  document.getElementById('editExamDuration').value = exam.duration || 30;
  document.getElementById('editExamDifficulty').value = exam.difficulty || 'Medium';
  
  document.getElementById('editExamModal').style.display = 'flex';
}

function populateExamSelects() {
  const selects = ['addQuestionExam', 'filterExam'];
  selects.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = ALL_EXAMS.map(exam => 
      `<option value="${exam.id}">${exam.icon || '📝'} ${exam.title}</option>`
    ).join('');
    if (currentValue) select.value = currentValue;
  });
}

function handleSetToken() {
  const input = document.getElementById('githubTokenInput');
  const token = input.value.trim();
  if (!token) {
    showToast('⚠️ Please paste a valid GitHub token', 'warning');
    return;
  }
  if (token.length < 40) {
    showToast('⚠️ Invalid token format (should be at least 40 characters)', 'error');
    return;
  }
  setGitHubToken(token);
  input.value = '';
  updateGitHubStatus();
  showToast('✅ GitHub token set successfully!', 'success');
}

function handleRemoveToken() {
  if (confirm('⚠️ Are you sure you want to remove the GitHub token? Your exams will still work locally but won\'t sync to GitHub.')) {
    removeGitHubToken();
    updateGitHubStatus();
    showToast('🔓 GitHub token removed', 'warning');
  }
}

function updateGitHubStatus() {
  const status = getGitHubStatus();
  const el = document.getElementById('githubStatus');
  if (el) {
    if (status.connected) {
      el.innerHTML = `✅ Connected to <strong>${status.repo}</strong> (${status.file})`;
      el.style.color = 'var(--success)';
      el.style.background = '#d1fae5';
    } else {
      el.innerHTML = '⚪ Not connected to GitHub (local storage only)';
      el.style.color = 'var(--text-muted)';
      el.style.background = 'var(--bg)';
    }
  }
}

function setupAdminEvents() {
  // Add Exam
  const addExamBtn = document.getElementById('addExamBtn');
  if (addExamBtn) addExamBtn.addEventListener('click', openAddExamModal);
  
  const addExamForm = document.getElementById('addExamForm');
  if (addExamForm) {
    addExamForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const data = {
        title: document.getElementById('examTitle').value,
        icon: document.getElementById('examIcon').value || '📝',
        description: document.getElementById('examDescription').value,
        duration: document.getElementById('examDuration').value,
        difficulty: document.getElementById('examDifficulty').value
      };
      createExam(data);
      document.getElementById('addExamModal').style.display = 'none';
    });
  }
  
  // Edit Exam
  const editExamForm = document.getElementById('editExamForm');
  if (editExamForm) {
    editExamForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const examId = document.getElementById('editExamId').value;
      const data = {
        title: document.getElementById('editExamTitle').value,
        icon: document.getElementById('editExamIcon').value || '📝',
        description: document.getElementById('editExamDescription').value,
        duration: document.getElementById('editExamDuration').value,
        difficulty: document.getElementById('editExamDifficulty').value
      };
      updateExam(examId, data);
      document.getElementById('editExamModal').style.display = 'none';
    });
  }
  
  // Add Question
  const addQuestionBtn = document.getElementById('addQuestionBtn');
  if (addQuestionBtn) {
    addQuestionBtn.addEventListener('click', () => {
      if (!ALL_EXAMS || ALL_EXAMS.length === 0) {
        showToast('⚠️ Please create an exam first!', 'warning');
        openAddExamModal();
        return;
      }
      document.getElementById('addQuestionModal').style.display = 'flex';
    });
  }
  
  const addQuestionForm = document.getElementById('addQuestionForm');
  if (addQuestionForm) {
    addQuestionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      addNewQuestion();
    });
  }
  
  // Edit Question
  const editQuestionForm = document.getElementById('editQuestionForm');
  if (editQuestionForm) {
    editQuestionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveEditedQuestion();
    });
  }
  
  // Filter
  const filterExam = document.getElementById('filterExam');
  if (filterExam) {
    filterExam.addEventListener('change', function() {
      renderAllQuestions(this.value);
    });
  }
  
  // Search
  const searchQuestions = document.getElementById('searchQuestions');
  if (searchQuestions) {
    searchQuestions.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const rows = document.querySelectorAll('#adminQuestionList tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
      });
    });
  }
  
  // Close Modals
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) modal.style.display = 'none';
    });
  });
  
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) this.style.display = 'none';
    });
  });
  
  // Logout
  const adminLogout = document.getElementById('adminLogout');
  if (adminLogout) {
    adminLogout.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
      window.location.href = 'index.html';
    });
  }
  
  // Tabs
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const tabId = this.dataset.tab;
      document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.remove('active'));
      const tabContent = document.getElementById('tab-' + tabId);
      if (tabContent) tabContent.classList.add('active');
      if (tabId === 'questions') renderAllQuestions();
      if (tabId === 'exams') renderExamList();
    });
  });
  
  // GitHub Token buttons
  const setTokenBtn = document.getElementById('setGitHubTokenBtn');
  const removeTokenBtn = document.getElementById('removeGitHubTokenBtn');
  if (setTokenBtn) setTokenBtn.addEventListener('click', handleSetToken);
  if (removeTokenBtn) removeTokenBtn.addEventListener('click', handleRemoveToken);
  
  // Enter key for token input
  const tokenInput = document.getElementById('githubTokenInput');
  if (tokenInput) {
    tokenInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleSetToken();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', loadAdmin);