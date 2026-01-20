let currentImages: string[] = [];
let currentImageIndex = 0;
let imageTimeout: number | null = null;

function updateCarousel(imageSelector: string, dotsSelector: string) {
  const carouselImage: HTMLImageElement | null =
    document.querySelector(imageSelector);
  const dots: NodeListOf<HTMLElement> | null = document.querySelectorAll(
    `${dotsSelector} span`
  );

  if (!carouselImage || !currentImages.length) {
    return;
  }

  carouselImage.src = currentImages[currentImageIndex];

  dots.forEach((dot) => dot.classList.remove('active'));
  if (dots[currentImageIndex]) {
    dots[currentImageIndex].classList.add('active');
  }
}

function startAutoSlide(
  imageSelector: string,
  dotsSelector: string,
  interval = 5000
) {
  if (imageTimeout) {
    clearInterval(imageTimeout);
  }

  imageTimeout = setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateCarousel(imageSelector, dotsSelector);
  }, interval);
}

export function initializeCarousel({
  images = [],
  imageSelector = '#carouselImage',
  dotsSelector = '.carousel-dots',
  interval = 5000,
}: {
  images?: string[];
  imageSelector?: string;
  dotsSelector?: string;
  interval?: number;
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
    dot.dataset.index = index + '';

    dot.addEventListener('click', () => {
      if (imageTimeout === null) {
        return;
      }

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
