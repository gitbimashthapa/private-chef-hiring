// hooks/useForm.js
import { useState, useEffect } from 'react';
import { validateForm } from '../utils/validation';

const useForm = (initialValues = {}, validationRules = {}, onSubmit = () => {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  // Update form validity whenever values or errors change
  useEffect(() => {
    const formHasErrors = Object.keys(errors).length > 0;
    const formIsTouched = Object.keys(touched).length > 0;
    setIsValid(!formHasErrors && formIsTouched);
  }, [errors, touched]);
  
  // Reset form to initial values
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({ ...prev, [name]: inputValue }));
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field if it's already been touched
    if (touched[name] && validationRules[name]) {
      const fieldErrors = validateForm({ [name]: inputValue }, { [name]: validationRules[name] });
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };
  
  // Handle input blur (for validation)
  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field
    if (validationRules[name]) {
      const fieldErrors = validateForm({ [name]: values[name] }, { [name]: validationRules[name] });
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(initialValues).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate all fields
    const formErrors = validateForm(values, validationRules);
    setErrors(formErrors);
    
    // If no errors, submit the form
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Set a specific field value programmatically
  const setValue = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };
  
  // Set multiple values at once
  const setMultipleValues = (newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  };
  
  // Set a specific error programmatically
  const setError = (field, errorMessage) => {
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
  };
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValue,
    setMultipleValues,
    setError
  };
};

export default useForm;