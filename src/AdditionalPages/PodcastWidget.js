import React from 'react';

const PodcastWidget = () => {
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Podcast Widget</h1>
      <p style={paragraphStyle}>Welcome to the Podcast Widget page! Here you can embed and manage your podcast widgets.</p>
    </div>
  );
};

export default PodcastWidget;

const containerStyle = {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: 'auto'
  };

  const titleStyle = {
    color: '#6200ee',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  };

  const paragraphStyle = {
    color: '#333',
    fontSize: '16px'
  };
