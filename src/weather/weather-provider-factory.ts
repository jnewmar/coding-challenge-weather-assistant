import { WeatherProviderClient } from './weather-provider-client-interface';
import { OpenWeatherClient } from './openweather-client';

export enum WeatherProviderType {
  OPEN_WEATHER = 'openweather',
}

export class WeatherProviderFactory {
  static getWeatherProvider(
    provider: WeatherProviderType,
  ): WeatherProviderClient {
    switch (provider) {
      case WeatherProviderType.OPEN_WEATHER:
        return new OpenWeatherClient();
      default:
        throw new Error(`Unsupported weather provider: ${provider}`);
    }
  }
}
