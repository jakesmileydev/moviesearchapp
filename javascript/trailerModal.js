const openTrailerModal = async function (e) {
  if (!e.target.closest(".movie-details__trailer-button")) return;
  const year = e.target.dataset.year;
  const title = e.target.dataset.title;
  const trailerSrc = await getYouTubeTrailer(`${title} ${year} trailer`);
  if (!trailerSrc) return;
  // &origin=https://yourdomain.com
  // try adding this to the url once i get a domain to fix the errors while watching the trailer
  const modalHTML = `
          <div class="modal">
            
              <div class="modal__content">
                <div class="modal__header">
                  <h3 class="modal__title">${title}<span class="modal__year">(${year})</span></h3>
                  <button class="modal__button__close"><i class="ph-x"></i></button>
                </div>
                <div class="iframe-container">
                <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${trailerSrc}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
              </div>
            
          </div>
    `;
  content.insertAdjacentHTML("beforeend", modalHTML);
  setTimeout(() => {
    document.querySelector(".modal").classList.add("modal__visible");
  }, 10);
};

const closeTrailerModal = function (e) {
  if (!document.querySelector(".modal")) return;
  document.querySelector(".modal").classList.remove("modal__visible");
  setTimeout(() => {
    document.querySelector(".modal").remove();
  }, 320);
};
