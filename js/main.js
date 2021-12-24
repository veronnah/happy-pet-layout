document.addEventListener("DOMContentLoaded", () => {
  const cartCounter = document.getElementById("cartCounter");
  const cartLS = localStorage.getItem("cart");

  if (!cartLS) {
    localStorage.setItem("cart", []);
    cartCounter.textContent = "Cart";
  } else {
    const cartPrice = JSON.parse(cartLS).reduce((acc, animal) => {
      const animalPrice = parseInt(animal.price.replace(/\s+/g, ""));

      return acc + animalPrice;
    }, 0);

    cartCounter.textContent = `${cartPrice} zł.`;
  }

  const headerNavList = document.querySelectorAll("#headerNavList li a");

  headerNavList.forEach((link) => {
    if (location.href === link.href) {
      link.classList.add("active");
    }
  });
});

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
