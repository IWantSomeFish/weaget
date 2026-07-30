import {useEffect, useState} from 'react';
import menu from './assets/images/menu.svg';
import './App.css';
import {GetLocationName, GetTemperatureUnit, UpdateWeather} from "../wailsjs/go/main/App";
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

    async function fetchTemperatureUnit() {
        const unit: boolean = await GetTemperatureUnit();
        setTemperatureUnit(unit);
    }
    const [weather, setWeather] = useState<internal.CurrentWeather | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cityName, setCityName] = useState<string>('');
    const [WeatherIcon, setWeatherIcon] = useState<string>('');
    const [temperatureUnit, setTemperatureUnit] = useState<boolean>(false);

    useEffect(() => { fetchWeather();}, []);
    useEffect(() => {getNameByCords().then(name => setCityName(name)).catch(() => setCityName(''))}, []);
    useEffect(() => {
        if (weather) {
            const icon = getWeatherIcon(weather.weather_code, Boolean(weather.is_day));
            setWeatherIcon(icon);
        }
    }, [weather]);
    useEffect(() => {fetchTemperatureUnit();}, [weather]);

    function toggleSidebar() {
        console.log("toggling sidebar");
        setSidebarOpen(!sidebarOpen);
    }

    function updateWeather() {
        fetchWeather();
        fetchTemperatureUnit();
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
                    <div style={{padding: '10px'}}>
                        <h2>Sidebar</h2>
                        <p>This is the sidebar content.</p>
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
                        <p>Temperature: {weather.temperature_2m} {temperatureUnit ? '°F' : '°C'}</p>
                    </div>
                )}
                <button className="btn" onClick={updateWeather}>Update Weather</button>
            </div>
        </div>
    )
}

export default App
