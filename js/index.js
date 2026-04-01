const themeToggle = document.getElementById('toggleTheme');
const storageKey = 'netflix-theme';

function getSystemPreference() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getCurrentTheme() {
  const saved = localStorage.getItem(storageKey);
  return saved === 'light' || saved === 'dark' ? saved : getSystemPreference();
}

function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle('light-theme', isLight);

  if (themeToggle) {
    themeToggle.textContent = isLight ? 'Modo escuro' : 'Modo claro';
    themeToggle.setAttribute(
      'aria-label',
      isLight ? 'Ativar modo escuro' : 'Ativar modo claro'
    );
  }

  localStorage.setItem(storageKey, isLight ? 'light' : 'dark');
}

function toggleTheme() {
  const current = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  applyTheme(current === 'light' ? 'dark' : 'light');
}

alert('bem vindo a netflix!');

let editingProfileIndex = null;

function storeActiveProfile(name, imageSrc) {
  const absoluteImageSrc = new URL(imageSrc, window.location.href).href;
  localStorage.setItem('perfilAtivoNome', name);
  localStorage.setItem('perfilAtivoImagem', absoluteImageSrc);
}

function openModal(index) {
  const modal = document.getElementById('edit-modal');
  const input = document.getElementById('profile-name-input');
  const profileNameSpan = document.querySelectorAll('.profile-name')[index];

  if (!profileNameSpan) return;

  editingProfileIndex = index;
  input.value = profileNameSpan.textContent;
  modal.classList.add('open');
  input.focus();
}

function closeModal() {
  const modal = document.getElementById('edit-modal');
  modal.classList.remove('open');
  editingProfileIndex = null;
}

function saveProfileName() {
  const input = document.getElementById('profile-name-input');
  if (editingProfileIndex === null) return;

  const newName = input.value.trim();
  if (!newName) {
    alert('Digite um nome valido para o perfil.');
    return;
  }

  const profileNames = document.querySelectorAll('.profile-name');
  const profileNameSpan = profileNames[editingProfileIndex];

  if (profileNameSpan) {
    const previousName = profileNameSpan.textContent;
    profileNameSpan.textContent = newName;
    localStorage.setItem(`profileName_${editingProfileIndex}`, newName);

    const activeName = localStorage.getItem('perfilAtivoNome');
    if (activeName === previousName || (activeName && activeName.startsWith('Perfil'))) {
      localStorage.setItem('perfilAtivoNome', newName);
    }
  }

  closeModal();
}

function initProfileSelection() {
  const profiles = document.querySelectorAll('.perfil');
  const profileCards = document.querySelectorAll('.profile-card');

  profileCards.forEach((card, index) => {
    const nameSpan = card.querySelector('.profile-name');
    const savedName = localStorage.getItem(`profileName_${index}`);

    if (nameSpan && savedName) {
      nameSpan.textContent = savedName;
    }

    const editButton = card.querySelector('.edit-profile');
    if (editButton) {
      editButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        openModal(index);
      });
    }
  });

  profiles.forEach(profile => {
    profile.addEventListener('click', () => {
      const img = profile.querySelector('img');
      const nameSpan = profile.querySelector('.profile-name');

      if (img && nameSpan) {
        const name = nameSpan.textContent;
        const imageSrc = img.getAttribute('src') || img.src;
        storeActiveProfile(name, imageSrc);
      }
    });
  });
}

function initModalEvents() {
  const cancelBtn = document.querySelector('#edit-modal .cancel');
  const saveBtn = document.querySelector('#edit-modal .save');
  const input = document.getElementById('profile-name-input');

  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (saveBtn) saveBtn.addEventListener('click', saveProfileName);

  if (input) {
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') saveProfileName();
      if (event.key === 'Escape') closeModal();
    });
  }

  window.addEventListener('click', event => {
    const modal = document.getElementById('edit-modal');
    if (event.target === modal) closeModal();
  });
}

function setupPhotoEdition() {
  const imageInput = document.createElement('input');
  imageInput.type = 'file';
  imageInput.accept = 'image/*';
  imageInput.style.display = 'none';

  let currentImageElement = null;
  document.body.appendChild(imageInput);

  imageInput.addEventListener('change', () => {
    const file = imageInput.files?.[0];
    if (!file || !currentImageElement) return;

    const objectUrl = URL.createObjectURL(file);
    currentImageElement.src = objectUrl;
    currentImageElement.alt = 'Foto de perfil atualizada';
    currentImageElement.onload = () => URL.revokeObjectURL(objectUrl);
    imageInput.value = '';
  });

  document.querySelectorAll('.profile-card').forEach(card => {
    if (!card.querySelector('.change-photo')) {
      const changeBtn = document.createElement('button');
      changeBtn.className = 'change-photo';
      changeBtn.setAttribute('type', 'button');
      changeBtn.setAttribute('aria-label', 'Mudar foto do perfil');
      changeBtn.title = 'Mudar foto do perfil';
      changeBtn.textContent = '📷';
      card.appendChild(changeBtn);
    }
  });

  document.querySelectorAll('.change-photo').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const profileCard = button.closest('.profile-card');
      currentImageElement = profileCard?.querySelector('img') || null;
      if (currentImageElement) imageInput.click();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initProfileSelection();
  initModalEvents();
  setupPhotoEdition();

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  applyTheme(getCurrentTheme());
});
