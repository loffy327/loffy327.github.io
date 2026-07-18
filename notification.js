/**
 * Toast Notification System
 */

// Create toast container if it doesn't exist
const ensureToastContainer = () => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
};

const icons = {
  success: '<i class="fas fa-check-circle"></i>',
  error: '<i class="fas fa-exclamation-circle"></i>',
  warning: '<i class="fas fa-exclamation-triangle"></i>',
  info: '<i class="fas fa-info-circle"></i>'
};

export const showToast = (message, type = 'info', duration = 3000) => {
  const container = ensureToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconHtml = icons[type] || icons.info;
  
  toast.innerHTML = `
    <div class="toast-icon">${iconHtml}</div>
    <div class="toast-message">${message}</div>
  `;
  
  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
};

export const toast = {
  success: (msg, duration) => showToast(msg, 'success', duration),
  error: (msg, duration) => showToast(msg, 'error', duration),
  warning: (msg, duration) => showToast(msg, 'warning', duration),
  info: (msg, duration) => showToast(msg, 'info', duration)
};
