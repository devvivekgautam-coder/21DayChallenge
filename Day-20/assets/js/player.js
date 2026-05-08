let currentMovie = null;
let isPlaying = false;
let controlsTimeout = null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.getElementById('player-page')) return;
  initNavbar();

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { window.location.href = 'index.html'; return; }

  await loadPlayerPage(id);
  initCustomControls();
});

async function loadPlayerPage(id) {
  showPlayerSkeleton();

  const movie = await API.details(id);
  if (!movie) { window.location.href = 'index.html'; return; }
  currentMovie = movie;

  const trailerKey = getTrailerKey(movie.videos);
  const title = movie.title || movie.name || 'Unknown';
  const backdrop = getBackdropURL(movie.backdrop_path);
  const savedProgress = Storage.getProgress(id);

  document.title = `${title} — CineStream`;

  document.getElementById('player-title').textContent = title;

  document.getElementById('player-meta').textContent =
    `${(movie.release_date || '').slice(0, 4)} • ${movie.runtime ? movie.runtime + ' min' : ''} • ⭐ ${movie.vote_average?.toFixed(1) || 'N/A'}`;

  const playerContainer = document.getElementById('player-container');
  if (trailerKey) {
    playerContainer.innerHTML = `
      <div class="youtube-player-wrap">
        <iframe
          id="yt-player"
          src="${YOUTUBE_EMBED}${trailerKey}?autoplay=1&enablejsapi=1&controls=0&modestbranding=1&rel=0&showinfo=0"
          allow="autoplay; encrypted-media; fullscreen"
          allowfullscreen
          frameborder="0">
        </iframe>
        <div class="player-gradient"></div>
        <div class="skip-intro" id="skip-intro" onclick="hideSkipIntro()">Skip Intro ⏭</div>
        <div class="player-controls" id="player-controls">
          <div class="controls-left">
            <button class="ctrl-btn" id="play-pause-btn" onclick="toggleYTPlay()">⏸</button>
            <button class="ctrl-btn" id="rewind-btn" onclick="seekYT(-10)">⏮ 10s</button>
            <button class="ctrl-btn" id="forward-btn" onclick="seekYT(10)">10s ⏭</button>
            <div class="volume-wrap">
              <button class="ctrl-btn" onclick="toggleMute()">🔊</button>
              <input type="range" class="volume-slider" min="0" max="100" value="100" oninput="setVolume(this.value)">
            </div>
          </div>
          <div class="controls-center">
            <span id="ctrl-title">${title}</span>
          </div>
          <div class="controls-right">
            <button class="ctrl-btn" onclick="toggleFullscreen()">⛶</button>
            <button class="ctrl-btn" onclick="window.location.href='movie.html?id=${id}'">ℹ Info</button>
          </div>
        </div>
      </div>`;

    setTimeout(showSkipIntro, 3000);
    setTimeout(hideSkipIntro, 25000);
  } else {
    playerContainer.innerHTML = `
      <div class="no-trailer">
        <img src="${backdrop}" alt="${title}" style="width:100%;height:100%;object-fit:cover;opacity:0.3">
        <div class="no-trailer-msg">
          <div class="no-trailer-icon">🎬</div>
          <h3>Trailer not available</h3>
          <p>The trailer for this title is not available for playback.</p>
          <a href="movie.html?id=${id}" class="btn-primary">View Details</a>
        </div>
      </div>`;
  }

  window.addEventListener('beforeunload', () => {
    Storage.updateProgress({ id: movie.id, title, poster_path: movie.poster_path }, 35 + Math.random() * 50);
  });

  renderSimilarMovies(movie.similar?.results || []);
  hidePlayerSkeleton();
}

function showSkipIntro() {
  document.getElementById('skip-intro')?.classList.add('visible');
}
function hideSkipIntro() {
  document.getElementById('skip-intro')?.classList.remove('visible');
}

function initCustomControls() {
  const wrap = document.querySelector('.youtube-player-wrap');
  if (!wrap) return;

  wrap.addEventListener('mousemove', showControls);
  wrap.addEventListener('mouseleave', scheduleHideControls);
}

function showControls() {
  document.getElementById('player-controls')?.classList.add('visible');
  clearTimeout(controlsTimeout);
  scheduleHideControls();
}

function scheduleHideControls() {
  controlsTimeout = setTimeout(() => {
    document.getElementById('player-controls')?.classList.remove('visible');
  }, 3000);
}

function toggleYTPlay() {
  isPlaying = !isPlaying;
  document.getElementById('play-pause-btn').textContent = isPlaying ? '⏸' : '▶';
}

function seekYT(seconds) {
  showToast?.(`${seconds > 0 ? '+' : ''}${seconds}s`);
}

function toggleMute() {
  showToast?.('Mute toggled');
}

function setVolume(val) {

}

function toggleFullscreen() {
  const el = document.getElementById('player-container');
  if (!document.fullscreenElement) {
    el?.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

function renderSimilarMovies(movies) {
  const container = document.getElementById('similar-grid');
  if (!container) return;
  container.innerHTML = movies.slice(0, 12).map(m => `
    <div class="similar-card" onclick="window.location.href='watch.html?id=${m.id}'">
      <img src="${getPosterURL(m.poster_path)}" alt="${m.title || m.name}" loading="lazy" onerror="this.src='assets/images/no-poster.jpg'">
      <div class="similar-info">
        <h4>${m.title || m.name || 'Unknown'}</h4>
        <span>⭐ ${m.vote_average?.toFixed(1) || 'N/A'}</span>
      </div>
    </div>`).join('');
}

function showPlayerSkeleton() {
  document.getElementById('player-container').innerHTML = `<div class="skeleton-player"></div>`;
}
function hidePlayerSkeleton() { }

document.addEventListener('keydown', (e) => {
  if (!document.getElementById('player-page')) return;
  const tag = document.activeElement.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;

  switch (e.key) {
    case ' ':
    case 'k':
      e.preventDefault();
      toggleYTPlay();
      break;
    case 'f':
      toggleFullscreen();
      break;
    case 'Escape':
      if (document.fullscreenElement) document.exitFullscreen();
      break;
    case 'ArrowLeft':
      seekYT(-10);
      break;
    case 'ArrowRight':
      seekYT(10);
      break;
  }
});

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
  }, 2000);
}