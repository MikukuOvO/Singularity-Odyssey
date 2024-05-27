// src/components/Astronaut.js
import React from 'react';
import { Link } from 'react-router-dom';

function Astronaut() {
    return (
        <Link to="/astronomy">
            <div className="astronaut">
                <img src="/assets/Astronomy.png" alt="Astronomy" />
            </div>
        </Link>
    );
}

export default Astronaut;
