import React, { useState } from 'react';
import './App.css';
import CalendarComponent from './components/CalendarComponent';
import MarkdownEditorComponent from './components/MarkdownEditorComponent';
import logo from './logo.svg'; // Make sure to have a logo.png in the src folder

function App() {
  const [memos, setMemos] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);

  return (
    <div className="App">
      <Memo
        memos={memos}
        setMemos={setMemos}
        selectedMemo={selectedMemo}
        setSelectedMemo={setSelectedMemo}
      />
    </div>
  );
}

const Memo = ({ memos, setMemos, selectedMemo, setSelectedMemo }) => {
  const handleBack = async () => {
    window.location.href = 'http://192.168.0.136:3000';
  };

  return (
    <div className="App">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" onClick={handleBack} />
      </div>
      <div className="content">
        <div className="left-half">
          <CalendarComponent />
        </div>
        <div className="right-half">
          <MarkdownEditorComponent
            memos={memos}
            setMemos={setMemos}
            selectedMemo={selectedMemo}
            setSelectedMemo={setSelectedMemo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
