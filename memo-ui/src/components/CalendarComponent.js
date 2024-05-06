import React, { useEffect, useState } from 'react';

function CalendarComponent() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url = `http://127.0.0.1:5000/api/todayevents`;  // 使用环境变量中的 API URL
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
      <div>
        <h2>Do List</h2>
        <ul>
          {events.map((event) => (
              <li key={event.id}>
                <strong>{event.title}</strong> - {event.destination}<br/>
                Start: {new Date(event.start).toLocaleString()}<br/>
                End: {new Date(event.end).toLocaleString()}
              </li>
          ))}
        </ul>
      </div>
  );
}

export default CalendarComponent;
