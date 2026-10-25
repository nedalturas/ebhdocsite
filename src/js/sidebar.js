document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const sidebar = document.getElementById('docsSidebar');
  const menuButton = document.getElementById('menu');
  const backdrop = document.getElementById('docsBackdrop');
  const closeButton = document.getElementById('sidebarClose');

  const searchInput = document.getElementById('docsSearchInput');
  const searchClear = document.getElementById('docsSearchClear');
  const searchResults = document.getElementById('docsSearchResults');

  let searchIndex = [];

  // Fetch search index for instant search results
  fetch('/docs-search.json')
    .then(res => res.json())
    .then(data => {
      searchIndex = data;
    })
    .catch(() => {
      // Fallback: build index from DOM links
      document.querySelectorAll('.category-links a').forEach(link => {
        const cat = link.closest('details')?.querySelector('summary span')?.textContent.trim() || '';
        searchIndex.push({
          title: link.textContent.trim(),
          category: cat,
          url: link.getAttribute('href')
        });
      });
    });

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

  if (closeButton) closeButton.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (searchResults && !searchResults.hidden) {
        searchResults.hidden = true;
      }
      if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    }
  });

  // Highlight active link and keep its parent details open
  document.querySelectorAll('.category-links a').forEach(link => {
    const linkPath = (link.getAttribute('href') || '').replace(/\/$/, '') || '/';
    if (linkPath === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      const parentDetails = link.closest('details');
      if (parentDetails) parentDetails.open = true;
    }

    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        closeSidebar();
      }
    });
  });

  // Search dropdown logic
  function renderSearchResults(query) {
    if (!searchResults) return;
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      searchResults.innerHTML = '';
      searchResults.hidden = true;
      if (searchClear) searchClear.hidden = true;
      return;
    }

    if (searchClear) searchClear.hidden = false;

    const matches = searchIndex.filter(item =>
      item.title.toLowerCase().includes(cleanQuery) ||
      (item.category && item.category.toLowerCase().includes(cleanQuery))
    );

    if (matches.length === 0) {
      searchResults.innerHTML = `<div class="docs-search-no-results">No documentation matches "${escapeHtml(cleanQuery)}"</div>`;
      searchResults.hidden = false;
      return;
    }

    const html = matches.map(item => `
      <a href="${item.url}" class="docs-search-result-item">
        <span class="docs-search-result-title">${escapeHtml(item.title)}</span>
        <span class="docs-search-result-category">${escapeHtml(item.category || 'Docs')}</span>
      </a>
    `).join('');

    searchResults.innerHTML = html;
    searchResults.hidden = false;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });

    searchInput.addEventListener('focus', (e) => {
      if (e.target.value.trim()) {
        renderSearchResults(e.target.value);
      }
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      renderSearchResults('');
    });
  }

  // Close search dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (searchResults && !searchResults.contains(e.target) && e.target !== searchInput) {
      searchResults.hidden = true;
    }
  });
});
