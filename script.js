const API_KEY = "32889f53";

const searchForm = document.querySelector(".search-form");
const searchBarInput = document.querySelector(".search-bar__input");
const searchBar = document.querySelector(".search-bar");
const loader = document.querySelector(".loader");
const searchResults = document.querySelector(".search-results");
const pagination = document.querySelector(".pagination");

let query;
let page = 1;
let totalResults = 0;

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
  searchForMovie(query);
});

const searchForMovie = async function (userQuery) {
  let SEARCH_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&page=${page}&type=movie&s=`;

  // Fetch data and convert to json
  const response = await fetch(`${SEARCH_URL}${userQuery}`);
  const data = await response.json();

  console.log(data);
};
