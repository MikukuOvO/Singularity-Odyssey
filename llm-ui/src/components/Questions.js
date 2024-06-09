import React, { useState, useEffect } from 'react';
import '../Questions.css'; // 确保引入了样式文件

const Questions = ({ handlePredict }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate_questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleQuestionClick = (question) => {
    handlePredict(question);
  };

  return (
    <div className="questions-container">
      <h3>Ask me anything...</h3>
      <ul>
        {questions.map((question, index) => (
          <li key={index} className="question" onClick={() => handleQuestionClick(question)}>
            {question}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Questions;
