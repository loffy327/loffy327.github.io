import { getProductsByCategory, searchProducts } from '../data/products.js';
import { formatVND } from './currency.js';
import { cart } from './cart.js';
import { toast } from './notification.js';

/**
 * Render Product Card HTML
 */
export const createProductCard = (product) => {
  const isNewBadge = product.isNew ? '<span class="badge badge-success product-badge">Mới</span>' : '';
  const isPopularBadge = product.isPopular ? '<span class="badge badge-warning product-badge"><i class="fas fa-star"></i> Bestseller</span>' : '';
  const badge = isNewBadge || isPopularBadge;
  
  return `
    <div class="card product-card reveal">
      ${badge}
      <a href="product.html?id=${product.id}" class="product-img-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.src='assets/images/placeholder.png'">
      </a>
      <a href="product.html?id=${product.id}"><h3 class="product-title">${product.name}</h3></a>
      
      <div class="product-actions">
        <div class="product-price">${formatVND(product.prices.m)}</div>
        <button class="btn btn-primary btn-icon add-to-cart-quick" data-id="${product.id}" aria-label="Thêm vào giỏ">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
  `;
};

/**
 * Handle quick add to cart
 */
export const setupQuickAdd = (container) => {
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-quick');
    if (btn) {
      e.preventDefault();
      const productId = btn.dataset.id;
      // Import here to avoid circular dependencies issues if any, or just use global/imported data
      import('../data/products.js').then(module => {
        const product = module.getProductById(productId);
        if (product) {
          // Thêm size M mặc định, không topping
          cart.addItem(product, 1, { size: 'm', ice: '100', sugar: '100', selectedToppings: [] });
        }
      });
    }
  });
};
