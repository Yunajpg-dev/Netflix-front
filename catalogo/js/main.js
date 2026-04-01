import { categories } from './data.js';
import { createCarousel } from './components/Carousel.js';

document.addEventListener('DOMContentLoaded', () => {
    const nomePerfil = localStorage.getItem('perfilAtivoNome');
    const imagemPerfil = localStorage.getItem('perfilAtivoImagem');
    let currentFilter = 'all';
    let currentQuery = '';

    if (nomePerfil || imagemPerfil) {
        const kidsLink = document.querySelector('.kids-link');
        const profileIcon = document.querySelector('.profile-icon');

        if (kidsLink && nomePerfil) kidsLink.textContent = nomePerfil;
        if (profileIcon && imagemPerfil) {
            profileIcon.src = imagemPerfil;
        }
    }

    const container = document.getElementById('main-content');
    const searchBox = document.getElementById('search-box');
    const searchToggle = document.getElementById('search-toggle');
    const searchInput = document.getElementById('search-input');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileMenuToggle = document.getElementById('profile-menu-toggle');
    const profileDropdownMenu = document.getElementById('profile-dropdown-menu');
    const themeToggle = document.getElementById('theme-toggle');

    const getAllCategories = () => {
        const myListItems = JSON.parse(localStorage.getItem('myList') || '[]');
        const allCategories = [...categories];

        if (myListItems.length > 0) {
            allCategories.push({
                title: 'Minha lista',
                items: myListItems
            });
        }

        return allCategories;
    };

    const getCategoryType = (title) => {
        const lowerTitle = title.toLowerCase();

        if (lowerTitle === 'continuar assistindo') return 'filmes';
        if (lowerTitle.includes('filme')) return 'filmes';
        if (lowerTitle.includes('série') || lowerTitle.includes('serie')) return 'series';
        if (lowerTitle.includes('minha lista')) return 'minha-lista';

        return lowerTitle;
    };

    const getFilteredCategories = () => {
        const normalizedQuery = currentQuery.trim().toLowerCase();

        return getAllCategories()
            .map((category) => {
                let items = category.items;

                if (currentFilter !== 'all' && getCategoryType(category.title) !== currentFilter) {
                    items = [];
                }

                if (normalizedQuery) {
                    items = items.filter((item) =>
                        (item.title || '').toLowerCase().includes(normalizedQuery)
                    );
                }

                return {
                    ...category,
                    items
                };
            })
            .filter((category) => category.items.length > 0);
    };

    const renderSections = () => {
        if (!container) return;

        container.innerHTML = '';

        const categoriesToRender = getFilteredCategories();

        if (categoriesToRender.length === 0) {
            container.innerHTML = `
                <section class="search-empty-state">
                    <h2>Nenhum título encontrado</h2>
                    <p>Tente pesquisar por outro nome de filme ou série.</p>
                </section>
            `;
            return;
        }

        categoriesToRender.forEach((category) => {
            const carousel = createCarousel(category);
            container.appendChild(carousel);
        });
    };

    const sectionFilter = (tipo) => {
        currentFilter = tipo;
        renderSections();
    };

    const showMyList = () => {
        currentFilter = 'minha-lista';
        renderSections();

        const myListSection = document.querySelector('.slider-section');
        if (myListSection) {
            myListSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            alert('Sua Minha lista está vazia no momento.');
        }
    };

    renderSections();

    const btnSeries = document.getElementById('btn-series');
    const btnFilmes = document.getElementById('btn-filmes');
    const btnInicio = document.getElementById('btn-inicio');
    const btnMinhaLista = document.getElementById('btn-minha-lista');
    const footerInicio = document.getElementById('footer-inicio');

    if (btnSeries) {
        btnSeries.addEventListener('click', (e) => {
            e.preventDefault();
            sectionFilter('series');
        });
    }

    if (btnFilmes) {
        btnFilmes.addEventListener('click', (e) => {
            e.preventDefault();
            sectionFilter('filmes');
        });
    }

    if (btnInicio) {
        btnInicio.addEventListener('click', (e) => {
            e.preventDefault();
            renderSections();
            currentFilter = 'all';
            renderSections();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (btnMinhaLista) {
        btnMinhaLista.addEventListener('click', (e) => {
            e.preventDefault();
            showMyList();
        });
    }

    if (footerInicio) {
        footerInicio.addEventListener('click', (e) => {
            e.preventDefault();
            renderSections();
            currentFilter = 'all';
            renderSections();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (searchToggle && searchInput && searchBox) {
        searchToggle.addEventListener('click', () => {
            searchBox.classList.toggle('open');

            if (searchBox.classList.contains('open')) {
                searchInput.focus();
            } else {
                searchInput.value = '';
                currentQuery = '';
                renderSections();
            }
        });

        searchInput.addEventListener('input', (event) => {
            currentQuery = event.target.value;
            renderSections();
        });

        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                searchInput.value = '';
                currentQuery = '';
                searchBox.classList.remove('open');
                renderSections();
            }
        });
    }

    if (profileDropdown && profileMenuToggle && profileDropdownMenu) {
        profileMenuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = profileDropdown.classList.toggle('open');
            profileMenuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        profileDropdownMenu.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        window.addEventListener('click', () => {
            profileDropdown.classList.remove('open');
            profileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            profileDropdown?.classList.remove('open');
            profileMenuToggle?.setAttribute('aria-expanded', 'false');
        });
    }

    window.toggleMyList = function (item) {
        let myList = JSON.parse(localStorage.getItem('myList') || '[]');
        const existingIndex = myList.findIndex((i) => i.title === item.title);

        if (existingIndex > -1) {
            myList.splice(existingIndex, 1);
            localStorage.setItem('myList', JSON.stringify(myList));
            renderSections();
            alert(`${item.title} removido da Minha lista!`);
            return false;
        }

        myList.push(item);
        localStorage.setItem('myList', JSON.stringify(myList));
        renderSections();
        alert(`${item.title} adicionado à Minha lista!`);
        return true;
    };
});
