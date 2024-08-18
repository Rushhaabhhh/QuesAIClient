import React from 'react';

const Help = () => {

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Help</h1>
      <p style={paragraphStyle}>Need assistance? Check out our help section for FAQs, tutorials, and contact support.</p>
    </div>
  );
};

export default Help;

const containerStyle = {
    padding: '20px',
    backgroundColor: '#fafafa',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: 'auto'
  };

  const titleStyle = {
    color: '#009688',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  };

  const paragraphStyle = {
    color: '#333',
    fontSize: '16px'
  };
