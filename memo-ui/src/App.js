// src/App.js
import React from 'react';
import './App.css';
import CalendarComponent from './components/CalendarComponent';
import MarkdownEditorComponent from './components/MarkdownEditorComponent';

function App() {
  return (
    <div className="App">
      <div className="top-half">
        <CalendarComponent />
      </div>
      <div className="bottom-half">
        <MarkdownEditorComponent />
      </div>
    </div>
  );
}

export default App;
