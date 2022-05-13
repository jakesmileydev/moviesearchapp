const API_KEY = "32889f53";

const searchForm = document.querySelector(".search-form");
const searchBarInput = document.querySelector(".search-bar__input");
const searchBar = document.querySelector(".search-bar");
const greeting = document.querySelector(".greeting");
const content = document.querySelector(".content");

// This value is so the spinner-start and greeting-fade-out don't overlap
let spinnerDelay = 375;

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
  setTimeout(() => {
    document.querySelector(".spinner").classList.add("spinner__visible");
  }, spinnerDelay);
};

const removeSpinner = function () {
  document.querySelector(".spinner").classList.remove("spinner__visible");
  setTimeout(() => {
    // Remove spinner from DOM
    document.querySelector(".spinner")
      ? document.querySelector(".spinner").remove()
      : "";
    // Once the greeting is removed, the delay is no longer necessary
    spinnerDelay = 0;
  }, 376);
};

const animateMovieSelection = function (e) {
  if (!e.target.closest(".search-result__link")) return;
  const thisMovie = e.target.closest(".search-result__link");
  thisMovie.style.boxShadow = "0 0 12px #34d399";
  setTimeout(() => {
    thisMovie.style.boxShadow = "0 0 6px #34d399";
  }, 100);
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

const hideGreeting = function () {
  greeting.classList.remove("greeting__welcome");
  searchForm.classList.remove("search-form__welcome");
  setTimeout(() => {
    greeting.classList.add("greeting__hidden");
  }, 270);
};

const showGreeting = function () {
  clearSearchResults();
  greeting.classList.remove("greeting__hidden");
  greeting.classList.add("greeting__welcome");
  searchForm.classList.add("search-form__welcome");
  // Since the greeting is now back, reset spinner delay
  spinnerDelay = 375;
};

const renderSearchResults = function (data) {
  let results = "";
  data.Search.forEach((result) => {
    results += `
      <li class="search-result">
        <a class="search-result__link" href="#title/${result.imdbID}">
          <div class="search-result__img-box">
            <img class="search-result__img" src=${result.Poster}>
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

const clearSearchResults = function () {
  document.querySelector(".search-results")
    ? document.querySelector(".search-results").remove()
    : "";
};

const submitSearch = function (e) {
  e.preventDefault();
  const query = searchBarInput.value;
  window.location.hash = `search=${query}`;
};

const renderMovieDetails = function (movieData) {
  console.log(movieData);
  clearSearchResults();
};

const navigateToSearchResults = async function (query) {
  // If this is the first search (greeting__welcome class is applied), search bar and arrow slide up, then arrow fades out
  greeting.classList.contains("greeting__hidden") ? "" : hideGreeting();
  // Clear search results
  clearSearchResults();
  // spinner fade in
  renderSpinner();
  // await movie data
  const data = await searchMovies(query);
  // spinner fade out
  removeSpinner();
  // render search results
  renderSearchResults(data);
  // results slide up and fade in
};

const navigateToMovieDetails = async function (titleID) {
  let SEARCH_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&i=${titleID}`;
  clearSearchResults();
  const response = await fetch(SEARCH_URL);
  renderSpinner();
  const data = await response.json();
  removeSpinner();

  renderMovieDetails(data);
};

const navigate = function () {
  const hashDirectory = window.location.hash.slice(0, 7);

  // If hash is a search query, get data and render search results
  if (hashDirectory === "#search") {
    const query = window.location.hash.slice(8);
    return navigateToSearchResults(query);
  }

  // If hash is a movie ID, get data and render movie details
  if (hashDirectory === "#title/") {
    const title = window.location.hash.slice(7);
    return navigateToMovieDetails(title);
  }

  // If hash is empty (navigating back to home page) show greeting
  if (hashDirectory === "") return showGreeting();
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
