// Fetch and display the details of the first movie
fetchMovieDetails(1);

// Fetch all movies and display them in the menu
fetchMovies();

// Attach event listeners
document.getElementById('films').addEventListener('click', handleMovieClick);

// Function to fetch and display movie details
function fetchMovieDetails(movieId) {
  fetch(`http://localhost:3000/films/${movieId}`)
    .then(response => response.json())
    .then(movie => {
      // Update the movie details
      document.getElementById('movie-poster').src = movie.poster;
      document.getElementById('movie-title').textContent = movie.title;
      document.getElementById('movie-runtime').textContent = `Runtime: ${movie.runtime} minutes`;
      document.getElementById('movie-showtime').textContent = `Showtime: ${movie.showtime}`;
      document.getElementById('movie-description').textContent = movie.description;
      updateAvailableTickets(movie.capacity, movie.tickets_sold);

      // Enable/disable ticket purchase button based on availability
      const buyButton = document.getElementById('buy-ticket-button');
      if (movie.tickets_sold === movie.capacity) {
        buyButton.disabled = true;
        buyButton.textContent = 'Sold Out';
      } else {
        buyButton.disabled = false;
        buyButton.textContent = 'Buy Ticket';
      }
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Function to fetch all movies and display them in the menu
function fetchMovies() {
  fetch('http://localhost:3000/films')
    .then(response => response.json())
    .then(movies => {
      const menu = document.getElementById('films');
      menu.innerHTML = '';

      movies.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.textContent = movie.title;

        if (movie.tickets_sold === movie.capacity) {
          listItem.classList.add('sold-out');
        }

        menu.appendChild(listItem);
      });
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Event listener for movie click
function handleMovieClick(event) {
  if (event.target.nodeName === 'LI') {
    const movieTitle = event.target.textContent;
    const movies = Array.from(document.querySelectorAll('#films li'));

    movies.forEach(movie => {
      movie.classList.remove('active');
    });

    event.target.classList.add('active');

    const movieId = movies.findIndex(movie => movie.textContent === movieTitle) + 1;
    fetchMovieDetails(movieId);
  }
}

// Event listener for ticket purchase
document.getElementById('buy-ticket-button').addEventListener('click', () => {
  const availableTicketsElement = document.getElementById('available-tickets');
  const availableTickets = parseInt(availableTicketsElement.textContent);
  
  if (availableTickets > 0) {
    const updatedTickets = availableTickets - 1;
    updateAvailableTickets(updatedTickets);

    const movieId = getActiveMovieId();
    updateTicketsSold(movieId, updatedTickets);
  }
});

// Function to update the available tickets count
function updateAvailableTickets(tickets) {
  const availableTicketsElement = document.getElementById('available-tickets');
  availableTicketsElement.textContent = tickets.toString();
}

// Function to get the ID of the active movie
function getActiveMovieId() {
  const activeMovie = document.querySelector('#films li.active');
  const movies = Array.from(document.querySelectorAll('#films li'));
  const activeIndex = movies.indexOf(activeMovie);
  return activeIndex + 1;
}

// Update the tickets_sold count on the server (Extra Bonus)
function updateTicketsSold(movieId, ticketsSold) {
  fetch(`http://localhost:3000/films/${movieId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tickets_sold: ticketsSold
    })
  })
    .then(response => response.json())
    .then(updatedMovie => {
      console.log('Tickets sold count updated:', updatedMovie);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Delete a film from the server (Extra Bonus)
function deleteFilm(movieId) {
  fetch(`http://localhost:3000/films/${movieId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(() => {
      console.log(`Film with ID ${movieId} deleted.`);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}
