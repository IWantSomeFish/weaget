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
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Updates current weather information and prints it to the console
func (a *App) UpdateWeather(name string) {
	ch := make(chan internal.CurrentWeather)
	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		result, err := internal.GetCurrentWeather(37.6173, 55.7558)
		if err != nil {
			fmt.Println("Error getting weather:", err)
			return
		}
		ch <- result
	}()
	result := <-ch
	fmt.Println("Current Weather:", result)
	wg.Wait()
}
