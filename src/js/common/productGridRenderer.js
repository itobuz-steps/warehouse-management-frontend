export const renderProductGrid = ({
  container,
  products,
  createCardHTML,
  onViewDetails,
  emptyState,
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
      onViewDetails(JSON.parse(e.currentTarget.dataset.product));
    });
  });
};
