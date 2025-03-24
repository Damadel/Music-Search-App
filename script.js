// === SELECT DOM ELEMENTS ===
const searchBtn = document.getElementById("searchBtn"); // Search button
const searchInput = document.getElementById("searchInput"); // Text input for song/artist
const resultsDiv = document.getElementById("results"); // Where songs will be displayed

// === EVENT 1: When Search Button Is Clicked ===
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim(); // Get value from input
  if (!query) return; // If input is empty, stop

  // Use a proxy (AllOrigins) to bypass Deezer's CORS block
  const url = `https://api.codetabs.com/v1/proxy?quest=https://api.deezer.com/search?q=${encodeURIComponent(
    query
  )}`;

  // === FETCH DATA FROM DEEZER API ===
  fetch(url)
    .then((res) => res.json()) // Convert response to JSON
    .then((data) => {
      showResults(data.data); // Display results
    })
    .catch((err) => {
      console.error("Error fetching songs:", err); // Log error
      resultsDiv.innerHTML = "<p>Something went wrong. Try again.</p>"; // Show error message
    });
});

// === EVENT 2: Log While Typing (Optional Feature) ===
searchInput.addEventListener("input", () => {
  console.log("User is typing:", searchInput.value); // Log each typed letter
});

// === DISPLAY SONG RESULTS ON THE PAGE ===
function showResults(tracks) {
  resultsDiv.innerHTML = ""; // Clear any previous results

  tracks.forEach((track) => {
    const card = document.createElement("div"); // Create a div for each song
    card.className = "card"; // Add CSS class

    // === Fill card with song data ===
    card.innerHTML = `
      <img src="${track.album.cover_medium}" alt="Album Cover">
      <h3 class="track-title">${track.title}</h3>
      <button class="edit-btn">Edit Title</button>
      <p>${track.artist.name}</p>
      <p><strong>Price:</strong> $0.69</p>
      <audio controls src="${track.preview}"></audio>
      <button class="save-btn">Save to Playlist</button>
      <button class="remove-btn">Remove</button>
    `;

    // === EVENT 3: Remove the Song Card ===
    const removeBtn = card.querySelector(".remove-btn");
    removeBtn.addEventListener("click", () => {
      card.remove(); // Remove the whole song card
    });

    // === BONUS EVENT: Edit the Song Title ===
    const titleElement = card.querySelector(".track-title");
    const editBtn = card.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      titleElement.textContent = "★ Edited Title ★"; // Change title on click
    });

    // === SAVE SONG TO JSON SERVER BACKEND ===
    const saveBtn = card.querySelector(".save-btn");
    saveBtn.addEventListener("click", () => {
      const songData = {
        title: track.title,
        artist: track.artist.name,
        preview: track.preview,
        cover: track.album.cover_medium,
      };

      // POST this song data to your JSON Server (db.json)
      fetch("http://localhost:3001/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(songData),
      })
        .then((res) => res.json())
        .then(() => {
          alert(" Song saved to playlist!");
        })
        .catch((err) => {
          alert(" Failed to save song.");
          console.error(err);
        });
    });

    // Add the finished card to the results section
    resultsDiv.appendChild(card);
  });
}
