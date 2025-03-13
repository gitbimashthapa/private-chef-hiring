// utils/formatters.js

/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
    if (amount === undefined || amount === null) return '';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  /**
   * Formats a date object to a readable string
   * @param {Date|string} date - The date to format
   * @param {string} format - The format style ('short', 'medium', 'long', 'full')
   * @returns {string} - Formatted date string
   */
  export const formatDate = (date, format = 'medium') => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const options = {
      short: { month: 'numeric', day: 'numeric', year: '2-digit' },
      medium: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' },
      full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    };
    
    return dateObj.toLocaleDateString('en-US', options[format]);
  };
  
  /**
   * Truncates text to a specified length and adds an ellipsis
   * @param {string} text - The text to truncate
   * @param {number} maxLength - Maximum length before truncating
   * @returns {string} - Truncated text
   */
  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    
    return `${text.substring(0, maxLength)}...`;
  };
  
  /**
   * Formats a phone number to standard format
   * @param {string} phoneNumber - The phone number to format
   * @returns {string} - Formatted phone number
   */
  export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if the input is valid
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    return phoneNumber;
  };