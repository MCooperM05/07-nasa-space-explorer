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

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const images = await response.json();

    // Match your CSS: .gallery is a class, not an id
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Clear previous results (also removes any placeholder)

    images.forEach(item => {
      // Skip videos since <img> can't render them
      if (item.media_type !== 'image') return;

      const card = document.createElement('div');
      card.classList.add('gallery-item'); // matches your .gallery-item CSS

      card.innerHTML = `
        <img src="${item.url}" alt="${item.title}">
        <p><strong>${item.title}</strong></p>
        <p>${item.date}</p>
      `;

      gallery.appendChild(card);
    });

  } catch (error) {
    console.error('Failed to fetch space images:', error);
    alert('Something went wrong fetching images. Check the console for details.');
  }
}