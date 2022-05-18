const searchMovies = async function (userQuery) {
  // Get search results of query from the OMDB API
  let SEARCH_URL = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&type=movie&s=`;
  // Fetch data
  const response = await fetch(`${SEARCH_URL}${userQuery}`);
  // Convert data to json
  const data = await response.json();
  return data;
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
  // Next three lines fix bugs where navigating with browser buttons too fast renders unwanted search results or search error
  clearAllExistingContent();
  if (!window.location.hash.includes("search")) return;
  // If no movie data was returned from API, render search error instead
  if (!data.Search) return renderSearchError();

  let results = "";
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

const clearSearchBarInputValue = function () {
  searchBarInput.value = "";
};

const addQueryToSearchBar = function (query) {
  const search = "%20";
  const replace = " ";
  searchBarInput.value = query.split(search).join(replace);
};

const submitSearch = function (e) {
  e.preventDefault();
  const query = searchBarInput.value;
  window.location.hash = `search=${query}`;
};

const navigateToSearchResults = async function (query) {
  // Fill in the search bar text with current query (swap '%20' from url with ' ')
  addQueryToSearchBar(query);
  await wait(200);
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
