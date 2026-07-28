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
	IsDay       int     `json:"is_day"`
	UpdateTime  string  `json:"time"`
	WindSpeed   float64 `json:"wind_speed_10m"`
}

type ReverseResponse struct {
	Address struct {
		City    string `json:"city"`
		Town    string `json:"town"`
		Village string `json:"village"`
		State   string `json:"state"`
		Country string `json:"country"`
	} `json:"address"`
}

func GetCurrentWeather(config Config) (CurrentWeather, error) {
	response, err := http.Get(fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&timezone=GMT&wind_speed_unit=ms&temperature_unit=fahrenheit", config.Latitude, config.Longitude))
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

func GetNameByCords(latitude, longitude float64) (ReverseResponse, error) {
	url := fmt.Sprintf("https://nominatim.openstreetmap.org/reverse?lat=%f&lon=%f&format=jsonv2&zoom=10", latitude, longitude)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return ReverseResponse{}, err
	}
	req.Header.Set("User-Agent", "weaget/1.0")
	req.Header.Set("Accept", "application/json")
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		return ReverseResponse{}, err
	}
	defer response.Body.Close()
	var data ReverseResponse
	err = json.NewDecoder(response.Body).Decode(&data)
	if err != nil {
		return ReverseResponse{}, err
	}
	return data, nil
}
