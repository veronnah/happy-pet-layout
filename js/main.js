const cartLS = localStorage.getItem("cart");
const parsedCartLS = cartLS ? JSON.parse(cartLS) : [];
const cartAnimals = cartLS ? JSON.parse(cartLS) : [];
const filterSectionList = document.getElementById("filterSectionList");
let cartSectionList = document.getElementById("cartSectionList");
let animalsSectionList = document.querySelector(".animalsSectionList");
let selectedFilterIdx = 0;
let fetchedAnimals = null;

const fetchAnimalsForShop = async () => {
  fetchedAnimals = await fetchAnimals();
  generateAnimalsCard(fetchedAnimals, 0);
};

const fetchAnimalsForCart = async () => {
  fetchedAnimals = await fetchAnimals();
};

const fetchAnimals = async () => {
  try {
    const response = await fetch("./static/animals.json");
    return await response.json();
  } catch (e) {
    console.log("e", e);
  }
};

const generateAnimalsCard = (animals, filterIdx) => {
  if (!animalsSectionList) return;

  animalsSectionList.innerHTML = null;
  let filteredAnimals = null;

  if (Number(filterIdx) === 0) {
    filteredAnimals = animals;
  } else {
    filteredAnimals = animals.filter(
      (animal) => animal.filterType === Number(filterIdx)
    );
  }

  filteredAnimals.forEach((animal, idx) => {
    const animalVaccinated =
      animal.vaccinated ?  `<img src="./img/icons/vaccinated-icon.svg" alt="vaccinated">` : '';

    const content = `<div class="swiper-slide animal-card" data-id="${
      animal.id + animal.name
    }">
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
            Dodać do koszyka
            <img src="./img/icons/to-cart-icon.svg" alt="buy">
          </button>
        </div>
      </div>
    `;

    animalsSectionList.innerHTML += content;
  });
};

const generateFilter = () => {
  if (!filterSectionList) return;

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
      selectedFilterIdx === idx ? `category--selected` : ""
    }">${category}</li>`;

    filterSectionList.innerHTML += link;
  });
};

const generateCartCard = () => {
  if (cartSectionList) {
    cartSectionList.innerHTML = null;

    parsedCartLS.forEach((animal, idx) => {
      const animalVaccinated =
        animal.vaccinated && `<img src="./img/icons/vaccinated-icon.svg" alt="vaccinated">`;

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
                Usunąć
              </button>
            </div>
          </div>
        `;

      cartSectionList.innerHTML += content;
    });
  }
};

const onBuy = (e) => {
  const targetId = event.target.id;
  const targetFetchedAnimal = fetchedAnimals[targetId];

  event.target.innerHTML = `
      <div class="added__to-cart" style="cursor: not-allowed;">
        W koszyku
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
  if (!animalsSectionList) return;

  parsedCartLS.forEach((animal) => {
    const targetAnimal = animalsSectionList.children[animal.id];
    const isEqual = animal.id + animal.name === targetAnimal?.dataset?.id;

    if (isEqual) {
      targetAnimal.getElementsByClassName("footer-box__button")[0].innerHTML = `
          <div class="added__to-cart" style="cursor: not-allowed;">
            W koszyku
            <img src="./img/icons/in-cart-icon.svg" alt="in cart">
          </div>
        `;
    }
  });
};

const cartPriceCounter = () => {
  const cartForPriceLS = localStorage.getItem("cart");
  const cartCounter = document.getElementById("cartCounter");

  if (!cartForPriceLS) {
    cartCounter.textContent = "Koszyk";
    return;
  }

  const cartPrice = JSON.parse(cartForPriceLS).reduce((acc, animal) => {
    const animalPrice = parseInt(animal.price.replace(/\s+/g, ""));

    return acc + animalPrice;
  }, 0);

  cartCounter.textContent = `${cartPrice} zł.`;
};

const showCartList = () => {
  if (!filterSectionList) return;

  filterSectionList.addEventListener("click", (e) => {
    let target = e.target;

    while (target && target.parentNode !== filterSectionList) {
      target = target.parentNode;
      if (!target) return;
    }

    if (target.tagName === "LI") {
      const currentFilterType =
        document.getElementsByClassName("category--selected");
      currentFilterType[0].classList.remove("category--selected");
      target.classList.add("category--selected");
      generateAnimalsCard(fetchedAnimals, target.dataset.idx);
      cartChecker();
    }
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  if (!cartLS) {
    localStorage.setItem("cart", []);
  }

  const headerNavList = document.querySelectorAll("#headerNavList li a");

  headerNavList.forEach((link) => {
    if (location.href === link.href) {
      link.classList.add("active");
    }
  });

  cartPriceCounter();
  generateCartCard();
  await fetchAnimalsForShop();
  await fetchAnimalsForCart();
  generateFilter();
  cartChecker();
  showCartList();
});

const miniSlider = new Swiper(".mini__slider", {
  loop: true,

  slidesPerView: 2,
  spaceBetween: 20,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  scrollbar: {
    el: ".swiper-scrollbar",
    draggable: true,
  },
});

const catalogSlider = new Swiper(".catalog__slider", {
  loop: true,

  slidesPerView: 3,
  spaceBetween: 20,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
});

lightGallery(document.getElementById('lightgallery')); 
