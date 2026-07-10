// =========================================================
//   DASHBOARD FUNCTIONS
// =========================================================

function loadDashboard() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  
  document.getElementById('dashName').textContent = `Welcome, ${user.name}!`;
  document.getElementById('dashEmail').textContent = user.email;
  document.getElementById('statExams').textContent = user.examsTaken || 0;
  document.getElementById('statHighest').textContent = user.highestScore || 0;
  document.getElementById('statAverage').textContent = user.averageScore || 0;
  
  loadExamHistory(user.id);
  loadLeaderboard();
}

function loadExamHistory(userId) {
  const history = getExamHistory(userId);
  const container = document.getElementById('historyList');
  if (!container) return;
  
  if (history.length === 0) {
    container.innerHTML = `
      <div class="no-history">
        <p>📭 You haven't taken any exams yet.</p>
        <a href="index.html#examsSection" class="btn btn-primary" style="margin-top:12px;">Browse Exams</a>
      </div>
    `;
    return;
  }
  
  container.innerHTML = history.slice().reverse().map((record, index) => {
    const exam = getExamById(record.examId);
    const total = exam ? exam.totalQuestions : 1;
    const pct = ((record.score / total) * 100).toFixed(1);
    let badge = 'badge-average', status = '📊 Average';
    if (pct >= 70) { badge = 'badge-pass'; status = '✅ Pass'; }
    else if (pct < 40) { badge = 'badge-fail'; status = '❌ Fail'; }
    
    return `
      <div class="history-item">
        <div>
          <strong>${exam ? exam.title : 'Unknown Exam'}</strong>
          <br>
          <span style="font-size:0.8rem;color:var(--text-secondary);">
            ${new Date(record.date).toLocaleDateString('en-US', {
              day: '2-digit', month: 'short', year: 'numeric'
            })}
          </span>
        </div>
        <div style="text-align:right;">
          <span class="history-score">${record.score}</span>
          <br>
          <span class="badge ${badge}">${status}</span>
        </div>
      </div>
    `;
  }).join('');
}

function loadLeaderboard() {
  const container = document.getElementById('leaderboardList');
  if (!container) return;
  
  const users = getUsers();
  const sorted = users
    .filter(u => u.examsTaken > 0)
    .sort((a, b) => (b.highestScore || 0) - (a.highestScore || 0))
    .slice(0, 10);
  
  if (sorted.length === 0) {
    container.innerHTML = `
      <div class="no-history">
        <p>🏆 No leaderboard data yet. Be the first to take an exam!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = sorted.map((user, index) => `
    <div class="leaderboard-item">
      <span class="rank">#${index + 1}</span>
      <span class="name">${user.name}</span>
      <span class="score">${user.highestScore || 0} pts</span>
      <span style="font-size:0.8rem;color:var(--text-muted);">${user.examsTaken} exams</span>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('dashName')) {
    loadDashboard();
  }
});