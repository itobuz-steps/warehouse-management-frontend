let currentImages = [];
let currentImageIndex = 0;
let imageTimeout = null;

function updateCarousel(imageSelector, dotsSelector) {
  const carouselImage = document.querySelector(imageSelector);
  const dots = document.querySelectorAll(`${dotsSelector} span`);

  if (!carouselImage || !currentImages.length) {
    return;
  }

  carouselImage.src = currentImages[currentImageIndex];

  dots.forEach((dot) => dot.classList.remove('active'));
  if (dots[currentImageIndex]) {
    dots[currentImageIndex].classList.add('active');
  }
}

function startAutoSlide(imageSelector, dotsSelector, interval = 5000) {
    
  if (imageTimeout) {
    clearInterval(imageTimeout);
  }

  imageTimeout = setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateCarousel(imageSelector, dotsSelector);
  }, interval);
}

export function initializeCarousel({
  images,
  imageSelector = '#carouselImage',
  dotsSelector = '.carousel-dots',
  interval = 5000,
}) {
  currentImages = images?.length ? images : ['/images/placeholder.png'];
  currentImageIndex = 0;

  const carouselImage = document.querySelector(imageSelector);
  const carouselDots = document.querySelector(dotsSelector);

  if (!carouselImage || !carouselDots) {
    return;
  }

  carouselDots.innerHTML = '';

  currentImages.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.dataset.index = index;

    dot.addEventListener('click', () => {
      clearInterval(imageTimeout);
      currentImageIndex = index;
      updateCarousel(imageSelector, dotsSelector);
      startAutoSlide(imageSelector, dotsSelector, interval);
    });

    carouselDots.appendChild(dot);
  });

  updateCarousel(imageSelector, dotsSelector);
  startAutoSlide(imageSelector, dotsSelector, interval);
}
