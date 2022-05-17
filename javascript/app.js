const searchForm = document.querySelector(".search-form");
const searchBarInput = document.querySelector(".search-bar__input");
const searchBar = document.querySelector(".search-bar");
const content = document.querySelector(".content");
const greeting = document.querySelector(".greeting");

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));

const clearAllExistingContent = function () {
  clearSearchErrorMessages();
  clearSearchResults();
  clearMovieDetails();
  closeTrailerModal();
};

const handleContentClick = function (e) {
  animateMovieSelection(e);
  copyLinkToClipboard(e);
  openTrailerModal(e);
  if (!e.target.closest(".modal-button__close")) return;
  closeTrailerModal(e);
};

const navigate = async function () {
  clearAllExistingContent();

  const hashDirectory = window.location.hash.slice(0, 7);
  // If hash is empty(navigating back to home page) show greeting
  if (hashDirectory === "") return showGreeting();

  // If this is the first search (greeting__welcome class is applied), hide greeting arrow and slide search bar up
  if (greeting.classList.contains("greeting__welcome")) hideGreeting();

  // If hash is a search query, get data and render search results
  if (hashDirectory === "#search") {
    // if (window.location.hash.contains("title")) return;
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
content.addEventListener("click", handleContentClick);
