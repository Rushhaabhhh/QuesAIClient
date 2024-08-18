import React from 'react';

const Upgrade = () => {

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Upgrade</h1>
      <p style={paragraphStyle}>Explore our upgrade options to enhance your experience. Choose the plan that fits your needs.</p>
    </div>
  );
};

export default Upgrade;

const containerStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: 'auto'
  };

  const titleStyle = {
    color: '#ff5722',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  };

  const paragraphStyle = {
    color: '#333',
    fontSize: '16px'
  };
