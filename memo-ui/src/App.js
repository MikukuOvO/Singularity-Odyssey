import React from 'react';
import './App.css';
import CalendarComponent from './components/CalendarComponent';
import MemoListComponent from './components/MemoListComponent';
import MarkdownEditorComponent from './components/MarkdownEditorComponent';

function App() {
  return (
    <div className="App">
      <Memo />
    </div>
  );
}

const Memo = () => {
  const handleBack = async () => {
    window.location.href = 'http://192.168.0.136:3000';
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
        <MemoListComponent />
        <MarkdownEditorComponent />
      </div>
    </div>
  );
}

export default App;
