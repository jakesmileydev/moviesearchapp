const showGreeting = async function () {
  clearAllExistingContent();
  clearSearchBarInputValue();
  greeting.style.display = "flex";
  await wait(320);
  greeting.classList.add("greeting__welcome");
  searchForm.classList.add("search-form__welcome");
  await wait(320);
  greeting.classList.remove("greeting__hidden");
};

const hideGreeting = async function () {
  greeting.classList.remove("greeting__welcome");
  searchForm.classList.remove("search-form__welcome");
  greeting.classList.add("greeting__hidden");
  await wait(320);
  greeting.style.display = "none";
};

const renderSpinner = async function () {
  if (document.querySelector(".spinner")) return;
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
  if (!document.querySelector(".spinner")) return;
  document.querySelector(".spinner").classList.remove("spinner__visible");
  document.querySelector(".spinner")
    ? document.querySelector(".spinner").remove()
    : "";
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
