import dotenv from 'dotenv';

dotenv.config();

export const weatherServiceConfig = {
  maxFeelsLike: process.env.MAX_FEELS_LIKE
    ? parseFloat(process.env.MAX_FEELS_LIKE)
    : 25,
  maxHumidity: process.env.MAX_HUMIDITY
    ? parseFloat(process.env.MAX_HUMIDITY)
    : 80,
  maxRain: process.env.MAX_RAIN ? parseFloat(process.env.MAX_RAIN) : 0,
  maxWindSpeed: process.env.MAX_WIND_SPEED
    ? parseFloat(process.env.MAX_WIND_SPEED)
    : 5,
};
