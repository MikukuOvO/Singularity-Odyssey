import React, { useEffect, useState } from 'react';
import WordCloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState('');
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    // Fetch calendar events from an API
    fetch('http://127.0.0.1:5000/api/todayevents')
      .then(response => response.json())
      .then(data => {
        setEvents(data);
        // Fetch summary from the API
        fetch('http://127.0.0.1:5000/api/todaysummary')
          .then(response => response.json())
          .then(summaryData => setSummary(summaryData.summary));
      });
  }, []);

  // Extract individual words from the summary
  const words = summary.split(/\s+/).map(word => ({ text: word, value: Math.random() * 100 }));

  const options = {
    rotations: 0,  // No rotation, all words will be horizontal
    rotationAngles: [0, 0],
    fontSizes: [12, 60],
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
  };

  return (
    <div style={{ position: 'relative' }}>
      <h2>Calendar</h2>
      <div className="toggle-button-container">
        <button
          onClick={() => setShowMore(!showMore)}
          className="toggle-button"
        >
          {showMore ? '收起' : '显示更多'}
        </button>
      </div>
      <ul>
        {events.slice(0, showMore ? events.length : 2).map((event, index) => (
          <li key={index}>
            <h3>{event.title}</h3>
            地点：{event.destination}
            <br />
            时间：{new Date(event.start).toLocaleTimeString()} ~ {new Date(event.end).toLocaleTimeString()}
          </li>
        ))}
      </ul>
      <h3>今日摘要</h3>
      {summary && (
        <div className="wordcloud-container">
          <WordCloud words={words} options={options} />
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
