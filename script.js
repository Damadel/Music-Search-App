// This is the API endpoint where my JSON server is running
const API_URL = "https://music-search-apps.vercel.app/songs";

// Getting references to the HTML elements on the page using their IDs
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const sortBtn = document.getElementById("sortBtn");
const resultsDiv = document.getElementById("results");

// I use this array to store all the songs I get from the backend
// So I can filter, sort, and manage them in memory without re-fetching every time
let allSongs = [];

// This runs as soon as the page loads
// It fetches (gets) all the song data from the backend API
fetch(API_URL)
  .then((res) => res.json()) // Convert the response to a usable JavaScript object (JSON)
  .then((data) => {
    allSongs = data; // Save all the songs into my array so I can work with them later
    displaySongs(allSongs); // Display the full list of songs on the page
  })
  .catch((err) => {
    console.error("Failed to fetch songs:", err);
  });

// This function takes in an array of songs and displays them as HTML elements
function displaySongs(songs) {
  resultsDiv.innerHTML = ""; // Clear anything that was already in the display area

  // Loop through each song and create a "card" for it
  songs.forEach((song) => {
    const card = document.createElement("div"); // Make a new div element
    card.className = "card"; // Give it a class name so I can style it in CSS

    // Add the song info into the card using template strings
    // This shows song name, artist, likes, year, and the delete button
    card.innerHTML = `
      <h3>${song.name}</h3>
      <p><strong>Artist:</strong> ${song.artist}</p>
      <p><strong>Likes:</strong> ${song.likes}</p>
      <p><strong>Year:</strong> ${song.year}</p>
      <button class="delete-btn">Delete</button>
    `;

    resultsDiv.appendChild(card); // Add the card to the results div on the page

    // This grabs the delete button inside the card
    const deleteBtn = card.querySelector(".delete-btn");

    // Add an event listener so that when the delete button is clicked, this function runs
    deleteBtn.addEventListener("click", () => {
      // Send a DELETE request to the backend to remove the song
      fetch(`${API_URL}/${song.id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            // If something goes wrong (like wrong ID), throw an error
            throw new Error("Failed to delete song");
          }

          // If the delete was successful, update the array in memory
          allSongs = allSongs.filter((s) => s.id !== song.id); // Remove this song from the array

          // Re-display the remaining songs
          displaySongs(allSongs);
        })
        .catch((err) => {
          console.error("Error deleting song:", err); // Catch any network/server errors
        });
    });
  });
}

// This sets up the search functionality
// When I click the "Search" button, this runs
searchBtn.addEventListener("click", () => {
  // Get the text typed into the search box and clean it up (remove extra spaces, make lowercase)
  const term = searchInput.value.trim().toLowerCase();

  // Filter the songs in memory and return only the ones that match the search term
  const filtered = allSongs.filter(
    (song) =>
      song.name.toLowerCase().includes(term) || // Check if the song name includes the term
      song.artist.toLowerCase().includes(term) // Or if the artist name includes the term
  );

  // Show only the matching (filtered) songs
  displaySongs(filtered);
});

// This sets up sorting by number of likes
// When I click the "Likes" button, this runs
sortBtn.addEventListener("click", () => {
  // Make a copy of the songs array and sort it in descending order of likes
  // I use [...allSongs] to avoid changing the original order
  const sorted = [...allSongs].sort((a, b) => b.likes - a.likes);

  // Display the sorted songs
  displaySongs(sorted);
});
