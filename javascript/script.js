const API_KEY = "32889f53";

const searchForm = document.querySelector(".search-form");
const searchBarInput = document.querySelector(".search-bar__input");
const searchBar = document.querySelector(".search-bar");
const content = document.querySelector(".content");
const greeting = document.querySelector(".greeting");
const renderSpinner = async function () {
  if (document.querySelector(".spinner")) return;
  const spinnerHTML = `
  <svg class="spinner" viewBox="0 0 50 50">
    <circle
      class="path"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke-width="5"
    ></circle>
  </svg>  
  `;
  content.insertAdjacentHTML("afterbegin", spinnerHTML);

  document.querySelector(".spinner").classList.add("spinner__visible");
};

const removeSpinner = async function () {
  document.querySelector(".spinner").classList.remove("spinner__visible");
  await wait(320);
  // Remove spinner from DOM
  document.querySelector(".spinner")
    ? document.querySelector(".spinner").remove()
    : "";
};

const animateMovieSelection = function (e) {
  if (!e.target.closest(".search-result__link")) return;
  const thisMovie = e.target.closest(".search-result__link");
  thisMovie.style.boxShadow = "0 0 20px #34d399";
  setTimeout(() => {
    thisMovie.style.boxShadow = "0 0 15px #34d399";
  }, 50);
  setTimeout(() => {
    thisMovie.style.boxShadow = "0 0 10px #34d399";
  }, 75);
  setTimeout(() => {
    thisMovie.style.boxShadow = "";
  }, 100);
  setTimeout(() => {
    thisMovie.style.border = "2px solid #34d399";
  }, 100);
};

const searchMovies = async function (userQuery) {
  // Get search results of query from the OMDB API
  let SEARCH_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&type=movie&s=`;
  // Fetch data
  const response = await fetch(`${SEARCH_URL}${userQuery}`);
  // Convert data to json
  const data = await response.json();

  return data;
};

const hideGreeting = async function () {
  greeting.classList.remove("greeting__welcome");
  searchForm.classList.remove("search-form__welcome");

  greeting.classList.add("greeting__hidden");
  await wait(320);
  greeting.style.display = "none";
};
const clearSearchBarInputValue = function () {
  searchBarInput.value = "";
};
const clearMovieDetails = async function () {
  const movieDetails = document.querySelector(".movie-details");
  if (movieDetails) {
    movieDetails.classList.add("movie-details__fade-out");

    await wait(320);
    movieDetails.remove();
  }
};
const clearSearchResults = async function () {
  const searchResults = Array.from(
    document.querySelectorAll(".search-results")
  );
  if (searchResults) {
    searchResults.forEach((result) => {
      result.classList.add("search-results__fade-out");
    });
    await wait(320);

    searchResults.forEach((result) => result.remove());
  }
};
const showGreeting = async function () {
  clearSearchErrorMessages();

  clearSearchResults();
  clearMovieDetails();
  clearSearchBarInputValue();
  greeting.style.display = "flex";
  await wait(320);
  greeting.classList.add("greeting__welcome");
  searchForm.classList.add("search-form__welcome");
  await wait(320);
  greeting.classList.remove("greeting__hidden");
};

const clearSearchErrorMessages = function () {
  const error = document.querySelector(".error-message__search");
  error?.remove();
  const errors = Array.from(
    document.querySelectorAll(".error-message__search")
  );
  errors
    ? errors.forEach((errorMessage) => {
        errorMessage.remove();
      })
    : "";
};
const renderSearchError = async function () {
  // fixes bug when navigating quickly to home renders a search error
  if (window.location.hash === "") return;
  // If an error already exists, don't render another one
  if (document.querySelector(".error-message__search")) return;

  console.log("creating search error");
  content.insertAdjacentHTML(
    "afterbegin",
    `<div class="error-message__search">We couldn't find any movies matching that title. <br> Please try again :)</div>`
  );
  await wait(10);
  document
    .querySelector(".error-message__search")
    .classList.add("error-message__search__visible");
};

const renderSearchResults = async function (data) {
  // Next two lines fix bugs where navigating with browser buttons too fast renders unwanted search results or search error
  clearSearchErrorMessages();
  if (window.location.hash === "") return;
  // If no data was returned from API, render search error instead
  if (!data.Search) return renderSearchError();

  let results = "";
  data.Search.forEach((result) => {
    results += `
      <li class="search-result">
        <a class="search-result__link" href="#title/${result.imdbID}">
          <div class="search-result__img-box">
            <img class="search-result__img" src=${
              result.Poster === "N/A"
                ? "/images/default-poster.webp"
                : result.Poster
            }>
          </div>
          <div class="search-result__info">
            <h3 class="search-result__title">${result.Title}</h3>
            <p class="search-result__year">${result.Year}</p>
          </div>
        </a>
      </li>
    `;
  });
  const searchResultsHTML = `
  <ul class="search-results">
    ${results}
  </ul>
  `;
  content.insertAdjacentHTML("afterbegin", searchResultsHTML);
};

const submitSearch = function (e) {
  e.preventDefault();
  const query = searchBarInput.value;
  window.location.hash = `search=${query}`;
};

const renderMovieDetails = async function (movieData) {
  console.log(movieData);

  const movieDetailsHTML = `
    <div class="movie-details movie-details__hidden">
      <div class="movie-details__poster-container">
        <img class="movie-details__poster" src=${
          movieData.Poster === "N/A"
            ? "/images/default-poster.webp"
            : movieData.Poster
        }>
      </div>
      <div class="movie-details__info">
        <h3 class="movie-details__title">${movieData.Title}</h3>
        <div class="movie-details__subtitle">
          <span class="movie-details__year">${movieData.Year}</span>
          <span class="movie-details__director">${movieData.Director}</span>
        </div>
        <div class="movie-details__runtime-genre-rating">
          <span class="movie-details__runtime">${movieData.Runtime}</span>
          <span class="movie-details__genre">${movieData.Genre}</span>
          <span class="movie-details__rating">${movieData.imdbRating}</span>
        </div>
        <p class="movie-details__plot">${movieData.Plot}</p>
        <div class="movie-details__actors">${movieData.Actors}</div>
        <div class="movie-details__actions">
          <button class="movie-details__trailer-button"><i class="ph-play"></i> WATCH TRAILER</button>
          <button class="movie-details__share-button" dataset.title="${
            movieData.title
          }"><i class="ph-share-network"></i></button>
        </div>
      </div>
    </div>
  `;
  content.insertAdjacentHTML("afterbegin", movieDetailsHTML);
  await wait(120);
  document
    .querySelector(".movie-details")
    .classList.remove("movie-details__hidden");
};

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));

const addQueryToSearchBar = function (query) {
  const search = "%20";
  const replace = " ";
  searchBarInput.value = query.split(search).join(replace);
};

// This function accepts a query from the url
const navigateToSearchResults = async function (query) {
  // Fill in the search bar text with current query (swap '%20' from url with ' ')
  addQueryToSearchBar(query);
  renderSpinner();
  await wait(280);
  const data = await searchMovies(query);
  removeSpinner();
  renderSearchResults(data);
  // waiting for old results to fade out
  await wait(120);
  // if there are results, make them visible
  if (document.querySelector(".search-results"))
    document
      .querySelector(".search-results")
      .classList.add("search-results__fade-in");
};

const navigateToMovieDetails = async function (titleID) {
  let SEARCH_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&i=${titleID}`;
  renderSpinner();
  await wait(280);

  const response = await fetch(SEARCH_URL);
  const data = await response.json();
  removeSpinner();
  renderMovieDetails(data);
};

const navigate = async function () {
  const hashDirectory = window.location.hash.slice(0, 7);
  // check for old error message and remove

  clearSearchErrorMessages();
  if (document.querySelector(".movie-details")) await clearMovieDetails();
  if (document.querySelector(".search-results")) await clearSearchResults();
  // If hash is empty(navigating back to home page) show greeting
  if (hashDirectory === "") return showGreeting();
  // If this is the first search (greeting__welcome class is applied), search bar and arrow slide up, then arrow fades out, wait additional time for animations to finish (.32s)
  if (greeting.classList.contains("greeting__welcome")) {
    hideGreeting();
    await wait(320);
  }
  // If hash is a search query, get data and render search results
  if (hashDirectory === "#search") {
    const query = window.location.hash.slice(8);
    return navigateToSearchResults(query);
  }
  // If hash is a movie ID, get data and render movie details
  if (hashDirectory === "#title/") {
    const titleID = window.location.hash.slice(7);
    return navigateToMovieDetails(titleID);
  }
};

searchForm.addEventListener("submit", submitSearch);
// Create green outline for active search bar on focus
searchBarInput.addEventListener("focus", () => {
  searchBar.classList.add("search-bar__active");
});
// Remove green outline for active search bar on un-focus
searchBarInput.addEventListener("blur", () => {
  searchBar.classList.remove("search-bar__active");
});
window.addEventListener("hashchange", navigate);
window.addEventListener("load", navigate);
content.addEventListener("click", animateMovieSelection);
