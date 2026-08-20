
async function loadComponents(root = document) {
  const components = [...root.querySelectorAll('[data-component]')];
  await Promise.all(components.map(async (component) => {
    const response = await fetch(component.dataset.component);
    if (!response.ok) throw new Error(`Component load failed: ${component.dataset.component}`);
    component.outerHTML = await response.text();
  }));
}

async function renderRepeatedComponents(root = document) {
  const containers = [...root.querySelectorAll('[data-repeat-component][data-repeat-data]')];
  await Promise.all(containers.map(async (container) => {
    const [templateResponse, dataResponse] = await Promise.all([
      fetch(container.dataset.repeatComponent),
      fetch(container.dataset.repeatData),
    ]);

    if (!templateResponse.ok || !dataResponse.ok) {
      throw new Error(`Repeated component load failed: ${container.dataset.repeatComponent}`);
    }

    const template = await templateResponse.text();
    const items = await dataResponse.json();
    container.outerHTML = items.map((item) => {
      const values = {
        ...item,
        parameters: Array.isArray(item.parameters)
          ? item.parameters.map((parameter) => `<li>${parameter}</li>`).join('')
          : '',
      };
      return template.replace(/{{(\w+)}}/g, (_, key) => values[key] ?? '');
    }).join('');
  }));
}

function initPage() {
  const menuButton = document.querySelector('.header__menu-button');
  const nav = document.querySelector('.nav');
  menuButton?.addEventListener('click', () => {
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

  if (document.querySelector('.mySwiper')) {
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
  }

  if (document.querySelector('.partners__slider')) {
    const partnersSlider = new Swiper('.partners__slider', {
      loop: true,
      slidesPerView: 3.5,
      spaceBetween: 0,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1100: {
          slidesPerView: 3.5,
        },
      },
    });
  }

  /**
   * products slider on about us page
   */
  if (document.querySelector('.about-us-directions__slider')) {
    const directionsSlider = new Swiper('.about-us-directions__slider', {
      loop: true,
      slidesPerView: 1.15,
      spaceBetween: 20,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      breakpoints: {
        480: {
          slidesPerView: 2.15,
        },
        768: {
          slidesPerView: 3.15,
        },
        1100: {
          slidesPerView: 4.15,
        },
      },
    });
  }

  document.querySelectorAll('.service-item__button').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.service-item');
      const willOpen = !item.classList.contains('service-item--open');
      document.querySelectorAll('.service-item--open').forEach((openedItem) => {
        openedItem.classList.remove('service-item--open');
        openedItem.querySelector('.service-item__button').setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('service-item--open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

loadComponents()
  .then(() => renderRepeatedComponents())
  .then(initPage)
  .catch((error) => {
    console.error(error);
    initPage();
  });
