// src/components/Astronaut.js
import React from 'react';
import { Link } from 'react-router-dom';

function Calendar() {
    return (
        <Link to="http://localhost:5173/calendar/">
            <div className="calendar">
                <img src="/assets/Calendar.png" alt="Calendar" />
                <p color='white'>Calendar</p>
            </div>
        </Link>
    );
}

export default Calendar;
