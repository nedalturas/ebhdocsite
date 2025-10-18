document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  
  // Toggle categories on click
  document.querySelectorAll('.category-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.parentElement;
      category.classList.toggle('open');
    });
  });
  
  // Auto-open category if current page is inside it
  document.querySelectorAll('.category-links a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      // Found active link, open its category
      const category = link.closest('.category');
      category.classList.add('open');
      link.classList.add('active');
    }
  });
});