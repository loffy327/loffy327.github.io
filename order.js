/**
 * Order Management System (Mock Backend)
 */
class OrderManager {
  constructor() {
    this.orders = this.loadOrders();
  }

  loadOrders() {
    const saved = localStorage.getItem('bobatea_orders');
    return saved ? JSON.parse(saved) : [];
  }

  saveOrders() {
    localStorage.setItem('bobatea_orders', JSON.stringify(this.orders));
  }

  generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'BBA-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  createOrder(customerInfo, items, paymentMethod, subtotal, shippingFee, total) {
    const newOrder = {
      id: this.generateOrderId(),
      createdAt: new Date().toISOString(),
      customer: customerInfo,
      items: [...items],
      paymentMethod,
      subtotal,
      shippingFee,
      total,
      status: 'pending' // pending -> processing -> shipping -> completed / cancelled
    };

    this.orders.unshift(newOrder); // Thêm vào đầu danh sách
    this.saveOrders();
    return newOrder;
  }

  getOrderById(id) {
    return this.orders.find(o => o.id === id);
  }

  updateOrderStatus(id, status) {
    const order = this.getOrderById(id);
    if (order) {
      order.status = status;
      this.saveOrders();
      return true;
    }
    return false;
  }

  getRecentOrders(limit = 10) {
    return this.orders.slice(0, limit);
  }
}

export const orderManager = new OrderManager();
