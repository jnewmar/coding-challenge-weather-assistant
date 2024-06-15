// src/weather-provider-client.ts

import { WeatherInfo } from './models/weather-info';

export interface WeatherProviderClient {
  getWeatherInfo(location: string): Promise<WeatherInfo | undefined>;
}
