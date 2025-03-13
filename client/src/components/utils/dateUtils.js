// utils/dateUtils.js

/**
 * Checks if a date is available based on the provided availability array
 * @param {Date} date - The date to check
 * @param {Array} availableDates - Array of available date objects
 * @returns {boolean} - Whether the date is available
 */
export const isDateAvailable = (date, availableDates) => {
    if (!date || !availableDates || !availableDates.length) return false;
  
    // Format the date to YYYY-MM-DD for comparison
    const formattedDate = formatDateToString(date);
    
    // Check if the date exists in the available dates
    return availableDates.some(available => {
      if (typeof available === 'string') {
        return available === formattedDate;
      } else if (available.date) {
        return available.date === formattedDate;
      }
      return false;
    });
  };
  
  /**
   * Formats a Date object to YYYY-MM-DD string
   * @param {Date} date - The date to format
   * @returns {string} - Formatted date string
   */
  export const formatDateToString = (date) => {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  
  /**
   * Get the next available date from the given availability array
   * @param {Array} availableDates - Array of available date objects
   * @returns {Date|null} - The next available date or null
   */
  export const getNextAvailableDate = (availableDates) => {
    if (!availableDates || !availableDates.length) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Convert string dates to Date objects if needed
    const dates = availableDates.map(available => {
      if (typeof available === 'string') {
        return new Date(available);
      } else if (available.date) {
        return new Date(available.date);
      }
      return null;
    }).filter(date => date !== null && date >= today);
    
    // Sort dates in ascending order
    dates.sort((a, b) => a - b);
    
    return dates.length > 0 ? dates[0] : null;
  };
  
  /**
   * Calculate the number of days between two dates
   * @param {Date} startDate - The start date
   * @param {Date} endDate - The end date
   * @returns {number} - Number of days
   */
  export const daysBetween = (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Set time to beginning of day for accurate calculation
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    // Calculate the difference in days
    return Math.round(Math.abs((start - end) / oneDay));
  };