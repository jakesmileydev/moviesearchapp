const API_KEY = "32889f53";
const SEARCH_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&s=`;

const searchForm = document.querySelector(".search-form");
const searchBarInput = document.querySelector(".search-bar__input");
const searchBar = document.querySelector(".search-bar");
const loader = document.querySelector(".loader");

let query;

// Create green outline for search bar on user focus
searchBarInput.addEventListener("focus", () => {
  searchBar.classList.add("searching");
});
// Remove green outline for search bar on blur
searchBarInput.addEventListener("blur", () => {
  searchBar.classList.remove("searching");
});

// Get input data from search-bar__input and store it in the query variable
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  query = searchBarInput.value;
  // Get search results of query from the OMDB API
  getMovieData(query);
});

const getMovieData = async function (userQuery) {
  // Start loader
  loader.classList.remove("loader__hidden");
  // Fetch data and convert to json
  const response = await fetch(`${SEARCH_URL}${userQuery}`);
  const data = await response.json();
  // Stop loader
  loader.classList.add("loader__hidden");
  // If there are results, render them
  console.log(data);
};

const renderMovieData = function () {};
