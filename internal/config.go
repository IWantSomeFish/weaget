package internal

import (
	"encoding/json"
	"os"
)

type Config struct {
	Name             string  `json:"name"`
	Latitude         float64 `json:"latitude"`
	Longitude        float64 `json:"longitude"`
	Speed_unit       string  `json:"speed_unit"`
	Temperature_unit bool    `json:"temperature_unit"`
}

func LoadConfig() (Config, error) {
	if _, err := os.Stat("config.json"); os.IsNotExist(err) {
		name, _ := GetNameByCords(51.50, -0.12)
		defaultConfig := Config{
			Name:             name.Address.City,
			Latitude:         51.50,
			Longitude:        -0.12,
			Speed_unit:       "ms",
			Temperature_unit: true,
		}
		SaveConfig(defaultConfig)
		return defaultConfig, nil
	}

	file, err := os.ReadFile("config.json")
	if err != nil {
		return Config{}, err
	}

	var cfg Config
	err = json.Unmarshal(file, &cfg)
	if err != nil {
		return Config{}, err
	}

	return cfg, nil
}

func SaveConfig(cfg Config) error {
	file, err := os.Create("config.json")
	if err != nil {
		return err
	}
	defer file.Close()
	bytes, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return err
	}
	_, err = file.Write(bytes)
	if err != nil {
		return err
	}
	return nil
}
