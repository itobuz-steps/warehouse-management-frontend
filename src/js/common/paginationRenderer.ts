export const paginationRenderer = ({
  container,
  currentPage,
  totalPages,
  onPageChange,
}: {
  container: HTMLElement;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  container.innerHTML = '';

  if (totalPages <= 1) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';

  const createBtn = (label: string, page: number, disabled = false) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = 'page-btn';

    if (disabled) {
      btn.disabled = true;
      btn.classList.add('disabled');
      return btn;
    }

    btn.addEventListener('click', () => {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    return btn;
  };

  container.appendChild(createBtn('<<', 1, currentPage === 1));
  container.appendChild(createBtn('<', currentPage - 1, currentPage === 1));

  const info = document.createElement('span');
  info.className = 'page-info';
  info.textContent = `${currentPage} of ${totalPages}`;
  container.appendChild(info);

  container.appendChild(
    createBtn('>', currentPage + 1, currentPage === totalPages)
  );
  container.appendChild(
    createBtn('>>', totalPages, currentPage === totalPages)
  );
};
