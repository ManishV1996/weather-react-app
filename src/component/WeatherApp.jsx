import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../component/WeatherApp.css';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [isCelsius, setIsCelsius] = useState(true);

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = async () => {
    const apiKey = 'bfbb42d6527f56d842d5277bf65bda99';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const getBackgroundClass = () => {
    if (weatherData) {
      const weatherCode = weatherData.weather[0].id;
      if (weatherCode >= 200 && weatherCode < 600) {
        return 'rainy';
      } else if (weatherCode >= 600 && weatherCode < 700) {
        return 'snowy';
      } else if (weatherCode >= 700 && weatherCode < 800) {
        return 'foggy';
      } else if (weatherCode === 800) {
        return 'sunny';
      } else {
        return 'cloudy';
      }
    }
    return '';
  };

  const getTemperature = () => {
    if (weatherData) {
      const temperature = isCelsius
        ? Math.round(weatherData.main.temp - 273.15) // Convert from Kelvin to Celsius
        : Math.round((weatherData.main.temp - 273.15) * 9 / 5 + 32); // Convert from Kelvin to Fahrenheit

      const unit = isCelsius ? '°C' : '°F';
      return `${temperature} ${unit}`;
    }
    return '';
  };

  const updateCurrentDate = () => {
    const date = new Date();
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    const formattedDate = date.toLocaleString('en-US', options);
    setCurrentDate(formattedDate);
  };

  useEffect(() => {
    // Function to handle geolocation success
    const handleGeolocationSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      getCityFromCoordinates(latitude, longitude);
    };

    // Function to handle geolocation error
    const handleGeolocationError = (error) => {
      console.error('Error getting geolocation:', error);
    };

    // Get the user's geolocation
    const getUserGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError);
      }
    };

    // Function to get city name from coordinates
    const getCityFromCoordinates = async (latitude, longitude) => {
      const apiKey = 'bfbb42d6527f56d842d5277bf65bda99';
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setCity(data.name);
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Update the current date immediately and then refresh every second
    updateCurrentDate();
    setInterval(updateCurrentDate, 1000);

    // Get the user's geolocation when the component mounts
    getUserGeolocation();
  }, []);

  const handleUnitToggle = () => {
    setIsCelsius(!isCelsius);
  };

  return (
    <div className={`weather-app ${getBackgroundClass()}`}>
      <div className="overlay">
        <div className="container">
          <form className="section section__inputs form-group ">
            <input
              type="text"
              className="form-control py-3"
              placeholder="Enter city name"
              value={city}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <Button className="py-3" onClick={handleSearch} block>
              Search
            </Button>
          </form>
          <br />
          <br />
          <br />
          {weatherData && (
            <div>
              <div className="section section__temperature">
                <div className="icon">
                  <h2>{`${weatherData.name}, ${weatherData.sys.country}`}</h2>
                  <img
                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                    alt="weathericon"
                  />
                  <h3>{weatherData.weather[0].description}</h3>
                </div>
                <div className="temperature">
                  <h2>Temperature: {getTemperature()}</h2>
                  <Form.Check
                    type="switch"
                    id="temperature-switch"
                    label={isCelsius ? 'Celsius' : 'Fahrenheit'}
                    checked={isCelsius}
                    onChange={handleUnitToggle}
                  />
                </div>
              </div>
              <div className="section section__descriptions">
                <div className="cards">
                  <h4>Min Temp: {Math.round(weatherData.main.temp_min - 273.15)} °C</h4>
                </div>
                <div className="cards">
                  <h4>Max Temp: {Math.round(weatherData.main.temp_max - 273.15)} °C</h4>
                </div>
                <div className="cards">
                  <h4>Wind: {weatherData.wind.speed} m/s</h4>
                </div>
                <div className="cards">
                  <h4>Humidity: {weatherData.main.humidity}%</h4>
                </div>
              </div>
            </div>
          )}
          <br />
          <br />
          <br />
          <footer className="footer">
            <p>{currentDate}</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
