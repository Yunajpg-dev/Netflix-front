import { getYouTubeId, getRandomMatchScore, getDurationText, getAgeBadge } from '../utils.js';

export function createCard(item) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    if (item.progress) {
        card.classList.add('has-progress');
    }

    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.title || 'Movie cover';

    const iframe = document.createElement('iframe');
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; encrypted-media';

    const videoId = getYouTubeId(item.youtube);
    const description = item.description || 'Descrição indisponível no momento.';

    card.appendChild(iframe);
    card.appendChild(img);

    const ageBadge = getAgeBadge(item);

    const details = document.createElement('div');
    details.className = 'card-details';
    details.innerHTML = `
        <div class="details-buttons">
            <div class="left-buttons">
                <button class="btn-icon btn-play-icon"><i class="fas fa-play" style="margin-left:2px;"></i></button>
                <button class="btn-icon btn-check"><i class="fas fa-check"></i></button>
                <button class="btn-icon btn-add"><i class="fas fa-plus"></i></button>
                <button class="btn-icon"><i class="fas fa-thumbs-up"></i></button>
            </div>
            <div class="right-buttons">
                <button class="btn-icon btn-expand" aria-label="Mostrar descrição"><i class="fas fa-chevron-down"></i></button>
            </div>
        </div>
        <div class="movie-title">${item.title || (item.genre ? item.genre : 'Título indisponível')}</div>
        <div class="details-info">
            <span class="match-score">${getRandomMatchScore()}% relevante</span>
            <span class="age-badge ${ageBadge.class}">${ageBadge.text}</span>
            <span class="duration">${getDurationText(item)}</span>
            <span class="resolution">HD</span>
        </div>
        <div class="details-tags">
            ${item.tags ? item.tags.map((tag) => `<span>${tag}</span>`).join('') : '<span>Empolgante</span><span>Animação</span><span>Ficção</span>'}
        </div>
        <div class="details-description">
            <p>${description}</p>
        </div>
    `;
    card.appendChild(details);

    const addButton = details.querySelector('.btn-add');
    const checkButton = details.querySelector('.btn-check');
    const expandButton = details.querySelector('.btn-expand');

    const isInMyList = () => {
        const myList = JSON.parse(localStorage.getItem('myList') || '[]');
        return myList.some((i) => i.title === item.title);
    };

    const updateAddButton = () => {
        if (isInMyList()) {
            addButton.innerHTML = '<i class="fas fa-check"></i>';
            addButton.classList.add('added');
        } else {
            addButton.innerHTML = '<i class="fas fa-plus"></i>';
            addButton.classList.remove('added');
        }
    };

    updateAddButton();

    if (addButton) {
        addButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (window.toggleMyList) {
                window.toggleMyList(item);
                updateAddButton();
            }
        });
    }

    if (expandButton) {
        expandButton.addEventListener('click', (event) => {
            event.stopPropagation();

            document.querySelectorAll('.movie-card.expanded').forEach((expandedCard) => {
                if (expandedCard !== card) {
                    expandedCard.classList.remove('expanded');
                }
            });

            card.classList.toggle('expanded');
        });
    }

    if (checkButton) {
        checkButton.addEventListener('click', () => {
            item.progress = 100;
            if (!card.classList.contains('has-progress')) {
                card.classList.add('has-progress');
            }
            const pbContainer = card.querySelector('.progress-bar-container');
            if (pbContainer) {
                const pbValue = pbContainer.querySelector('.progress-value');
                if (pbValue) pbValue.style.width = '100%';
            }
            checkButton.classList.add('checked');
        });
    }

    if (item.progress) {
        const pbContainer = document.createElement('div');
        pbContainer.className = 'progress-bar-container';
        const pbValue = document.createElement('div');
        pbValue.className = 'progress-value';
        pbValue.style.width = `${item.progress}%`;
        pbContainer.appendChild(pbValue);
        card.appendChild(pbContainer);
    }

    let playTimeout;
    card.addEventListener('mouseenter', () => {
        const rect = card.getBoundingClientRect();
        const windowWidth = window.innerWidth;

        if (rect.left < 100) {
            card.classList.add('origin-left');
        } else if (rect.right > windowWidth - 100) {
            card.classList.add('origin-right');
        }

        playTimeout = setTimeout(() => {
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}`;
            iframe.classList.add('playing');
            img.classList.add('playing-video');
        }, 600);
    });

    card.addEventListener('mouseleave', () => {
        clearTimeout(playTimeout);
        iframe.classList.remove('playing');
        img.classList.remove('playing-video');
        iframe.src = '';
        card.classList.remove('origin-left');
        card.classList.remove('origin-right');
        card.classList.remove('expanded');
    });

    return card;
}
