import React, { useEffect, useState } from 'react';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch calendar events from an API
    fetch('http://192.168.0.136:3000/api/calendar')
      .then(response => response.json())
      .then(data => setEvents(data));
  }, []);

  return (
    <div>
      <h2>Calendar</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <strong>{event.date}</strong>: {event.event}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarComponent;
