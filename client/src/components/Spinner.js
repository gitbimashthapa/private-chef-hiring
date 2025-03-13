import React from 'react';
import '../styles/Spinner.css';

const Spinner = ({ size = 'medium', color = 'primary', fullPage = false }) => {
  const spinnerClasses = `
    spinner 
    spinner-${size} 
    spinner-${color} 
    ${fullPage ? 'spinner-fullpage' : ''}
  `.trim();

  return (
    <div className={spinnerClasses}>
      <div className="spinner-circle"></div>
      {fullPage && <p className="spinner-text">Loading...</p>}
    </div>
  );
};

export default Spinner;