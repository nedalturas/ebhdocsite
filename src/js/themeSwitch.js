
const toggle = document.getElementById('theme-toggle');
const icon = toggle.querySelector('.theme-icon');
const html = document.documentElement;

// Check saved theme or default to light
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
icon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

toggle.addEventListener('click', () => {
  const theme = html.getAttribute('data-theme');
  const newTheme = theme === 'light' ? 'dark' : 'light';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});