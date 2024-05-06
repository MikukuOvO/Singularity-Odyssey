// src/components/MarkdownEditorComponent.js
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MarkdownEditorComponent() {
  const [markdown, setMarkdown] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <div style={{ flex: 1, padding: '10px', borderRight: '5px solid #d4af37' }}>
        <h2>Memo</h2>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          rows="10"
          style={{ width: '95%', height: '90%', resize: 'none' }}
        />
      </div>
      <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        <h2>View</h2>
        <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
      </div>
    </div>
  );
}

export default MarkdownEditorComponent;