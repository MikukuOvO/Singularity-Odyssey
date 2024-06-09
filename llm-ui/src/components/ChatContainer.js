import React from 'react';

function ChatContainer({ messages, isLoading }) {
  return (
    <div className="chat-container">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.type}`}>
          <p>{msg.text}</p>
        </div>
      ))}
      {isLoading && <p>Processing...</p>}
    </div>
  );
}

export default ChatContainer;
