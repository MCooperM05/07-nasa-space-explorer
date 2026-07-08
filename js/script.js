// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

const spaceImagesBtn = document.getElementById("spaceImagesBtn");

spaceImagesBtn.addEventListener('click', fetchImages);

async function fetchImages(){
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startInput.value}&end_date=${endInput.value}`;

  const gallery = document.querySelector('.gallery');

  // Show a loading message immediately, using your existing placeholder styles
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔄</div>
      <p>Loading space photos…</p>
    </div>
  `;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const images = await response.json();

    // Clear the loading message before adding real results
    gallery.innerHTML = '';

    images.forEach(item => {
      if (item.media_type !== 'image') return;

      const card = document.createElement('div');
      card.classList.add('gallery-item');

      card.innerHTML = `
        <img src="${item.url}" alt="${item.title}">
        <p><strong>${item.title}</strong></p>
        <p>${item.date}</p>
      `;

      gallery.appendChild(card);
    });

    // Handle the case where the date range returned zero images
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

    // Show an error message in the gallery itself, not just an alert
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">⚠️</div>
        <p>Something went wrong fetching images. Please try again.</p>
      </div>
    `;
  }
}