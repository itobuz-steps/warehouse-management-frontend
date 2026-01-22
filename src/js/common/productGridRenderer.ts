import type { Product } from '../types/product';

export const renderProductGrid = ({
  container,
  products,
  createCardHTML,
  onViewDetails,
  emptyState,
}: {
  container: HTMLElement;
  products: Product[];
  createCardHTML: (product: Product) => string;
  onViewDetails: (product: Product) => void;
  emptyState: () => void;
}) => {
  container.innerHTML = '';

  if (!products.length) {
    emptyState();
    return;
  }

  products.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.product = JSON.stringify(product);
    card.innerHTML = createCardHTML(product);

    card.addEventListener('click', () => {
      onViewDetails(product);
    });

    container.appendChild(card);
  });

  container.querySelectorAll('#viewDetails').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const el = e.currentTarget as HTMLElement;

      if (!el.dataset.product) {
        onViewDetails(JSON.parse(el.dataset.product as string));
      }
    });
  });
};
