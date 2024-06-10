import React, { useState, useEffect } from 'react';
import './Assistant.css';
import Options from './components/Options';
import ChatContainer from './components/ChatContainer';
import InputContainer from './components/InputContainer';
import logo from './images/astronomer.png'; // Make sure to have a logo.png in the src folder
import Questions from './components/Questions'; // 引入 Questions 组件
import Icons from './components/Icons'; // 引入 Icons 组件

function Assistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      window.location.href = 'http://localhost:3000';
    }, 1000); // 动画时间 3 秒后跳转
  };

  useEffect(() => {
  }, []);

  const handlePredict = async (question) => {
    const userMessage = question || input;
    
    setMessages([...messages, { text: userMessage, type: 'user' }]);
    setInput('');
    setMessages(prevMessages => [...prevMessages, { text: '', type: 'bot' }]);
    
    const result = await fetchPrediction(userMessage, updateBotMessage);
    
    setMessages(prevMessages => {
      const lastMessageIndex = prevMessages.length - 1;
      const updatedMessages = [...prevMessages];
      updatedMessages[lastMessageIndex] = { text: result, type: 'bot' };
      return updatedMessages;
    });
  };
  

  let previousChunk = '';

  const updateBotMessage = (chunk) => {
    setMessages(prevMessages => {
      const lastMessageIndex = prevMessages.length - 1;
      const updatedMessages = [...prevMessages];

      if (chunk !== previousChunk) {
        // 仅在 chunk 不同的情况下追加文本
        if (updatedMessages[lastMessageIndex].type === 'bot') {
          updatedMessages[lastMessageIndex].text += chunk;
        } else {
          updatedMessages.push({ text: chunk, type: 'bot' });
        }
      }

      previousChunk = chunk; // 更新前一个 chunk
      return updatedMessages;
    });
  };

  return (
    <div className="Assistant">
      <div className="left-pane">
        <div className={`header ${isAnimating ? 'animate-logo' : ''}`}>
          <img src={logo} alt="Logo" className={`logo ${isAnimating ? 'logo-animate' : ''}`} onClick={handleBack} />
        </div>
        <Options />
        <Icons />
        <Questions handlePredict={handlePredict} />
      </div>
      <div className="right-pane">
        <ChatContainer messages={messages} isLoading={isLoading} />
        <InputContainer
          input={input}
          setInput={setInput}
          handlePredict={handlePredict}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

async function fetchPrediction(input, updateBotMessage) {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: input })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunk = decoder.decode(value, { stream: true });
      result += chunk;
      updateBotMessage(chunk);
      await new Promise(resolve => setTimeout(resolve, 10)); // 每0.01秒刷新一次
    }

    return result;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    updateBotMessage("Error fetching data");
    return "Error fetching data";
  }
}

export default Assistant;
