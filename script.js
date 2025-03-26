//  First, I define the API URL where my music data lives
// This is the link to my local JSON server running on port 3004
const API_URL = "http://localhost:3004/music";

//  Now I grab all the elements from my HTML that I’ll need to work with later
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");

//  Now I use fetch() to get data from the server when the page first loads
fetch(API_URL)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    //  I go inside the returned JSON and pick out the array of songs
    const songs = data.songs;

    //  I log the full song list just to make sure the data came through correctly
    console.log("Fetched songs:", songs);

    //  Now I want to allow searching — so I listen for when the user clicks the "Search" button
    searchBtn.addEventListener("click", () => {
      //  First, I clear the previous search results from the page
      resultsDiv.innerHTML = "";

      //  I grab whatever the user typed in the search input field
      const searchTerm = searchInput.value.toLowerCase();

      //  I filter the songs that match the name or artist
      const filteredSongs = songs.filter(
        (song) =>
          song.name.toLowerCase().includes(searchTerm) ||
          song.artist.toLowerCase().includes(searchTerm)
      );

      //  I loop through the filtered songs and build their cards
      filteredSongs.forEach((song) => {
        // Create a new div to hold one song info
        const card = document.createElement("div");
        card.className = "card";

        // Build the card HTML with a Like button
        card.innerHTML = `
          <h3>${song.name}</h3>
          <p><strong>Artist:</strong> ${song.artist}</p>
          <p><strong>Likes:</strong> <span class="likes-count">${song.likes}</span></p>
          <p><strong>Year:</strong> ${song.year}</p>
          <button class="like-btn">Like</button>
        `;

        // Add the card to the results div
        resultsDiv.appendChild(card);

        // Add functionality to the Like button
        const likeBtn = card.querySelector(".like-btn");
        const likesCount = card.querySelector(".likes-count");

        likeBtn.addEventListener("click", () => {
          // Increase the number of likes
          song.likes += 1;

          // Update the likes in the UI
          likesCount.textContent = song.likes;

          console.log(`Liked: ${song.name}, Total Likes: ${song.likes}`);
        });
      });

      console.log("Filtered songs:", filteredSongs);
    });
  })
  .catch((error) => {
    console.log("Error fetching songs:", error);
  });
