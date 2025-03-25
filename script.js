// First, I define the URL where my music data is.
// This is coming from my JSON server running on port 3002.
const API_URL = "http://localhost:3002/music";

// elements from the HTML
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");

// Now I use fetch() to get data from the API as soon as the page loads.
fetch(API_URL)
  .then(response => {
    // When the server responds, I turn that response into real JSON
    // So I can actually use the data inside JavaScript.
    return response.json();
  })
  .then(data => {
    // After converting to JSON, I go inside the "songs" array in the data.
    // So I write: data.songs — that gives me the list of all songs.
    const songs = data.songs;

    // For now, I just want to make sure the data is coming through,
    // so I log it in the console to check if it worked.
    console.log("Fetched songs:", songs);

    // 🔄 I loop through every song I got from the server
songs.forEach(song => {
  // 🧱 I create a new card (like a box) for this song
  const card = document.createElement("div");

  // 🎨 I give it the class name 'card' so it uses my CSS styling
  card.className = "card";

  // 📝 I add song info inside the card using innerHTML
  // This builds small bits of HTML using the song's data
  card.innerHTML = `
        <h3>${song.name}</h3>
        <p><strong>Artist:</strong> ${song.artist}</p> 
        <p><strong>Likes:</strong> ${song.likes.toLocaleString()}</p>
        <p><strong>Year:</strong> ${song.year}</p>
      `;

  // 📥 Finally, I put this card inside the main results area
  resultsDiv.appendChild(card);
});

  })
  .catch(error => {
    // If the fetch fails (like if the server is off or the URL is wrong),
    // I catch the error and log it in the console.
    console.log("Error fetching songs:", error);
  });
