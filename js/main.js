const cartLS = localStorage.getItem("cart");

const swiper = new Swiper(".mini__slider", {
  loop: true,

  slidesPerView: 2,
  spaceBetween: 20,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  scrollbar: {
    el: ".swiper-scrollbar",
    // hide: true,
    draggable: true,
  },
});

// animals.js
const categoriesList = document.getElementById("filterSectionCategories");
let animalsList = document.getElementById("animalsSectionList");
let selectedIdx = 0;
let fetchedAnimals = null;
const cartFromLS = localStorage.getItem("cart");
const parsedCart = cartFromLS ? JSON.parse(cartFromLS) : [];

const fetchAnimals = async () => {
  try {
    const response = await fetch("./static/animals.json");
    fetchedAnimals = await response.json();

    generateAnimalsCard(fetchedAnimals, 0);
  } catch (e) {
    console.log("e", e);
  }
};

const generateAnimalsCard = (animals, filterIdx) => {
  animalsList.innerHTML = null;
  let filteredAnimals = null;

  if (Number(filterIdx) === 0) {
    filteredAnimals = animals;
  } else {
    filteredAnimals = animals.filter(
      (animal) => animal.filterType === Number(filterIdx)
    );
  }

  filteredAnimals.forEach((animal, idx) => {
    const animalVaccinated = animal.vaccinated
      ? `<img src="./img/icons/vaccinated-icon.svg" alt="vaccinated">`
      : "";

    const content = `<div class="animal-card">
          <div class="animal-card__header">
            <div class="header-box">
              <p class="header-box__age">${animal.age}</p>
              miesiące
            </div>
            ${animalVaccinated}
          </div>
          <div class="animal-card__main">
            <img src="./img/animals/${animal.image}" alt="dog">
            <h3 class="main-box__title">${animal.name}</h3>
            <p class="main-box__description">
              ${animal.description}
            </p>
            <div class="main-box__tags">
              <p>${animal.tag}</p>
              <p>${animal.subTag}</p>
            </div>
          </div>
          <div class="animal-card__footer">
            <h4 class="footer-box__price">${animal.price}.</h4>
            <button id="${idx}" class="footer-box__button" onclick="onBuy(this)">
              Kupic
              <img src="./img/icons/buy-icon.svg" alt="buy">
            </button>
          </div>
        </div>
      `;

    animalsList.innerHTML += content;
  });
};

const generateFilter = () => {
  const categories = [
    "Wsystkie",
    "Psy",
    "Koty",
    "Papugi",
    "Chomiki",
    "Ryby",
    "Gady",
  ];

  categories.forEach((category, idx) => {
    const link = `<li data-idx=${idx} class="category ${
      selectedIdx === idx ? `category--selected` : ""
    }">${category}</li>`;

    categoriesList.innerHTML += link;
  });
};

categoriesList.addEventListener("click", (e) => {
  let target = e.target;

  while (target && target.parentNode !== categoriesList) {
    target = target.parentNode;
    if (!target) return;
  }

  if (target.tagName === "LI") {
    const currentFilterType =
      document.getElementsByClassName("category--selected");
    currentFilterType[0].classList.remove("category--selected");
    target.classList.add("category--selected");
    generateAnimalsCard(fetchedAnimals, target.dataset.idx);
  }
});

// cart logic //
let cartAnimals = [];

if (cartFromLS) {
  cartAnimals = JSON.parse(cartFromLS);
}

let fetchedAnFor = null;

const fetchAnimalsQWEWE = async () => {
  try {
    const response = await fetch("./static/animals.json");
    fetchedAnFor = await response.json();
  } catch (e) {
    console.log("e", e);
  }
};

const onBuy = (e) => {
  const targetId = event.target.id;
  const targetFetchedAnimal = fetchedAnFor[targetId];
  event.target.innerHTML = `
      <div style="cursor: not-allowed;">
        Kupione
        <img src="./img/icons/in-cart-icon.svg" alt="in cart">
      </div>
    `;

  if (targetFetchedAnimal) {
    cartAnimals.push(targetFetchedAnimal);
    localStorage.setItem("cart", JSON.stringify(cartAnimals));
    cartPriceCounter();
  }
};

const cartChecker = () => {
  parsedCart.forEach((animal) => {
    const targetAnimal = animalsList.children[animal.id];

    targetAnimal.getElementsByClassName("footer-box__button")[0].innerHTML = `
        <div style="cursor: not-allowed;">
          Kupione
          <img src="./img/icons/in-cart-icon.svg" alt="in cart">
        </div>
      `;
  });
};

const cartPriceCounter = () => {
  const cartForPriceLS = localStorage.getItem("cart");
  const cartCounter = document.getElementById("cartCounter");

  if (!cartForPriceLS) {
    cartCounter.textContent = "Cart";
    return;
  }

  const cartPrice = JSON.parse(cartForPriceLS).reduce((acc, animal) => {
    const animalPrice = parseInt(animal.price.replace(/\s+/g, ""));

    return acc + animalPrice;
  }, 0);

  cartCounter.textContent = `${cartPrice} zł.`;
};

document.addEventListener("DOMContentLoaded", async () => {
  if (!cartLS) {
    localStorage.setItem("cart", []);
  }

  cartPriceCounter();

  const headerNavList = document.querySelectorAll("#headerNavList li a");

  headerNavList.forEach((link) => {
    if (location.href === link.href) {
      link.classList.add("active");
    }
  });

  fetchAnimals();
  await fetchAnimalsQWEWE();
  generateFilter();
  cartChecker();
});
