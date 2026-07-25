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
                <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/>
                <button className="btn" onClick={updateWeather}>Update Weather</button>
            </div>
        </div>
    )
}

export default App
