// utils/validation.js

/**
 * Validates an email address format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validates a password based on common requirements
   * @param {string} password - The password to validate
   * @returns {Object} - Validation results and message
   */
  export const validatePassword = (password) => {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }
    
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    
    // Check for different character types
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
      return { 
        isValid: false, 
        message: 'Password must include uppercase, lowercase, number, and special character' 
      };
    }
    
    return { isValid: true, message: 'Password is valid' };
  };
  
  /**
   * Validates a phone number format
   * @param {string} phoneNumber - The phone number to validate
   * @returns {boolean} - Whether the phone number is valid
   */
  export const isValidPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return false;
    
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it has the right number of digits (10 for US)
    return cleaned.length === 10;
  };
  
  /**
   * Validates a form object with custom rules
   * @param {Object} formData - The form data to validate
   * @param {Object} validationRules - The validation rules
   * @returns {Object} - Validation errors
   */
  export const validateForm = (formData, validationRules) => {
    const errors = {};
    
    Object.keys(validationRules).forEach(field => {
      const value = formData[field];
      const rules = validationRules[field];
      
      // Check required fields
      if (rules.required && (!value || value.trim() === '')) {
        errors[field] = `${rules.label || field} is required`;
        return;
      }
      
      // Skip further validation if field is empty and not required
      if (!value && !rules.required) return;
      
      // Check minimum length
      if (rules.minLength && value.length < rules.minLength) {
        errors[field] = `${rules.label || field} must be at least ${rules.minLength} characters`;
      }
      
      // Check maximum length
      if (rules.maxLength && value.length > rules.maxLength) {
        errors[field] = `${rules.label || field} cannot exceed ${rules.maxLength} characters`;
      }
      
      // Check pattern match
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = rules.message || `${rules.label || field} format is invalid`;
      }
      
      // Custom validation function
      if (rules.validate && typeof rules.validate === 'function') {
        const validateResult = rules.validate(value, formData);
        if (validateResult !== true) {
          errors[field] = validateResult;
        }
      }
    });
    
    return errors;
  };