//  First, I define the API URL where my music data lives
// This is the link to my local JSON server running on port 3002
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
      // 🧹 First, I clear the previous search results from the page
      // Otherwise, old results will keep stacking up
      resultsDiv.innerHTML = "";

      //  I grab whatever the user typed in the search input field
      // I also use .toLowerCase() to make it case-insensitive (so "burna" works the same as "Burna")
      const searchTerm = searchInput.value.toLowerCase();

      //  Now I filter the songs array — this means I’ll only keep songs that match the search
      // .filter() checks every song to see if the name includes the word the user typed
      const filteredSongs = songs.filter(song =>
        song.name.toLowerCase().includes(searchTerm) ||
        song.artist.toLowerCase().includes(searchTerm)
      );      

      //  Now I take the filtered songs and loop through them one by one
      // I use forEach to create a visual card for each result
      filteredSongs.forEach((song) => {
        //  I create a new <div> element that will hold one song's info
        const card = document.createElement("div");

        //  I give it the "card" class so it uses the card styling in my CSS
        card.className = "card";

        //  Inside that card, I add song details using innerHTML
        // I show: the song name, artist, number of likes, and year
        card.innerHTML = `
          <h3>${song.name}</h3>
          <p><strong>Artist:</strong> ${song.artist}</p>
          <p><strong>Likes:</strong> ${song.likes.toLocaleString()}</p>
          <p><strong>Year:</strong> ${song.year}</p>
        `;

        // 📥 Finally, I insert that card into the results area on the webpage
        resultsDiv.appendChild(card);
      });

      console.log("Filtered songs:", filteredSongs);
    });
  })
  .catch((error) => {
    //  If there’s a problem (like the server isn’t running), this block will catch the error
    // I log the error in the console so I know what went wrong
    console.log("Error fetching songs:", error);
  });




 
