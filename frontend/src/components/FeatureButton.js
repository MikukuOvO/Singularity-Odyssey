import React from 'react';
import { Link } from 'react-router-dom';

function FeatureButton({ name, icon, to }) {
    return (
        <Link to={to} className="feature-button">
            <img src={icon} alt={`${name} icon`} />
            <p>{name}</p>
        </Link>
    );
}

export default FeatureButton;
