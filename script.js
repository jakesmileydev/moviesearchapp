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
  // reset page value in case this isn't the first search
  page = 1;
  totalResults = 0;
  // Get search results of query from the OMDB API
  searchMovies(query);
});

const searchMovies = async function (userQuery) {
  let SEARCH_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&page=${page}&type=movie&s=`;

  // Start loader
  loader.classList.remove("loader__hidden");
  // Fetch data and convert to json
  const response = await fetch(`${SEARCH_URL}${userQuery}`);
  const data = await response.json();

  // Stop loader
  loader.classList.add("loader__hidden");
  // If there are results, render them
  if (data.Search) renderMovieData(data);
};

const renderMovieData = function (searchData) {
  // Clear existing results
  searchResults.innerHTML = "";
  searchBarInput.value = "";
  totalResults = searchData.totalResults;
  renderPagination(searchData.totalResults);

  // Create new list element for each search result and render on page
  searchData.Search.forEach((result) => {
    const HTML = `
        <li class="search-result" data-id=${result.imdbID}>
        <img
          class="poster"
          src=${result.Poster}
          alt="${result.Title} poster image"
        />
        <div class="result-info">
          <h3 class="title">${result.Title}</h3>
          <p class="year">${result.Year}</p>
        </div>
        <i class="ph-caret-right"></i>
      </li>
        `;
    searchResults.insertAdjacentHTML("beforeend", HTML);
  });
};

const renderPagination = function (totalResults) {
  const lastPage = Math.floor(totalResults / 10) + 1;

  pagination.innerHTML = "";
  if (totalResults <= 10)
    return pagination.insertAdjacentHTML(
      "afterbegin",
      `Showing ${totalResults} results for ${query}`
    );
  pagination.insertAdjacentHTML(
    "afterbegin",
    `Showing ${page === 1 ? page : page * 10 - 9}-${
      page === lastPage ? totalResults : page * 10
    } of ${totalResults} results for '${query}'`
  );
  const paginationButtonsHTML = `
    <div class="pagination-buttons">
        <button class="pagination-button previous"><i class="ph-caret-circle-left"></i></button>
        <p>Page ${page}</p>
        <button class="pagination-button next"><i class="ph-caret-circle-right"></i></button>
    </div>
  `;
  pagination.insertAdjacentHTML("beforeend", paginationButtonsHTML);
};

pagination.addEventListener("click", (e) => {
  if (!e.target.closest(".pagination-button")) return;
  if (e.target.closest(".previous")) {
    if (page === 1) return;
    page--;
  }
  if (e.target.closest(".next")) {
    console.log(totalResults);
    const maxPages = Math.floor(totalResults / 10);
    if (page > maxPages) return;
    page++;
  }
  searchResults.innerHTML = "";
  searchMovies(query);
});

searchResults.addEventListener("click", (e) => {
  if (!e.target.closest(".search-result")) return;
  findSingleMovieData(e.target.closest(".search-result").dataset.id);
});

const findSingleMovieData = async function (id) {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
  );
  const data = await response.json();
  console.log(data);
};
