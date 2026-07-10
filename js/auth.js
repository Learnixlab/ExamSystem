// =========================================================
//   AUTHENTICATION SYSTEM
// =========================================================

const USERS_KEY = 'exam_users';
const CURRENT_USER_KEY = 'exam_current_user';
const ADMIN_EMAIL = 'admin@examsystem.com';

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

function registerUser(name, email, password) {
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: 'This email is already registered.' };
  }
  
  const newUser = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: password,
    createdAt: new Date().toISOString(),
    examsTaken: 0,
    totalScore: 0,
    highestScore: 0,
    averageScore: 0,
    isAdmin: email.toLowerCase().trim() === ADMIN_EMAIL,
    completedExams: []
  };
  
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  return { success: true, user: newUser };
}

function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password
  );
  if (!user) {
    return { success: false, message: 'Invalid email or password.' };
  }
  setCurrentUser(user);
  return { success: true, user };
}

function logoutUser() {
  setCurrentUser(null);
}

function hasUserTakenExam(userId, examId) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return false;
  return user.completedExams && user.completedExams.includes(examId);
}

function markExamCompleted(userId, examId) {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return;
  
  if (!users[userIndex].completedExams) {
    users[userIndex].completedExams = [];
  }
  
  if (!users[userIndex].completedExams.includes(examId)) {
    users[userIndex].completedExams.push(examId);
  }
  
  saveUsers(users);
  
  const current = getCurrentUser();
  if (current && current.id === userId) {
    current.completedExams = users[userIndex].completedExams;
    setCurrentUser(current);
  }
}

function updateUserStats(userId, score, examId) {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return;
  
  const user = users[userIndex];
  user.examsTaken = (user.examsTaken || 0) + 1;
  user.totalScore = (user.totalScore || 0) + score;
  user.averageScore = Math.round(user.totalScore / user.examsTaken);
  if (score > (user.highestScore || 0)) {
    user.highestScore = score;
  }
  
  if (!user.completedExams) user.completedExams = [];
  if (!user.completedExams.includes(examId)) {
    user.completedExams.push(examId);
  }
  
  const history = getExamHistory(userId);
  history.push({
    examId,
    score,
    date: new Date().toISOString()
  });
  saveExamHistory(userId, history);
  
  saveUsers(users);
  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(user);
  }
}

function getExamHistory(userId) {
  try {
    return JSON.parse(localStorage.getItem(`exam_history_${userId}`) || '[]');
  } catch {
    return [];
  }
}

function saveExamHistory(userId, history) {
  localStorage.setItem(`exam_history_${userId}`, JSON.stringify(history));
}

function checkAuthState() {
  const user = getCurrentUser();
  const navActions = document.getElementById('navActions');
  if (!navActions) return;
  
  if (user) {
    navActions.innerHTML = `
      <span style="font-size:0.85rem;color:var(--text-secondary);">
        Welcome, ${user.name.split(' ')[0]}${user.isAdmin ? ' 👑' : ''}
      </span>
      <div class="user-avatar" id="userAvatar">
        ${user.name.charAt(0).toUpperCase()}
      </div>
    `;
    const avatar = document.getElementById('userAvatar');
    if (avatar) avatar.addEventListener('click', toggleUserMenu);
  } else {
    navActions.innerHTML = `
      <button class="btn btn-outline btn-sm" id="navLoginBtn">Login</button>
      <button class="btn btn-primary btn-sm" id="navRegisterBtn">Register</button>
    `;
    const loginBtn = document.getElementById('navLoginBtn');
    const registerBtn = document.getElementById('navRegisterBtn');
    if (loginBtn) loginBtn.addEventListener('click', () => {
      document.getElementById('loginModal').style.display = 'flex';
    });
    if (registerBtn) registerBtn.addEventListener('click', () => {
      document.getElementById('registerModal').style.display = 'flex';
    });
  }
}

function toggleUserMenu() {
  let menu = document.getElementById('userMenu');
  if (!menu) {
    const user = getCurrentUser();
    menu = document.createElement('div');
    menu.id = 'userMenu';
    menu.className = 'user-menu';
    let menuItems = `
      <a href="dashboard.html">📊 Dashboard</a>
    `;
    if (user && user.isAdmin) {
      menuItems += `<a href="admin.html">⚙️ Admin Panel</a>`;
    }
    menuItems += `
      <div class="divider"></div>
      <a href="#" id="logoutLink" style="color: var(--danger);">🚪 Logout</a>
    `;
    menu.innerHTML = menuItems;
    document.body.appendChild(menu);
    document.getElementById('logoutLink').addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
      menu.classList.remove('show');
      checkAuthState();
      if (typeof showToast === 'function') {
        showToast('Logged out successfully', 'success');
      }
      window.location.reload();
    });
  }
  menu.classList.toggle('show');
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const result = loginUser(email, password);
      if (result.success) {
        document.getElementById('loginModal').style.display = 'none';
        showToast(`Welcome back, ${result.user.name}!`, 'success');
        checkAuthState();
        window.location.reload();
      } else {
        showToast(result.message, 'error');
      }
    });
  }
  
  // Register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const confirm = document.getElementById('registerConfirm').value;
      if (password !== confirm) {
        showToast('Passwords do not match.', 'error');
        return;
      }
      if (password.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        return;
      }
      const result = registerUser(name, email, password);
      if (result.success) {
        document.getElementById('registerModal').style.display = 'none';
        showToast(`Account created! Welcome ${result.user.name}!`, 'success');
        checkAuthState();
        window.location.reload();
      } else {
        showToast(result.message, 'error');
      }
    });
  }
  
  // Switch between login and register
  const switchToRegister = document.getElementById('switchToRegister');
  const switchToLogin = document.getElementById('switchToLogin');
  if (switchToRegister) {
    switchToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('loginModal').style.display = 'none';
      document.getElementById('registerModal').style.display = 'flex';
    });
  }
  if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('registerModal').style.display = 'none';
      document.getElementById('loginModal').style.display = 'flex';
    });
  }
  
  // Close modals
  const loginClose = document.getElementById('loginClose');
  const registerClose = document.getElementById('registerClose');
  if (loginClose) loginClose.addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'none';
  });
  if (registerClose) registerClose.addEventListener('click', () => {
    document.getElementById('registerModal').style.display = 'none';
  });
  
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) this.style.display = 'none';
    });
  });
});

window.hasUserTakenExam = hasUserTakenExam;
window.markExamCompleted = markExamCompleted;