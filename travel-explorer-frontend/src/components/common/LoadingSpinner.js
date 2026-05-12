import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const spinnerStyle = {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: size === 'small' ? '20px' : size === 'large' ? '60px' : '40px',
    height: size === 'small' ? '20px' : size === 'large' ? '60px' : '40px',
    animation: 'spin 2s linear infinite',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;