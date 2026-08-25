import {useEffect, useState} from 'react';
import menu from './assets/images/menu.svg';
import './App.css';
import {UpdateConfig, UpdateWeather} from "../wailsjs/go/main/App";
import { internal } from '../wailsjs/go/models';
import { getWeatherIcon } from './helpers/weatherIcon.helper';
import './helpers/weatherIcons.css';

function App() {

    async function fetchWeather() {
        const weather: internal.CurrentWeather = await UpdateWeather();
        setWeather(weather);
    }

    async function fetchConfig() {
        const config: internal.Config = await UpdateConfig();
        setConfig(config);
    }

    async function saveConfig() {
        fetchConfig()
    }
    const [weather, setWeather] = useState<internal.CurrentWeather>(new internal.CurrentWeather);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [tempratureUnit, setTempUnit] = useState<boolean>(false);
    const [WeatherIcon, setWeatherIcon] = useState<string>('');
    const [config, setConfig] = useState<internal.Config>(new internal.Config);

    useEffect(() => { 
        async function initialize() {
            fetchConfig();
            fetchWeather();
        }
        initialize();
    }, []);
    
    useEffect(() => {
        if (weather) {
            const icon = getWeatherIcon(weather.weather_code, Boolean(weather.is_day));
            setWeatherIcon(icon);
            setTempUnit(config?.temperature_unit ?? false);
        }
    }, [weather]);

    function toggleSidebar() {
        setSidebarOpen(!sidebarOpen);
    }

    function updateWeather() {
        fetchWeather();
        if (weather) setWeatherIcon(getWeatherIcon(weather.weather_code, Boolean(weather.is_day)));
    }

    return (
        <div id="app" className="app">
            <div id="sidebar" className="sidebar">
                <div className="column">
                    <button onClick={toggleSidebar} className="btn">
                        <img src={menu} style={{height: '30px'}}/>
                    </button>
                </div>
                <div id="sidebar-menu" className={`sidebar-menu ${sidebarOpen ? 'open' : ''}`}>
                    <div className='content'>
                        <text>Settings</text>
                        <text>Latitude</text>
                        <input id="latitude" className="input" defaultValue={config.latitude}></input>
                        <text>Longitude</text>
                        <input id="longitude" defaultValue={config.longitude}></input>
                        <button onClick={saveConfig}>Save settings</button>
                    </div>
                </div>
                <div className={`overlay ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
            </div>
            <div id="input" className="input-box">
                    <div>
                        <div
                            role="img"
                            aria-label="Weather icon"
                            className={`weather-icon weather-icon--code-${weather.weather_code} ${weather.is_day ? 'is-day' : 'is-night'}`}
                            dangerouslySetInnerHTML={{__html: WeatherIcon}}
                        />
                        <p>Weather in {config.name || '...'}</p>
                        <p>Humidity: {weather.relative_humidity_2m}%</p>
                        <p>Temperature: {weather.temperature_2m} {tempratureUnit ? '°F' : '°C'}</p>
                    </div>
                <button className="btn" onClick={updateWeather}>Update Weather</button>
            </div>
        </div>
    )
}

export default App
