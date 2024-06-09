import React, { useState } from 'react';
import '../Options.css'; // 确保引入了样式文件

function Options() {
  const [activeOption, setActiveOption] = useState('chat');

  return (
    <div className="options-container">
      <button
        className={`option ${activeOption === 'chat' ? 'active' : ''}`}
        onClick={() => setActiveOption('chat')}
      >
        Chat
      </button>
      <button
        className={`option ${activeOption === 'recommend' ? 'active' : ''}`}
        onClick={() => setActiveOption('recommend')}
      >
        Recommend
      </button>
    </div>
  );
}

export default Options;
