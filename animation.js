/**
 * Handle Scroll Animations and Interactions
 */

export const initAnimations = () => {
  // Intersection Observer for reveal animations on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: Stop observing once revealed
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with .reveal class
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // Header Scroll Effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Parallax Effect for Hero section
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    window.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth - e.pageX * 2) / 90;
      const y = (window.innerHeight - e.pageY * 2) / 90;
      
      heroImage.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
  }
};
