import {useEffect, useState} from 'react';
import menu from './assets/images/menu.svg';
import './App.css';
import {SaveConfig, UpdateConfig, UpdateWeather} from "../wailsjs/go/main/App";
import { internal } from '../wailsjs/go/models';
import { getWeatherIcon } from './helpers/weatherIcon.helper';
import './helpers/weatherIcons.css';
import { Quit, WindowMinimise } from '../wailsjs/runtime/runtime';

function App() {

    async function fetchWeather() {
        const weather: internal.CurrentWeather = await UpdateWeather();
        setWeather(weather);
    }

    async function fetchConfig() {
        const config: internal.Config = await UpdateConfig();
        setConfig(config);
        setDraftConfig(config);
    }

    async function saveConfig() {
        const {latitude, longitude} = draftConfig;
        if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
            setConfigError('Latitude must be between -90 and 90.');
            return;
        }
        if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
            setConfigError('Longitude must be between -180 and 180.');
            return;
        }

        setConfigError('');
        const savedConfig = await SaveConfig(draftConfig);
        setConfig(savedConfig);
        setDraftConfig(savedConfig);
        setTempUnit(savedConfig.temperature_unit);
        await fetchWeather();
        await fetchConfig();
        setSidebarOpen(false);
    }
    const [weather, setWeather] = useState<internal.CurrentWeather>(new internal.CurrentWeather);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [windowPinned, setWindowPinned] = useState(false);
    const [tempratureUnit, setTempUnit] = useState<boolean>(false);
    const [WeatherIcon, setWeatherIcon] = useState<string>('');
    const [config, setConfig] = useState<internal.Config>(new internal.Config);
    const [draftConfig, setDraftConfig] = useState<internal.Config>(new internal.Config);
    const [configError, setConfigError] = useState('');

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

    function toggleWindowPinned() {
        setWindowPinned(!windowPinned);
    }

    function updateWeather() {
        fetchWeather();
        if (weather) setWeatherIcon(getWeatherIcon(weather.weather_code, Boolean(weather.is_day)));
    }

    return (
        <div id="app" className="app">
            <header className={`titlebar ${windowPinned ? 'titlebar--pinned' : ''}`}>
                <span className="titlebar__name">Weaget</span>
                <div className="titlebar__actions">
                    <button className="titlebar__update" type="button" onClick={updateWeather}>Update</button>
                    <div className="titlebar__controls">
                    <button
                        className={`titlebar__button titlebar__pin ${windowPinned ? 'titlebar__pin--active' : ''}`}
                        type="button"
                        onClick={toggleWindowPinned}
                        aria-label={windowPinned ? 'Unpin window' : 'Pin window'}
                        aria-pressed={windowPinned}
                        title={windowPinned ? 'Unpin window' : 'Pin window'}
                    >
                        📌
                    </button>
                    <button className="titlebar__button" type="button" onClick={WindowMinimise} aria-label="Minimise window">−</button>
                    <button className="titlebar__button titlebar__button--close" type="button" onClick={Quit} aria-label="Close window">×</button>
                    </div>
                </div>
            </header>
            <div id="sidebar" className="sidebar">
                <div className="column">
                    <button onClick={toggleSidebar} className="btn">
                        <img src={menu} style={{height: '30px'}}/>
                    </button>
                </div>
                <div id="sidebar-menu" className={`sidebar-menu ${sidebarOpen ? 'open' : ''}`}>
                    <form className="content" onSubmit={(event) => { event.preventDefault(); saveConfig(); }}>
                        <h2 style={{paddingTop:5}}>Settings</h2>

                        <label htmlFor="temperature-unit">Temperature</label>
                        <select
                            id="temperature-unit"
                            className="input"
                            value={draftConfig.temperature_unit ? 'fahrenheit' : 'celsius'}
                            onChange={(event) => setDraftConfig({...draftConfig, temperature_unit: event.target.value === 'fahrenheit'})}
                        >
                            <option value="celsius">Celsius (°C)</option>
                            <option value="fahrenheit">Fahrenheit (°F)</option>
                        </select>

                        <label htmlFor="speed-unit">Wind speed</label>
                        <select
                            id="speed-unit"
                            className="input"
                            value={draftConfig.speed_unit || 'ms'}
                            onChange={(event) => setDraftConfig({...draftConfig, speed_unit: event.target.value})}
                        >
                            <option value="ms">Metres per second (m/s)</option>
                            <option value="kmh">Kilometres per hour (km/h)</option>
                            <option value="mph">Miles per hour (mph)</option>
                        </select>

                        <label htmlFor="latitude">Latitude</label>
                        <input
                            id="latitude"
                            className="input"
                            type="number"
                            min="-90"
                            max="90"
                            step="any"
                            value={Number.isFinite(draftConfig.latitude) ? draftConfig.latitude : ''}
                            onChange={(event) => setDraftConfig({...draftConfig, latitude: event.currentTarget.valueAsNumber})}
                            required
                        />

                        <label htmlFor="longitude">Longitude</label>
                        <input
                            id="longitude"
                            className="input"
                            type="number"
                            min="-180"
                            max="180"
                            step="any"
                            value={Number.isFinite(draftConfig.longitude) ? draftConfig.longitude : ''}
                            onChange={(event) => setDraftConfig({...draftConfig, longitude: event.currentTarget.valueAsNumber})}
                            required
                        />
                        {configError && <p className="config-error" role="alert">{configError}</p>}
                        <button className="btn" type="submit">Save settings</button>
                    </form>
                </div>
                <div className={`overlay ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
            </div>
            <div id="input" className="input-box">
                    <div className="weather-card">
                        <div className="weather-card__overview">
                            <div className="weather-card__temperature-card">
                                <p className="weather-card__location">Weather in {config.name || '...'}</p>
                                <p className="weather-card__temperature">
                                {weather.temperature_2m}<span>{tempratureUnit ? '°F' : '°C'}</span>
                            </p>
                            <div
                                role="img"
                                aria-label="Weather icon"
                                className={`weather-icon weather-icon--code-${weather.weather_code} ${weather.is_day ? 'is-day' : 'is-night'}`}
                                dangerouslySetInnerHTML={{__html: WeatherIcon}}
                            />
                            </div>
                            <div className="weather-card__details">
                                <p><span>Wind</span><strong>{weather.wind_speed_10m} {config.speed_unit || 'm/s'}</strong></p>
                                <p><span>Humidity</span><strong>{weather.relative_humidity_2m}%</strong></p>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default App
