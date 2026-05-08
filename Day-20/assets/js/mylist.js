document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('mylist-page')) return;
  initNavbar();
  loadMyList();
});

function loadMyList() {
  const grid = document.getElementById('mylist-grid');
  const empty = document.getElementById('mylist-empty');
  const count = document.getElementById('mylist-count');
  const list = Storage.getMyList();

  if (!list.length) {
    grid.classList.add('hidden');
    empty.classList.remove('hidden');
    if (count) count.textContent = '0 titles';
    return;
  }

  empty.classList.add('hidden');
  grid.classList.remove('hidden');
  if (count) count.textContent = `${list.length} title${list.length !== 1 ? 's' : ''}`;

  grid.innerHTML = list.map(movie => createMyListCard(movie)).join('');
}

function createMyListCard(movie) {
  const poster = getPosterURL(movie.poster_path || '');
  const title = movie.title || movie.name || 'Unknown';
  const rating = movie.vote_average?.toFixed(1) || 'N/A';
  const year = (movie.release_date || '').slice(0, 4);
  const progress = Storage.getProgress(movie.id);

  return `
    <div class="mylist-card" data-id="${movie.id}">
      <div class="mylist-poster">
        <img src="${poster}" alt="${title}" loading="lazy" onerror="this.src='assets/images/no-poster.jpg'">
        <div class="mylist-overlay">
          <a href="watch.html?id=${movie.id}" class="mylist-play">▶ Play</a>
          <a href="movie.html?id=${movie.id}" class="mylist-info">ℹ Info</a>
          <button class="mylist-remove" onclick="removeFromList(${movie.id}, this)">✕ Remove</button>
        </div>
        ${progress > 0 ? `<div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>` : ''}
      </div>
      <div class="mylist-card-info">
        <h4>${title}</h4>
        <div class="mylist-meta">
          ${year ? `<span class="year">${year}</span>` : ''}
          ${rating !== 'N/A' ? `<span class="rating">⭐ ${rating}</span>` : ''}
        </div>
      </div>
    </div>`;
}

function removeFromList(id, btn) {
  Storage.removeFromList(id);
  const card = btn.closest('.mylist-card');
  card.style.transition = 'opacity 0.3s, transform 0.3s';
  card.style.opacity = '0';
  card.style.transform = 'scale(0.9)';
  setTimeout(() => {
    card.remove();
    loadMyList();
  }, 300);
}

function clearMyList() {
  if (!confirm('Clear your entire list?')) return;
  Storage.saveMyList([]);
  loadMyList();
}