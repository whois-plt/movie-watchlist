import { apiKey as key } from "./build/functions.js"
const mainContent = document.querySelector(".container__main-content")
const localStorageData = JSON.parse(localStorage.getItem("movieIDs"))

mainContent.innerHTML = ""

if (localStorageData.length > 0 && localStorageData) {
  getStoredMovies()
} else {
  mainContent.innerHTML = `
      <div class="no-data">
        <img src="/source/no-data-icon.svg" alt="">
        <p class="alert text-align--center">Oops. It seems your list is empty.</p>
        <a class="list-empty-btn" href="/">Search for movies</a>
      </div>
    `
}

async function getStoredMovies() {
  const storedMovies = JSON.parse(localStorage.getItem("movieIDs"))
  for (const movieID of storedMovies) {
    let res = await fetch(`https://www.omdbapi.com/?apikey=${key}&i=${movieID}`)
    let data = await res.json()
    mainContent.innerHTML += `
    <div class="movies-list">
        <div class="movie-card">
            <div class="movie__image">
                <img src="${data.Poster}"
                    alt="">
            </div>
            <div class="movie__info-wrapper">
                <div class="movie__info-title-star">
                    <h3 class="movie-title">${data.Title}</h3>
                    <p class="movie-star"><i class="fa-solid fa-star"></i> ${data.imdbRating}</p>
                </div>
                <div class="movie__info-details">
                    <p class="movie-length">${data.Runtime}</p>
                    <div class="movie-genre">${data.Genre}</div>
                    <button id="${data.imdbID}" class="watchlist-btn" data-active><i class="fa-solid fa-circle-minus"></i>Remove</button>
                </div>
                <p class="movie-plot">${data.Plot}</p>
            </div>
        </div>
    </div>
    `
  }
  const watchlistBtn = document.querySelectorAll(".watchlist-btn")
  const movieList = document.querySelectorAll(".movies-list")
  removeFromWatchlist(watchlistBtn, movieList, storedMovies)
}

function removeFromWatchlist(watchlistBtn, movieList, storedMovies) {
  watchlistBtn.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      movieList[i].remove()
      const arr = storedMovies.filter((movies) => {
        return movies !== btn.id
      })
      localStorage.setItem("movieIDs", JSON.stringify(arr))
      location.reload()
    })
  })
}
