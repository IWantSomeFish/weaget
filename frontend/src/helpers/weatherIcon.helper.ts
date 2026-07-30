import {
    clearDay,
    clearNight,
    cloudyDay,
    cloudyNight,
    fogDay,
    fogNight,
    drizzleDay,
    drizzleNight,
    rainDay,
    rainNight,
    snowDay,
    snowNight,
    thunderstormDay,
    thunderstormNight,
    freezingRainDay,
    freezingRainNight,
    grainDay,
    grainNight,
    overcastDay,
    overcastNight,
    rimeDay,
    rimeNight,
    showerRainDay,
    showerRainNight,
    snowShowerDay,
    snowShowerNight,
} from "./icons.imports";

export function getWeatherIcon(weatherCode: number, isDay: boolean): string {
    switch (weatherCode) {
        case 0:
            return isDay ? clearDay : clearNight;
        case 1:
        case 2:
            return isDay ? cloudyDay : cloudyNight;
        case 3:
            return isDay ? overcastDay : overcastNight;
        case 45:
            return isDay ? fogDay : fogNight;
        case 48:
            return isDay ? rimeDay : rimeNight;
        case 51:
        case 53:
        case 55:
            return isDay ? drizzleDay : drizzleNight;
        case 61:
        case 63:
        case 65:
            return isDay ? rainDay : rainNight;
        case 66:
        case 67:
            return isDay ? freezingRainDay : freezingRainNight;
        case 71:
        case 73:
        case 75:
            return isDay ? snowDay : snowNight;
        case 77:
            return isDay ? grainDay : grainNight;
        case 80:
        case 81:
        case 82:
            return isDay ? showerRainDay : showerRainNight;
        case 85:
        case 86:
            return isDay ? snowShowerDay : snowShowerNight;
        case 95:
        case 96:
        case 99:
            return isDay ? thunderstormDay : thunderstormNight;
        default:
            return isDay ? clearDay : clearNight;
    }
}