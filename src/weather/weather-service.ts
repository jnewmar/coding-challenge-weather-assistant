import { WeatherInfo } from './models/weather-info';
import { WeatherProviderClient } from './weather-provider-client-interface';
import {
  WeatherProviderFactory,
  WeatherProviderType,
} from './weather-provider-factory';
import { weatherServiceConfig } from './weatherServiceConfig';

export class WeatherService {
  private weatherProvider: WeatherProviderClient;

  constructor() {
    const providerType = process.env
      .WEATHER_PROVIDER_TYPE as WeatherProviderType;
    this.weatherProvider =
      WeatherProviderFactory.getWeatherProvider(providerType);
  }

  async shouldIGoOutside(
    city: string,
    state?: string,
    country?: string,
  ): Promise<WeatherInfo | undefined> {
    const location = [];
    if (city) {
      location.push(city);
    }
    if (state) {
      location.push(state);
    }
    if (country) {
      location.push(country);
    }
    const weatherInfo = await this.weatherProvider.getWeatherInfo(
      location.join(','),
    );
    //console.log(weatherInfo);
    return weatherInfo;
  }

  //Alternative function to analyze here if the user should go outside
  analyze(weatherInfo: WeatherInfo) {
    const { feels_like, humidity, rain1h, windSpeed } =
      weatherInfo as WeatherInfo;

    let recommendation = `Temperature feels like: ${feels_like}°C, Humidity: ${humidity}%, Wind Speed: ${windSpeed} m/s Rain $rain}.`;

    const { maxFeelsLike, maxHumidity, maxRain, maxWindSpeed } =
      weatherServiceConfig;

    if (
      feels_like < maxFeelsLike &&
      humidity < maxHumidity &&
      windSpeed < maxWindSpeed &&
      rain1h === maxRain
    ) {
      recommendation += ' You should go outside.';
    } else {
      recommendation += " You shouldn't go outside.";
    }
    return recommendation;
  }
}
