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
  // Build the request URL using .value to get the actual date strings
  // from the input elements (not the elements themselves)
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startInput.value}&end_date=${endInput.value}`;

  try {
    // Send the request to NASA's APOD API
    const response = await fetch(url);

    // Check if NASA's server responded with an error (e.g. bad API key, bad dates)
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    // Parse the JSON response body into a JS array of image objects
    const images = await response.json();

    // Grab the container on the page where we'll display the images
    // (update 'gallery' to match whatever id your HTML actually uses)
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear out any previous results

    // Loop through each day's data and build a card for it
    images.forEach(item => {
      // Some days return a video instead of an image — skip those,
      // or handle them differently, since <img> won't work for a video
      if (item.media_type !== 'image') return;

      const card = document.createElement('div');
      card.classList.add('image-card');
      card.innerHTML = `
        <h3>${item.title}</h3>
        <img src="${item.url}" alt="${item.title}">
        <p>${item.date}</p>
      `;
      gallery.appendChild(card);
    });

  } catch (error) {
    // Log the error and let the user know something went wrong
    console.error('Failed to fetch space images:', error);
    alert('Something went wrong fetching images. Check the console for details.');
  }
}
