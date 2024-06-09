import React from 'react';

function BackButton({ handleBack }) {
  return (
    <div className="Back-button">
      <button onClick={handleBack}>Back</button>
    </div>
  );
}

export default BackButton;
