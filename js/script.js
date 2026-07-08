// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

setupDateInputs(startInput, endInput);

const spaceImagesBtn = document.getElementById("spaceImagesBtn");
spaceImagesBtn.addEventListener('click', fetchImages);

const gallery = document.getElementById('gallery');

// --- Modal setup ---
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const modalClose = document.getElementById('modalClose');

function openModal(item) {
  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalExplanation.textContent = item.explanation;

  // Clean up anything left over from a previous modal open
  const existingWrapper = document.getElementById('modalVideoWrapper');
  if (existingWrapper) existingWrapper.remove();
  const existingLink = document.getElementById('modalVideoLink');
  if (existingLink) existingLink.remove();

  if (item.media_type === 'video') {
    modalImg.classList.add('hidden');

    // Only YouTube and Vimeo reliably allow iframe embedding.
    // Other hosts (including apod.nasa.gov itself) block it via
    // the X-Frame-Options header, which causes a "refused to connect" error.
    const isEmbeddable = /youtube\.com|youtu\.be|player\.vimeo\.com/.test(item.url);

    if (isEmbeddable) {
      const videoWrapper = document.createElement('div');
      videoWrapper.id = 'modalVideoWrapper';
      videoWrapper.classList.add('modal-video-wrapper');
      videoWrapper.innerHTML = `<iframe src="${item.url}" allowfullscreen></iframe>`;
      modalImg.insertAdjacentElement('afterend', videoWrapper);
    } else {
      // Fallback: a plain link that opens the video in a new tab
      const link = document.createElement('a');
      link.id = 'modalVideoLink';
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.classList.add('modal-video-link');
      link.textContent = 'Watch video ↗';
      modalImg.insertAdjacentElement('afterend', link);
    }

  } else {
    modalImg.classList.remove('hidden');
    modalImg.src = item.url;
    modalImg.alt = item.title;
  }

  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

let currentImages = [];

gallery.addEventListener('click', (e) => {
  const card = e.target.closest('.gallery-item');
  if (!card) return;
  const item = currentImages[card.dataset.index];
  if (item) openModal(item);
});

// --- Fetching + rendering ---
async function fetchImages(){
  // thumbs=True asks NASA to include a thumbnail_url for video entries
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startInput.value}&end_date=${endInput.value}&thumbs=True`;

  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔄</div>
      <p>Loading space photos…</p>
    </div>
  `;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`NASA API error: ${response.status}`);

    const images = await response.json();
    currentImages = images;

    gallery.innerHTML = '';

    images.forEach((item, index) => {
      const card = document.createElement('div');
      card.classList.add('gallery-item');
      card.dataset.index = index;

      if (item.media_type === 'video') {
        // Use the video's thumbnail if NASA provided one; otherwise fall back
        // to a plain placeholder box so the layout doesn't break
        const thumb = item.thumbnail_url
          ? `<img src="${item.thumbnail_url}" alt="${item.title}">`
          : `<div class="placeholder-icon" style="padding:60px 0;">🎬</div>`;

        card.innerHTML = `
          <span class="media-badge">▶ VIDEO</span>
          ${thumb}
          <p><strong>${item.title}</strong></p>
          <p>${item.date}</p>
        `;
      } else {
        card.innerHTML = `
          <img src="${item.url}" alt="${item.title}">
          <p><strong>${item.title}</strong></p>
          <p>${item.date}</p>
        `;
      }

      gallery.appendChild(card);
    });

    if (gallery.children.length === 0) {
      gallery.innerHTML = `
        <div class="placeholder">
          <div class="placeholder-icon">🪐</div>
          <p>No images found for that date range.</p>
        </div>
      `;
    }

  } catch (error) {
    console.error('Failed to fetch space images:', error);
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">⚠️</div>
        <p>Something went wrong fetching images. Please try again.</p>
      </div>
    `;
  }
}