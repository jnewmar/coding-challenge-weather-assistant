export class LocationNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LocationNotFoundError';
  }
}

export class WeatherProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherProviderError';
  }
}
