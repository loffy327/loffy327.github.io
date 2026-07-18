import { cart } from './cart.js';
import { orderManager } from './order.js';
import { toast } from './notification.js';

export const initCheckout = () => {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (cart.items.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống!');
      return;
    }

    const formData = new FormData(form);
    const customerInfo = {
      fullName: formData.get('fullName'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      note: formData.get('note')
    };

    // Validate phone number simple
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(customerInfo.phone)) {
      toast.error('Số điện thoại không hợp lệ!');
      return;
    }

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    const newOrder = orderManager.createOrder(customerInfo, cart.items, paymentMethod, cart.getSubtotal(), cart.getShippingFee(), cart.getTotalPrice());
    
    if (newOrder) {
      cart.clearCart();
      
      // Chuyển hướng đến trang thành công hoặc hiện modal
      const modal = document.getElementById('success-modal');
      if (modal) {
        document.getElementById('order-id-display').textContent = newOrder.id;
        modal.classList.add('active');
      } else {
        toast.success('Đặt hàng thành công!');
        setTimeout(() => {
          window.location.href = `order-tracking.html?id=${newOrder.id}`;
        }, 2000);
      }
    }
  });

  // Select payment method UI
  document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', () => {
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
      method.classList.add('active');
      method.querySelector('input[type="radio"]').checked = true;
    });
  });
};
