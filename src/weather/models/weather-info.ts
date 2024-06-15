export interface WeatherInfo {
  weather: string;
  temperature?: number; // in Celsius
  feels_like: number; // in Celsius
  humidity: number; // percentage
  rain1h: number;
  windSpeed: number; // in meters per second
}
