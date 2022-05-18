const clearMovieDetails = async function () {
  const movieDetails = document.querySelector(".movie-details");
  if (movieDetails) {
    movieDetails.classList.add("movie-details__fade-out");
    await wait(320);
    movieDetails.remove();
  }
};

const copyLinkToClipboard = function (e) {
  if (!e.target.closest(".movie-details__share-button")) return;
  navigator.clipboard.writeText(window.location).then(
    function () {
      const shareButton = document.querySelector(
        ".movie-details__share-button"
      );
      shareButton.classList.add("movie-details__share-button__success");

      setTimeout(() => {
        shareButton.classList.remove("movie-details__share-button__success");
      }, 1000);
    },
    function () {
      console.log("Error, clipboard.writeText(window.location) failed");
    }
  );
};

const renderMovieDetails = async function (movieData) {
  // Fixes navigation bug
  clearAllExistingContent();

  if (!window.location.hash.includes("title")) return;
  const movieDetailsHTML = `
      <div class="movie-details movie-details__hidden">
        <div class="movie-details__poster-container">
          <img class="movie-details__poster" src=${movieData.Poster === "N/A"
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
            <span class="movie-details__runtime">${movieData.Runtime.split(
      " "
    ).join("&nbsp;")}</span>
            <span class="movie-details__genre">${movieData.Genre}</span>
            <div class="movie-details__rating-container">
              <svg class="movie-details__rating-circle" width="40" height="40">
                <circle stroke="#585A70" fill="transparent" stroke-width="4" r="18" cx="20" cy="20" style="stroke-dashoffset: 29.4053;">
                </circle>
                <circle stroke="#34D399" fill="transparent" stroke-dasharray="113.09733552923255" stroke-width="4" r="18" cx="20" cy="20" style="stroke-dashoffset: ${113.09733 - movieData.imdbRating * 10 * 1.13097
    };">
                </circle>
              </svg>
              <span class="movie-details__rating-text">
                ${movieData.imdbRating}
              </span>
            </div>
          </div>
          <p class="movie-details__plot">${movieData.Plot}</p>
          <div class="movie-details__actors">${movieData.Actors}</div>
          <div class="movie-details__actions">
            <button class="movie-details__trailer-button" data-year="${movieData.Year
    }" data-title="${movieData.Title
    }"><i class="ph-play"></i> WATCH TRAILER</button>
            <button class="movie-details__share-button" ><i class="ph-share-network"></i></button>
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

const getYouTubeTrailer = async function (query) {
  try {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    return data.items[0].id.videoId;
  } catch {
    console.log("Something Went Wrong, unable to fetch trailer from YouTube");
  }
};

const navigateToMovieDetails = async function (titleID) {
  let SEARCH_URL = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${titleID}`;
  await wait(200);
  renderSpinner();
  await wait(280);
  const response = await fetch(SEARCH_URL);
  const data = await response.json();
  removeSpinner();
  renderMovieDetails(data);
};
