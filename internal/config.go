package internal

import (
	"encoding/json"
	"os"
)

type Config struct {
	latitude         float64
	longitude        float64
	speed_unit       string
	temperature_unit string
}

func LoadConfig() (Config, error) {
	file, err := os.Open("config.json")
	if err != nil {
		return Config{}, err
	}
	defer file.Close()

	var cfg Config
	err = json.NewDecoder(file).Decode(&cfg)
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
	err = json.NewEncoder(file).Encode(cfg)
	if err != nil {
		return err
	}
	return nil
}
