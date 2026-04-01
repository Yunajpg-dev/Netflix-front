import { createCard } from './Card.js';

function getCategoryType(title) {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle === 'continuar assistindo') {
        return 'filmes';
    }

    if (lowerTitle.includes('filme')) {
        return 'filmes';
    }

    if (lowerTitle.includes('rie') || lowerTitle.includes('sã©rie')) {
        return 'series';
    }

    if (lowerTitle.includes('minha lista')) {
        return 'minha-lista';
    }

    return lowerTitle;
}

export function createCarousel(category) {
    const section = document.createElement('div');
    section.className = 'slider-section';
    section.id = `section-${category.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    section.dataset.section = category.title.toLowerCase();
    section.dataset.tipo = getCategoryType(category.title);

    const header = document.createElement('div');
    header.className = 'slider-header';

    const title = document.createElement('h2');
    title.className = 'slider-title';
    title.innerText = category.title;

    const indicators = document.createElement('div');
    indicators.className = 'slider-indicators';

    header.appendChild(title);
    header.appendChild(indicators);
    section.appendChild(header);

    const row = document.createElement('div');
    row.className = 'movie-row';

    category.items.forEach((item) => {
        const card = createCard(item);
        row.appendChild(card);
    });

    section.appendChild(row);
    return section;
}
