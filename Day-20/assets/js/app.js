let heroMovies = [];
let heroIndex = 0;
let heroInterval = null;
let heroTrailerPlayer = null;

document.addEventListener('DOMContentLoaded', async () => {
    initNavbar();
    showLoadingScreen();
    await loadHomePage();
    hideLoadingScreen();
});

function showLoadingScreen() {
    document.getElementById('loading-screen')?.classList.remove('hidden');
}
function hideLoadingScreen() {
    const ls = document.getElementById('loading-screen');
    if (ls) {
        ls.classList.add('fade-out');
        setTimeout(() => ls.classList.add('hidden'), 600);
    }
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar?.classList.add('scrolled');
        else navbar?.classList.remove('scrolled');
    });

    hamburger?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('open');
        hamburger.classList.toggle('active');
    });

    const path = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') && path.endsWith(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
}

async function loadHomePage() {
    if (!document.getElementById('hero')) return;

    const [trending, popular, topRated, upcoming, nowPlaying] = await Promise.all([
        API.trending(),
        API.popular(),
        API.topRated(),
        API.upcoming(),
        API.nowPlaying(),
    ]);

    heroMovies = trending?.results?.slice(0, 5) || [];
    if (heroMovies.length) {
        renderHero(heroMovies[0]);
        startHeroRotation();
    }

    const continueList = Storage.getContinueWatching();
    if (continueList.length) {
        renderRow('continue-watching-row', 'Continue Watching', continueList, true);
    }

    renderRow('trending-row', '🔥 Trending Now', trending?.results || []);
    renderRow('popular-row', '⭐ Popular on Netflix', popular?.results || []);
    renderRow('mylist-row', '📋 My List', Storage.getMyList());
    renderRow('toprated-row', '🏆 Top Rated', topRated?.results || []);
    renderRow('upcoming-row', '🎬 Upcoming', upcoming?.results || []);
    renderRow('nowplaying-row', '🎞️ Now Playing', nowPlaying?.results || []);
}

async function renderHero(movie) {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const details = await API.details(movie.id);
    const trailerKey = details ? getTrailerKey(details.videos) : null;

    const backdrop = getBackdropURL(movie.backdrop_path);
    const title = movie.title || movie.name || 'Unknown';
    const overview = movie.overview?.slice(0, 200) + (movie.overview?.length > 200 ? '...' : '') || '';
    const rating = movie.vote_average?.toFixed(1) || 'N/A';
    const year = (movie.release_date || '').slice(0, 4);

    hero.style.backgroundImage = `url('${backdrop}')`;

    document.getElementById('hero-title').textContent = title;
    document.getElementById('hero-overview').textContent = overview;
    document.getElementById('hero-rating').textContent = `⭐ ${rating}`;
    document.getElementById('hero-year').textContent = year;

    const playBtn = document.getElementById('hero-play');
    const infoBtn = document.getElementById('hero-info');
    const listBtn = document.getElementById('hero-list');

    if (playBtn) playBtn.onclick = () => window.location.href = `watch.html?id=${movie.id}`;
    if (infoBtn) infoBtn.onclick = () => window.location.href = `movie.html?id=${movie.id}`;
    if (listBtn) {
        updateListButton(listBtn, movie.id);
        listBtn.onclick = () => toggleMyList(movie, listBtn);
    }

    const trailerContainer = document.getElementById('hero-trailer');
    if (trailerContainer && trailerKey) {
        trailerContainer.innerHTML = `
      <iframe
        id="hero-iframe"
        src="${YOUTUBE_EMBED}${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1"
        allow="autoplay; encrypted-media"
        allowfullscreen
        frameborder="0">
      </iframe>`;
        trailerContainer.classList.remove('hidden');
    } else if (trailerContainer) {
        trailerContainer.classList.add('hidden');
    }

    const heroContent = hero.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
            heroContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        });
    }

    renderHeroDots();
}

function renderHeroDots() {
    const dotsEl = document.getElementById('hero-dots');
    if (!dotsEl) return;
    dotsEl.innerHTML = heroMovies.map((_, i) =>
        `<button class="hero-dot ${i === heroIndex ? 'active' : ''}" onclick="goToHero(${i})"></button>`
    ).join('');
}

function goToHero(index) {
    heroIndex = index;
    clearInterval(heroInterval);
    renderHero(heroMovies[heroIndex]);
    startHeroRotation();
}

function startHeroRotation() {
    clearInterval(heroInterval);
    heroInterval = setInterval(() => {
        heroIndex = (heroIndex + 1) % heroMovies.length;
        renderHero(heroMovies[heroIndex]);
    }, 8000);
}

function renderRow(containerId, title, movies, isContinue = false) {
    const container = document.getElementById(containerId);
    if (!container || !movies?.length) {
        container?.closest('.row-section')?.remove();
        return;
    }

    const section = container.closest('.row-section');
    if (section) {
        section.querySelector('.row-title').textContent = title;
    }

    container.innerHTML = movies.map(movie => createCard(movie, isContinue)).join('');

    // Hover preview
    container.querySelectorAll('.movie-card').forEach(card => {
        setupCardHover(card);
    });

    const wrapper = container.closest('.slider-wrapper');
    if (wrapper) {
        wrapper.querySelector('.arrow-left')?.addEventListener('click', () => scrollRow(container, -1));
        wrapper.querySelector('.arrow-right')?.addEventListener('click', () => scrollRow(container, 1));
    }
}

function createCard(movie, isContinue = false) {
    const poster = getPosterURL(movie.poster_path);
    const title = movie.title || movie.name || 'Unknown';
    const rating = movie.vote_average?.toFixed(1) || 'N/A';
    const year = (movie.release_date || movie.first_air_date || '').slice(0, 4);
    const progress = Storage.getProgress(movie.id);
    const inList = Storage.isInList(movie.id);

    return `
    <div class="movie-card" data-id="${movie.id}" data-title="${title.replace(/"/g, '&quot;')}" onclick="goToMovie(${movie.id})">
      <div class="card-poster">
        <img src="${poster}" alt="${title}" loading="lazy" onerror="this.src='assets/images/no-poster.jpg'">
        <div class="card-overlay">
          <div class="card-play"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div>
          <div class="card-actions">
            <button class="card-btn add-btn ${inList ? 'in-list' : ''}" onclick="event.stopPropagation(); toggleCardList(this, ${movie.id})" title="${inList ? 'Remove from list' : 'Add to list'}">
              ${inList ? '✓' : '+'}
            </button>
            <button class="card-btn like-btn" onclick="event.stopPropagation()" title="Like">👍</button>
            <a href="movie.html?id=${movie.id}" class="card-btn info-btn" onclick="event.stopPropagation()" title="More info">ℹ</a>
          </div>
          <div class="card-info">
            <div class="card-title">${title}</div>
            <div class="card-meta">
              <span class="card-rating">⭐ ${rating}</span>
              <span class="card-year">${year}</span>
            </div>
          </div>
        </div>
        ${isContinue && progress > 0 ? `<div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>` : ''}
        <div class="rating-badge">${rating}</div>
      </div>
    </div>`;
}

function scrollRow(container, dir) {
    const cardWidth = container.querySelector('.movie-card')?.offsetWidth + 12 || 200;
    container.scrollBy({ left: dir * cardWidth * 3, behavior: 'smooth' });
}

function goToMovie(id) {
    window.location.href = `movie.html?id=${id}`;
}

function setupCardHover(card) {
    let hoverTimer;
    card.addEventListener('mouseenter', () => {
        hoverTimer = setTimeout(() => card.classList.add('expanded'), 400);
    });
    card.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
        card.classList.remove('expanded');
    });
}

function toggleMyList(movie, btn) {

    if (Storage.isInList(movie.id)) {
        Storage.removeFromList(movie.id);
        btn.textContent = '+ My List';
        btn.classList.remove('in-list');
    } else {
        Storage.addToList(movie);
        btn.textContent = '✓ My List';
        btn.classList.add('in-list');
    }

    const myListRow = document.getElementById('mylist-row');

    if (myListRow) renderRow('mylist-row', '📋 My List', Storage.getMyList());
}

function toggleCardList(btn, movieId) {
    const card = btn.closest('.movie-card');
    const title = card?.dataset?.title || '';
    const movie = { id: movieId, title, poster_path: card?.querySelector('img')?.src };

    if (Storage.isInList(movieId)) {
        Storage.removeFromList(movieId);
        btn.textContent = '+';
        btn.classList.remove('in-list');
        btn.title = 'Add to list';
        showToast(`Removed from My List`);
    }
    else {
        Storage.addToList(movie);
        btn.textContent = '✓';
        btn.classList.add('in-list');
        btn.title = 'Remove from list';
        showToast(`Added to My List`);
    }
}

function updateListButton(btn, id) {
    if (!btn) return;
    if (Storage.isInList(id)) {
        btn.textContent = '✓ My List';
        btn.classList.add('in-list');
    } else {
        btn.textContent = '+ My List';
        btn.classList.remove('in-list');
    }
}

function showToast(msg) {
    const existing = document.querySelector('.toast');
    existing?.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('mobile-menu')?.classList.remove('open');
    }
    if (e.key === 'ArrowRight' && document.getElementById('hero')) {
        goToHero((heroIndex + 1) % heroMovies.length);
    }
    if (e.key === 'ArrowLeft' && document.getElementById('hero')) {
        goToHero((heroIndex - 1 + heroMovies.length) % heroMovies.length);
    }
});