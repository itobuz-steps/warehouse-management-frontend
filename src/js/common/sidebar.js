document.addEventListener('DOMContentLoaded', () => {
  fetch('sidebar.html')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Sidebar not found');
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById('sidebar-container').innerHTML = html;
      const currentPath = window.location.pathname.split('/').pop();

      const links = document.querySelectorAll('.sidebar-menu a');
      links.forEach((link) => {
        link.classList.remove('active');

        const linkPath = link.getAttribute('href').split('/').pop();

        if (linkPath === currentPath) {
          link.classList.add('active');
        }
      });
    })
    .catch((err) => console.error('Error loading sidebar:', err));
});
