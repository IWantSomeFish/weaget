import {useEffect, useState} from 'react';
import menu from './assets/images/menu.svg';
import './App.css';
import {GetLocationName, UpdateWeather} from "../wailsjs/go/main/App";
import { internal } from '../wailsjs/go/models';

function App() {

    async function fetchWeather() {
        const result: internal.CurrentWeather = await UpdateWeather();
        setWeather(result);
    }
    
    async function getNameByCords(): Promise<string> {
        // In browser environment, read config from public/config.json via HTTP
        const result: string = await GetLocationName();
        setCityName(result);
        return result;
    }
    useEffect(() => { fetchWeather();}, []);
    
    const [weather, setWeather] = useState<internal.CurrentWeather | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cityName, setCityName] = useState<string>('');


    function toggleSidebar() {
        console.log("toggling sidebar");
        setSidebarOpen(!sidebarOpen);
    }

    useEffect(() => {
        // load city name asynchronously
        getNameByCords().then(name => setCityName(name)).catch(() => setCityName(''));
    }, []);

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
                        <p>Weather in {cityName || '...'}</p>
                        <p>Humidity: {weather.relative_humidity_2m}%</p>
                        <p>Temperature: {weather.temperature_2m}°C</p>
                    </div>
                )}
                <button className="btn" onClick={fetchWeather}>Update Weather</button>
            </div>
        </div>
    )
}

export default App
