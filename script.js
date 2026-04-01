const storageKey = 'netflix-theme';

function getSystemPreference() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getCurrentTheme() {
  const saved = localStorage.getItem(storageKey);
  return saved === 'light' || saved === 'dark' ? saved : getSystemPreference();
}

function updateThemeButtons(theme) {
  const isLight = theme === 'light';
  const buttons = document.querySelectorAll('#toggleTheme, #theme-toggle');

  buttons.forEach((button) => {
    const inDropdown = button.classList.contains('profile-theme-action');
    button.textContent = isLight
      ? (inDropdown ? 'Ativar modo escuro' : 'Modo escuro')
      : (inDropdown ? 'Ativar modo claro' : 'Modo claro');
    button.setAttribute(
      'aria-label',
      isLight ? 'Ativar modo escuro' : 'Ativar modo claro'
    );
    button.setAttribute(
      'title',
      isLight ? 'Ativar modo escuro' : 'Ativar modo claro'
    );
  });
}

function applyTheme(theme) {
  const normalizedTheme = theme === 'light' ? 'light' : 'dark';
  document.body.classList.toggle('light-theme', normalizedTheme === 'light');
  localStorage.setItem(storageKey, normalizedTheme);
  updateThemeButtons(normalizedTheme);
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  applyTheme(currentTheme === 'light' ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getCurrentTheme());

  document.querySelectorAll('#toggleTheme, #theme-toggle').forEach((button) => {
    button.addEventListener('click', toggleTheme);
  });
});

window.toggleTheme = toggleTheme;
window.applyTheme = applyTheme;
