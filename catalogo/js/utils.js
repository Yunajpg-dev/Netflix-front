export function getYouTubeId(url) {
    if (!url) return "7RUA0IOfar8";
    if (url.includes('v=')) {
        return url.split('v=')[1].split('&')[0];
    }
    return url.split('/').pop();
}

export function getRandomMatchScore() {
    return Math.floor(Math.random() * 20 + 80);
}

export function getDurationText(item) {
    if (!item) return 'Duração indisponível';

    const genre = item.genre ? item.genre.toLowerCase() : '';

    if (genre.includes('série') || genre.includes('serie') || item.seasons) {
        const seasons = item.seasons || 1;
        return `${seasons} temporada${seasons > 1 ? 's' : ''}`;
    }

    if (item.duration) {
        return item.duration;
    }

    // valor padrão se não informado explicitamente
    return '2h ' + Math.floor(Math.random() * 59) + 'm';
}

export function getRandomAgeBadge() {
    return Math.random() > 0.5 ? { text: 'A16', class: 'red-accent' } : { text: '16', class: '' };
}

export function getAgeBadge(item) {
    if (item && item.genre && item.genre.toLowerCase().includes('anima')) {
        return { text: 'L', class: 'green-accent' };
    }

    if (item && item.hasDeath) {
        return { text: 'A16', class: 'red-accent' };
    }

    return getRandomAgeBadge();
}
