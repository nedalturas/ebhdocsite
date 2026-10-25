document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const sidebar = document.getElementById('docsSidebar');
  const menuButton = document.getElementById('menu');
  const backdrop = document.getElementById('docsBackdrop');
  const closeButton = document.getElementById('sidebarClose');
  const currentTopicSpan = document.getElementById('docsCurrentTopic');

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('show');
    if (menuButton) menuButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('docs-sidebar-open');
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('show');
    if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('docs-sidebar-open');
  }

  if (menuButton) {
    menuButton.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', closeSidebar);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });

  // Highlight active link, ensure parent <details> is open, and update mobile header text
  let activeFound = false;
  document.querySelectorAll('.category-links a').forEach(link => {
    const linkPath = (link.getAttribute('href') || '').replace(/\/$/, '') || '/';
    if (linkPath === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      activeFound = true;

      const parentDetails = link.closest('details');
      if (parentDetails) {
        parentDetails.open = true;
      }

      if (currentTopicSpan) {
        currentTopicSpan.textContent = link.textContent.trim();
      }
    }

    link.addEventListener('click', () => {
      // Auto close sidebar on mobile navigation
      if (window.innerWidth < 992) {
        closeSidebar();
      }
    });
  });
});
