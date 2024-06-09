import React, { useEffect, useState } from 'react';

const MemoListModal = ({ closeModal, setSelectedMemo }) => {
  const [memos, setMemos] = useState([]);
  const [selectedMemoContent, setSelectedMemoContent] = useState('');

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/memos');
        const data = await response.json();
        setMemos(data);
      } catch (error) {
        console.error('Error fetching memos:', error);
      }
    };

    fetchMemos();
  }, []);

  const handleSelectMemo = async (memo) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/memos/${memo.id}`);
      const data = await response.json();
      setSelectedMemo(memo);
      setSelectedMemoContent(data.content);
    } catch (error) {
      console.error('Error fetching memo content:', error);
    }
  };

  const handleDeleteMemo = async (memoId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/memos/${memoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMemos(memos.filter(memo => memo.id !== memoId));
        setSelectedMemoContent('');
        console.log('Memo deleted successfully');
      } else {
        console.error('Failed to delete memo:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting memo:', error);
    }
  };

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <button onClick={closeModal} style={closeButtonStyle}>Close</button>
        <h2>Previous Memos</h2>
        <ul>
          {memos.map((memo) => (
            <li key={memo.id} onClick={() => handleSelectMemo(memo)}>
              {memo.title}
              <button onClick={() => handleDeleteMemo(memo.id)}>
              🗑️
              </button>
            </li>           
          ))}
        </ul>
        {selectedMemoContent && <MemoContent content={selectedMemoContent} />}
      </div>
    </div>
  );
};

const MemoContent = ({ content }) => (
  <div style={contentBoxStyle}>
    <h3>Memo Content</h3>
    <p>{content}</p>
  </div>
);

const modalStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const modalContentStyle = {
  backgroundColor: '#2A125A',  // 中紫色背景，匹配主界面
  padding: '20px',
  borderRadius: '10px',
  width: '80%',
  maxWidth: '500px',
  position: 'relative'
};

const closeButtonStyle = {
  position: 'center',
  top: '10px',
  right: '10px'
};

const contentBoxStyle = {
  marginTop: '20px',
  padding: '10px',
  backgroundColor: '#3E1B58',  // 深紫色背景，适配整体色调
  borderRadius: '10px',
  color: '#FFFFFF'
};

export default MemoListModal;
