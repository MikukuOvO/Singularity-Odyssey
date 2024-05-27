import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Calendar from './views/Calendar';
// import Assistant from './views/Assistant';
// import Memo from './views/Memo';
// import Astronomy from './views/Astronomy';
import FeatureButton from './components/FeatureButton';
import Astronaut from './components/Astronaut';
import Calendar from './components/Calendar';
import './App.css';
import Assistant from './components/Assistant';
import Memo from './components/Memo';
import Weather from './components/Weather';
import Clock from './components/Clock';

function App() {
    return (
        <Router>
            <div className="App">
                <Astronaut />
                <Calendar />
                <Assistant />
                <Memo />
                <Weather />
                <Clock />
            </div>
        </Router>
    );
}

export default App;
