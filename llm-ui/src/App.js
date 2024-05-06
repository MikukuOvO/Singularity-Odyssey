import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    setIsLoading(true);
    const result = await fetchPrediction(input);
    setMessages([...messages, { text: input, type: 'user' }, { text: result, type: 'bot' }]);
    setInput('');
    setIsLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>LLM Assistant</h1>
      </header>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {isLoading && <p>正在处理...</p>}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message ..."
          onKeyPress={event => event.key === 'Enter' ? handlePredict() : null}
        />
        <button onClick={handlePredict} disabled={isLoading || !input.trim()}>
          Enter
        </button>
      </div>
    </div>
  );
}

async function fetchPrediction(input) {
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
    const data = await response.json();
    return data.prediction;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return "Error fetching data";
  }
}

export default App;