import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Clock from './Clock'; // 导入时钟组件
import '../App.css';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = 22.3092607; // 武汉的纬度
        const lon = 113.9304907; // 武汉的经度
        const api_key = '6d840c50b91ce3c2f717bbf6457be2a0'; // 您的 OpenWeatherMap API 密钥
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
        const response = await axios.get(url);
        setWeatherData(response.data);
        setError(null);
      } catch (error) {
        setWeatherData(null);
        setError('Unable to fetch weather data');
      }
    };

    fetchWeather();
  }, []);

  const renderWeather = () => {
    if (error) {
      return <div className="error">{error}</div>;
    }

    if (!weatherData) {
      return <div className="loading">Loading...</div>;
    }

    const { main, wind } = weatherData;
    return (
      <div className="weather-container">
        {/* 使用自定义图标 */}
        <img className="icon" src={`http://openweathermap.org/img/wn/02d@2x.png`} alt="Weather icon" />
        <div className="temperature">Temperature: {main.temp.toFixed(1)}°C</div>
        {/* <div className="description">Weather: {weather[0].description}</div> */}
        <div className="wind">Wind: {wind.speed.toFixed(0)} m/s</div>
        <div className="humidity">Humidity: {main.humidity}%</div>
      </div>
    );
  };

  return (
    <div>
      <div className="weather-wrapper">
        {renderWeather()}
      </div>
      {/* <div className="clock-wrapper">
        <Clock /> 
      </div> */}
    </div>
  );
};

export default Weather;
