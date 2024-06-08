import React from 'react';
import CalendarComponent from './components/CalendarComponent';
import MarkdownEditorComponent from './components/MarkdownEditorComponent';

const Memo = () => {
  const handleBack = async () => {
    window.location.href = '/';
  };

  return (
    <div className="App">
      <div className="top-half">
        <CalendarComponent />
        <div className="Back-button">
          <button onClick={handleBack}>Back</button>
        </div>
      </div>

      <div className="bottom-half">
        <MarkdownEditorComponent />
      </div>
    </div>
  );
}

export default Memo;
