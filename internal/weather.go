package internal

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type WeatherResponse struct {
	Current CurrentWeather `json:"current"`
}

type CurrentWeather struct {
	Temperature float64 `json:"temperature_2m"`
	Humidity    float64 `json:"relative_humidity_2m"`
	WeatherCode int     `json:"weather_code"`
	UpdateTime  string  `json:"time"`
}

func GetCurrentWeather(longitude float64, latitude float64) (CurrentWeather, error) {
	response, err := http.Get(fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current=temperature_2m,relative_humidity_2m,weather_code", latitude, longitude))
	if err != nil {
		return CurrentWeather{}, err
	}
	defer response.Body.Close()
	var weather WeatherResponse
	err = json.NewDecoder(response.Body).Decode(&weather)
	if err != nil {
		return CurrentWeather{}, err
	}
	return weather.Current, nil
}
