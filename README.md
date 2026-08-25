## Weather Widget

A small desktop weather widget. Displays the current weather in a compact interface and automatically updates the data every 5 minutes.

<img width="509" height="378" alt="image" src="https://github.com/user-attachments/assets/a7c09d60-fa88-41e4-9b23-372bcdc0a817" />

Features
- 🌤️ Displaying the current weather.
- 🌡️ Temperature and main weather parameters.
- 📍 Getting the weather for a given geolocation.
- 🔄 Automatic data update every 5 minutes.
- ⚙️ Configuring the app via a configuration file.
- 🖥️ Compact desktop interface.
- 📌 The ability to pin a widget to the desktop.
### Technologies

The application is written in:

- Go — backend and working with system functions.
- Wails — connecting Go with frontend and creating a desktop application.
- React + TypeScript — user interface.
- Open-Meteo API — retrieving weather data.
- Nominatim - reverse geolocation to city name.
Customization

After the first launch, the application creates a configuration file automatically.

In the configuration, you can change the main parameters of the application, for example, the geolocation for obtaining the forecast and other widget settings.

<img width="509" height="378" alt="image" src="https://github.com/user-attachments/assets/f8ae8a39-8f4c-4a36-b814-4322478fe89d" />

Example:
```json
{
    "latitude": 52.37,
    "longitude": 4.90
}
```

After changing the configuration, restart the application if the modified parameter is not applied automatically.

Weather update

When the application is launched, it immediately receives up‑to‑date weather data.

After that, the backend automatically makes a new request every 5 minutes and transmits the updated data to the frontend via Wails events.

### Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

### Building

To build a redistributable, production mode package, use `wails build`.
