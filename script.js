
    const menuButton = document.querySelector('.header__menu-button');
    const nav = document.querySelector('.nav');
    menuButton.addEventListener('click', () => {
      const opened = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!opened));
      nav.classList.toggle('nav--open');
    });

    const documentTabs = document.querySelectorAll('.docs__tab');
    const documentCaption = document.querySelector('.docs__caption');
    const documentImage = document.querySelector('.docs__image');
    documentTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        documentTabs.forEach((item) => {
          item.classList.remove('docs__tab--active');
          item.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('docs__tab--active');
        tab.setAttribute('aria-selected', 'true');
        documentCaption.textContent = tab.dataset.caption;
        documentImage.setAttribute('src', `images/docs/${tab.dataset.image.replace(/\\s+/g, '-').toLowerCase()}`);
      });
    });
    const swiper = new Swiper('.mySwiper', {
      loop: false,
      navigation: false,
      slidesPerView: 4,
      spaceBetween: 10,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        480: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
      },
    });