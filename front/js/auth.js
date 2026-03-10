/**
 * Gestion auth : login, register, logout, état
 */
function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function getUsername() {
  return localStorage.getItem('username') || '';
}

function setAuth(token, username) {
  localStorage.setItem('token', token);
  if (username) localStorage.setItem('username', username);
}

function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
}

function renderAuthBlock(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (isLoggedIn()) {
    el.innerHTML = `
      <span class="auth-user">Bonjour, <strong>${escapeHtml(getUsername())}</strong></span>
      <button type="button" class="btn btn-outline" id="btn-logout">Déconnexion</button>
    `;
    document.getElementById('btn-logout')?.addEventListener('click', () => {
      clearAuth();
      window.location.reload();
    });
  } else {
    el.innerHTML = `
      <form id="form-login" class="auth-form">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Mot de passe" required />
        <button type="submit" class="btn">Connexion</button>
      </form>
      <button type="button" class="btn btn-outline" id="btn-show-register">Créer un compte</button>
      <form id="form-register" class="auth-form hidden">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Mot de passe" required />
        <button type="submit" class="btn">S'inscrire</button>
      </form>
      <p id="auth-message" class="auth-message"></p>
    `;
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const btnShowRegister = document.getElementById('btn-show-register');
    const msg = document.getElementById('auth-message');

    formLogin?.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.textContent = '';
      const fd = new FormData(formLogin);
      try {
        const data = await apiPost('/api/auth/login', { username: fd.get('username'), password: fd.get('password') });
        setAuth(data.token, fd.get('username'));
        window.location.reload();
      } catch (err) {
        msg.textContent = err.error || 'Connexion impossible';
        msg.classList.add('error');
      }
    });

    btnShowRegister?.addEventListener('click', () => {
      formRegister.classList.toggle('hidden');
    });

    formRegister?.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.textContent = '';
      const fd = new FormData(formRegister);
      try {
        await apiPost('/api/auth/register', { username: fd.get('username'), password: fd.get('password') });
        msg.textContent = 'Compte créé. Connecte-toi.';
        msg.classList.remove('error');
        formRegister.classList.add('hidden');
      } catch (err) {
        msg.textContent = err.error || 'Inscription impossible';
        msg.classList.add('error');
      }
    });
  }
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function requireAuth(callback) {
  if (!isLoggedIn()) {
    document.body.innerHTML = '<p class="container">Connecte-toi pour accéder à cette page. <a href="./">Accueil</a></p>';
    return;
  }
  callback?.();
}
