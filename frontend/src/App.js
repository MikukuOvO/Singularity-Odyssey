import React, { useEffect } from 'react';
import './style/App.css';
import stars from './images/stars.png';
import moon from './images/moon.png';
import astronomer from './images/astronomer.png'
import mountainsBehind from './images/mountains_behind.png';
import mountainsFront from './images/mountains_front.png';


const App = () => {
  useEffect(() => {
    const handleScroll = () => {
      let value = window.scrollY;
      document.getElementById('stars').style.left = value * 0.25 + 'px';
      document.getElementById('moon').style.top = value * 1.05 + 'px';
      document.getElementById('mountains_behind').style.top = value * 0.5 + 'px';
      document.getElementById('mountains_front').style.top = value * 0 + 'px';
      document.getElementById('text').style.marginRight = value * 4 + 'px';
      document.getElementById('text').style.marginTop = value * 0.8 + 'px';
      document.getElementById('btn').style.marginTop = value * 1.8 + 'px';
      document.querySelector('header').style.top = value * 0.5 + 'px';
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <header>
        <a href="#" className="logo">Singularity Odyssey</a>
        <ul>
          <li><a href="#" className="active">Home</a></li>
          <li><a href="http://localhost:3002/calendar/">Calendar</a></li>
          <li><a href="http://localhost:3003/llm">Assistant</a></li>
          <li><a href="http://localhost:3001/memo">Memo</a></li>
        </ul>
      </header>
      <section>
        <img src={stars} id="stars" alt="stars" />
        <img src={moon} id="moon" alt="moon" />
        <img src={mountainsBehind} id="mountains_behind" alt="mountains behind" />
        <h2 id="text"><img src={astronomer} alt="Moon Light" style={{ width: '200px', height: '200px' }} /></h2>
        <a href="#sec" id="btn">Explore</a>
        <img src={mountainsFront} id="mountains_front" alt="mountains front" />
      </section>
      <div className="sec" id="sec">
        <h2>About Singularity Odyssey</h2>
        <p>
        The project "Singularity Odyssey" is an integrated application that combines calendar, natural language processing, 
        <br></br>intelligent route planning, and personal memo functionalities.
        <br></br>
        <br></br>
        Inspired by astronomical phenomena and literary philosophical concepts, it aims to enhance the quality of life for users, 
        <br></br>promoting personal growth and social connection through the power of technology.
      </p>
      </div>
    </div>
  );
};

export default App;
