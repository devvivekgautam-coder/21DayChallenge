document.addEventListener('DOMContentLoaded', async () => {
  if (!document.getElementById('movie-page')) return;
  initNavbar();

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { window.location.href = 'index.html'; return; }

  await loadMoviePage(id);
});

async function loadMoviePage(id) {
  showMovieSkeleton();

  const movie = await API.details(id);
  if (!movie) { window.location.href = 'index.html'; return; }

  const title = movie.title || movie.name || 'Unknown';
  document.title = `${title} — CineStream`;

  const backdrop = getBackdropURL(movie.backdrop_path);
  const backdropEl = document.getElementById('movie-backdrop');
  if (backdropEl) {
    backdropEl.style.backgroundImage = `url('${backdrop}')`;
  }

  const posterEl = document.getElementById('movie-poster');
  if (posterEl) {
    posterEl.src = getPosterURL(movie.poster_path, 'w780');
    posterEl.alt = title;
  }

  setText('movie-title', title);
  setText('movie-tagline', movie.tagline || '');
  setText('movie-overview', movie.overview || 'No overview available.');
  setText('movie-rating', `⭐ ${movie.vote_average?.toFixed(1) || 'N/A'} / 10`);
  setText('movie-year', (movie.release_date || '').slice(0, 4));
  setText('movie-runtime', movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '');
  setText('movie-status', movie.status || '');
  setText('movie-language', movie.original_language?.toUpperCase() || '');
  setText('movie-votes', `${(movie.vote_count || 0).toLocaleString()} votes`);

  const genresEl = document.getElementById('movie-genres');
  if (genresEl) {
    genresEl.innerHTML = (movie.genres || []).map(g =>
      `<span class="genre-tag">${g.name}</span>`
    ).join('');
  }

  const trailerKey = getTrailerKey(movie.videos);
  const trailerSection = document.getElementById('trailer-section');
  const trailerIframe = document.getElementById('trailer-iframe');
  if (trailerKey && trailerIframe) {
    trailerIframe.src = `${YOUTUBE_EMBED}${trailerKey}?modestbranding=1&rel=0`;
    trailerSection?.classList.remove('hidden');
  } else {
    trailerSection?.classList.add('hidden');
  }

  const playBtn = document.getElementById('movie-play');
  const listBtn = document.getElementById('movie-list');
  if (playBtn) playBtn.onclick = () => window.location.href = `watch.html?id=${id}`;
  if (listBtn) {
    updateMovieListBtn(listBtn, movie.id);
    listBtn.onclick = () => {
      if (Storage.isInList(movie.id)) {
        Storage.removeFromList(movie.id);
      } else {
        Storage.addToList({
          id: movie.id, title, poster_path: movie.poster_path,
          vote_average: movie.vote_average, release_date: movie.release_date,
        });
      }
      updateMovieListBtn(listBtn, movie.id);
    };
  }

  const cast = (movie.credits?.cast || []).slice(0, 12);
  const castEl = document.getElementById('cast-grid');
  if (castEl && cast.length) {
    castEl.innerHTML = cast.map(person => `
      <div class="cast-card">
        <div class="cast-img">
          <img src="${getPosterURL(person.profile_path, 'w185')}" alt="${person.name}"
               loading="lazy" onerror="this.src='assets/images/no-person.jpg'">
        </div>
        <div class="cast-info">
          <h5>${person.name}</h5>
          <p>${person.character || ''}</p>
        </div>
      </div>`).join('');
    document.getElementById('cast-section')?.classList.remove('hidden');
  }

  const similar = movie.similar?.results || [];
  const similarEl = document.getElementById('similar-movies');
  if (similarEl && similar.length) {
    similarEl.innerHTML = similar.slice(0, 12).map(m => `
      <div class="similar-card" onclick="window.location.href='movie.html?id=${m.id}'">
        <img src="${getPosterURL(m.poster_path)}" alt="${m.title || m.name}" loading="lazy" onerror="this.src='assets/images/no-poster.jpg'">
        <div class="similar-info">
          <h4>${m.title || m.name || 'Unknown'}</h4>
          <span>⭐ ${m.vote_average?.toFixed(1) || 'N/A'}</span>
        </div>
      </div>`).join('');
    document.getElementById('similar-section')?.classList.remove('hidden');
  }

  hideMovieSkeleton();
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function updateMovieListBtn(btn, id) {
  if (Storage.isInList(id)) {
    btn.innerHTML = '✓ My List';
    btn.classList.add('in-list');
  } else {
    btn.innerHTML = '+ My List';
    btn.classList.remove('in-list');
  }
}

function showMovieSkeleton() {
  document.getElementById('movie-content')?.classList.add('loading');
}
function hideMovieSkeleton() {
  document.getElementById('movie-content')?.classList.remove('loading');
  document.getElementById('movie-content')?.classList.add('visible');
}