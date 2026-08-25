package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "weaget",
		Width:     512,
		Height:    384,
		Frameless: true,

		MinWidth:  512,
		MinHeight: 384,

		MaxWidth:  512,
		MaxHeight: 384,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: app.startup,
		Bind: []interface{}{
			app,
		},
		Windows: &windows.Options{
			WebviewIsTransparent: true,
		},
		BackgroundColour: &options.RGBA{
			R: 0,
			G: 0,
			B: 0,
			A: 0,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
