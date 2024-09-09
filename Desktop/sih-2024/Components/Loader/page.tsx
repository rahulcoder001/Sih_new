import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <h2 className="loading-text">Loading...</h2>
    </div>
  );
};

export default Loader;
