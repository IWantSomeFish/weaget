package main

import (
	"context"
	"fmt"
	"sync"
	"time"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"weaget/internal"
)

// App struct
type App struct {
	ctx context.Context
	cfg internal.Config
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.cfg, _ = internal.LoadConfig()

	go a.weatherLoop()
}

func (a *App) weatherLoop() {
	ticker := time.NewTicker(1 * time.Minute)

	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			a.UpdateWeather()

		case <-a.ctx.Done():
			return
		}
	}
}

// Updates current weather information and prints it to the console
func (a *App) UpdateWeather() internal.CurrentWeather {
	ch := make(chan internal.CurrentWeather)
	var wg sync.WaitGroup
	wg.Add(1)

	go func() {
		defer wg.Done()
		result, err := internal.GetCurrentWeather(a.cfg)
		if err != nil {
			fmt.Println("Error getting weather:", err)
			return
		}
		ch <- result
	}()

	result := <-ch
	wg.Wait()
	runtime.EventsEmit(a.ctx, "weatherUpdated", result)
	return result
}
func (a *App) GetLocationName() string {
	data, err := internal.GetNameByCords(a.cfg.Latitude, a.cfg.Longitude)
	if err != nil {
		fmt.Println("Error getting location name:", err)
		return ""
	}
	a.cfg.Name = data.Address.City
	return data.Address.City
}

func (a *App) UpdateConfig() internal.Config {
	a.cfg, _ = internal.LoadConfig()
	return a.cfg
}

// SaveConfig persists settings supplied by the frontend and applies them to
// subsequent weather requests.
func (a *App) SaveConfig(cfg internal.Config) (internal.Config, error) {
	location, err := internal.GetNameByCords(cfg.Latitude, cfg.Longitude)
	if err == nil {
		switch {
		case location.Address.City != "":
			cfg.Name = location.Address.City
		case location.Address.Town != "":
			cfg.Name = location.Address.Town
		case location.Address.Village != "":
			cfg.Name = location.Address.Village
		case location.Address.State != "":
			cfg.Name = location.Address.State
		}
	}

	if err := internal.SaveConfig(cfg); err != nil {
		return internal.Config{}, err
	}
	a.cfg = cfg
	return cfg, nil
}
