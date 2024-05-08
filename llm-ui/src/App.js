import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);

  useEffect(() => {
    // 在组件加载完成时获取位置信息
    handleLocation();
  }, []);

  const handlePredict = async () => {
    setIsLoading(true);
    const result = await fetchPrediction(input);
    setMessages([...messages, { text: input, type: 'user' }, { text: result, type: 'bot' }]);
    setInput('');
    setIsLoading(false);
  };

  const handleLocation = async () => {
    try {
      setIsLoading(true);
      const locationResult = await fetchLocation();
      const { province, city } = locationResult;
      setLocationInfo({ province, city });
      setMessages([
        { text: `Hello, friend from ${province}, ${city}.`, type: 'bot' },
        ...messages,
      ]);
    } catch (error) {
      console.error('Error getting location:', error);
      setMessages([...messages, { text: 'Error getting location.', type: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
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
        {isLoading && <p>Processing...</p>}
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

async function fetchIP() {
  try {
    const response = await fetch('http://127.0.0.1:5000/get_ip', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return { ip: data.ip };
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return "Error fetching location";
  }
}

async function fetchLocation() {
  try {
    // 获取用户的 IP 地址
    const ipData = await fetchIP();
    // const userIP = ipData.ip;
    const userIP = '114.247.50.2';

    // 使用获取到的用户 IP 地址调用高德地图 API
    const userKey = '478235d991172967692a6608a539bac5';
    const response = await fetch(`https://restapi.amap.com/v3/ip?ip=${userIP}&output=xml&key=${userKey}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const xmlString = await response.text();

    // 使用 DOMParser 解析 XML 数据
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // 提取需要的数据
    const province = xmlDoc.getElementsByTagName('province')[0].textContent;
    const city = xmlDoc.getElementsByTagName('city')[0].textContent;

    return { province, city };
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return "Error fetching location";
  }
}

export default App;
