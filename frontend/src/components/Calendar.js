// src/components/Astronaut.js
import React from 'react';
import { Link } from 'react-router-dom';

function Calendar() {
    return (
        <Link to="http://192.168.0.136:3002/calendar/">
            <div className="calendar">
                <img src="/assets/Calendar.png" alt="Calendar" />
                <p color='white'>Calendar</p>
            </div>
        </Link>
    );
}

export default Calendar;
