import React, { useState } from 'react';
import './App.css';
import CalendarComponent from './components/CalendarComponent';
import MarkdownEditorComponent from './components/MarkdownEditorComponent';
import logo from './images/astronomer.png'; // Make sure to have a logo.png in the src folder

function App() {
  const [memos, setMemos] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLogoClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      window.location.href = 'http://192.168.0.136:3000';
    }, 1000); // 动画时间 3 秒后跳转
  };

  return (
    <div className="App">
      <Memo
        memos={memos}
        setMemos={setMemos}
        selectedMemo={selectedMemo}
        setSelectedMemo={setSelectedMemo}
        isAnimating={isAnimating}
        handleLogoClick={handleLogoClick}
      />
    </div>
  );
}

const Memo = ({ memos, setMemos, selectedMemo, setSelectedMemo, isAnimating, handleLogoClick }) => {
  return (
    <div className="App">
      
      <div className="content">
        <div className="left-half">
          <div className={`header ${isAnimating ? 'animate-logo' : ''}`}>
            <img src={logo} alt="Logo" className={`logo ${isAnimating ? 'logo-animate' : ''}`} onClick={handleLogoClick} />
          </div>
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
};

export default App;
