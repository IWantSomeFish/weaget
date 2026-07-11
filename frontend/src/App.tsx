import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {UpdateWeather} from "../wailsjs/go/main/App";

function App() {
    const [name, setName] = useState('');
    const updateName = (e: any) => setName(e.target.value);

    function updateWeather() {
        UpdateWeather(name);
    }

    return (
        <div id="App">
            <img src={logo} id="logo" alt="logo"/>
            <div id="input" className="input-box">
                <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/>
                <button className="btn" onClick={updateWeather}>Update Weather</button>
            </div>
        </div>
    )
}

export default App
