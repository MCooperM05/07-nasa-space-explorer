// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

const url = 'https://api.nasa.gov/planetary/apod?api_key=Hnb4rGRJ7FnMaWWcS5GSjGxjjzAkTs9GzeZr5I8c&start_date=${startInput}&end_date=${endInput}';
