export namespace internal {
	
	export class Config {
	    name: string;
	    latitude: number;
	    longitude: number;
	    speed_unit: string;
	    temperature_unit: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.latitude = source["latitude"];
	        this.longitude = source["longitude"];
	        this.speed_unit = source["speed_unit"];
	        this.temperature_unit = source["temperature_unit"];
	    }
	}
	export class CurrentWeather {
	    temperature_2m: number;
	    relative_humidity_2m: number;
	    weather_code: number;
	    is_day: number;
	    time: string;
	    wind_speed_10m: number;
	
	    static createFrom(source: any = {}) {
	        return new CurrentWeather(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.temperature_2m = source["temperature_2m"];
	        this.relative_humidity_2m = source["relative_humidity_2m"];
	        this.weather_code = source["weather_code"];
	        this.is_day = source["is_day"];
	        this.time = source["time"];
	        this.wind_speed_10m = source["wind_speed_10m"];
	    }
	}

}

