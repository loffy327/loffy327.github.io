import { toast } from './notification.js';

/**
 * Cart State Management
 */
class Cart {
  constructor() {
    this.items = this.loadCart();
    this.listeners = [];
  }

  loadCart() {
    const saved = localStorage.getItem('bobatea_cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('bobatea_cart', JSON.stringify(this.items));
    this.notifyListeners();
  }

  generateId(product, size, ice, sugar, selectedToppings) {
    // Tạo ID duy nhất cho item trong giỏ hàng dựa trên các tuỳ chọn
    const toppingStr = selectedToppings.map(t => t.id).sort().join('_');
    return `${product.id}_${size}_${ice}_${sugar}_${toppingStr}`;
  }

  addItem(product, quantity = 1, options = {}) {
    const { size = 'm', ice = '100', sugar = '100', selectedToppings = [] } = options;
    
    // Tính giá tiền dựa trên size và topping
    let itemPrice = product.prices[size];
    selectedToppings.forEach(t => {
      itemPrice += t.price;
    });

    const cartItemId = this.generateId(product, size, ice, sugar, selectedToppings);
    
    const existingItemIndex = this.items.findIndex(item => item.cartItemId === cartItemId);
    
    if (existingItemIndex > -1) {
      this.items[existingItemIndex].quantity += quantity;
    } else {
      this.items.push({
        cartItemId,
        productId: product.id,
        name: product.name,
        image: product.image,
        price: itemPrice,
        quantity,
        options: {
          size,
          ice,
          sugar,
          toppings: selectedToppings
        }
      });
    }

    this.saveCart();
    toast.success('Đã thêm vào giỏ hàng!');
  }

  updateQuantity(cartItemId, quantity) {
    const itemIndex = this.items.findIndex(item => item.cartItemId === cartItemId);
    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.removeItem(cartItemId);
      } else {
        this.items[itemIndex].quantity = quantity;
        this.saveCart();
      }
    }
  }

  removeItem(cartItemId) {
    this.items = this.items.filter(item => item.cartItemId !== cartItemId);
    this.saveCart();
    toast.info('Đã xóa sản phẩm khỏi giỏ hàng');
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getShippingFee() {
    // Miễn phí vận chuyển cho đơn > 200k
    return this.getSubtotal() > 200000 ? 0 : 25000;
  }

  getTotalPrice() {
    if (this.items.length === 0) return 0;
    return this.getSubtotal() + this.getShippingFee();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    // Gọi ngay khi subscribe
    listener(this);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this));
  }
}

// Export a singleton instance
export const cart = new Cart();

// Khởi tạo update UI global
export const initCartUI = () => {
  cart.subscribe((c) => {
    // Update tất cả các badge giỏ hàng
    document.querySelectorAll('.cart-badge').forEach(badge => {
      const total = c.getTotalItems();
      badge.textContent = total > 99 ? '99+' : total;
      if (total === 0) {
        badge.style.display = 'none';
      } else {
        badge.style.display = 'flex';
      }
    });
  });
};
