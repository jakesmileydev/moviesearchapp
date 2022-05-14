const API_KEY = "32889f53";

const searchForm = document.querySelector(".search-form");
const searchBarInput = document.querySelector(".search-bar__input");
const searchBar = document.querySelector(".search-bar");
const content = document.querySelector(".content");
const greeting = document.querySelector('.greeting');
const renderSpinner = function () {
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

const removeSpinner = function () {
  document.querySelector(".spinner").classList.remove("spinner__visible");
  setTimeout(() => {
    // Remove spinner from DOM
    document.querySelector(".spinner")
      ? document.querySelector(".spinner").remove()
      : "";
  }, 376);
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
const renderSearchError = function () {
  // fixes bug when navigating quickly to home renders a search error
  if (window.location.hash === "") return;
  if (document.querySelector(".error-message__search")) return;
  console.log("creating search error");
  content.insertAdjacentHTML(
    "afterbegin",
    `<div class="error-message__search error-message__search__visible">We couldn't find any movies matching that title. <br> Please try again :)</div>`
  );
  document
    .querySelector(".error-message__search")
    .classList.add("error-message__search__hidden");
};
const renderSearchResults = function (data) {
  let results = "";
  if (!data.Search) return renderSearchError();

  data.Search.forEach((result) => {
    results += `
      <li class="search-result">
        <a class="search-result__link" href="#title/${result.imdbID}">
          <div class="search-result__img-box">
            <img class="search-result__img" src=${result.Poster === "N/A"
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

const renderMovieDetails = function (movieData) {
  console.log(movieData);

  const movieDetailsHTML = `
    <div class="movie-details">
      <div class="movie-details__poster-container">
        <img class="movie-details__poster" src=${movieData.Poster === "N/A"
      ? "/images/default-poster.webp"
      : movieData.Poster
    }>
      </div>
      <div class="movie-details__info>
        <h3 class="movie-details__title">${movieData.Title}</h3>
        <div class="movie-details__subtitle">
          <p class="movie-details__year">${movieData.Year}</p>
          <p class="movie-details__director">${movieData.Director}</p>
        </div>
        <div class="movie-details__runtime-genre-rating">
          <p class="movie-details__runtime">${movieData.Runtime}</p>
          <p class="movie-details__genre">${movieData.Genre}</p>
        </div>
      </div>
    </div>
  `;
  content.insertAdjacentHTML("afterbegin", movieDetailsHTML);
};

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));

const addQueryToSearchBar = function (query) {
  const search = "%20";
  const replace = " ";
  searchBarInput.value = query.split(search).join(replace);
};

// this function accepts the query from the url
const navigateToSearchResults = async function (query) {
  // Fill in the search bar text with current query (swap '%20' from url with ' ')
  addQueryToSearchBar(query);
  // Clear search results

  // spinner fade in
  renderSpinner();
  // await movie data
  const data = await searchMovies(query);
  // spinner fade out
  removeSpinner();
  // render search results
  renderSearchResults(data);
  // waiting for old results to fade out
  await wait(320);
  // if there are results, make them visible
  document.querySelector(".search-results")
    ? document
      .querySelector(".search-results")
      .classList.add("search-results__fade-in")
    : "";
};

const navigateToMovieDetails = async function (titleID) {
  let SEARCH_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&i=${titleID}`;

  renderSpinner();
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
