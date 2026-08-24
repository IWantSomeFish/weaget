import {useEffect, useState} from 'react';
import menu from './assets/images/menu.svg';
import './App.css';
import {GetLocationName, UpdateConfig, UpdateWeather} from "../wailsjs/go/main/App";
import { internal } from '../wailsjs/go/models';
import { getWeatherIcon } from './helpers/weatherIcon.helper';

function App() {

    async function fetchWeather() {
        const weather: internal.CurrentWeather = await UpdateWeather();
        setWeather(weather);
    }
    
    async function getNameByCords(): Promise<string> {
        // In browser environment, read config from public/config.json via HTTP
        const result: string = await GetLocationName();
        setCityName(result);
        return result;
    }

    async function fetchConfig() {
        const config: internal.Config = await UpdateConfig();
        setConfig(config);
    }

    async function saveConfig() {
        fetchConfig()
    }
    const [weather, setWeather] = useState<internal.CurrentWeather | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cityName, setCityName] = useState<string>('');
    const [tempratureUnit, setTempUnit] = useState<boolean>(false);
    const [WeatherIcon, setWeatherIcon] = useState<string>('');
    const [config, setConfig] = useState<internal.Config | null>(null);

    useEffect(() => { 
        async function initialize() {
            fetchConfig();
            fetchWeather();
            getNameByCords().then(name => setCityName(name)).catch(() => setCityName(''))
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
        getNameByCords();
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
                        <h3>Settings</h3>
                        <input></input>
                        <button onClick={saveConfig}>Save settings</button>
                    </div>
                </div>
                <div className={`overlay ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
            </div>
            <div id="input" className="input-box">
                {weather && (
                    <div>
                        <img src={WeatherIcon} alt="Weather Icon" style={{width: '120px', height: '100px'}}/>
                        <p>Weather in {cityName || '...'}</p>
                        <p>Humidity: {weather.relative_humidity_2m}%</p>
                        <p>Temperature: {weather.temperature_2m} {tempratureUnit ? '°F' : '°C'}</p>
                    </div>
                )}
                <button className="btn" onClick={updateWeather}>Update Weather</button>
            </div>
        </div>
    )
}

export default App
