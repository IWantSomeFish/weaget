package main

import (
	"context"
	"fmt"
	"sync"
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
	fmt.Println("Current config:", a.cfg)
	fmt.Println("Current Weather:", result)
	wg.Wait()
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
