let searchTimeout = null;let currentGenre = null;
let currentPage = 1;
let currentQuery = '';
let isLoading = false;

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.getElementById('search-results')) return;
  initNavbar();

  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q') || '';

  if (q) {
    document.getElementById('search-input').value = q;
    currentQuery = q;
    await performSearch(q);
  } else {
    await loadGenres();
    await loadTrending();
  }

  setupSearchInput();
  setupInfiniteScroll();
});

function setupSearchInput() {
  const input = document.getElementById('search-input');
  if (!input) return;

  input.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearTimeout(searchTimeout);

    if (query.length < 2) {
      hideSuggestions();
      if (!query) {
        currentQuery = '';
        loadTrending();
      }
      return;
    }

    searchTimeout = setTimeout(async () => {
      showSuggestions(query);
      currentQuery = query;
      currentPage = 1;
      await performSearch(query, true);
      updateURL(query);
    }, 400);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      hideSuggestions();
      const q = input.value.trim();
      if (q) {
        currentQuery = q;
        currentPage = 1;
        performSearch(q, true);
        updateURL(q);
      }
    }
    if (e.key === 'Escape') hideSuggestions();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) hideSuggestions();
  });
}

function updateURL(query) {
  const url = new URL(window.location);
  url.searchParams.set('q', query);
  window.history.pushState({}, '', url);
}

async function showSuggestions(query) {
  const box = document.getElementById('suggestions');
  if (!box) return;

  const data = await API.multiSearch(query);
  const results = (data?.results || []).slice(0, 6);

  if (!results.length) { box.classList.remove('open'); return; }

  box.innerHTML = results.map(item => {
    const title = item.title || item.name || '';
    const type = item.media_type === 'movie' ? '🎬' : item.media_type === 'tv' ? '📺' : '👤';
    const img = item.poster_path || item.profile_path
      ? `<img src="${getPosterURL(item.poster_path || item.profile_path, 'w92')}" alt="">`
      : '<div class="no-img">?</div>';
    return `<div class="suggestion-item" onclick="selectSuggestion(${item.id}, '${item.media_type}', '${title.replace(/'/g, "\\'")}')">
      <div class="suggestion-img">${img}</div>
      <div class="suggestion-info">
        <span class="suggestion-title">${title}</span>
        <span class="suggestion-type">${type} ${item.media_type || 'movie'}</span>
      </div>
    </div>`;
  }).join('');

  box.classList.add('open');
}

function hideSuggestions() {
  document.getElementById('suggestions')?.classList.remove('open');
}

function selectSuggestion(id, type, title) {
  hideSuggestions();
  if (type === 'person') return;
  window.location.href = `movie.html?id=${id}`;
}

async function performSearch(query, reset = false) {
  if (isLoading) return;
  isLoading = true;

  const resultsEl = document.getElementById('search-results');
  const countEl = document.getElementById('result-count');
  const titleEl = document.getElementById('results-title');

  if (reset) {
    currentPage = 1;
    resultsEl.innerHTML = '';
    currentGenre = null;
    document.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
  }

  if (currentPage === 1) showSkeletons(resultsEl, 12);

  titleEl.textContent = `Results for "${query}"`;

  const data = await API.search(query, currentPage);
  const movies = data?.results?.filter(m => m.media_type !== 'person' && (m.poster_path || m.backdrop_path)) || data?.results || [];

  if (currentPage === 1) resultsEl.innerHTML = '';
  if (countEl) countEl.textContent = `${data?.total_results?.toLocaleString() || 0} results`;

  if (!movies.length && currentPage === 1) {
    resultsEl.innerHTML = '<div class="no-results"><h3>No results found</h3><p>Try different keywords</p></div>';
    isLoading = false;
    return;
  }

  movies.forEach(movie => {
    const card = createSearchCard(movie);
    resultsEl.insertAdjacentHTML('beforeend', card);
  });

  currentPage++;
  isLoading = false;
}

async function loadGenres() {
  const container = document.getElementById('genre-chips');
  if (!container) return;

  const data = await API.genres();
  const genres = data?.genres || [];

  container.innerHTML = genres.map(g =>
    `<button class="genre-chip" data-id="${g.id}" onclick="filterByGenre(${g.id}, this)">${g.name}</button>`
  ).join('');
}

async function filterByGenre(genreId, btn) {
  currentGenre = genreId;
  currentPage = 1;
  currentQuery = '';
  document.getElementById('search-input').value = '';

  document.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');

  const resultsEl = document.getElementById('search-results');
  const titleEl = document.getElementById('results-title');
  titleEl.textContent = `${btn.textContent} Movies`;
  resultsEl.innerHTML = '';
  showSkeletons(resultsEl, 12);

  const data = await API.byGenre(genreId, 1);
  resultsEl.innerHTML = '';
  (data?.results || []).forEach(m => resultsEl.insertAdjacentHTML('beforeend', createSearchCard(m)));
}

async function loadTrending() {
  const resultsEl = document.getElementById('search-results');
  const titleEl = document.getElementById('results-title');
  if (!resultsEl) return;
  titleEl.textContent = '🔥 Trending Now';
  showSkeletons(resultsEl, 12);
  const data = await API.trending();
  resultsEl.innerHTML = '';
  (data?.results || []).forEach(m => resultsEl.insertAdjacentHTML('beforeend', createSearchCard(m)));
}

function createSearchCard(movie) {
  const poster = getPosterURL(movie.poster_path);
  const title = movie.title || movie.name || 'Unknown';
  const rating = movie.vote_average?.toFixed(1) || 'N/A';
  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4);

  return `
    <div class="search-card" onclick="window.location.href='movie.html?id=${movie.id}'">
      <div class="search-card-img">
        <img src="${poster}" alt="${title}" loading="lazy" onerror="this.src='assets/images/no-poster.jpg'">
        <div class="search-overlay">
          <div class="play-icon">▶</div>
        </div>
      </div>
      <div class="search-card-info">
        <h4>${title}</h4>
        <div class="search-card-meta">
          <span class="rating">⭐ ${rating}</span>
          <span class="year">${year}</span>
        </div>
      </div>
    </div>`;
}

function setupInfiniteScroll() {
  const sentinel = document.getElementById('scroll-sentinel');
  if (!sentinel) return;

  const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && !isLoading) {
      if (currentQuery) await performSearch(currentQuery);
      else if (currentGenre) {
        const data = await API.byGenre(currentGenre, currentPage);
        const resultsEl = document.getElementById('search-results');
        (data?.results || []).forEach(m => resultsEl.insertAdjacentHTML('beforeend', createSearchCard(m)));
        currentPage++;
      }
    }
  }, { threshold: 0.1 });

  observer.observe(sentinel);
}

function showSkeletons(container, count) {
  container.innerHTML = Array(count).fill(0).map(() => `
    <div class="search-card skeleton">
      <div class="search-card-img skeleton-img"></div>
      <div class="search-card-info">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>`).join('');
}