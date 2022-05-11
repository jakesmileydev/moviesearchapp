const API_KEY = "32889f53";

const searchForm = document.querySelector(".search-form");
const searchBarInput = document.querySelector(".search-bar__input");
const searchBar = document.querySelector(".search-bar");
const greeting = document.querySelector(".greeting");
const content = document.querySelector(".content");

// This value is so the spinner start and greeting fade out don't overlap eachother during ONLY THE FIRST search submission(while the greeting is being hidden), once the removeSpinner function is called, this value will become 0 for subsequent searches
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

const findMovie = async function (userQuery) {
  // Get search results of query from the OMDB API
  let SEARCH_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&type=movie&s=`;
  // Fetch data
  const response = await fetch(`${SEARCH_URL}${userQuery}`);
  // Convert data to json
  const data = await response.json();
  console.log(data);
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
  document.querySelector(".search-results")
    ? document.querySelector(".search-results").remove()
    : "";
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
        <a href="titles/${result.imdbID}">
          <div class="search-result__img-box">
            <img src=${result.Poster}>
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

const navigate = async function () {
  const query = window.location.hash.slice(8);
  searchBarInput.value = query;
  // If the query is empty (navigating back) return
  if (query === "") return showGreeting();
  // If this is the first search (greeting__welcome class is applied), search bar and arrow slide up, then arrow fades out
  greeting.classList.contains("greeting__hidden") ? "" : hideGreeting();
  document.querySelector(".search-results")
    ? document.querySelector(".search-results").remove()
    : "";

  // spinner fade in
  renderSpinner();
  // await movie data
  const data = await findMovie(query);
  // spinner fade out
  removeSpinner();
  // render search results
  renderSearchResults(data);
  // results slide up and fade in
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
