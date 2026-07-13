import {useState} from 'react';
import menu from './assets/images/menu.svg';
import './App.css';
import {UpdateWeather} from "../wailsjs/go/main/App";

function App() {
    const [name, setName] = useState('');
    const updateName = (e: any) => setName(e.target.value);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    function updateWeather() {
        UpdateWeather(name);
    }

    function toggleSidebar() {
        console.log("toggling sidebar");
        setSidebarOpen(!sidebarOpen);
    }

    return (
        <div id="app" className="app">
            <div style={{ width: '40px', backgroundColor: 'rgba(194, 172, 255, 0.25)', flexDirection: 'column', display: 'flex', padding: '10px'}}>
                <button onClick={toggleSidebar} style={{backgroundColor: 'transparent', padding: '0px', cursor: 'pointer'}}>
                    <img src={menu} style={{height: '30px'}}/>
                </button>
            </div>
            <div id="sidebar" className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ backgroundColor: 'rgba(231, 229, 236, 0.7)', transition: 'width 0.3s', overflow: 'hidden'}}>
                <div style={{padding: '10px'}}>
                    <h2>Sidebar</h2>
                    <p>This is the sidebar content.</p>
                </div>
            </div>
            <div id="input" className="input-box">
                <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/>
                <button className="btn" onClick={updateWeather}>Update Weather</button>
            </div>
        </div>
    )
}

export default App
