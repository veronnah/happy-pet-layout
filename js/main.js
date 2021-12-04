const swiper = new Swiper('.mini__slider', {
  loop: true,

  slidesPerView: 2,
  spaceBetween: 20,

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  scrollbar: {
    el: ".swiper-scrollbar",
    // hide: true,
    draggable: true,
  },

});