import enableSearchOnEnter from "./build/functions.js"
import { apiKey as key } from "./build/functions.js"

const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")
const clearSearchBtn = document.getElementById("clear-search-btn")
const mainContent = document.querySelector(".container__main-content")
const exploreBtn = document.getElementById("explore-btn")
const storedMovies = JSON.parse(localStorage.getItem("movieIDs"))
const storedMovieInput = localStorage.getItem("movieInput")

async function getMovie() {
  mainContent.innerHTML = ""
  let res = await fetch(
    `https://www.omdbapi.com/?apikey=${key}&s=${
      storedMovieInput ? storedMovieInput : searchInput.value
    }`
  )
  let data = await res.json()
  if (data.Search) {
    for (const el of data.Search) {
      let res = await fetch(
        `https://www.omdbapi.com/?apikey=${key}&i=${el?.imdbID}`
      )
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
                      <p class="movie-star"><i class="fa-solid fa-star"></i> ${
                        data.imdbRating
                      }</p>
                  </div>
                  <div class="movie__info-details">
                      <p class="movie-length">${data.Runtime}</p>
                      <div class="movie-genre">${data.Genre}</div>
                      ${getWatchlistBtn(data.imdbID)}
                  </div>
                  <p class="movie-plot">${data.Plot}</p>
              </div>
          </div>
      </div>
      `
    }
  } else {
    mainContent.innerHTML = `
      <div class="no-data">
        <p class="alert text-align--center">Unable to find what you’re looking for. Please try another search.</p>
      </div>
    `
  }
  // declarations and function calls after html rendering
  const watchlistBtn = document.querySelectorAll(".watchlist-btn")
  addToWatchlist(watchlistBtn)
}

if (storedMovieInput) {
  clearSearchBtn.style.display = "block"
  searchInput.value = storedMovieInput
  getMovie()
} else {
  clearSearchBtn.style.display = "none"
}

function getWatchlistBtn(data) {
  const btn = `<button id="${data}" class="watchlist-btn"><i class="fa-solid fa-circle-plus"></i>Watchlist</button>`

  if (storedMovies) {
    if (storedMovies.includes(data)) {
      return `<button class="watchlist-btn btn-disabled">Added</button>`
    } else {
      return btn
    }
  } else {
    return btn
  }
}

function addToWatchlist(watchlistBtn) {
  const movieIDArr = []
  if (storedMovies) {
    for (const data of storedMovies) {
      movieIDArr.push(data)
    }
  }
  watchlistBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      movieIDArr.push(btn.id)
      btn.innerHTML = `Added`
      btn.classList.add("btn-disabled")
      localStorage.setItem("movieIDs", JSON.stringify(movieIDArr))
    })
  })
}

// function calls, event listeners

exploreBtn.addEventListener("click", () => {
  searchInput.focus()
  window.scrollTo(0, 0)
})
searchBtn.addEventListener("click", () => {
  location.reload()
  localStorage.setItem("movieInput", searchInput.value)
})
searchBtn.addEventListener("click", getMovie)
enableSearchOnEnter(searchInput, searchBtn, searchInput.value)

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = ""
  mainContent.innerHTML = `
    <div class="no-data">
      <img src="/source/no-data-icon.svg" alt="">
      <button id="explore-btn" href="#" class="alert text-align--center">Start exploring</button>
    </div>
  `
  localStorage.removeItem("movieInput")
  location.reload()
})
