// =========================================================
//   ADMIN PANEL (local-only editor + export)
//   - No login accounts, no backend, no database.
//   - Edits are auto-saved as a DRAFT in this browser's
//     localStorage so you don't lose work on refresh.
//   - Click "Download data.js" to export the current state
//     as a real js/data.js file. Replace the one in your
//     hosted project with it (and re-upload / commit) to
//     publish the changes to every visitor of the site.
// =========================================================

const ADMIN_PASSCODE = 'admin123';   // <-- CHANGE THIS to your own passcode
const DRAFT_KEY = 'admin_draft_exams';
const MATERIALS_DRAFT_KEY = 'admin_draft_materials';

let workingExams = [];
let workingMaterials = [];

// ===== Passcode Gate =====
function checkPasscode() {
  const entered = document.getElementById('passInput').value;
  const errorEl = document.getElementById('passError');
  if (entered === ADMIN_PASSCODE) {
    sessionStorage.setItem('admin_unlocked', '1');
    document.getElementById('passGate').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    initAdmin();
  } else {
    errorEl.style.display = 'block';
  }
}

document.getElementById('passSubmit').addEventListener('click', checkPasscode);
document.getElementById('passInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkPasscode();
});

document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('admin_unlocked') === '1') {
    document.getElementById('passGate').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    initAdmin();
  }
});

// ===== Draft persistence =====
function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore corrupted draft */ }
  // No draft yet -> start from whatever is currently published in data.js
  return JSON.parse(JSON.stringify(ALL_EXAMS));
}

function saveDraft() {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(workingExams));
}

function loadMaterialsDraft() {
  try {
    const raw = localStorage.getItem(MATERIALS_DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore corrupted draft */ }
  return JSON.parse(JSON.stringify(typeof STUDY_MATERIALS !== 'undefined' ? STUDY_MATERIALS : []));
}

function saveMaterialsDraft() {
  localStorage.setItem(MATERIALS_DRAFT_KEY, JSON.stringify(workingMaterials));
}

// ===== Init =====
function initAdmin() {
  workingExams = loadDraft();
  workingMaterials = loadMaterialsDraft();
  updateAdminStats();
  renderExamList();
  renderAllQuestions();
  renderMaterialsList();
  populateExamSelects();
  setupAdminEvents();
}

function getWorkingExamById(id) {
  return workingExams.find(e => e.id === id);
}

function refreshAll() {
  saveDraft();
  updateAdminStats();
  renderExamList();
  renderAllQuestions(document.getElementById('filterExam').value || 'all');
  populateExamSelects();
}

function refreshMaterials() {
  saveMaterialsDraft();
  renderMaterialsList();
}

// ===== Stats =====
function updateAdminStats() {
  document.getElementById('adminTotalExams').textContent = workingExams.length;
  const totalQ = workingExams.reduce((sum, e) => sum + (e.questions ? e.questions.length : 0), 0);
  document.getElementById('adminTotalQuestions').textContent = totalQ;
}

// ===== Render Exam List =====
function renderExamList() {
  const container = document.getElementById('adminExamList');
  if (!container) return;

  if (workingExams.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px;color:var(--text-secondary);">
        <p>📭 No exams yet.</p>
        <button class="btn btn-primary" id="createFirstExamBtn" style="margin-top:12px;">➕ Create First Exam</button>
      </div>
    `;
    document.getElementById('createFirstExamBtn').addEventListener('click', openAddExamModal);
    return;
  }

  container.innerHTML = workingExams.map((exam) => `
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
        <button class="btn-edit" onclick="previewExam('${exam.id}')" title="Preview as a student would see it">👁️ Preview</button>
        <button class="btn-edit" onclick="cloneExam('${exam.id}')" title="Duplicate this exam">📄 Clone</button>
        <button class="btn-edit" onclick="openEditExamModal('${exam.id}')">✏️ Edit</button>
        <button class="btn-delete" onclick="deleteExam('${exam.id}')">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

// ===== Render All Questions =====
function renderAllQuestions(filterExamId = 'all') {
  const tbody = document.getElementById('adminQuestionList');
  if (!tbody) return;

  const letters = ['A', 'B', 'C', 'D'];
  let html = '';
  let count = 0;

  const exams = filterExamId === 'all' ? workingExams : workingExams.filter(e => e.id === filterExamId);
  const canReorder = filterExamId !== 'all'; // dragging across exams isn't meaningful, only within one
  const reorderHint = document.getElementById('reorderHint');
  if (reorderHint) reorderHint.style.display = canReorder ? 'block' : 'none';

  exams.forEach((exam) => {
    (exam.questions || []).forEach((q, qIndex) => {
      count++;
      html += `
        <tr class="q-row" draggable="${canReorder}" data-exam-id="${exam.id}" data-q-index="${qIndex}">
          <td style="padding:10px;">${canReorder ? '<span class="drag-handle">⠿</span>' : ''}${count}</td>
          <td style="padding:10px;max-width:300px;">
            <span class="badge-exam">${exam.icon || '📝'} ${exam.title}</span><br>
            <span style="font-size:0.95rem;">${q.question}</span>
          </td>
          <td style="padding:10px;font-size:0.85rem;">
            ${q.options.map((o, i) => `${letters[i]}. ${o}${i === q.answer ? ' ✅' : ''}`).join('<br>')}
          </td>
          <td style="padding:10px;"><strong style="color:var(--success);">${letters[q.answer]}</strong></td>
          <td style="padding:10px;">
            <div style="display:flex;gap:6px;">
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
      📭 No questions found. ${workingExams.length > 0 ? 'Add your first question!' : 'Create an exam first!'}
    </td></tr>`;
  }
  tbody.innerHTML = html;
  if (canReorder) attachRowDragEvents(tbody);
}

// ===== Drag-drop question reorder (only meaningful within a single filtered exam) =====
let dragSrcIndex = null;

function attachRowDragEvents(tbody) {
  tbody.querySelectorAll('tr.q-row').forEach(row => {
    row.addEventListener('dragstart', () => {
      dragSrcIndex = parseInt(row.dataset.qIndex);
      row.classList.add('dragging');
    });
    row.addEventListener('dragend', () => row.classList.remove('dragging'));
    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      row.classList.add('drag-over');
    });
    row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
    row.addEventListener('drop', (e) => {
      e.preventDefault();
      row.classList.remove('drag-over');
      const examId = row.dataset.examId;
      const targetIndex = parseInt(row.dataset.qIndex);
      if (dragSrcIndex === null || targetIndex === dragSrcIndex) return;
      const exam = getWorkingExamById(examId);
      if (!exam) return;
      const [moved] = exam.questions.splice(dragSrcIndex, 1);
      exam.questions.splice(targetIndex, 0, moved);
      dragSrcIndex = null;
      refreshAll();
      showToast('↕️ Question order updated!', 'success');
    });
  });
}

// ===== CREATE EXAM =====
function createExam(examData) {
  const newExam = {
    id: 'exam_' + Date.now(),
    title: examData.title.trim(),
    icon: examData.icon || '📝',
    description: examData.description || 'Practice exam',
    duration: parseInt(examData.duration) || 30,
    totalQuestions: 0,
    category: (examData.category || 'general').trim().toLowerCase() || 'general',
    difficulty: examData.difficulty || 'Medium',
    questions: []
  };
  workingExams.push(newExam);
  refreshAll();
  showToast('✅ Exam created! (remember to download & publish)', 'success');
}

// ===== EDIT EXAM =====
function updateExam(examId, examData) {
  const exam = getWorkingExamById(examId);
  if (!exam) return showToast('Exam not found!', 'error');
  exam.title = examData.title.trim() || exam.title;
  exam.icon = examData.icon || exam.icon;
  exam.description = examData.description || exam.description;
  exam.category = (examData.category || exam.category || 'general').trim().toLowerCase() || 'general';
  exam.duration = parseInt(examData.duration) || exam.duration;
  exam.difficulty = examData.difficulty || exam.difficulty;
  refreshAll();
  showToast('✅ Exam updated!', 'success');
}

// ===== DELETE EXAM =====
function deleteExam(examId) {
  if (!confirm('⚠️ Delete this exam and ALL its questions?')) return;
  workingExams = workingExams.filter(e => e.id !== examId);
  refreshAll();
  showToast('✅ Exam deleted!', 'success');
}

// ===== STUDY MATERIALS: CRUD =====
function renderMaterialsList() {
  const container = document.getElementById('adminMaterialsList');
  if (!container) return;

  if (workingMaterials.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-secondary);">📭 এখনও কোনো study material যোগ করা হয়নি।</div>`;
    return;
  }

  container.innerHTML = workingMaterials.map(mat => {
    const exam = mat.examId ? getWorkingExamById(mat.examId) : null;
    return `
      <div class="admin-exam-card">
        <div class="exam-info">
          <div class="exam-icon">${mat.icon || '📎'}</div>
          <div>
            <h4>${mat.title}</h4>
            <div class="exam-meta">
              <span>${exam ? '🔗 ' + exam.title : '🌐 General'}</span>
              ${mat.category ? `<span>🏷️ ${mat.category}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="exam-actions">
          <button class="btn-edit" onclick="openEditMaterialModal('${mat.id}')">✏️ Edit</button>
          <button class="btn-delete" onclick="deleteMaterial('${mat.id}')">🗑️ Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function populateMaterialExamSelect() {
  ['materialExam', 'editMaterialExam'].forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = `<option value="">🌐 General (not tied to any exam)</option>` +
      workingExams.map(exam => `<option value="${exam.id}">${exam.icon || '📝'} ${exam.title}</option>`).join('');
    if (currentValue) select.value = currentValue;
  });
}

function createMaterial(data) {
  if (!data.title.trim() || !data.url.trim()) return showToast('⚠️ Title ও URL আবশ্যক।', 'warning');
  const exam = data.examId ? getWorkingExamById(data.examId) : null;
  workingMaterials.push({
    id: 'mat_' + Date.now(),
    title: data.title.trim(),
    description: data.description || '',
    icon: data.icon || '📎',
    url: data.url.trim(),
    examId: data.examId || '',
    category: data.category || (exam ? exam.category : 'general')
  });
  refreshMaterials();
  showToast('✅ Study material added!', 'success');
}

function openEditMaterialModal(matId) {
  const mat = workingMaterials.find(m => m.id === matId);
  if (!mat) return showToast('Material not found!', 'error');
  document.getElementById('editMaterialId').value = mat.id;
  document.getElementById('editMaterialTitle').value = mat.title;
  document.getElementById('editMaterialIcon').value = mat.icon || '📎';
  document.getElementById('editMaterialDescription').value = mat.description || '';
  document.getElementById('editMaterialUrl').value = mat.url;
  document.getElementById('editMaterialCategory').value = mat.category || '';
  populateMaterialExamSelect();
  document.getElementById('editMaterialExam').value = mat.examId || '';
  document.getElementById('editMaterialModal').style.display = 'flex';
}

function updateMaterial(matId, data) {
  const mat = workingMaterials.find(m => m.id === matId);
  if (!mat) return showToast('Material not found!', 'error');
  mat.title = data.title.trim() || mat.title;
  mat.icon = data.icon || mat.icon;
  mat.description = data.description || mat.description;
  mat.url = data.url.trim() || mat.url;
  mat.examId = data.examId || '';
  mat.category = data.category || mat.category;
  refreshMaterials();
  showToast('✅ Study material updated!', 'success');
}

function deleteMaterial(matId) {
  if (!confirm('⚠️ Delete this study material?')) return;
  workingMaterials = workingMaterials.filter(m => m.id !== matId);
  refreshMaterials();
  showToast('✅ Study material deleted!', 'success');
}

// ===== CLONE EXAM =====
function cloneExam(examId) {
  const exam = getWorkingExamById(examId);
  if (!exam) return showToast('Exam not found!', 'error');
  const clone = JSON.parse(JSON.stringify(exam));
  clone.id = 'exam_' + Date.now();
  clone.title = exam.title + ' (Copy)';
  workingExams.push(clone);
  refreshAll();
  showToast('✅ Exam cloned! Edit the copy as needed.', 'success');
}

// ===== PREVIEW EXAM (student view, read-only) =====
function previewExam(examId) {
  const exam = getWorkingExamById(examId);
  if (!exam) return showToast('Exam not found!', 'error');
  const letters = ['A', 'B', 'C', 'D'];
  const body = document.getElementById('previewBody');

  if (!exam.questions || exam.questions.length === 0) {
    body.innerHTML = `<p style="color:var(--text-secondary);">This exam has no questions yet.</p>`;
  } else {
    body.innerHTML = `
      <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:14px;">
        ${exam.icon || '📝'} <strong>${exam.title}</strong> — ${exam.questions.length} question(s), showing exactly as a student would see them (correct answer highlighted for your reference only).
      </p>
      <div style="display:flex;flex-direction:column;gap:16px;max-height:60vh;overflow-y:auto;">
        ${exam.questions.map((q, i) => `
          <div class="preview-question-card">
            <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:6px;">Question ${i + 1}</div>
            <h4 style="margin-bottom:12px;">${q.question}</h4>
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${q.options.map((opt, oi) => `
                <div class="option locked ${oi === q.answer ? 'correct-answer' : ''}" style="padding:8px 12px;">
                  <span class="opt-label">${letters[oi]}</span><span>${opt}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  document.getElementById('previewModal').style.display = 'flex';
}

// ===== ADD QUESTION =====
function addNewQuestion() {
  const examId = document.getElementById('addQuestionExam').value;
  const question = document.getElementById('addQuestionText').value.trim();
  const options = ['A', 'B', 'C', 'D'].map(l => document.getElementById('addOption' + l).value.trim());
  const answer = parseInt(document.getElementById('addCorrectAnswer').value);

  if (!question || options.some(o => !o)) return showToast('Please fill all fields.', 'error');

  const exam = getWorkingExamById(examId);
  if (!exam) return showToast('Exam not found!', 'error');

  exam.questions = exam.questions || [];
  exam.questions.push({ question, options, answer });
  exam.totalQuestions = exam.questions.length;

  refreshAll();
  showToast('✅ Question added!', 'success');
  document.getElementById('addQuestionModal').style.display = 'none';
  document.getElementById('addQuestionForm').reset();
}

// ===== EDIT QUESTION =====
function openEditQuestionModal(examId, qIndex) {
  const exam = getWorkingExamById(examId);
  if (!exam || !exam.questions[qIndex]) return showToast('Question not found!', 'error');
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
  const options = ['A', 'B', 'C', 'D'].map(l => document.getElementById('editOption' + l).value.trim());
  const answer = parseInt(document.getElementById('editCorrectAnswer').value);

  if (!question || options.some(o => !o)) return showToast('Please fill all fields.', 'error');

  const exam = getWorkingExamById(examId);
  if (!exam || !exam.questions[qIndex]) return showToast('Question not found!', 'error');

  exam.questions[qIndex] = { question, options, answer };
  refreshAll();
  showToast('✅ Question updated!', 'success');
  document.getElementById('editQuestionModal').style.display = 'none';
}

// ===== DELETE QUESTION =====
function deleteQuestion(examId, qIndex) {
  if (!confirm('⚠️ Delete this question?')) return;
  const exam = getWorkingExamById(examId);
  if (!exam) return;
  exam.questions.splice(qIndex, 1);
  exam.totalQuestions = exam.questions.length;
  refreshAll();
  showToast('✅ Question deleted!', 'success');
}

// ===== Modals =====
function openAddExamModal() {
  document.getElementById('addExamForm').reset();
  document.getElementById('addExamModal').style.display = 'flex';
}

function openEditExamModal(examId) {
  const exam = getWorkingExamById(examId);
  if (!exam) return showToast('Exam not found!', 'error');
  document.getElementById('editExamId').value = exam.id;
  document.getElementById('editExamTitle').value = exam.title;
  document.getElementById('editExamIcon').value = exam.icon || '📝';
  document.getElementById('editExamDescription').value = exam.description || '';
  document.getElementById('editExamCategory').value = exam.category || 'general';
  document.getElementById('editExamDuration').value = exam.duration || 30;
  document.getElementById('editExamDifficulty').value = exam.difficulty || 'Medium';
  document.getElementById('editExamModal').style.display = 'flex';
}

function populateExamSelects() {
  ['addQuestionExam', 'filterExam', 'bulkImportExam'].forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    const currentValue = select.value;
    const options = workingExams.map(exam => `<option value="${exam.id}">${exam.icon || '📝'} ${exam.title}</option>`).join('');
    select.innerHTML = id === 'filterExam' ? `<option value="all">All Exams</option>${options}` : options;
    if (currentValue) select.value = currentValue;
  });
  populateMaterialExamSelect();
}

// ===== Download data.js =====
function downloadDataJs() {
  const examBankJson = JSON.stringify(workingExams, null, 2);
  const materialsJson = JSON.stringify(workingMaterials, null, 2);
  const fileContent = `// =========================================================
//   DATA - All Exams and Questions
//   Generated by Admin Panel on ${new Date().toLocaleString()}
//   Replace js/data.js in your project with this file and
//   publish (upload / commit & push) to update the live site.
// =========================================================

const ALL_EXAMS = ${examBankJson};

// ===== Study Materials =====
// Each item: { id, title, description, icon, url, examId ("" = general, not tied to any exam), category }
const STUDY_MATERIALS = ${materialsJson};

// ===== Helper Functions =====
function getExamById(id) {
  return ALL_EXAMS.find(exam => exam.id === id);
}

function getMaterialsByExamId(examId) {
  return STUDY_MATERIALS.filter(m => m.examId === examId);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
`;

  const blob = new Blob([fileContent], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('📥 data.js downloaded — now replace it in your hosted project!', 'success');
}

// ===== BULK IMPORT (JSON or CSV) =====
function parseBulkCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) return [];
  // Detect & skip a header row like "question,optionA,optionB,optionC,optionD,answer"
  const startIndex = /^\s*question\s*,/i.test(lines[0]) ? 1 : 0;
  const splitCsvLine = (line) => {
    // simple CSV split that respects quoted commas
    const cells = [];
    let cur = '', inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { inQuotes = !inQuotes; }
      else if (c === ',' && !inQuotes) { cells.push(cur.trim()); cur = ''; }
      else { cur += c; }
    }
    cells.push(cur.trim());
    return cells.map(c => c.replace(/^"|"$/g, ''));
  };

  const questions = [];
  for (let i = startIndex; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    if (cells.length < 6) continue;
    const [question, a, b, c, d, answer] = cells;
    questions.push({
      question,
      options: [a, b, c, d],
      answer: Math.min(3, Math.max(0, parseInt(answer) || 0))
    });
  }
  return questions;
}

function parseBulkImportText(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    const parsed = JSON.parse(trimmed);
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    return arr
      .filter(q => q && q.question && Array.isArray(q.options) && q.options.length >= 2)
      .map(q => ({
        question: String(q.question),
        options: q.options.slice(0, 4).map(String),
        answer: Math.min(3, Math.max(0, parseInt(q.answer) || 0))
      }));
  }
  return parseBulkCsv(trimmed);
}

function runBulkImport() {
  const examId = document.getElementById('bulkImportExam').value;
  const text = document.getElementById('bulkImportText').value;
  const exam = getWorkingExamById(examId);
  if (!exam) return showToast('⚠️ Please select a target exam.', 'warning');

  let newQuestions;
  try {
    newQuestions = parseBulkImportText(text);
  } catch (err) {
    return showToast('❌ Could not parse input — check the JSON/CSV format.', 'error');
  }
  if (!newQuestions || newQuestions.length === 0) {
    return showToast('⚠️ No valid questions found in the input.', 'warning');
  }

  exam.questions = (exam.questions || []).concat(newQuestions);
  exam.totalQuestions = exam.questions.length;
  refreshAll();
  showToast(`✅ Imported ${newQuestions.length} question(s)!`, 'success');
  document.getElementById('bulkImportModal').style.display = 'none';
  document.getElementById('bulkImportText').value = '';
  document.getElementById('bulkImportFile').value = '';
}

// ===== Toast =====
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== Events =====
function setupAdminEvents() {
  document.getElementById('downloadDataBtn').addEventListener('click', downloadDataJs);

  document.getElementById('addExamBtn').addEventListener('click', openAddExamModal);
  document.getElementById('addExamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    createExam({
      title: document.getElementById('examTitle').value,
      icon: document.getElementById('examIcon').value,
      description: document.getElementById('examDescription').value,
      category: document.getElementById('examCategory').value,
      duration: document.getElementById('examDuration').value,
      difficulty: document.getElementById('examDifficulty').value
    });
    document.getElementById('addExamModal').style.display = 'none';
  });

  document.getElementById('editExamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    updateExam(document.getElementById('editExamId').value, {
      title: document.getElementById('editExamTitle').value,
      icon: document.getElementById('editExamIcon').value,
      description: document.getElementById('editExamDescription').value,
      category: document.getElementById('editExamCategory').value,
      duration: document.getElementById('editExamDuration').value,
      difficulty: document.getElementById('editExamDifficulty').value
    });
    document.getElementById('editExamModal').style.display = 'none';
  });

  document.getElementById('addQuestionBtn').addEventListener('click', () => {
    if (workingExams.length === 0) {
      showToast('⚠️ Please create an exam first!', 'warning');
      openAddExamModal();
      return;
    }
    document.getElementById('addQuestionForm').reset();
    document.getElementById('addQuestionModal').style.display = 'flex';
  });
  document.getElementById('addQuestionForm').addEventListener('submit', (e) => {
    e.preventDefault();
    addNewQuestion();
  });

  document.getElementById('editQuestionForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveEditedQuestion();
  });

  document.getElementById('bulkImportBtn').addEventListener('click', () => {
    if (workingExams.length === 0) {
      showToast('⚠️ Please create an exam first!', 'warning');
      openAddExamModal();
      return;
    }
    document.getElementById('bulkImportModal').style.display = 'flex';
  });
  document.getElementById('bulkImportFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { document.getElementById('bulkImportText').value = reader.result; };
    reader.readAsText(file);
  });
  document.getElementById('bulkImportSubmit').addEventListener('click', runBulkImport);

  document.getElementById('addMaterialBtn').addEventListener('click', () => {
    document.getElementById('addMaterialForm').reset();
    populateMaterialExamSelect();
    document.getElementById('addMaterialModal').style.display = 'flex';
  });
  document.getElementById('addMaterialForm').addEventListener('submit', function(e) {
    e.preventDefault();
    createMaterial({
      title: document.getElementById('materialTitle').value,
      icon: document.getElementById('materialIcon').value,
      description: document.getElementById('materialDescription').value,
      url: document.getElementById('materialUrl').value,
      examId: document.getElementById('materialExam').value,
      category: document.getElementById('materialCategory').value
    });
    document.getElementById('addMaterialModal').style.display = 'none';
  });
  document.getElementById('editMaterialForm').addEventListener('submit', function(e) {
    e.preventDefault();
    updateMaterial(document.getElementById('editMaterialId').value, {
      title: document.getElementById('editMaterialTitle').value,
      icon: document.getElementById('editMaterialIcon').value,
      description: document.getElementById('editMaterialDescription').value,
      url: document.getElementById('editMaterialUrl').value,
      examId: document.getElementById('editMaterialExam').value,
      category: document.getElementById('editMaterialCategory').value
    });
    document.getElementById('editMaterialModal').style.display = 'none';
  });

  document.getElementById('filterExam').addEventListener('change', function() {
    renderAllQuestions(this.value);
  });

  document.getElementById('searchQuestions').addEventListener('input', function() {
    const term = this.value.toLowerCase();
    document.querySelectorAll('#adminQuestionList tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  });

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

  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.remove('active'));
      document.getElementById('tab-' + this.dataset.tab).classList.add('active');
      if (this.dataset.tab === 'questions') renderAllQuestions(document.getElementById('filterExam').value);
      if (this.dataset.tab === 'exams') renderExamList();
      if (this.dataset.tab === 'materials') renderMaterialsList();
    });
  });
}
