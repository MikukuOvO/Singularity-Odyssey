import React from 'react';

function InputContainer({ input, setInput, handlePredict, isLoading }) {
  return (
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
  );
}

export default InputContainer;
