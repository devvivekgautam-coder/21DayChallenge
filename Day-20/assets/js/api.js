const API_KEY = '8265bd1679663a7ea12ac168da84d2e8';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/';
const IMG_W500 = IMG_BASE + 'w500';
const IMG_W780 = IMG_BASE + 'w780';
const IMG_ORIGINAL = IMG_BASE + 'original';
const YOUTUBE_EMBED = 'https://www.youtube.com/embed/';


async function fetchAPI(endpoint, params = {}) {
    const query = new URLSearchParams({ api_key: API_KEY, ...params }).toString();
    const url = `${BASE_URL}${endpoint}?${query}`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error('Fetch error:', err);
        return null;
    }
}

const API = {
    trending: (page = 1) => fetchAPI('/trending/movie/week', { page }),
    popular: (page = 1) => fetchAPI('/movie/popular', { page }),
    topRated: (page = 1) => fetchAPI('/movie/top_rated', { page }),
    upcoming: (page = 1) => fetchAPI('/movie/upcoming', { page }),
    nowPlaying: (page = 1) => fetchAPI('/movie/now_playing', { page }),
    details: (id) => fetchAPI(`/movie/${id}`, { append_to_response: 'credits,videos,similar' }),
    videos: (id) => fetchAPI(`/movie/${id}/videos`),
    search: (query, page = 1) => fetchAPI('/search/movie', { query, page }),
    genres: () => fetchAPI('/genre/movie/list'),
    byGenre: (genreId, page = 1) => fetchAPI('/discover/movie', { with_genres: genreId, sort_by: 'popularity.desc', page }),
    similar: (id) => fetchAPI(`/movie/${id}/similar`),
    person: (id) => fetchAPI(`/person/${id}`, { append_to_response: 'movie_credits' }),
    tvTrending: (page = 1) => fetchAPI('/trending/tv/week', { page }),
    tvPopular: (page = 1) => fetchAPI('/tv/popular', { page }),
    multiSearch: (query) => fetchAPI('/search/multi', { query }),
};

function getPosterURL(path, size = 'w500') {
    if (!path) return 'assets/images/no-poster.jpg';
    return `${IMG_BASE}${size}${path}`;
}

function getBackdropURL(path, size = 'original') {
    if (!path) return 'assets/images/no-backdrop.jpg';
    return `${IMG_BASE}${size}${path}`;
}

function getTrailerKey(videos) {
    if (!videos || !videos.results) return null;

    const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')
        || videos.results.find(v => v.site === 'YouTube');

    return trailer ? trailer.key : null;
}

const Storage = {
    getMyList: () => JSON.parse(localStorage.getItem('myList') || '[]'),

    saveMyList: (list) => localStorage.setItem('myList', JSON.stringify(list)),

    addToList: (movie) => {
        const list = Storage.getMyList();

        if (!list.find(m => m.id === movie.id)) {
            list.unshift(movie);
            Storage.saveMyList(list);
            return true;
        }
        return false;
    },

    removeFromList: (id) => {
        const list = Storage.getMyList().filter(m => m.id !== id);
        Storage.saveMyList(list);
    },

    isInList: (id) => Storage.getMyList().some(m => m.id === id),

    getContinueWatching: () => JSON.parse(localStorage.getItem('continueWatching') || '[]'),

    saveContinueWatching: (list) => localStorage.setItem('continueWatching', JSON.stringify(list)),

    updateProgress: (movie, progress) => {
        let list = Storage.getContinueWatching();
        const idx = list.findIndex(m => m.id === movie.id);
        const entry = { ...movie, progress, timestamp: Date.now() };
        if (idx >= 0) list[idx] = entry;
        else list.unshift(entry);
        list = list.slice(0, 20);
        Storage.saveContinueWatching(list);
    },

    getProgress: (id) => {
        const list = Storage.getContinueWatching();
        const m = list.find(m => m.id === id);
        return m ? m.progress : 0;
    },
};