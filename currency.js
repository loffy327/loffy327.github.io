/**
 * Format a number to VND currency string
 * Example: 35000 -> "35.000 ₫"
 */
export const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Parse a VND currency string back to number (if needed)
 * Example: "35.000 ₫" -> 35000
 */
export const parseVND = (currencyString) => {
  if (!currencyString) return 0;
  // Xóa các ký tự không phải số
  const numericString = currencyString.replace(/[^\d]/g, '');
  return parseInt(numericString, 10);
};
