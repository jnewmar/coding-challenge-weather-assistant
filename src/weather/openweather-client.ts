import axios, { AxiosInstance, AxiosError } from 'axios';
import { WeatherProviderClient } from './weather-provider-client-interface';
import { WeatherInfo } from './models/weather-info';
import { LocationNotFoundError, WeatherProviderError } from '../errors';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const TIMEOUT = parseInt(process.env.OPENWEATHER_TIMEOUT || '5000', 10); // Default to 5000ms if not provided in environment variables

export class OpenWeatherClient implements WeatherProviderClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.openweathermap.org/data/2.5',
      timeout: TIMEOUT,
      params: {
        appid: API_KEY,
        units: 'metric',
      },
    });
  }

  async getWeatherInfo(location: string): Promise<WeatherInfo | undefined> {
    try {
      const response = await this.axiosInstance.get('/weather', {
        params: { q: location },
      });
      //console.log('res', response)
      return {
        weather: response.data.weather[0]?.main,
        temperature: response.data.main.temp,
        feels_like: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        rain1h: response.data.rain ? response.data.rain['1h'] ?? 0 : 0,
        windSpeed: response.data.wind.speed,
      } as WeatherInfo;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleAxiosError(error);
      } else {
        console.error('Unexpected error:', error);
        throw new WeatherProviderError(
          'An unexpected error occurred. Please try again.',
        );
      }
    }
  }
}

function handleAxiosError(error: AxiosError) {
  if (error.code === 'ECONNABORTED') {
    console.error('Request timeout:', error);
    throw new WeatherProviderError('Request timed out. Please try again.');
  }

  if (error.response) {
    // A response was received but with a status code outside the 2xx range
    if (error.response.status === 404) {
      console.error('Location not found:', error.response.data);
      throw new LocationNotFoundError(
        'Location not found. Please check the location and try again.',
      );
    } else if (error.response.status >= 500 && error.response.status < 600) {
      console.error('Server error:', error.response.data);
      throw new WeatherProviderError('Server error. Please try again later.');
    } else {
      console.error('Error fetching weather data:', error.response.data);
      throw new WeatherProviderError(
        'An error occurred while fetching the weather data.',
      );
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    throw new WeatherProviderError(
      'No response received from the weather service. Please try again.',
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error setting up the request:', error.message);
    throw new WeatherProviderError(
      'Error setting up the request. Please try again.',
    );
  }
}
