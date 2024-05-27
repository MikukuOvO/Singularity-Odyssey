// src/components/Astronaut.js
import React from 'react';
import { Link } from 'react-router-dom';

function Memo() {
    return (
        <Link to="http://localhost:3001/memo">
            <div className="memo">
                <img src="/assets/Memo.png" alt="Memo" />
                <p color='white'>Memo</p>
            </div>
        </Link>
    );
}

export default Memo;
