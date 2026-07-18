import { initCartUI } from './modules/cart.js';
import { initAnimations } from './modules/animation.js';

// Khởi tạo app
document.addEventListener('DOMContentLoaded', () => {
  console.log('BobaTea App Initialized');
  
  // Khởi tạo giỏ hàng UI
  initCartUI();
  
  // Khởi tạo animations
  initAnimations();

  // Xử lý Dark Mode
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.documentElement; // Dùng <html> thay vì <body> để style CSS dễ hơn
  
  // Kiểm tra local storage
  const currentTheme = localStorage.getItem('theme') || 'light';
  body.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = body.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    if (theme === 'dark') {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  }

  // Mobile Menu
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');
  
  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }
});
