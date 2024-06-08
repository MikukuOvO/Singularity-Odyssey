import React, { useState } from 'react';

const MemoListComponent = ({ setSelectedMemo }) => {
  const [memos, setMemos] = useState([]);
  const [newMemo, setNewMemo] = useState("");

  const handleAddMemo = () => {
    if (newMemo.trim() !== "") {
      const memo = { id: Date.now(), content: newMemo };
      setMemos([...memos, memo]);
      setNewMemo("");
      setSelectedMemo(memo);
    }
  };

  const handleDeleteMemo = (id) => {
    setMemos(memos.filter(memo => memo.id !== id));
  };

  return (
    <div>
      <h2>Memos</h2>
      <input
        type="text"
        value={newMemo}
        onChange={(e) => setNewMemo(e.target.value)}
        placeholder="Add a new memo..."
      />
      <button onClick={handleAddMemo}>Add</button>
      <ul>
        {memos.map((memo) => (
          <li key={memo.id}>
            <span onClick={() => setSelectedMemo(memo)}>{memo.content}</span>
            <button onClick={() => handleDeleteMemo(memo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoListComponent;
