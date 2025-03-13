import React from 'react';
import '../styles/Button.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  className = '', 
  fullWidth = false,
  ...rest 
}) => {
  const buttonClasses = `
    btn 
    btn-${variant} 
    btn-${size} 
    ${fullWidth ? 'btn-full-width' : ''} 
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;